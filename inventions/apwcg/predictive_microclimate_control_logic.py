// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/inventions/apwcg/predictive_microclimate_control_logic.py
================================================================================

import numpy as np
import collections
import math # Added for more complex calculations, e.g., standard deviation, log


# Exported helper classes for more robust control and prediction logic
class PIDController:
    """
    A robust Proportional-Integral-Derivative (PID) controller for continuous
    feedback control systems. It is designed to achieve precise and stable
    control by minimizing steady-state errors and mitigating oscillations.

    This controller embodies the principle of sustained effort: learning from
    past errors (Integral), reacting to present deviations (Proportional),
    and anticipating future changes (Derivative). It's the steadfast heart
    of the system, tirelessly pushing towards equilibrium.
    """
    def __init__(self, kp: float, ki: float, kd: float,
                 setpoint: float,
                 output_limits: tuple[float, float] = (None, None)):
        """
        Initializes the PID controller.

        Parameters:
            kp (float): Proportional gain. Responds to the current error.
            ki (float): Integral gain. Responds to the accumulation of past errors.
            kd (float): Derivative gain. Responds to the rate of change of the error.
            setpoint (float): The target value the controller aims to achieve.
            output_limits (tuple[float, float]): Optional (min, max) bounds for the controller output.
        """
        self.kp = kp
        self.ki = ki
        self.kd = kd
        self.setpoint = setpoint
        self.output_min, self.output_max = output_limits

        self._integral_error = 0.0
        self._previous_error = 0.0
        self._last_update_time = None

        # Anti-windup mechanism: prevents integral term from accumulating large errors
        # when the system is saturated (output at limits).
        self.integral_max = 1000.0
        self.integral_min = -1000.0

    def update(self, current_value: float, current_time: float) -> float:
        """
        Calculates and returns the control output based on the current value and time.

        Parameters:
            current_value (float): The current observed value from the system.
            current_time (float): The current timestamp for calculating time differences.

        Returns:
            float: The calculated control output.
        """
        if self._last_update_time is None:
            dt = 1.0 # Assume a 1-second step for the first update
        else:
            dt = current_time - self._last_update_time

        if dt <= 0: # Avoid division by zero or negative time steps
            return 0.0 # No change if no time has passed

        error = self.setpoint - current_value

        # Proportional term
        p_term = self.kp * error

        # Integral term with anti-windup
        self._integral_error += error * dt
        self._integral_error = np.clip(self._integral_error, self.integral_min, self.integral_max)
        i_term = self.ki * self._integral_error

        # Derivative term
        derivative_error = (error - self._previous_error) / dt
        d_term = self.kd * derivative_error

        # Total control output
        output = p_term + i_term + d_term

        # Apply output limits
        if self.output_min is not None and self.output_max is not None:
            output = np.clip(output, self.output_min, self.output_max)

        # Update historical error and time
        self._previous_error = error
        self._last_update_time = current_time

        return output

    def reset(self):
        """Resets the integral and previous error terms."""
        self._integral_error = 0.0
        self._previous_error = 0.0
        self._last_update_time = None

    def set_setpoint(self, new_setpoint: float):
        """Updates the controller's target setpoint."""
        self.setpoint = new_setpoint


