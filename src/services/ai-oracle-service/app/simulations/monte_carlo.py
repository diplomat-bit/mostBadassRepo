// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/ai-oracle-service/app/simulations/monte_carlo.py
================================================================================

# src/services/ai-oracle-service/app/simulations/monte_carlo.py

import logging
from typing import Dict, Optional, Union

import numpy as np
import pandas as pd

# Configure logging for the service
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class MonteCarloSimulator:
    """
    Performs Monte Carlo simulations for financial portfolio projections.

    This class models the future value of a portfolio by running a large number
    of randomized simulations based on specified financial parameters. It can
    account for contributions, withdrawals, fees, and inflation.

    Attributes:
        initial_portfolio_value (float): The starting value of the portfolio.
        years_to_simulate (int): The number of years to project into the future.
        num_simulations (int): The number of individual simulation paths to run.
        mean_annual_return (float): The expected average annual return (e.g., 0.08 for 8%).
        annual_volatility (float): The annual standard deviation of returns (e.g., 0.15 for 15%).
        annual_contribution (float): The total amount contributed to the portfolio annually.
        contribution_frequency (str): How often contributions are made ('monthly' or 'annually').
        annual_withdrawal (float): The total amount withdrawn from the portfolio annually.
        withdrawal_frequency (str): How often withdrawals are made ('monthly' or 'annually').
        inflation_rate (float): The expected annual rate of inflation.
        management_fees (float): Annual management fees as a percentage of portfolio value.
        random_seed (Optional[int]): Seed for the random number generator for reproducibility.
        results (Optional[np.ndarray]): A 2D numpy array holding the nominal results of the simulation.
                                        Shape: (num_simulations, num_time_steps + 1).
        inflation_adjusted_results (Optional[np.ndarray]): A 2D numpy array holding the
                                                           inflation-adjusted results.
    """

    def __init__(self,
                 initial_portfolio_value: float,
                 years_to_simulate: int,
                 num_simulations: int,
                 mean_annual_return: float,
                 annual_volatility: float,
                 annual_contribution: float = 0.0,
                 contribution_frequency: str = 'monthly',
                 annual_withdrawal: float = 0.0,
                 withdrawal_frequency: str = 'monthly',
                 inflation_rate: float = 0.02,
                 management_fees: float = 0.0,
                 random_seed: Optional[int] = None):
        """
        Initializes the MonteCarloSimulator with the necessary parameters.
        """
        self._validate_inputs(
            initial_portfolio_value, years_to_simulate, num_simulations,
            mean_annual_return, annual_volatility, annual_contribution,
            contribution_frequency, annual_withdrawal, withdrawal_frequency,
            inflation_rate, management_fees
        )

        self.initial_portfolio_value = initial_portfolio_value
        self.years_to_simulate = years_to_simulate
        self.num_simulations = num_simulations
        self.mean_annual_return = mean_annual_return
        self.annual_volatility = annual_volatility
        self.annual_contribution = annual_contribution
        self.contribution_frequency = contribution_frequency
        self.annual_withdrawal = annual_withdrawal
        self.withdrawal_frequency = withdrawal_frequency
        self.inflation_rate = inflation_rate
        self.management_fees = management_fees
        self.random_seed = random_seed

        self.results: Optional[np.ndarray] = None
        self.inflation_adjusted_results: Optional[np.ndarray] = None

        # Use monthly time steps for better accuracy
        self._time_steps = self.years_to_simulate * 12

        # Pre-calculate monthly parameters for efficiency
        self._monthly_return = (1 + self.mean_annual_return) ** (1/12) - 1
        self._monthly_volatility = self.annual_volatility / np.sqrt(12)
        self._monthly_fees = self.management_fees / 12
        self._monthly_inflation = (1 + self.inflation_rate) ** (1/12) - 1

        self._monthly_contribution = self.annual_contribution / 12 if self.contribution_frequency == 'monthly' else 0
        self._monthly_withdrawal = self.annual_withdrawal / 12 if self.withdrawal_frequency == 'monthly' else 0

        logger.info("MonteCarloSimulator initialized.")

    @staticmethod
    def _validate_inputs(*args):
        """Validates the input parameters for the simulation."""
        (initial_portfolio_value, years_to_simulate, num_simulations,
         mean_annual_return, annual_volatility, annual_contribution,
         contribution_frequency, annual_withdrawal, withdrawal_frequency,
         inflation_rate, management_fees) = args

        if not all(isinstance(val, (int, float)) for val in [
            initial_portfolio_value, years_to_simulate, num_simulations,
            mean_annual_return, annual_volatility, annual_contribution,
            annual_withdrawal, inflation_rate, management_fees
        ]):
            raise TypeError("Numeric inputs must be of type int or float.")

        if initial_portfolio_value < 0:
            raise ValueError("Initial portfolio value cannot be negative.")
        if not (isinstance(years_to_simulate, int) and years_to_simulate > 0):
            raise ValueError("Years to simulate must be a positive integer.")
        if not (isinstance(num_simulations, int) and num_simulations > 0):
            raise ValueError("Number of simulations must be a positive integer.")
        if annual_volatility < 0:
            raise ValueError("Annual volatility cannot be negative.")
        if annual_contribution < 0:
            raise ValueError("Annual contribution cannot be negative.")
        if annual_withdrawal < 0:
            raise ValueError("Annual withdrawal cannot be negative.")
        if management_fees < 0:
            raise ValueError("Management fees cannot be negative.")
        if contribution_frequency not in ['monthly', 'annually']:
            raise ValueError("Contribution frequency must be 'monthly' or 'annually'.")
        if withdrawal_frequency not in ['monthly', 'annually']:
            raise ValueError("Withdrawal frequency must be 'monthly' or 'annually'.")

    def run_simulation(self) -> None:
        """
        Executes the Monte Carlo simulation.

        This method populates the `self.results` and `self.inflation_adjusted_results`
        attributes with the simulation outcomes.
        """
        logger.info(f"Starting Monte Carlo simulation with {self.num_simulations} paths for {self.years_to_simulate} years.")

        if self.random_seed is not None:
            np.random.seed(self.random_seed)

        # Initialize a 2D array to store portfolio values for each simulation over time
        # Shape: (num_simulations, num_time_steps + 1) to include the initial value
        portfolio_values = np.zeros((self.num_simulations, self._time_steps + 1))
        portfolio_values[:, 0] = self.initial_portfolio_value

        # Generate all random returns at once for performance (vectorization)
        random_returns = np.random.normal(
            loc=self._monthly_return,
            scale=self._monthly_volatility,
            size=(self.num_simulations, self._time_steps)
        )

        for t in range(1, self._time_steps + 1):
            # Get previous month's portfolio value
            prev_value = portfolio_values[:, t-1]

            # Calculate growth from investment returns
            current_value = prev_value * (1 + random_returns[:, t-1])

            # Add contributions
            current_value += self._monthly_contribution
            if self.contribution_frequency == 'annually' and t % 12 == 0:
                current_value += self.annual_contribution

            # Subtract withdrawals
            current_value -= self._monthly_withdrawal
            if self.withdrawal_frequency == 'annually' and t % 12 == 0:
                current_value -= self.annual_withdrawal

            # Subtract management fees
            current_value *= (1 - self._monthly_fees)

            # Ensure portfolio value doesn't go below zero (debt is not modeled)
            current_value[current_value < 0] = 0

            # Store the new value
            portfolio_values[:, t] = current_value

        self.results = portfolio_values
        self._calculate_inflation_adjusted_results()
        logger.info("Monte Carlo simulation completed successfully.")

    def _calculate_inflation_adjusted_results(self) -> None:
        """
        Adjusts the nominal simulation results for inflation.
        This method should be called after `run_simulation`.
        """
        if self.results is None:
            raise RuntimeError("Simulation must be run before adjusting for inflation.")

        # Create an array of inflation adjustments for each time step
        inflation_adjuster = (1 + self._monthly_inflation) ** np.arange(self._time_steps + 1)
        
        # Divide each column (time step) by the corresponding inflation factor
        self.inflation_adjusted_results = self.results / inflation_adjuster
        logger.info("Inflation-adjusted results calculated.")

    def get_summary_statistics(self, adjusted_for_inflation: bool = True) -> Dict[str, Union[float, Dict[str, float]]]:
        """
        Calculates and returns summary statistics of the simulation results.

        Args:
            adjusted_for_inflation (bool): If True, returns statistics based on
                                           inflation-adjusted values. Otherwise, uses nominal values.

        Returns:
            A dictionary containing key statistics like mean, median, and percentiles
            of the final portfolio value, and probabilities of specific outcomes.
        """
        results_to_use = self._get_results(adjusted_for_inflation)
        final_values = results_to_use[:, -1]

        summary = {
            "final_portfolio_value": {
                "mean": float(np.mean(final_values)),
                "median": float(np.median(final_values)),
                "std_dev": float(np.std(final_values)),
                "5th_percentile": float(np.percentile(final_values, 5)),
                "25th_percentile": float(np.percentile(final_values, 25)),
                "75th_percentile": float(np.percentile(final_values, 75)),
                "95th_percentile": float(np.percentile(final_values, 95)),
                "min": float(np.min(final_values)),
                "max": float(np.max(final_values)),
            },
            "probability_of_ruin": self.calculate_probability_of_ruin(adjusted_for_inflation)
        }
        return summary

    def get_percentile_over_time(self, percentile: int, adjusted_for_inflation: bool = True) -> np.ndarray:
        """
        Calculates a specific percentile of portfolio values for each time step.

        Args:
            percentile (int): The percentile to calculate (e.g., 5, 50, 95).
            adjusted_for_inflation (bool): If True, uses inflation-adjusted values.

        Returns:
            A 1D numpy array representing the portfolio value at the given
            percentile for each time step.
        """
        if not 0 <= percentile <= 100:
            raise ValueError("Percentile must be between 0 and 100.")

        results_to_use = self._get_results(adjusted_for_inflation)
        return np.percentile(results_to_use, percentile, axis=0)

    def calculate_probability_of_reaching_target(self, target_value: float, adjusted_for_inflation: bool = True) -> float:
        """
        Calculates the probability of the final portfolio value meeting or exceeding a target.

        Args:
            target_value (float): The target portfolio value.
            adjusted_for_inflation (bool): If True, the target is compared against
                                           inflation-adjusted portfolio values.

        Returns:
            The probability (between 0.0 and 1.0) of reaching the target.
        """
        if target_value < 0:
            raise ValueError("Target value cannot be negative.")
            
        results_to_use = self._get_results(adjusted_for_inflation)
        final_values = results_to_use[:, -1]
        
        successful_simulations = np.sum(final_values >= target_value)
        return float(successful_simulations / self.num_simulations)

    def calculate_probability_of_ruin(self, ruin_threshold: float = 1.0, adjusted_for_inflation: bool = True) -> float:
        """
        Calculates the probability of the portfolio value dropping below a threshold at any point.

        Args:
            ruin_threshold (float): The value below which the portfolio is considered "ruined".
                                    Defaults to 1.0.
            adjusted_for_inflation (bool): If True, uses inflation-adjusted values.

        Returns:
            The probability (between 0.0 and 1.0) of the portfolio value ever
            falling below the ruin threshold.
        """
        results_to_use = self._get_results(adjusted_for_inflation)
        
        # Check if any value in each simulation path drops below the threshold
        ruined_simulations = np.sum(np.any(results_to_use < ruin_threshold, axis=1))
        return float(ruined_simulations / self.num_simulations)

    def get_results_as_dataframe(self, adjusted_for_inflation: bool = True) -> pd.DataFrame:
        """
        Returns the full simulation results as a pandas DataFrame.

        Args:
            adjusted_for_inflation (bool): If True, returns inflation-adjusted values.

        Returns:
            A pandas DataFrame where each column is a simulation path and each
            row is a time step (month).
        """
        results_to_use = self._get_results(adjusted_for_inflation)
        
        # Create a time index for the DataFrame
        index = pd.date_range(
            start=pd.Timestamp.now().date(),
            periods=self._time_steps + 1,
            freq='MS' # Month Start frequency
        )
        
        df = pd.DataFrame(results_to_use.T, index=index)
        df.columns = [f'Simulation_{i+1}' for i in range(self.num_simulations)]
        df.index.name = 'Date'
        return df

    def _get_results(self, adjusted_for_inflation: bool) -> np.ndarray:
        """Helper method to get the correct results array based on the inflation flag."""
        if self.results is None or self.inflation_adjusted_results is None:
            raise RuntimeError("Simulation must be run before results can be accessed.")
        
        return self.inflation_adjusted_results if adjusted_for_inflation else self.results


