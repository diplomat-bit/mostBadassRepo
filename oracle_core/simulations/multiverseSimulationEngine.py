// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/oracle_core/simulations/multiverseSimulationEngine.py
================================================================================

```python
# oracle_core/simulations/multiverseSimulationEngine.py

import concurrent.futures
import numpy as np
import pandas as pd
import simpy
import yaml
import json
import logging
import time
import uuid
import os
from datetime import datetime
from typing import Dict, Any, List, Generator, Tuple, Optional

# ==============================================================================
# CONFIGURATION
# ==============================================================================

# Setup sophisticated logging to provide clear insights into the engine's operation
LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - [%(processName)s] - %(message)s'
logging.basicConfig(level=logging.INFO, format=LOG_FORMAT)
logger = logging.getLogger('MultiverseSimulationEngine')

# Determine the optimal number of parallel workers based on system resources
# This ensures the engine scales effectively on different hardware.
try:
    MAX_WORKERS = os.cpu_count()
    if MAX_WORKERS is None:
        MAX_WORKERS = 4
        logger.warning("Could not determine CPU count, defaulting to 4 workers.")
    else:
        logger.info(f"Detected {MAX_WORKERS} CPU cores available for parallel processing.")
except NotImplementedError:
    MAX_WORKERS = 4
    logger.warning("os.cpu_count() not implemented, defaulting to 4 workers.")


# --- Constants for Simulation Models ---
DEBT_INTEREST_RATE = 0.055  # Annual interest rate on corporate debt
INNOVATION_DECAY_RATE = 0.999 # Daily decay of the innovation index
EMPLOYEE_ATTRITION_RATE = 0.0005 # Daily probability of an employee leaving
HIRING_FREEZE_CASH_THRESHOLD = 50_000_000 # Cash level below which hiring stops


# ==============================================================================
# DATA STRUCTURES & MODELS
# ==============================================================================

class DigitalTwin:
    """
    Represents the complete state of a complex entity being simulated.

    A Digital Twin is a dynamic, virtual representation of a real-world object or system.
    In this context, it encapsulates the entire state of a corporation, including its
    financials, operations, human resources, and market position.
    """
    def __init__(self, twin_id: str, name: str, initial_state: Dict[str, Any]):
        """
        Initializes the DigitalTwin instance.

        Args:
            twin_id: A unique identifier for the digital twin.
            name: A human-readable name for the twin.
            initial_state: A dictionary representing the starting state of the twin.
        """
        self.id = twin_id
        self.name = name
        self.state = initial_state
        self.history = [initial_state.copy()]
        logger.debug(f"DigitalTwin '{self.name}' ({self.id}) initialized.")

    def update_state(self, new_state_changes: Dict[str, Any]) -> None:
        """
        Performs a deep merge to update the twin's state.

        Args:
            new_state_changes: A dictionary of changes to apply to the current state.
        """
        for key, value in new_state_changes.items():
            if isinstance(value, dict) and key in self.state and isinstance(self.state[key], dict):
                self._deep_merge(self.state[key], value)
            else:
                self.state[key] = value
        self.history.append(self.state.copy())
        logger.debug(f"State updated for DigitalTwin '{self.name}'.")

    def _deep_merge(self, source: Dict, changes: Dict) -> None:
        """Recursively merges dictionaries."""
        for key, value in changes.items():
            if isinstance(value, dict) and key in source and isinstance(source[key], dict):
                self._deep_merge(source[key], value)
            else:
                source[key] = value

    def get_state_snapshot(self) -> Dict[str, Any]:
        """Returns a deep copy of the current state."""
        return json.loads(json.dumps(self.state))


class SimulationScenario:
    """
    Defines the parameters, events, and conditions for a single simulation run.

    Each scenario represents a unique 'universe' or 'timeline' with specific external
    events (e.g., market shocks, regulatory changes) that will affect the Digital Twin.
    """
    def __init__(self, scenario_id: str, config: Dict[str, Any]):
        """
        Initializes the SimulationScenario.

        Args:
            scenario_id: A unique identifier for the scenario.
            config: Configuration dictionary for the scenario.
        """
        self.id = scenario_id
        self.description = config.get('description', 'No description provided.')
        self.duration_days = int(config.get('duration_days', 365))
        # Events are sorted by day to ensure chronological processing in the simulation.
        self.events = sorted(config.get('events', []), key=lambda e: e.get('day', 0))
        logger.debug(f"Scenario '{self.id}' initialized for {self.duration_days} days with {len(self.events)} events.")


class SimulationResult:
    """
    Encapsulates the complete output of a single simulation run.

    This includes the final state of the Digital Twin and a detailed timeline
    of key performance indicators (KPIs) throughout the simulation period.
    """
    def __init__(self, scenario_id: str, twin_id: str, final_state: Dict[str, Any], timeline: List[Dict[str, Any]]):
        self.scenario_id = scenario_id
        self.twin_id = twin_id
        self.final_state = final_state
        self.timeline = timeline


# ==============================================================================
# CORE SIMULATION SUB-MODELS
# ==============================================================================

class CorporateFinanceModel:
    """A sub-model handling the financial dynamics of the digital twin."""

    def __init__(self, env: simpy.Environment, initial_financials: Dict[str, Any]):
        self.env = env
        self.cash = float(initial_financials.get('cash', 1e6))
        self.revenue_per_day = float(initial_financials.get('daily_revenue', 5e4))
        self.cogs_per_day = float(initial_financials.get('daily_cogs', 2e4))
        self.opex_per_day = float(initial_financials.get('daily_opex', 1.5e4))
        self.debt = float(initial_financials.get('debt', 5e5))
        self.assets = float(initial_financials.get('assets', 2e6))
        self.r_and_d_investment = float(initial_financials.get('daily_r_and_d', 5e4))

        # Dynamic variables
        self.market_sentiment = 1.0
        self.innovation_index = 0.5  # A measure of the company's tech edge
        self.market_share = float(initial_financials.get('market_share', 0.15))
        self.base_market_share = self.market_share

    def run_daily_operations(self) -> Generator:
        """Main simulation process for daily financial activities."""
        while True:
            # R&D and Innovation Dynamics
            self._update_innovation()

            # Market Share Dynamics
            self._update_market_share()

            # P&L Calculation with volatility and dynamic factors
            daily_revenue = self.revenue_per_day * self.market_sentiment * (self.market_share / self.base_market_share) * (1 + np.random.normal(0, 0.05))
            daily_cogs = self.cogs_per_day * (1 + np.random.normal(0, 0.02))
            
            # OPEX can be influenced by factors like employee count (from HR model)
            daily_opex = self.opex_per_day

            gross_profit = daily_revenue - daily_cogs
            net_operating_income = gross_profit - daily_opex - self.r_and_d_investment
            
            # Debt and Interest
            daily_interest_payment = (self.debt * DEBT_INTEREST_RATE) / 365
            net_income = net_operating_income - daily_interest_payment

            self.cash += net_income
            
            # Asset growth/depreciation
            self.assets += net_income # Simplified balance sheet logic (retained earnings increase assets)
            self.assets *= (1 + np.random.normal(0.0001, 0.0005)) # Random asset value fluctuation

            # Trigger strategic financial decisions
            if self.cash < 25_000_000 and self.debt < self.assets * 0.6: # Low cash buffer & safe debt-to-asset ratio
                self.take_on_debt(50_000_000)

            yield self.env.timeout(1)

    def _update_innovation(self):
        """Models the impact of R&D on the company's innovation capabilities."""
        # R&D has a chance to produce a breakthrough
        breakthrough_chance = self.r_and_d_investment / (self.assets * 0.01)
        if np.random.rand() < breakthrough_chance:
            self.innovation_index += np.random.uniform(0.05, 0.15)
        
        # Innovation naturally decays over time if not maintained
        self.innovation_index *= INNOVATION_DECAY_RATE
        self.innovation_index = min(max(self.innovation_index, 0.1), 1.0)
    
    def _update_market_share(self):
        """Models changes in market share based on innovation and sentiment."""
        innovation_effect = (self.innovation_index - 0.5) * 0.0005 # Innovation drives market share
        sentiment_effect = (self.market_sentiment - 1.0) * 0.001 # Market perception effect
        market_share_change = innovation_effect + sentiment_effect
        self.market_share = max(0.01, self.market_share + market_share_change)

    def apply_market_shock(self, magnitude: float):
        """Applies a sudden external shock to market sentiment."""
        logger.info(f"[t={self.env.now}] Applying market shock with magnitude: {magnitude:.2%}")
        self.market_sentiment = max(0.1, self.market_sentiment * (1 + magnitude))

    def apply_capital_infusion(self, amount: float):
        """Simulates receiving a direct capital injection."""
        logger.info(f"[t={self.env.now}] Applying capital infusion of ${amount:,.0f}")
        self.cash += amount
        self.assets += amount

    def take_on_debt(self, amount: float):
        """Simulates taking on new debt."""
        logger.info(f"[t={self.env.now}] Taking on new debt of ${amount:,.0f}")
        self.debt += amount
        self.cash += amount

    def get_kpis(self) -> Dict[str, Any]:
        """Returns a snapshot of key financial metrics."""
        return {
            "cash": self.cash,
            "debt": self.debt,
            "assets": self.assets,
            "equity": self.assets - self.debt,
            "market_sentiment": self.market_sentiment,
            "innovation_index": self.innovation_index,
            "market_share": self.market_share
        }

class HumanResourcesModel:
    """A sub-model handling employee dynamics."""
    def __init__(self, env: simpy.Environment, initial_hr_state: Dict[str, Any], finance_model: CorporateFinanceModel):
        self.env = env
        self.finance_model = finance_model
        self.employee_count = int(initial_hr_state.get('employee_count', 50000))
        self.employee_morale = float(initial_hr_state.get('employee_morale', 0.8)) # Scale of 0 to 1
        self.hiring_rate_per_day = 50 # Target new hires per day

    def run_daily_hr_cycle(self) -> Generator:
        """Main simulation process for daily HR activities."""
        while True:
            # Morale is affected by company performance (proxied by market sentiment)
            self.employee_morale += (self.finance_model.market_sentiment - 1.0) * 0.01
            self.employee_morale = min(max(self.employee_morale, 0.2), 1.0)

            # Attrition is higher when morale is low
            effective_attrition_rate = EMPLOYEE_ATTRITION_RATE / (self.employee_morale + 0.1)
            daily_departures = np.random.poisson(self.employee_count * effective_attrition_rate)
            self.employee_count -= daily_departures

            # Hiring
            if self.finance_model.cash > HIRING_FREEZE_CASH_THRESHOLD:
                daily_hires = np.random.poisson(self.hiring_rate_per_day * self.employee_morale)
                self.employee_count += daily_hires
            
            # Update OPEX in the finance model based on headcount
            self.finance_model.opex_per_day = 3_500_000 * (self.employee_count / 50000)

            yield self.env.timeout(1)

    def get_kpis(self) -> Dict[str, Any]:
        """Returns a snapshot of key HR metrics."""
        return {
            "employee_count": self.employee_count,
            "employee_morale": self.employee_morale
        }

# ==============================================================================
# SIMULATION WORKER FUNCTION
# ==============================================================================

def simulation_worker(digital_twin_initial_state: Dict[str, Any], scenario_config: Dict[str, Any]) -> SimulationResult:
    """
    The core function executed by each parallel process. It sets up and runs
    a single, complete simulation for one scenario.

    Args:
        digital_twin_initial_state: The starting state of the digital twin.
        scenario_config: The configuration for the specific scenario to run.

    Returns:
        A SimulationResult object containing the outcome.
    """
    twin = DigitalTwin(twin_id=digital_twin_initial_state['id'], name=digital_twin_initial_state['name'], initial_state=digital_twin_initial_state['state'])
    scenario = SimulationScenario(scenario_id=scenario_config['id'], config=scenario_config)
    
    env = simpy.Environment()
    
    # Initialize interconnected sub-models based on the twin's state
    finance_model = CorporateFinanceModel(env, twin.state['financials'])
    hr_model = HumanResourcesModel(env, twin.state['operations'], finance_model)
    # In a more complex setup, SupplyChainModel, MarketingModel etc. would be added here.

    timeline_data = []

    def event_injector(env: simpy.Environment, events: List[Dict[str, Any]]):
        """A SimPy process that injects discrete events into the simulation at specified times."""
        for event in events:
            delay = event.get('day', 0) - env.now
            if delay > 0:
                yield env.timeout(delay)
            
            event_type = event.get('type')
            try:
                if event_type == 'MARKET_SHOCK':
                    finance_model.apply_market_shock(float(event.get('magnitude', 0)))
                elif event_type == 'CAPITAL_INFUSION':
                    finance_model.apply_capital_infusion(float(event.get('amount', 0)))
                elif event_type == 'REGULATORY_CHANGE':
                    # Example of a more complex event
                    finance_model.opex_per_day *= (1 + float(event.get('compliance_cost_increase', 0)))
                    logger.info(f"[t={env.now}] Regulatory change increased OPEX.")
                else:
                    logger.warning(f"Unknown event type encountered in scenario {scenario.id}: {event_type}")
            except (ValueError, TypeError) as e:
                logger.error(f"Error processing event in scenario {scenario.id}: {event}. Error: {e}")

    def data_recorder(env: simpy.Environment):
        """A SimPy process that records the state of all models at regular intervals."""
        while True:
            kpis = {'day': env.now}
            kpis.update(finance_model.get_kpis())
            kpis.update(hr_model.get_kpis())
            timeline_data.append(kpis)
            yield env.timeout(1) # Record data once per simulated day

    # Start all concurrent processes within the simulation environment
    env.process(finance_model.run_daily_operations())
    env.process(hr_model.run_daily_hr_cycle())
    env.process(event_injector(env, scenario.events))
    env.process(data_recorder(env))

    # Execute the simulation until the defined duration is reached
    env.run(until=scenario.duration_days)
    
    final_kpis = {'day': env.now}
    final_kpis.update(finance_model.get_kpis())
    final_kpis.update(hr_model.get_kpis())

    return SimulationResult(
        scenario_id=scenario.id,
        twin_id=twin.id,
        final_state=final_kpis,
        timeline=timeline_data
    )

# ==============================================================================
# MULTIVERSE SIMULATION ENGINE
# ==============================================================================

class MultiverseSimulationEngine:
    """
    Orchestrates the execution of thousands of parallel simulations.

    This class manages loading data, distributing simulation tasks to a pool of
    worker processes, collecting results, and performing high-level aggregation.
    """
    def __init__(self, max_workers: int = MAX_WORKERS):
        """
        Initializes the engine with a process pool executor.

        Args:
            max_workers: The number of parallel processes to use.
        """
        self.executor = concurrent.futures.ProcessPoolExecutor(max_workers=max_workers)
        logger.info(f"Multiverse Simulation Engine initialized with {max_workers} worker processes.")

    def load_digital_twin_from_file(self, twin_id: str, source_path: str) -> Dict[str, Any]:
        """
        Loads digital twin configuration from a YAML file.
        In a production environment, this would fetch from a database or a dedicated service.
        """
        try:
            with open(source_path, 'r') as f:
                data = yaml.safe_load(f)
            
            for twin in data.get('digital_twins', []):
                if twin.get('id') == twin_id:
                    logger.info(f"Successfully loaded Digital Twin: {twin['name']} ({twin_id})")
                    return twin
            raise ValueError(f"Digital Twin with id '{twin_id}' not found in {source_path}")
        except FileNotFoundError:
            logger.error(f"Digital twin source file not found: {source_path}")
            raise
        except Exception as e:
            logger.error(f"Failed to load or parse digital twin {twin_id} from {source_path}: {e}")
            raise

    def load_scenarios_from_file(self, source_path: str) -> List[Dict[str, Any]]:
        """Loads a batch of simulation scenarios from a YAML file."""
        try:
            with open(source_path, 'r') as f:
                data = yaml.safe_load(f)
            scenarios = data.get('scenarios', [])
            logger.info(f"Loaded {len(scenarios)} scenarios from {source_path}")
            return scenarios
        except FileNotFoundError:
            logger.error(f"Scenarios source file not found: {source_path}")
            raise
        except Exception as e:
            logger.error(f"Failed to load or parse scenarios from {source_path}: {e}")
            raise

    def run_multiverse(self, digital_twin_initial_state: Dict[str, Any], scenarios: List[Dict[str, Any]]) -> List[SimulationResult]:
        """
        Executes all scenarios against the given digital twin in parallel.

        Args:
            digital_twin_initial_state: The starting state of the twin for all simulations.
            scenarios: A list of scenario configurations to run.

        Returns:
            A list of SimulationResult objects, one for each completed scenario.
        """
        start_time = time.time()
        futures = [self.executor.submit(simulation_worker, digital_twin_initial_state, sc) for sc in scenarios]
        
        results = []
        total_sims = len(futures)
        logger.info(f"Dispatched {total_sims} simulation tasks to worker pool.")

        for i, future in enumerate(concurrent.futures.as_completed(futures)):
            try:
                result = future.result()
                results.append(result)
                if (i + 1) % 100 == 0 or (i + 1) == total_sims:
                     logger.info(f"Completed simulation {i+1}/{total_sims} (Scenario: {result.scenario_id})")
            except Exception:
                logger.error(f"A simulation task failed spectacularly.", exc_info=True)

        end_time = time.time()
        logger.info(f"Multiverse simulation completed. Ran {len(results)}/{total_sims} simulations in {end_time - start_time:.2f} seconds.")
        return results

    def aggregate_results(self, results: List[SimulationResult]) -> Dict[str, Any]:
        """
        Processes raw simulation results into a statistically meaningful summary.
        This aggregated data is ideal for visualization and high-level analysis.

        Args:
            results: A list of SimulationResult objects from the multiverse run.

        Returns:
            A dictionary containing aggregated time-series data and final state summaries.
        """
        if not results:
            logger.warning("No simulation results to aggregate.")
            return {}

        logger.info("Starting aggregation of simulation results...")
        timelines = [pd.DataFrame(r.timeline).set_index('day') for r in results]
        
        all_kpis = list(timelines[0].columns)
        aggregated_data = {}

        for kpi in all_kpis:
            # Concatenate the time-series for a single KPI across all simulations
            kpi_data = pd.concat([df[kpi] for df in timelines if kpi in df.columns], axis=1)
            # Calculate statistical measures across the multiverse for each time step
            aggregated_data[kpi] = {
                'mean': kpi_data.mean(axis=1).to_list(),
                'median': kpi_data.median(axis=1).to_list(),
                'std_dev': kpi_data.std(axis=1).to_list(),
                'p5': kpi_data.quantile(0.05, axis=1).to_list(),
                'p25': kpi_data.quantile(0.25, axis=1).to_list(),
                'p75': kpi_data.quantile(0.75, axis=1).to_list(),
                'p95': kpi_data.quantile(0.95, axis=1).to_list(),
            }
        
        final_states_df = pd.DataFrame([r.final_state for r in results])
        final_state_summary = {col: {
            'mean': final_states_df[col].mean(),
            'median': final_states_df[col].median(),
            'std_dev': final_states_df[col].std(),
            'min': final_states_df[col].min(),
            'max': final_states_df[col].max()
        } for col in final_states_df.columns if col not in ['day']}

        logger.info("Aggregation complete.")
        return {
            'twin_id': results[0].twin_id,
            'num_simulations': len(results),
            'time_index_days': timelines[0].index.to_list(),
            'kpi_aggregates': aggregated_data,
            'final_state_summary': final_state_summary
        }

    def shutdown(self):
        """Cleans up resources, shutting down the process pool."""
        self.executor.shutdown(wait=True)
        logger.info("Multiverse Simulation Engine has been shut down.")


# ==============================================================================
# EXAMPLE USAGE & DEMONSTRATION
# ==============================================================================

def create_mock_data_files(num_scenarios: int = 2000):
    """Generates mock YAML files for digital twins and scenarios for demonstration."""
    logger.info("Generating mock data files for demonstration...")

    twin_data = {
        'digital_twins': [{
            'id': 'fortune_500_acme_corp',
            'name': 'ACME Corporation',
            'description': 'A digital twin for a leading fictional technology and manufacturing company.',
            'state': {
                'financials': {
                    'cash': 500_000_000, 'daily_revenue': 10_000_000,
                    'daily_cogs': 4_000_000, 'daily_opex': 3_500_000,
                    'daily_r_and_d': 750_000, 'debt': 1_200_000_000,
                    'assets': 8_500_000_000, 'market_share': 0.18
                },
                'operations': {'employee_count': 50000, 'employee_morale': 0.85}
            }
        }]
    }
    with open('digital_twins.yaml', 'w') as f:
        yaml.dump(twin_data, f, default_flow_style=False, sort_keys=False)

    scenarios_data = {'scenarios': []}
    for i in range(num_scenarios):
        events = []
        # Add a primary market shock event
        shock_day = np.random.randint(30, 250)
        shock_magnitude = np.random.normal(-0.15, 0.1)
        events.append({'day': shock_day, 'type': 'MARKET_SHOCK', 'magnitude': round(shock_magnitude, 4)})
        
        # 30% chance of a capital infusion event
        if np.random.rand() < 0.3:
            infusion_day = np.random.randint(shock_day + 30, 360)
            infusion_amount = np.random.lognormal(np.log(50_000_000), 0.5)
            events.append({'day': infusion_day, 'type': 'CAPITAL_INFUSION', 'amount': round(infusion_amount)})
        
        # 15% chance of a regulatory change event
        if np.random.rand() < 0.15:
            reg_day = np.random.randint(10, 360)
            cost_increase = np.random.uniform(0.01, 0.05)
            events.append({'day': reg_day, 'type': 'REGULATORY_CHANGE', 'compliance_cost_increase': round(cost_increase, 4)})

        scenarios_data['scenarios'].append({
            'id': f'scenario_{str(uuid.uuid4())[:8]}',
            'duration_days': 365,
            'description': f'Scenario {i+1} with a market shock of {shock_magnitude:.2%}.',
            'events': events
        })
    with open('scenarios.yaml', 'w') as f:
        yaml.dump(scenarios_data, f, default_flow_style=False, sort_keys=False)
    logger.info(f"Created mock data files: digital_twins.yaml and scenarios.yaml with {num_scenarios} scenarios.")


if __name__ == '__main__':
    """
    Main execution block to demonstrate the engine's capabilities.
    This script will:
    1. Generate mock data if it doesn't exist.
    2. Initialize the simulation engine.
    3. Load a digital twin and a set of scenarios.
    4. Run the full multiverse simulation.
    5. Aggregate the results.
    6. Save the aggregated analysis to a JSON file.
    """
    
    # 1. Setup: Create mock data files for the demonstration
    if not (os.path.exists('digital_twins.yaml') and os.path.exists('scenarios.yaml')):
        create_mock_data_files(num_scenarios=2000)
    
    # 2. Initialize the engine
    engine = MultiverseSimulationEngine()

    try:
        # 3. Load the data
        twin_id_to_simulate = 'fortune_500_acme_corp'
        digital_twin_state = engine.load_digital_twin_from_file(twin_id_to_simulate, 'digital_twins.yaml')
        scenarios_to_run = engine.load_scenarios_from_file('scenarios.yaml')

        # 4. Run the multiverse simulation
        simulation_results = engine.run_multiverse(digital_twin_state, scenarios_to_run)

        # 5. Aggregate and analyze the results
        if simulation_results:
            aggregated_analysis = engine.aggregate_results(simulation_results)
            
            # 6. Output the results
            output_filename = f"simulation_output_{twin_id_to_simulate}_{datetime.now().strftime('%Y%m%d%H%M%S')}.json"
            with open(output_filename, 'w') as f:
                json.dump(aggregated_analysis, f, indent=2)
            
            logger.info(f"Aggregated results saved to {output_filename}")
            
            # Print a high-level summary to the console
            summary = aggregated_analysis['final_state_summary']
            cash_summary = summary['cash']
            equity_summary = summary['equity']
            
            print("\n" + "="*80)
            print(f"MULTIVERSE SIMULATION SUMMARY FOR: {digital_twin_state.get('name')}")
            print("="*80)
            print(f"Number of Universes Simulated: {aggregated_analysis['num_simulations']}")
            print("\n--- Projected Final State (after 365 days) ---")
            print(f"Cash Balance:          Mean=${cash_summary['mean']:,.0f}, Median=${cash_summary['median']:,.0f}")
            print(f"                       Range (min-max): ${cash_summary['min']:,.0f} to ${cash_summary['max']:,.0f}")
            print(f"Shareholder Equity:    Mean=${equity_summary['mean']:,.0f}, Median=${equity_summary['median']:,.0f}")
            print(f"                       Range (min-max): ${equity_summary['min']:,.0f} to ${equity_summary['max']:,.0f}")
            print("="*80 + "\n")
        else:
            logger.warning("No simulations were successfully completed. No output generated.")

    except Exception:
        logger.critical("An unhandled exception occurred during the main execution block.", exc_info=True)
    finally:
        # 7. Cleanly shut down the engine's resources
        engine.shutdown()

```