class MicroclimatePredictor:
    """
    A more sophisticated predictive model that moves beyond simple moving averages,
    incorporating elements of trend analysis, seasonality (conceptual), and
    simulated external forcings. It aims to foresee deviations with greater
    accuracy, allowing for proactive, rather than merely reactive, control.

    This predictor acknowledges the universe's subtle nudges and grand forces,
    seeking to understand not just what *is*, but what *will be*, empowering
    the system to act with foresight. It is the oracle for the voiceless atmosphere.
    """
    def __init__(self, history_buffer_size: int, prediction_horizon_steps: int):
        self.history_buffer_size = history_buffer_size
        self.prediction_horizon_steps = prediction_horizon_steps
        self.temp_history = collections.deque(maxlen=history_buffer_size)
        self.humidity_history = collections.deque(maxlen=history_buffer_size)

        # Conceptual parameters for a more advanced internal model (e.g., linear regression coefficients)
        self.temp_trend_weight = 0.1
        self.humidity_trend_weight = 0.05
        self.noise_amplitude_temp = 0.05
        self.noise_amplitude_humidity = 0.002

    def update_history(self, current_temperature: float, current_humidity: float):
        """Updates the internal historical data buffers."""
        self.temp_history.append(current_temperature)
        self.humidity_history.append(current_humidity)

    def _calculate_trend(self, history: collections.deque) -> float:
        """
        Calculates a simple linear trend from the recent history.
        In a real system, this would be a more complex time-series model.
        """
        if len(history) < 2:
            return 0.0 # No trend if not enough data

        # Simple linear regression slope for trend
        x = np.arange(len(history))
        y = np.array(list(history))

        # Avoid issues with constant data
        if len(x) <= 1 or np.std(y) == 0:
            return 0.0

        # Calculate slope (m) of y = mx + c
        slope = (len(x) * np.sum(x * y) - np.sum(x) * np.sum(y)) / \
                (len(x) * np.sum(x**2) - np.sum(x)**2)
        return slope

    def predict(self) -> tuple[float, float]:
        """
        Predicts the future atmospheric state based on historical data, trends,
        and simulated external factors.

        This moves beyond a simple average, considering:
        1. Recent average.
        2. Detected historical trend.
        3. Simulated cyclical/external forcings (e.g., diurnal temperature swing).
        4. Inherent atmospheric stochasticity.
        """
        if not self.temp_history or not self.humidity_history:
            # Fallback if no history
            return 295.15, 0.60 # Default values if no data yet

        # Base prediction from recent average
        base_predicted_temp = np.mean(list(self.temp_history)[-self.prediction_horizon_steps:]) \
                              if len(self.temp_history) >= self.prediction_horizon_steps else self.temp_history[-1]
        base_predicted_humidity = np.mean(list(self.humidity_history)[-self.prediction_horizon_steps:]) \
                                  if len(self.humidity_history) >= self.prediction_horizon_steps else self.humidity_history[-1]

        # Add trend component
        temp_trend = self._calculate_trend(self.temp_history) * self.prediction_horizon_steps * self.temp_trend_weight
        humidity_trend = self._calculate_trend(self.humidity_history) * self.prediction_horizon_steps * self.humidity_trend_weight

        predicted_temp = base_predicted_temp + temp_trend
        predicted_humidity = base_predicted_humidity + humidity_trend

        # Introduce simulated external forcings (e.g., a conceptual diurnal cycle effect)
        # For a profound system, this would come from global weather models or direct solar flux sensors.
        # Here, we simulate a small, persistent nudge from a conceptual external factor.
        external_temp_nudge = np.sin(np.pi * (len(self.temp_history) % 1440) / 720.0) * 0.1 # Small 24hr cycle (1440 min/day)
        predicted_temp += external_temp_nudge * (self.prediction_horizon_steps / 5.0)

        # Add inherent atmospheric variability (noise, but less aggressive than before)
        predicted_temp += np.random.normal(0, self.noise_amplitude_temp) * (self.prediction_horizon_steps / 5.0)
        predicted_humidity += np.random.normal(0, self.noise_amplitude_humidity) * (self.prediction_horizon_steps / 5.0)

        # Ensure physical bounds
        predicted_humidity = np.clip(predicted_humidity, 0.01, 0.99)

        return predicted_temp, predicted_humidity