if __name__ == '__main__':
    # This block serves as an example and a simple test case.
    # It will only run when the script is executed directly.

    logger.info("--- Running Monte Carlo Simulation Example ---")

    # Define simulation parameters for a typical retirement savings scenario
    sim_params = {
        "initial_portfolio_value": 100000,
        "years_to_simulate": 30,
        "num_simulations": 5000,
        "mean_annual_return": 0.075,
        "annual_volatility": 0.15,
        "annual_contribution": 12000,
        "contribution_frequency": 'monthly', # $1000/month
        "annual_withdrawal": 0,
        "inflation_rate": 0.03,
        "management_fees": 0.005, # 0.5%
        "random_seed": 42 # For reproducible results
    }

    # Create an instance of the simulator and run the simulation
    simulator = MonteCarloSimulator(**sim_params)
    simulator.run_simulation()

    # Get and print summary statistics (inflation-adjusted)
    summary = simulator.get_summary_statistics(adjusted_for_inflation=True)
    
    print("\n--- Simulation Summary (Inflation-Adjusted) ---")
    final_value_stats = summary['final_portfolio_value']
    print(f"Median Final Portfolio Value: ${final_value_stats['median']:,.2f}")
    print(f"Mean Final Portfolio Value:   ${final_value_stats['mean']:,.2f}")
    print(f"Worst 5% Outcome:             ${final_value_stats['5th_percentile']:,.2f}")
    print(f"Best 5% Outcome:              ${final_value_stats['95th_percentile']:,.2f}")
    print(f"Range (25th-75th percentile): ${final_value_stats['25th_percentile']:,.2f} to ${final_value_stats['75th_percentile']:,.2f}")

    # Calculate the probability of reaching a specific financial goal
    target = 1_000_000 # $1 million in today's dollars
    prob_reaching_target = simulator.calculate_probability_of_reaching_target(
        target_value=target,
        adjusted_for_inflation=True
    )
    print(f"\nProbability of reaching ${target:,.0f} (in today's dollars): {prob_reaching_target:.2%}")

    # Get percentile data for plotting or further analysis
    median_projection = simulator.get_percentile_over_time(50, adjusted_for_inflation=True)
    print(f"\nMedian value after 10 years: ${median_projection[120]:,.2f}")
    print(f"Median value after 20 years: ${median_projection[240]:,.2f}")
    print(f"Median value after 30 years: ${median_projection[360]:,.2f}")

    # Optional: Plotting the results if matplotlib is installed
    try:
        import matplotlib.pyplot as plt
        import matplotlib.ticker as mticker

        print("\nGenerating plot...")
        
        df = simulator.get_results_as_dataframe(adjusted_for_inflation=True)
        
        fig, ax = plt.subplots(figsize=(12, 7))
        
        # Plot confidence intervals
        ax.fill_between(
            df.index,
            simulator.get_percentile_over_time(5, True),
            simulator.get_percentile_over_time(95, True),
            color='lightcoral', alpha=0.3, label='5th-95th Percentile'
        )
        ax.fill_between(
            df.index,
            simulator.get_percentile_over_time(25, True),
            simulator.get_percentile_over_time(75, True),
            color='lightskyblue', alpha=0.4, label='25th-75th Percentile'
        )
        
        # Plot the median projection
        ax.plot(df.index, median_projection, color='navy', linewidth=2, label='Median (50th Percentile)')
        
        # Formatting the plot for clarity
        ax.set_title(f'Portfolio Growth Projection over {sim_params["years_to_simulate"]} Years ({sim_params["num_simulations"]} Simulations)', fontsize=16)
        ax.set_xlabel('Year', fontsize=12)
        ax.set_ylabel('Portfolio Value (Inflation-Adjusted)', fontsize=12)
        ax.grid(True, which='both', linestyle='--', linewidth=0.5)
        ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, p: f'${x/1_000_000:.1f}M'))
        ax.legend()
        
        plt.tight_layout()
        # plt.savefig("monte_carlo_projection.png", dpi=300) # Uncomment to save the plot to a file
        plt.show()

    except ImportError:
        logger.warning("Matplotlib not found. Skipping plot generation. Install with 'pip install matplotlib'.")
        df = simulator.get_results_as_dataframe(adjusted_for_inflation=True)
        print("\nFirst 5 rows of the results DataFrame:")
        print(df.head())