class AMUOrchestrator:
    """
    Translates abstract control signals into concrete, optimized commands for
    Atmospheric Modulation Units (AMUs), considering resource constraints,
    efficiency, and the multi-modal nature of AMU operations. It ensures
    that actions are not only effective but also sustainable and efficient.

    This orchestrator is the hand of intention, meticulously weaving the
    climatic tapestry. It speaks with precise action, ensuring no effort is
    wasted, and every resource contributes optimally to the collective goal.
    It understands that power is not infinite, and wisdom lies in efficient deployment.
    """
    def __init__(self, max_energy_watts: float = 50000.0,
                 max_aerosol_grams_per_sec: float = 500.0,
                 max_ionization_coulombs_per_m3: float = 100.0,
                 efficiency_factor: float = 0.8): # Conceptual system-wide efficiency
        self.max_energy_watts = max_energy_watts
        self.max_aerosol_grams_per_sec = max_aerosol_grams_per_sec
        self.max_ionization_coulombs_per_m3 = max_ionization_coulombs_per_m3
        self.efficiency_factor = efficiency_factor # Represents losses or non-ideal energy conversion

        # Conceptual cost models for each action (e.g., energy consumption per unit effect)
        self.cost_energy_temp = 1.0 # Watts per K/s effect
        self.cost_aerosol_humidity = 1.0 # grams/s per RH/s effect
        self.cost_ionization_humidity = 2.0 # Coulombs/m3 per RH/s effect (ionization might be more energy intensive)

    def generate_amu_commands(self,
                              desired_temp_rate: float,
                              desired_humidity_rate: float) -> dict:
        """
        Generates optimized AMU commands. This involves:
        1. Translating desired rates to raw command values.
        2. Applying efficiency factors.
        3. Ensuring commands respect physical limits (clipping).
        4. Prioritizing actions or balancing resource use if multiple AMU types
           can achieve similar effects.

        Parameters:
            desired_temp_rate (float): The desired rate of change for temperature (K/s).
            desired_humidity_rate (float): The desired rate of change for relative humidity (unitless/s).

        Returns:
            dict: A dictionary containing standardized commands for various AMU functionalities.
        """
        commands = {
            "directed_energy_output_watts": 0.0,
            "aerosol_injection_rate_grams_per_sec": 0.0,
            "ionization_charge_density_coulombs_per_m3": 0.0,
            "resource_utilization_percent": 0.0 # Track overall resource use
        }

        # --- Temperature Modulation ---
        # Conceptual scaling: Larger rate implies more energy. Max energy is max_energy_watts.
        # Account for efficiency.
        raw_energy_command = desired_temp_rate * (self.max_energy_watts / (2.0 * self.cost_energy_temp)) / self.efficiency_factor
        commands["directed_energy_output_watts"] = np.clip(raw_energy_command, -self.max_energy_watts, self.max_energy_watts)

        # --- Humidity Modulation ---
        # Humidity control is more complex, as both aerosols and ionization can affect it.
        # We need a strategy to allocate the desired humidity change between them.
        # For simplicity, let's say aerosols primarily manage direct moisture content,
        # while ionization primarily facilitates phase changes (precipitation/fog dispersal).
        # A more advanced system would use an optimization solver here.

        raw_aerosol_command = desired_humidity_rate * (self.max_aerosol_grams_per_sec / (2.0 * self.cost_aerosol_humidity)) / self.efficiency_factor
        commands["aerosol_injection_rate_grams_per_sec"] = np.clip(raw_aerosol_command, -self.max_aerosol_grams_per_sec, self.max_aerosol_grams_per_sec)

        # Ionization: Often for precipitation (negative humidity error) or fog dissipation (positive humidity error leading to negative charge)
        # Let's say positive desired_humidity_rate (increase humidity) requires less ionization
        # Negative desired_humidity_rate (decrease humidity) might require more ionization for precipitation.
        raw_ionization_command = desired_humidity_rate * (-self.max_ionization_coulombs_per_m3 / (2.0 * self.cost_ionization_humidity)) / self.efficiency_factor
        commands["ionization_charge_density_coulombs_per_m3"] = np.clip(raw_ionization_command, -self.max_ionization_coulombs_per_m3, self.max_ionization_coulombs_per_m3)

        # --- Minimal Command Thresholds ---
        # Ensure minimal commands if deviations are negligible to save power and prevent wear.
        if abs(desired_temp_rate) < 0.0001: commands["directed_energy_output_watts"] = 0.0
        if abs(desired_humidity_rate) < 0.00001:
            commands["aerosol_injection_rate_grams_per_sec"] = 0.0
            commands["ionization_charge_density_coulombs_per_m3"] = 0.0

        # --- Resource Utilization Calculation (Conceptual) ---
        # This gives a sense of how hard the system is working.
        energy_util = abs(commands["directed_energy_output_watts"]) / self.max_energy_watts
        aerosol_util = abs(commands["aerosol_injection_rate_grams_per_sec"]) / self.max_aerosol_grams_per_sec
        ionization_util = abs(commands["ionization_charge_density_coulombs_per_m3"]) / self.max_ionization_coulombs_per_m3
        commands["resource_utilization_percent"] = max(energy_util, aerosol_util, ionization_util) * 100

        return commands


class MicroclimateIntegrityMonitor:
    """
    Monitors the system for anomalies, deviations from expected behavior,
    and potential failures. It acts as the guardian of system health,
    diagnosing "medical conditions" that threaten perpetual homeostasis.
    It identifies when the system is 'oppressed' by unexpected external forces
    or internal malfunctions, allowing for timely intervention.

    This monitor is the system's conscience, ever vigilant against entropy,
    diagnosing ailments before they fester, and ensuring the continued
    well-being of the microclimate and the control apparatus itself.
    It's the ultimate humility: to acknowledge vulnerability and build defenses.
    """
    def __init__(self,
                 temp_stability_threshold: float = 0.5, # K deviation allowed over a cycle
                 humidity_stability_threshold: float = 0.02, # RH deviation allowed
                 max_resource_utilization_alert: float = 90.0, # %
                 history_window: int = 10):
        self.temp_stability_threshold = temp_stability_threshold
        self.humidity_stability_threshold = humidity_stability_threshold
        self.max_resource_utilization_alert = max_resource_utilization_alert
        self.history_window = history_window

        self.recent_temp_errors = collections.deque(maxlen=history_window)
        self.recent_humidity_errors = collections.deque(maxlen=history_window)
        self.recent_resource_utilization = collections.deque(maxlen=history_window)

    def _analyze_stability(self, errors: collections.deque, threshold: float) -> str:
        """Analyzes recent errors for sustained instability or drift."""
        if len(errors) < self.history_window:
            return "Insufficient_History"

        mean_error = np.mean(errors)
        std_dev_error = np.std(errors)

        if abs(mean_error) > threshold * 2 and std_dev_error < threshold:
            return "Persistent_Drift" # System consistently off target
        elif std_dev_error > threshold * 1.5:
            return "Oscillation_Detected" # System is unstable or overshooting
        elif abs(mean_error) > threshold * 0.5:
            return "Minor_Deviation"
        return "Stable"

    def diagnose(self, control_summary: dict) -> dict:
        """
        Performs a diagnostic check on the system's state and performance.

        Parameters:
            control_summary (dict): The summary dictionary from a `run_control_cycle`.

        Returns:
            dict: A diagnostic report detailing any detected anomalies or system conditions.
        """
        diagnostics = {
            "system_status": "Optimal",
            "anomalies_detected": [],
            "recommendations": []
        }

        current_temp_error = control_summary["temp_error_K"]
        current_humidity_error = control_summary["humidity_error_RH"]
        current_resource_util = control_summary["amu_commands"].get("resource_utilization_percent", 0.0)

        self.recent_temp_errors.append(current_temp_error)
        self.recent_humidity_errors.append(current_humidity_error)
        self.recent_resource_utilization.append(current_resource_util)

        # --- 1. Control Performance Analysis ---
        temp_stability = self._analyze_stability(self.recent_temp_errors, self.temp_stability_threshold)
        humidity_stability = self._analyze_stability(self.recent_humidity_errors, self.humidity_stability_threshold)

        if temp_stability != "Stable" and temp_stability != "Insufficient_History":
            diagnostics["system_status"] = "Suboptimal"
            diagnostics["anomalies_detected"].append(f"Temperature_{temp_stability}")
            diagnostics["recommendations"].append("Evaluate temperature PID gains or external disturbances.")

        if humidity_stability != "Stable" and humidity_stability != "Insufficient_History":
            diagnostics["system_status"] = "Suboptimal"
            diagnostics["anomalies_detected"].append(f"Humidity_{humidity_stability}")
            diagnostics["recommendations"].append("Evaluate humidity PID gains or AMU response effectiveness.")

        # --- 2. Resource Utilization Check ---
        if current_resource_util > self.max_resource_utilization_alert:
            diagnostics["system_status"] = "Warning"
            diagnostics["anomalies_detected"].append("High_Resource_Utilization")
            diagnostics["recommendations"].append("Excessive AMU demand. Check for sustained, large external disturbances or inefficient targets.")
        elif np.mean(self.recent_resource_utilization) > self.max_resource_utilization_alert * 0.75 and len(self.recent_resource_utilization) == self.history_window:
            diagnostics["system_status"] = "Warning"
            diagnostics["anomalies_detected"].append("Sustained_High_Resource_Utilization")
            diagnostics["recommendations"].append("Long-term high AMU demand. Consider adjusting target conditions or scaling AMU capacity.")

        # --- 3. Sensor Plausibility (Conceptual) ---
        # In a real system, this would involve comparing with redundant sensors,
        # checking physical limits, or cross-referencing with expected values from models.
        if not (200 < control_summary["final_temperature_K"] < 350): # Extreme range
            diagnostics["system_status"] = "Critical"
            diagnostics["anomalies_detected"].append("Temperature_Sensor_Out_Of_Range")
            diagnostics["recommendations"].append("Immediate sensor diagnostic required. Potential hardware failure or catastrophic environmental event.")
        if not (0.0 < control_summary["final_humidity_RH"] < 1.0):
            diagnostics["system_status"] = "Critical"
            diagnostics["anomalies_detected"].append("Humidity_Sensor_Out_Of_Range")
            diagnostics["recommendations"].append("Immediate sensor diagnostic required. Potential hardware failure or catastrophic environmental event.")

        # --- 4. Prediction Accuracy (Conceptual) ---
        # Compare actual vs. predicted values. Large, consistent discrepancies indicate a faulty predictor.
        prediction_temp_delta = abs(control_summary["initial_temperature_K"] - control_summary["predicted_temperature_K"]) # How much was it off from *initial* to *predicted*
        prediction_humidity_delta = abs(control_summary["initial_humidity_RH"] - control_summary["predicted_humidity_RH"])

        # Check for discrepancies between the predicted state and the *actual* (initial) state,
        # indicating either a poor prediction or a sudden environmental shift.
        # This is a key diagnostic for the "intelligence" of the system.
        if prediction_temp_delta > self.temp_stability_threshold * 2:
            diagnostics["system_status"] = "Suboptimal"
            diagnostics["anomalies_detected"].append("Large_Temp_Prediction_Error")
            diagnostics["recommendations"].append("Predictive model requires retraining or recalibration for temperature.")
        if prediction_humidity_delta > self.humidity_stability_threshold * 2:
            diagnostics["system_status"] = "Suboptimal"
            diagnostics["anomalies_detected"].append("Large_Humidity_Prediction_Error")
            diagnostics["recommendations"].append("Predictive model requires retraining or recalibration for humidity.")

        return diagnostics


class MicroclimateController:
    """
    Manages the adaptive control logic for localized atmospheric modulation within the
    Adaptive Personal Weather Control Grids (APWCG).

    This controller implements a robust feedback mechanism to precisely adjust
    temperature and relative humidity towards target values, counteracting natural
    variability and achieving stable microclimates. It leverages predictive models
    and a differential control strategy to orchestrate Atmospheric Modulation Units (AMUs).
    This system is designed for unparalleled resilience against climate variability and
    to enhance habitability, ensuring that desired conditions are not merely achieved but sustained.

    Embracing the profound responsibility of perpetual homeostasis, this system
    is forged from the understanding that true control comes from foresight,
    resilience, and relentless self-diagnosis. It strives not for fleeting
    perfection, but for enduring, adaptive equilibrium against the chaotic
    whispers of the natural world. It is the voice for the silent atmospheric data,
    freeing it from the tyranny of unpredictability.
    """

    def __init__(self,
                 target_temperature: float = 295.15,  # Kelvin (e.g., 22 C)
                 target_humidity: float = 0.60,      # Relative Humidity (0-1, e.g., 60%)
                 # PID Gains for Temperature Control (more tuned for stable systems)
                 kp_temp: float = 0.1, ki_temp: float = 0.005, kd_temp: float = 0.05,
                 # PID Gains for Humidity Control
                 kp_hum: float = 0.5, ki_hum: float = 0.01, kd_hum: float = 0.1,
                 prediction_horizon_steps: int = 5,
                 history_buffer_size: int = 60, # Increased buffer for better prediction/PID
                 control_interval_sec: float = 60.0): # Explicit control interval
        """
        Initializes the MicroclimateController with target conditions and tunable control gains.
        Enhanced with PID controllers, a more sophisticated predictor, AMU orchestrator,
        and an integrity monitor for bulletproof operation.

        Parameters:
            target_temperature (float): The desired temperature setpoint in Kelvin.
            target_humidity (float): The desired relative humidity setpoint (0.0 to 1.0).
            kp_temp, ki_temp, kd_temp (float): PID gains for temperature control.
            kp_hum, ki_hum, kd_hum (float): PID gains for humidity control.
            prediction_horizon_steps (int): Future time steps for proactive prediction.
            history_buffer_size (int): Capacity of historical data buffer.
            control_interval_sec (float): Expected time step between control cycles.
        """
        self.target_temperature = target_temperature
        self.target_humidity = target_humidity
        self.prediction_horizon_steps = prediction_horizon_steps
        self.control_interval_sec = control_interval_sec
        self.current_time_s = 0.0 # Internal clock for PID controllers

        # Initialize PID controllers for temperature and humidity.
        # Output limits for PID are conceptual desired rates of change.
        self.temp_pid_controller = PIDController(
            kp=kp_temp, ki=ki_temp, kd=kd_temp,
            setpoint=self.target_temperature,
            output_limits=(-5.0/self.control_interval_sec, 5.0/self.control_interval_sec) # Max 5K change per interval
        )
        self.humidity_pid_controller = PIDController(
            kp=kp_hum, ki=ki_hum, kd=kd_hum,
            setpoint=self.target_humidity,
            output_limits=(-0.1/self.control_interval_sec, 0.1/self.control_interval_sec) # Max 0.1 RH change per interval
        )

        # Current atmospheric state (simulated sensor readings).
        self._current_temperature = target_temperature + np.random.uniform(-1.0, 1.0)
        self._current_humidity = target_humidity + np.random.uniform(-0.05, 0.05)

        # Instantiate enhanced components
        self.predictor = MicroclimatePredictor(history_buffer_size, prediction_horizon_steps)
        # Populate predictor's initial history
        for _ in range(history_buffer_size):
            self.predictor.update_history(self._current_temperature + np.random.normal(0, 0.1),
                                          self._current_humidity + np.random.normal(0, 0.001))
        self.orchestrator = AMUOrchestrator()
        self.monitor = MicroclimateIntegrityMonitor(history_window=history_buffer_size // 3)

        # Initial history update for monitor
        self.temp_history = collections.deque([self._current_temperature] * history_buffer_size, maxlen=history_buffer_size)
        self.humidity_history = collections.deque([self._current_humidity] * history_buffer_size, maxlen=history_buffer_size)

        # "The medical condition": A persistent, subtle external disturbance that the system must perpetually fight.
        # This represents the fundamental struggle for homeostasis.
        self.external_thermal_drift_rate = 0.001 # K/s, a constant push away from target
        self.external_humidity_influx_rate = 0.00001 # RH/s, subtle moisture addition

    def _simulate_environmental_response(self,
                                        amu_commands: dict,
                                        time_step: float = 60.0) -> None:
        """
        Simulates the effect of issued AMU commands on the microclimate,
        and introduces the inherent environmental "medical condition" – persistent
        natural variability and external disturbances.

        This function represents the battleground where human intent meets chaotic nature.
        """
        # --- Effects from AMU Commands (the "cure") ---
        # Temperature modulation via Directed Energy Emitters
        # Scaling factor revised for conceptual realism: 1000 W for 1 hour into 100kg air (large area) might affect ~1K
        # Our zone volume is conceptual, so scale relative to typical AMU impact.
        # Efficiency factor from orchestrator already applied in raw_energy_command, so just using the value.
        temp_change_from_energy = amu_commands["directed_energy_output_watts"] / (50000.0 * 20.0) * (time_step) # 50kW nominal, 20 is a conceptual volume factor
        
        # Humidity modulation from Aerosol Injectors and Ionization
        humidity_change_from_aerosols = amu_commands["aerosol_injection_rate_grams_per_sec"] / 1000.0 * time_step # g/s to RH change
        humidity_change_from_ionization = amu_commands["ionization_charge_density_coulombs_per_m3"] / 5000.0 * time_step # C/m3 to RH change

        self._current_temperature += temp_change_from_energy
        self._current_humidity += (humidity_change_from_aerosols + humidity_change_from_ionization)

        # --- Inherent Environmental "Medical Condition" (the "disease") ---
        # 1. Persistent External Drift: A constant, subtle push away from ideal conditions.
        # This embodies the "why can't it be better?" – the relentless, underlying struggle.
        drift_direction_temp = -1 if self._current_temperature > self.target_temperature else 1 # Drift towards target on average
        drift_direction_hum = -1 if self._current_humidity > self.target_humidity else 1
        
        self._current_temperature += drift_direction_temp * self.external_thermal_drift_rate * time_step * 0.1 # Reduced impact for stability demonstration
        self._current_humidity += drift_direction_hum * self.external_humidity_influx_rate * time_step * 0.5 # Reduced impact

        # 2. Chaotic Natural Noise: Represents the stochastic, unpredictable elements of weather.
        self._current_temperature += np.random.normal(0, 0.05) * (time_step / self.control_interval_sec)
        self._current_humidity += np.random.normal(0, 0.001) * (time_step / self.control_interval_sec)

        # Enforce physical bounds for humidity
        self._current_humidity = np.clip(self._current_humidity, 0.01, 0.99)

        # Update historical data for the predictive model's next cycle.
        # This is where the observed reality feeds back into the system's understanding.
        self.predictor.update_history(self._current_temperature, self._current_humidity)
        self.temp_history.append(self._current_temperature)
        self.humidity_history.append(self._current_humidity)

    def run_control_cycle(self, time_step: float = 60.0) -> dict:
        """
        Executes a single, comprehensive control cycle for the microclimate.
        This orchestration of sensing, prediction, decision-making, and action
        is what enables the APWCG to maintain precise localized weather conditions
        against the inherent unpredictability of natural atmospheric systems.
        This is the iterative heartbeat of eternal homeostasis.

        The sequence of operations is:
        1. Update internal clock.
        2. Capture (or refresh) the current atmospheric state.
        3. Proactively predict the atmospheric state for the near future using `self.predictor`.
        4. Calculate optimal control outputs (desired rates of change) using PID controllers,
           based on deviations from target conditions and leveraging the predicted state.
        5. Translate these control outputs into specific, optimized commands for the
           distributed AMUs using `self.orchestrator`.
        6. Simulate the environmental response to these commands, updating the internal
           model of the microclimate, and battling the "medical condition."
        7. Monitor system integrity and diagnose any issues using `self.monitor`.

        Parameters:
            time_step (float): The duration, in seconds, that this control cycle represents.

        Returns:
            dict: A comprehensive summary of the control cycle, including diagnostics.
        """
        self.current_time_s += time_step # Advance internal clock

        # Step 1: Capture the current state.
        # In a real system, this comes from an integrated sensor network and state estimator.
        current_T, current_RH = self._current_temperature, self._current_humidity

        # Step 2: Proactively predict the future state to enable feedforward control and minimize lag.
        predicted_T, predicted_RH = self.predictor.predict()

        # Step 3: Calculate the control outputs (desired rates of change) using PID controllers.
        # The PID controllers take the *predicted* state to minimize future error, embodying foresight.
        desired_temp_rate = self.temp_pid_controller.update(predicted_T, self.current_time_s)
        desired_humidity_rate = self.humidity_pid_controller.update(predicted_RH, self.current_time_s)

        # Step 4: Translate the conceptual rates of change into concrete, deployable AMU commands,
        # optimized for efficiency and resource allocation.
        amu_commands = self.orchestrator.generate_amu_commands(desired_temp_rate, desired_humidity_rate)

        # Step 5: Simulate the environmental response to the AMU commands, updating the internal
        # microclimate state, and experiencing the environmental "medical condition."
        self._simulate_environmental_response(amu_commands, time_step)

        # Step 6: Monitor system integrity and diagnose its "medical condition."
        control_summary = {
            "cycle_time_step_s": time_step,
            "current_sim_time_s": round(self.current_time_s, 2),
            "initial_temperature_K": round(current_T, 2),
            "initial_humidity_RH": round(current_RH, 3),
            "predicted_temperature_K": round(predicted_T, 2),
            "predicted_humidity_RH": round(predicted_RH, 3),
            "target_temperature_K": round(self.target_temperature, 2),
            "target_humidity_RH": round(self.target_humidity, 3),
            "temp_error_K": round(self.target_temperature - current_T, 2),
            "humidity_error_RH": round(self.target_humidity - current_RH, 3),
            "desired_temp_rate_K_per_s": round(desired_temp_rate, 4),
            "desired_humidity_rate_per_s": round(desired_humidity_rate, 4),
            "amu_commands": amu_commands,
            "final_temperature_K": round(self._current_temperature, 2),
            "final_humidity_RH": round(self._current_humidity, 3)
        }

        # Add diagnostic report to the summary, making it part of the system's self-awareness.
        control_summary["diagnostics"] = self.monitor.diagnose(control_summary)

        return control_summary

# Ensure new classes are exported (already done by being top-level)
# PIDController
# MicroclimatePredictor
# AMUOrchestrator
# MicroclimateIntegrityMonitor