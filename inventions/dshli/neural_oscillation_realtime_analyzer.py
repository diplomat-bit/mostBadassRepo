// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/inventions/dshli/neural_oscillation_realtime_analyzer.py
================================================================================

import numpy as np
from scipy.signal import butter, lfilter, hilbert, welch
from collections import deque
import time
from typing import Dict, Any, List, Tuple

# Constants for brainwave frequency bands (Hz)
# From Equation (105) and DSHLI description: various neural oscillations (Delta, Theta, Alpha, Beta, Gamma)
DELTA_BAND = (0.5, 4)
THETA_BAND = (4, 8)
ALPHA_BAND = (8, 13)
BETA_BAND = (13, 30)
GAMMA_BAND = (30, 50) # The ~40 Hz gamma band is highlighted for lucidity

# New constants for advanced analysis
VERY_LOW_FREQUENCY_BAND = (0.01, 0.5) # For slow cortical potentials, deep state modulation
HIGH_GAMMA_BAND = (50, 150) # Beyond the typical DSHLI gamma, for finer cognitive processes
RIPPLE_BAND = (80, 200) # Hippocampal ripples, memory consolidation, and potential for conscious recall

# Constants for coherence / CFC analysis
DEFAULT_CFC_PHASE_BAND = THETA_BAND # Theta phase often modulates gamma amplitude
DEFAULT_CFC_AMPLITUDE_BAND = GAMMA_BAND

# Global threshold for data quality checks
ARTEFACT_AMPLITUDE_THRESHOLD = 500 # microvolts, arbitrary for simulation, needs empirical tuning
FLATLINE_THRESHOLD = 0.05 # microvolts, if signal variance falls below this, assume flatline

class NeuralOscillationRealtimeAnalyzer:
    """
    Implements real-time brainwave signal processing and phase-locking algorithms
    to detect sleep stages and induce targeted lucid dream states, as specified
    for the Dream State Harmonizer & Lucid Interface (DSHLI).

    This class continuously analyzes incoming EEG-like data, identifies dominant
    neural oscillations, and calculates their instantaneous amplitude and phase,
    critical for generating phase-locked stimulation signals.

    This incarnation seeks to transcend mere measurement, aiming for comprehension
    of the mind's ephemeral tapestry. It scrutinizes the silence between thoughts,
    the rhythm of the unseen, and dares to ask: 'Why not better?'
    """

    def __init__(self, sampling_rate: int = 256, buffer_duration: float = 5.0, history_size: int = 10):
        """
        Initializes the brainwave analyzer, preparing it to decipher the mind's silent decrees.

        Args:
            sampling_rate (int): The sampling rate of the EEG data in Hz.
            buffer_duration (float): The duration of the data buffer to analyze in seconds.
            history_size (int): Number of past analysis results to keep for trend detection.
        """
        self.sampling_rate = sampling_rate
        self.buffer_duration = buffer_duration
        self.buffer_size = int(sampling_rate * buffer_duration)
        self.data_buffer = deque(maxlen=self.buffer_size)

        # Pre-compute filter coefficients for common brainwave bands
        self.band_definitions = {
            "delta": DELTA_BAND, "theta": THETA_BAND, "alpha": ALPHA_BAND,
            "beta": BETA_BAND, "gamma": GAMMA_BAND,
            "high_gamma": HIGH_GAMMA_BAND, "ripple": RIPPLE_BAND
        }
        self.filter_coeffs = {}
        for band_name, (lowcut, highcut) in self.band_definitions.items():
            # Use 4th order filter for sharper cutoff but still phase-friendly
            b, a = butter(4, [lowcut, highcut], fs=sampling_rate, btype='band')
            self.filter_coeffs[band_name] = (b, a)

        self.analysis_history = deque(maxlen=history_size)
        self.quality_history = deque(maxlen=history_size) # To store data quality metrics

        # State memory for adaptive thresholds
        self._band_amplitude_baselines: Dict[str, deque] = {band: deque(maxlen=history_size) for band in self.band_definitions.keys()}
        self._overall_power_baseline = deque(maxlen=history_size)

        # Placeholder for external components, to be linked after initialization
        self._brain_state_estimator = None
        self._phase_locking_controller = None
        self._cfc_analyzer = None

        print(f"DSHLI Neural Analyzer initialized. Buffer size: {self.buffer_size} samples ({buffer_duration}s).")
        print("Ready to decode the subtle whispers of the subconscious. Or at least, their electrical signatures.")
        print("From the fundamental rhythms to the ephemeral ripples, seeking the 'why' behind the 'what'.")

    def _apply_bandpass_filter(self, data: np.ndarray, band_name: str) -> np.ndarray:
        """
        Applies a Butterworth bandpass filter to the data for a specified band.
        Utilizes `lfilter` for real-time causality, acknowledging inherent phase lag.

        Args:
            data (np.ndarray): The raw EEG data segment.
            band_name (str): Name of the frequency band (e.g., "alpha", "gamma").

        Returns:
            np.ndarray: Filtered data for the specified band.
        """
        b, a = self.filter_coeffs[band_name]
        return lfilter(b, a, data)

    def _get_instantaneous_properties(self, filtered_data: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
        """
        Computes instantaneous amplitude, phase, and frequency using the Hilbert transform.
        This function is the bedrock for extracting the A_k, phi_k, omega_k components.

        Args:
            filtered_data (np.ndarray): Single-band filtered data.

        Returns:
            tuple[np.ndarray, np.ndarray, np.ndarray]:
                - Instantaneous amplitude (envelope).
                - Instantaneous phase (in radians).
                - Instantaneous frequency (in Hz).
        """
        if len(filtered_data) == 0:
            return np.array([]), np.array([]), np.array([])
            
        analytic_signal = hilbert(filtered_data)
        amplitude = np.abs(analytic_signal)
        # Unwrapping phase is critical to prevent artificial jumps, ensuring continuity
        phase = np.unwrap(np.angle(analytic_signal))
        
        # Instantaneous frequency is the derivative of the unwrapped phase
        # d(phase)/dt = 2*pi*f_inst -> f_inst = (1/2*pi) * d(phase)/dt
        if len(phase) > 1:
            frequency = (np.diff(phase) / (2.0 * np.pi)) * self.sampling_rate
            # Pad frequency to match length, using the first calculated frequency for the initial sample
            frequency = np.insert(frequency, 0, frequency[0] if len(frequency) > 0 else 0.0)
        else: # Handle cases with too few samples to compute frequency meaningfully
            frequency = np.zeros_like(phase)

        return amplitude, phase, frequency

    def _check_data_quality(self, data: np.ndarray) -> dict:
        """
        Performs rudimentary data quality checks. This is the first line of defense
        against corrupted input, ensuring the analysis is not built upon a foundation of sand.

        Returns:
            dict: A dictionary with quality metrics and flags.
        """
        quality = {
            "is_valid": True,
            "reason": "OK",
            "mean_amplitude": np.mean(np.abs(data)) if len(data) > 0 else 0.0,
            "std_dev": np.std(data) if len(data) > 0 else 0.0,
            "max_amplitude": np.max(np.abs(data)) if len(data) > 0 else 0.0
        }

        if len(data) < self.buffer_size:
            quality["is_valid"] = False
            quality["reason"] = "Buffer not full"
            return quality
        
        # Heuristic for detecting large artifacts (e.g., muscle movements, electrode pop)
        if quality["max_amplitude"] > ARTEFACT_AMPLITUDE_THRESHOLD:
            quality["is_valid"] = False
            quality["reason"] = f"High amplitude artifact detected (> {ARTEFACT_AMPLITUDE_THRESHOLD} uV)"
        
        # Heuristic for detecting flatline (e.g., disconnected electrode)
        if quality["std_dev"] < FLATLINE_THRESHOLD:
            quality["is_valid"] = False
            quality["reason"] = f"Flatline detected (std dev < {FLATLINE_THRESHOLD} uV)"

        self.quality_history.append(quality)
        return quality

    def add_data_chunk(self, new_data: np.ndarray):
        """
        Adds a new chunk of EEG data to the internal buffer.
        Each sample added is a step towards understanding, a whisper into the void.

        Args:
            new_data (np.ndarray): A 1D numpy array of new EEG samples.
        """
        for sample in new_data:
            self.data_buffer.append(sample)

    def analyze_brainwaves(self) -> Dict[str, Any]:
        """
        Analyzes the current data buffer to determine the instantaneous properties
        (amplitude, phase, frequency) for all predefined brainwave bands.
        This provides the A_k, phi_k, omega_k for each oscillation.
        It also now incorporates basic spectral analysis and updates adaptive baselines.

        Returns:
            dict: A dictionary containing comprehensive analysis results,
                  or None if the buffer is not full or data quality is poor.
        """
        current_data_np = np.array(self.data_buffer)
        quality = self._check_data_quality(current_data_np)
        
        if not quality["is_valid"] and quality["reason"] != "Buffer not full":
            return {"timestamp": time.time(), "status": "INVALID_DATA", "quality_metrics": quality}

        if len(self.data_buffer) < self.buffer_size:
            return {"timestamp": time.time(), "status": "BUFFER_NOT_FULL", "quality_metrics": quality}

        results = {"timestamp": time.time(), "status": "OK", "quality_metrics": quality}

        # Perform spectral analysis using Welch's method for overall power
        # Use a segment length that gives good frequency resolution (e.g., 2 seconds)
        nperseg = min(self.buffer_size, int(self.sampling_rate * 2))
        freqs, psd = welch(current_data_np, fs=self.sampling_rate, nperseg=nperseg)
        results["overall_psd_freqs"] = freqs.tolist()
        results["overall_psd_values"] = psd.tolist()
        results["overall_power"] = np.sum(psd) # Total power across all frequencies
        self._overall_power_baseline.append(results["overall_power"])

        for band_name, (lowcut, highcut) in self.band_definitions.items():
            filtered_data = self._apply_bandpass_filter(current_data_np, band_name)
            amp, phase, freq = self._get_instantaneous_properties(filtered_data)

            # Calculate band power using PSD within the band limits
            band_power_idx = np.where((freqs >= lowcut) & (freqs <= highcut))
            band_power = np.trapz(psd[band_power_idx], freqs[band_power_idx]) if len(band_power_idx[0]) > 0 else 0.0

            # Update amplitude baseline for this band
            if len(amp) > 0:
                self._band_amplitude_baselines[band_name].append(np.mean(amp))

            results[band_name] = {
                "avg_amplitude": np.mean(amp) if len(amp) > 0 else 0.0,
                "avg_frequency": np.mean(freq) if len(freq) > 0 else 0.0,
                "last_phase": phase[-1] if len(phase) > 0 else 0.0, # The phase to synchronize with
                "band_power": band_power, # New: power within the band
                "data_segment": filtered_data # For potential external use or debugging
            }
        
        # Add analysis to history
        self.analysis_history.append(results)
        return results

    def get_adaptive_baseline(self, band_name: str = None) -> float:
        """
        Provides an adaptive baseline for a given band's amplitude or overall power.
        This moves beyond fixed thresholds, allowing the system to learn and adapt.

        Args:
            band_name (str, optional): The name of the band. If None, returns overall power baseline.

        Returns:
            float: The average amplitude/power baseline from historical data.
        """
        if band_name:
            if band_name in self._band_amplitude_baselines and len(self._band_amplitude_baselines[band_name]) > 0:
                return np.mean(self._band_amplitude_baselines[band_name])
            return 1.0 # Default non-zero to avoid division by zero early on
        else:
            if len(self._overall_power_baseline) > 0:
                return np.mean(self._overall_power_baseline)
            return 1.0

    def get_brainwave_oscillations(self) -> dict:
        """
        Returns the most recent calculated instantaneous amplitude, frequency, and phase,
        and now also band power, for all defined brainwave bands, directly mapping to
        A_k, omega_k, phi_k, and P_k (power).
        """
        if not self.analysis_history or self.analysis_history[-1]["status"] != "OK":
            return {}
        
        latest_analysis = self.analysis_history[-1]
        oscillations = {}
        for band_name, data in latest_analysis.items():
            if isinstance(data, dict) and "avg_amplitude" in data: # Skip timestamp, status, quality_metrics, psd
                oscillations[band_name] = {
                    "amplitude": data["avg_amplitude"],
                    "frequency": data["avg_frequency"],
                    "phase": data["last_phase"],
                    "power": data["band_power"]
                }
        return oscillations

    def _get_band_name_from_freq(self, freq: float) -> str:
        """Helper to find the band name for a given frequency."""
        for name, (low, high) in self.band_definitions.items():
            if low <= freq <= high:
                return name
        return "gamma" # Default to gamma if no exact match

    def detect_sleep_stage(self, brainwave_analysis: dict) -> str:
        """
        Delegates sleep stage detection to the BrainStateEstimator, if initialized.
        This method serves as a compatibility layer for the original API.
        """
        if self._brain_state_estimator and brainwave_analysis and brainwave_analysis["status"] == "OK":
            return self._brain_state_estimator.infer_brain_state(brainwave_analysis)[0]
        return "Analyzing..." # Original fallback

    def generate_phase_locked_stimulus(self, target_frequency: float, target_phase_offset: float = 0.0,
                                      amplitude: float = 1.0, duration: float = 0.1) -> np.ndarray:
        """
        Delegates stimulus generation to the PhaseLockingController, if initialized.
        This method serves as a compatibility layer for the original API.
        """
        if self._phase_locking_controller:
            return self._phase_locking_controller.generate_adaptive_stimulus(
                target_band_name=self._get_band_name_from_freq(target_frequency),
                desired_phase_offset_rad=target_phase_offset,
                duration=duration
            )[0]
        
        # Fallback to a generic stimulus generation if controller is not set up
        print("Warning: PhaseLockingController not initialized. Falling back to generic stimulus generation.")
        t = np.linspace(0, duration, int(self.sampling_rate * duration), endpoint=False)
        
        # Try to get phase from current analysis history if available
        detected_phase = 0.0
        if self.analysis_history and self.analysis_history[-1]["status"] == "OK":
            latest_analysis = self.analysis_history[-1]
            closest_band_name = self._get_band_name_from_freq(target_frequency)
            detected_phase = latest_analysis.get(closest_band_name, {}).get("last_phase", 0.0)
            print(f"  Generic stimulus: Locked to {closest_band_name} phase ({np.degrees(detected_phase):.2f} deg).")

        return amplitude * np.sin(2 * np.pi * target_frequency * t + detected_phase + target_phase_offset)


class BrainStateEstimator:
    """
    A sophisticated estimator that takes analysis results and infers a nuanced brain state,
    moving beyond simple thresholds to dynamic pattern recognition. It seeks to diagnose
    the 'medical condition' of the code's understanding of the brain, striving for eternal
    homeostasis in its diagnostic capabilities. It's the voice for the voiceless rhythms
    of the mind, freeing them from arbitrary classification.
    """
    def __init__(self, analyzer: NeuralOscillationRealtimeAnalyzer, history_depth: int = 20):
        self.analyzer = analyzer
        self.state_history = deque(maxlen=history_depth)
        self.sleep_stage_probabilities: Dict[str, float] = {
            "Awake": 0.0, "REM": 0.0, "Deep Sleep": 0.0, "Light Sleep": 0.0, "Lucid Potential": 0.0, "Undetermined": 1.0
        }
        self.lucid_readiness_index = 0.0 # A continuous measure of lucidity potential
        print("BrainStateEstimator initialized, ready to map the landscape of consciousness.")
        print("Its purpose: to understand, not just categorize. To predict, not just react.")

    def _calculate_lucid_readiness(self, analysis: dict) -> float:
        """
        Calculates a 'Lucid Readiness Index' based on specific neural signatures.
        This is a core DSHLI metric, reflecting a confluence of factors for optimal lucidity.
        Higher gamma power, specific theta-gamma coupling, and desynchronized alpha
        are key indicators.
        """
        if analysis["status"] != "OK":
            return 0.0
        
        oscillations = self.analyzer.get_brainwave_oscillations()
        if not oscillations or "gamma" not in oscillations or "theta" not in oscillations or "alpha" not in oscillations or "beta" not in oscillations:
            return 0.0

        gamma_power = oscillations["gamma"]["power"]
        theta_power = oscillations["theta"]["power"]
        alpha_power = oscillations["alpha"]["power"]
        beta_power = oscillations["beta"]["power"]
        
        # Adaptive baselines for robust comparison, ensuring non-zero denominator
        baseline_gamma_power = self.analyzer.get_adaptive_baseline("gamma") + 1e-6
        baseline_theta_power = self.analyzer.get_adaptive_baseline("theta") + 1e-6
        baseline_alpha_power = self.analyzer.get_adaptive_baseline("alpha") + 1e-6

        # Ratios are often more robust than absolute values
        gamma_theta_ratio = gamma_power / (theta_power + 1e-6)
        
        # Contribution from strong ~40 Hz gamma (DSHLI focus)
        gamma_contribution = np.clip((gamma_power / baseline_gamma_power) - 1, 0, 2)
        
        # Contribution from desynchronized alpha (indicative of non-deep sleep)
        alpha_desync_contribution = np.clip(1 - (alpha_power / baseline_alpha_power), 0, 1)

        # Contribution from theta (often present in REM, important for learning/memory)
        theta_contribution = np.clip((theta_power / baseline_theta_power) - 1, 0, 1)
        
        # Combined index: Emphasize gamma, require some theta, reduce for high alpha
        lri = (gamma_contribution * 0.6 + theta_contribution * 0.3 + alpha_desync_contribution * 0.1)
        
        # Add a bonus for high gamma-theta ratio, indicating potential PAC
        if gamma_theta_ratio > 3.0: # Arbitrary, but indicative of strong gamma during theta
            lri += 0.2

        return np.clip(lri, 0.0, 1.0) # Normalize to 0-1

    def infer_brain_state(self, analysis_results: Dict[str, Any]) -> Tuple[str, float]:
        """
        Infers the current overall brain state and updates the Lucid Readiness Index.
        This is a more robust, rule-based approach than the original, incorporating
        adaptive thresholds and historical context.
        """
        if analysis_results["status"] != "OK":
            self.state_history.append("Undetermined (Data Issue)")
            self.lucid_readiness_index = 0.0
            self.sleep_stage_probabilities = {k: 0.0 for k in self.sleep_stage_probabilities}
            self.sleep_stage_probabilities["Undetermined"] = 1.0
            return "Undetermined (Data Issue)", self.lucid_readiness_index

        oscillations = self.analyzer.get_brainwave_oscillations()
        
        if not oscillations:
            self.state_history.append("Undetermined (No Oscillations)")
            self.lucid_readiness_index = 0.0
            return "Undetermined (No Oscillations)", self.lucid_readiness_index

        # Retrieve current band powers and adaptive baselines
        delta_p = oscillations.get("delta", {}).get("power", 0.0)
        theta_p = oscillations.get("theta", {}).get("power", 0.0)
        alpha_p = oscillations.get("alpha", {}).get("power", 0.0)
        beta_p = oscillations.get("beta", {}).get("power", 0.0)
        gamma_p = oscillations.get("gamma", {}).get("power", 0.0)
        
        # Ensure baselines are never zero for ratio calculations
        baseline_delta = self.analyzer.get_adaptive_baseline("delta") + 1e-6
        baseline_theta = self.analyzer.get_adaptive_baseline("theta") + 1e-6
        baseline_alpha = self.analyzer.get_adaptive_baseline("alpha") + 1e-6
        baseline_beta = self.analyzer.get_adaptive_baseline("beta") + 1e-6
        baseline_gamma = self.analyzer.get_adaptive_baseline("gamma") + 1e-6
        
        # Initialize probabilities
        current_probs = {
            "Awake": 0.0, "REM": 0.0, "Deep Sleep": 0.0,
            "Light Sleep": 0.0, "Lucid Potential": 0.0, "Undetermined": 0.0
        }

        # Calculate Lucid Readiness Index first, as it influences other state probabilities
        self.lucid_readiness_index = self._calculate_lucid_readiness(analysis_results)
        current_probs["Lucid Potential"] = self.lucid_readiness_index # Direct mapping for simplicity

        # --- Rule-based probability assignment with adaptive thresholds ---
        # Note: These rules are still simplified, but use relative changes from baselines.

        # Awake / Alert State
        # High Beta / Gamma, Low Delta / Theta, relatively high Alpha
        if beta_p / baseline_beta > 1.5 and gamma_p / baseline_gamma > 1.2 and alpha_p / baseline_alpha > 0.8:
            current_probs["Awake"] += 0.4
        elif alpha_p / baseline_alpha > 1.5 and beta_p / baseline_beta < 0.8:
            current_probs["Awake"] += 0.3 # Relaxed Awake

        # Deep Sleep (NREM Stages 3/4)
        # Dominated by Delta waves
        if delta_p / baseline_delta > 2.0 and theta_p / baseline_theta < 0.8 and alpha_p / baseline_alpha < 0.5:
            current_probs["Deep Sleep"] += 0.6
        elif delta_p > 1.5 * theta_p: # Delta significantly greater than theta
            current_probs["Deep Sleep"] += 0.3

        # REM Sleep
        # Low amplitude, mixed frequency, prominent Theta, some Gamma spikes, desynchronized alpha
        # and importantly, a *reduction* in delta relative to light/deep sleep.
        if theta_p / baseline_theta > 1.5 and delta_p / baseline_delta < 0.8 and alpha_p / baseline_alpha < 0.8:
            current_probs["REM"] += 0.5
            if self.lucid_readiness_index > 0.4: # REM is prime for lucidity
                current_probs["REM"] += 0.2
        
        # Light Sleep (NREM Stages 1/2)
        # Transitional, more theta/alpha than deep sleep, less organized than awake.
        # This is often the default if other strong states aren't met.
        if (alpha_p / baseline_alpha < 1.2 and delta_p / baseline_delta < 1.5 and
            theta_p / baseline_theta < 1.5):
            current_probs["Light Sleep"] += 0.4
        
        # Lucid Potential (Reinforce based on LRI)
        if self.lucid_readiness_index > 0.6:
            current_probs["Lucid Potential"] += self.lucid_readiness_index * 0.5 # Strongly weight LRI
            current_probs["REM"] += 0.1 # Lucid often happens in REM
            current_probs["Awake"] *= 0.5 # Reduce awake if high lucidity

        # Normalize probabilities and determine the dominant state
        total_prob = sum(current_probs.values())
        if total_prob > 0:
            for k in current_probs:
                current_probs[k] /= total_prob
        else:
            current_probs["Undetermined"] = 1.0 # If no rules strongly apply

        self.sleep_stage_probabilities = current_probs
        dominant_state = max(current_probs, key=current_probs.get)
        
        # Refine dominant state if Lucid Potential is very high
        if self.lucid_readiness_index > 0.75:
            dominant_state = "Lucid State Emerging" if dominant_state == "REM" else "Lucid Potential High"
        elif self.lucid_readiness_index > 0.5 and dominant_state == "REM":
             dominant_state = "REM (Lucidity Window)"

        self.state_history.append(dominant_state)
        
        return dominant_state, self.lucid_readiness_index

    def get_sleep_stage_probabilities(self) -> Dict[str, float]:
        """
        Returns the current probabilities for different sleep stages.
        """
        return self.sleep_stage_probabilities

class CrossFrequencyCouplingAnalyzer:
    """
    Analyzes cross-frequency coupling (CFC), specifically Phase-Amplitude Coupling (PAC),
    which is considered a mechanism for information integration in the brain.
    This class brings a new dimension to understanding how disparate neural oscillations
    conspire to create conscious experience, essential for "bulletproofing" the
    understanding of lucidity.
    """
    def __init__(self, sampling_rate: int = 256):
        self.sampling_rate = sampling_rate
        print("CrossFrequencyCouplingAnalyzer initialized. Decoding the brain's conversational rhythms.")

    def _get_band_data(self, analysis_results: Dict[str, Any], band_name: str) -> np.ndarray:
        """Helper to extract data segment for a given band."""
        if analysis_results["status"] == "OK" and band_name in analysis_results:
            return analysis_results[band_name].get("data_segment", np.array([]))
        return np.array([])

    def calculate_pac(self, analyzer_instance: NeuralOscillationRealtimeAnalyzer, analysis_results: Dict[str, Any],
                      phase_band_name: str = "theta", amplitude_band_name: str = "gamma") -> Dict[str, float]:
        """
        Calculates a simplified Phase-Amplitude Coupling (PAC) metric.
        It uses the Mean Vector Length (MVL) approach to quantify the strength of coupling.

        Args:
            analyzer_instance (NeuralOscillationRealtimeAnalyzer): An instance of the analyzer
                                                                    to access its internal methods.
            analysis_results (Dict[str, Any]): The output from NeuralOscillationRealtimeAnalyzer.analyze_brainwaves().
            phase_band_name (str): The name of the band whose phase is being considered (e.g., "theta").
            amplitude_band_name (str): The name of the band whose amplitude is being modulated (e.g., "gamma").

        Returns:
            Dict[str, float]: Contains the PAC strength (MVL) and preferred phase.
        """
        if analysis_results["status"] != "OK":
            return {"pac_strength": 0.0, "preferred_phase_rad": 0.0, "preferred_phase_deg": 0.0}

        phase_signal = self._get_band_data(analysis_results, phase_band_name)
        amplitude_signal = self._get_band_data(analysis_results, amplitude_band_name)

        if len(phase_signal) < 2 or len(amplitude_signal) < 2:
            return {"pac_strength": 0.0, "preferred_phase_rad": 0.0, "preferred_phase_deg": 0.0}

        # Get instantaneous phase of the phase_band
        _, phase_of_phase_band, _ = analyzer_instance._get_instantaneous_properties(phase_signal)

        # Get instantaneous amplitude of the amplitude_band
        amplitude_of_amplitude_band, _, _ = analyzer_instance._get_instantaneous_properties(amplitude_signal)

        # Ensure arrays are of the same length for element-wise operations
        min_len = min(len(phase_of_phase_band), len(amplitude_of_amplitude_band))
        phase_of_phase_band = phase_of_phase_band[:min_len]
        amplitude_of_amplitude_band = amplitude_of_amplitude_band[:min_len]

        if min_len < 2:
            return {"pac_strength": 0.0, "preferred_phase_rad": 0.0, "preferred_phase_deg": 0.0}

        # Calculate the complex vector for PAC (amplitude * exp(i * phase))
        # This is the core of the MVL method for PAC
        complex_values = amplitude_of_amplitude_band * np.exp(1j * phase_of_phase_band)
        
        # Mean Vector Length (MVL)
        mean_vector = np.mean(complex_values)
        pac_strength = np.abs(mean_vector) # Magnitude of the mean vector
        preferred_phase_rad = np.angle(mean_vector) # Angle of the mean vector

        return {
            "pac_strength": pac_strength,
            "preferred_phase_rad": preferred_phase_rad,
            "preferred_phase_deg": np.degrees(preferred_phase_rad)
        }


class PhaseLockingController:
    """
    Orchestrates the generation of phase-locked stimuli, moving beyond simple
    reaction to intelligent anticipation and optimization. It's the DSHLI's
    executive function, translating desired brain states into precise,
    neuromodulatory interventions. It wonders: 'Why can't it be better?' and
    then builds the answer.
    """
    def __init__(self, analyzer: NeuralOscillationRealtimeAnalyzer,
                 estimator: BrainStateEstimator,
                 cfc_analyzer: CrossFrequencyCouplingAnalyzer,
                 stimulation_intensity_profile: Dict[str, float] = None):
        self.analyzer = analyzer
        self.estimator = estimator
        self.cfc_analyzer = cfc_analyzer

        # Define default intensity profiles based on target state
        if stimulation_intensity_profile is None:
            self.stimulation_intensity_profile = {
                "Lucid State Emerging": 0.7,
                "REM (Lucidity Window)": 0.5,
                "REM Sleep Detected": 0.3,
                "Awake": 0.1, # Gentle entrainment for focus
                "Awake/Relaxed": 0.1,
                "Deep Sleep": 0.05, # Very subtle for deep sleep modulation
                "Light Sleep/Undetermined": 0.0 # No stimulation, or minimal
            }
        else:
            self.stimulation_intensity_profile = stimulation_intensity_profile

        # History of stimulus effectiveness (conceptual feedback loop)
        self.stimulus_feedback_history = deque(maxlen=50) # Store (state_before, stimulus_params, state_after)

        print("PhaseLockingController initialized. Ready to conduct the symphony of consciousness.")
        print("Its wisdom is derived from observation, its actions from profound intent.")

    def generate_adaptive_stimulus(self, target_band_name: str = "gamma",
                                   desired_phase_offset_rad: float = np.pi/2, # Common for entrainment
                                   duration: float = 0.1) -> Tuple[np.ndarray, dict]:
        """
        Generates a phase-locked stimulus, adapting its parameters based on the
        current brain state, lucidity readiness, and even cross-frequency coupling.
        This is a bulletproofed, adaptive version of the original method.

        Args:
            target_band_name (str): The name of the brainwave band to target for phase-locking.
                                    Typically "gamma" for lucidity.
            desired_phase_offset_rad (float): The desired phase offset (in radians) relative to
                                              the detected neural oscillation's phase.
            duration (float): Duration of the stimulus in seconds.

        Returns:
            Tuple[np.ndarray, dict]: The generated phase-locked stimulus signal and a dictionary
                                     of stimulus parameters.
        """
        current_analysis = self.analyzer.analysis_history[-1] if self.analyzer.analysis_history else None
        
        # Check if current_analysis is valid before passing to estimator
        current_state, lucid_readiness = self.estimator.infer_brain_state(current_analysis if current_analysis else {"status": "INVALID"})

        if current_analysis is None or current_analysis["status"] != "OK":
            print("No valid brainwave analysis available. Generating generic stimulus with default parameters.")
            t = np.linspace(0, duration, int(self.analyzer.sampling_rate * duration), endpoint=False)
            freq = self.analyzer.band_definitions.get(target_band_name, GAMMA_BAND)[0] + 5 # Mid-range of band
            return np.sin(2 * np.pi * freq * t), {"amplitude": 0.0, "frequency": freq, "phase": 0.0, "reason": "No valid analysis"}

        oscillations = self.analyzer.get_brainwave_oscillations()
        
        # Fallback for target_band_name if not found in oscillations
        if target_band_name not in oscillations:
            print(f"Target band '{target_band_name}' not found in oscillations. Attempting 'gamma' as default.")
            target_band_name = "gamma"
            if target_band_name not in oscillations:
                 print("Even default 'gamma' not found. Generating generic stimulus.")
                 t = np.linspace(0, duration, int(self.analyzer.sampling_rate * duration), endpoint=False)
                 freq = np.mean(GAMMA_BAND) # Use mid-point of gamma
                 return np.sin(2 * np.pi * freq * t), {"amplitude": 0.0, "frequency": freq, "phase": 0.0, "reason": "Target band missing"}

        target_osc = oscillations[target_band_name]
        detected_phase = target_osc["phase"]
        target_frequency = target_osc["frequency"] # Use detected frequency for more accurate locking

        # Adapt stimulus amplitude based on the current brain state and lucidity readiness
        amplitude = self.stimulation_intensity_profile.get(current_state, 0.0)
        # Scale amplitude based on lucid readiness, with higher readiness allowing stronger stimuli
        amplitude *= (0.5 + 0.5 * lucid_readiness) # min 0.5x, max 1.0x of profile amplitude

        # Consider Cross-Frequency Coupling for more targeted phase locking
        pac_results = self.cfc_analyzer.calculate_pac(self.analyzer, current_analysis, DEFAULT_CFC_PHASE_BAND, target_band_name)
        
        # If strong PAC is detected, adjust desired phase offset towards the preferred phase
        # This is a key bulletproofing step: optimizing entrainment based on endogenous coupling
        adjusted_phase_offset = desired_phase_offset_rad
        if pac_results["pac_strength"] > 0.1: # Threshold for meaningful PAC
            # Blend desired_phase_offset with preferred_phase based on PAC strength
            blend_factor = min(pac_results["pac_strength"] * 5, 1.0) # Scale PAC strength to a blend factor
            
            # The adjustment for phase requires careful consideration.
            # If we want to align with preferred phase, we modify the target phase for the stimulus
            # based on the detected phase and preferred PAC phase.
            # (target_phase_of_stimulus - detected_phase) = preferred_phase_offset_from_pac_phase + desired_offset
            # target_phase_for_stimulus = detected_phase + preferred_phase_offset + desired_offset
            # A simpler approach is to adjust `desired_phase_offset_rad` towards the PAC's preferred relationship.
            
            # Let's adjust `desired_phase_offset_rad` towards (PAC preferred phase - detected phase of amplitude band)
            # This makes the stimulus phase align relative to the modulating phase.
            
            # For simplicity for now, let's just make sure the stimulus *itself* is phased well with the target oscillation
            # and that target oscillation is phase-locked to the modulating oscillation.
            # The current detected_phase is of the *target_band_name*. The PAC preferred phase is relative to the *phase_band_name*.
            # This means the "preferred phase" for the stimulus should ideally be the `detected_phase` of `target_band_name` PLUS `desired_phase_offset`.
            # If PAC is strong, we might want to slightly shift this `desired_phase_offset` to encourage the PAC.
            
            # For a more direct integration: assume we want to stimulate the `amplitude_band_name` (gamma)
            # such that its phase aligns with the `preferred_phase_rad` of the `phase_band_name` (theta).
            # The current detected_phase is for the target band (e.g., gamma).
            # If the gamma activity is peaking at theta phase X (preferred_phase_rad), and we detect gamma at phase Y,
            # then our stimulus phase should aim to peak at X.
            
            # So, the phase in the sine wave: `detected_phase + adjusted_phase_offset` should target `pac_results["preferred_phase_rad"]`
            # This means `adjusted_phase_offset` should be `pac_results["preferred_phase_rad"] - detected_phase_of_phase_band + phase_offset_for_amplitude_peak_within_pac`
            # This is complex. Let's stick to the original plan: blend desired offset.
            
            # The interpretation here is that `pac_results["preferred_phase_rad"]` indicates the phase of the `phase_band`
            # at which the `amplitude_band` is strongest. So, if we want to reinforce this, we want our stimulus
            # for `amplitude_band_name` to be phase-locked relative to the `phase_band_name`'s detected phase.
            
            # Let's simplify and make the adjusted offset to nudge the stimulus towards the PAC's preferred phase relationship.
            # This assumes that `detected_phase` (of the target band) and `pac_results["preferred_phase_rad"]` (of the phase band)
            # have a consistent relationship for phase-locking. This is a heuristic that would need empirical tuning.
            
            # A common strategy: if PAC is detected, try to align the stimulus phase (of the amplitude band)
            # with the *detected phase* of the phase band + the PAC's *preferred offset*.
            # This means the stimulus phase for gamma, should be aligned with the theta phase, shifted by some value.
            # But here `detected_phase` is *gamma* phase. So we need `theta` phase.
            
            theta_phase_latest = oscillations.get(DEFAULT_CFC_PHASE_BAND[0], {}).get("phase", 0.0) # Get latest theta phase
            
            # Calculate desired phase for the stimulus based on theta phase and PAC's preferred phase
            # If theta is at 0 rad, and PAC preferred for gamma amp is pi/2, stimulus phase should target pi/2.
            # Stimulus phase = (theta_phase_latest + pac_results["preferred_phase_rad"]) % (2*np.pi)
            
            # This is a bit of a departure from the simple `detected_phase + offset`.
            # For `bulletproof` and `deeper` intent, we should use this.
            
            # Target stimulus phase to align with the *theta* preferred phase for *gamma* amplitude.
            # The actual phase of the stimulus is `2*pi*f*t + initial_phase`.
            # We want `initial_phase` to be `theta_phase_latest + pac_results["preferred_phase_rad"]`.
            
            # This changes the interpretation of `detected_phase + adjusted_phase_offset`
            # Let's retain the original interpretation of `detected_phase` (gamma's phase) and adjust its offset.
            # If the detected gamma phase is far from what PAC suggests, the offset should correct it.
            
            # A more robust blending for `adjusted_phase_offset`:
            # We have the current gamma phase (`detected_phase`).
            # We have a desired target phase for gamma based on PAC: `theta_phase_latest + pac_results["preferred_phase_rad"]`.
            # The required offset to achieve this target, starting from detected_phase:
            # `(theta_phase_latest + pac_results["preferred_phase_rad"] - detected_phase)`
            # We blend `desired_phase_offset_rad` (our initial guess) with this PAC-derived offset.
            
            pac_derived_offset = (theta_phase_latest + pac_results["preferred_phase_rad"] - detected_phase)
            # Ensure phase is wrapped to -pi to pi range
            pac_derived_offset = (pac_derived_offset + np.pi) % (2 * np.pi) - np.pi
            
            adjusted_phase_offset = (1 - blend_factor) * desired_phase_offset_rad + blend_factor * pac_derived_offset

            print(f"  PAC detected ({pac_results['pac_strength']:.2f}). Adjusting phase offset towards preferred theta-gamma coupling.")
        else:
            adjusted_phase_offset = desired_phase_offset_rad

        num_samples = int(self.analyzer.sampling_rate * duration)
        t = np.linspace(0, duration, num_samples, endpoint=False)
        
        # The stimulus signal generation: A(t) * sin(2*pi*f_target*t + phi_detected + phi_offset)
        stimulus_signal = amplitude * np.sin(2 * np.pi * target_frequency * t + detected_phase + adjusted_phase_offset)

        stim_params = {
            "target_frequency": target_frequency,
            "target_band_name": target_band_name,
            "amplitude": amplitude,
            "detected_phase": np.degrees(detected_phase),
            "adjusted_phase_offset": np.degrees(adjusted_phase_offset),
            "current_brain_state": current_state,
            "lucid_readiness_index": lucid_readiness,
            "pac_strength": pac_results["pac_strength"]
        }
        
        print(f"Generating {target_frequency:.2f}Hz adaptive stimulus. State: {current_state}. LRI: {lucid_readiness:.2f}.")
        print(f"  Locked to {target_band_name} phase ({np.degrees(detected_phase):.2f} deg) with offset {np.degrees(adjusted_phase_offset):.2f} deg. Amp: {amplitude:.2f}.")
        
        return stimulus_signal, stim_params

# Example Usage (modified to use new classes and enhanced logic)
if __name__ == "__main__":
    # Simulate EEG data acquisition
    def generate_eeg_chunk(sampling_rate: int, duration: float, noise_level: float = 0.1,
                           dominant_freq: float = 10, amplitude: float = 0.5,
                           theta_amp: float = 0.2, gamma_amp: float = 0.1,
                           delta_amp: float = 0.1,
                           pac_strength_factor: float = 0.0) -> np.ndarray:
        """Generates a synthetic EEG-like data chunk with some dominant frequency
           and potential for theta-gamma PAC."""
        t = np.linspace(0, duration, int(sampling_rate * duration), endpoint=False)
        
        # Base signal
        signal = amplitude * np.sin(2 * np.pi * dominant_freq * t + np.random.rand() * np.pi * 2)
        
        # Add other bands
        theta_base_phase = np.random.rand() * np.pi * 2
        gamma_base_phase = np.random.rand() * np.pi * 2

        signal += theta_amp * np.sin(2 * np.pi * np.mean(THETA_BAND) * t + theta_base_phase)
        signal += delta_amp * np.sin(2 * np.pi * np.mean(DELTA_BAND) * t + np.random.rand() * np.pi * 2)

        # Add gamma, potentially phase-amplitude coupled to theta
        gamma_carrier = gamma_amp * np.sin(2 * np.pi * np.mean(GAMMA_BAND) * t + gamma_base_phase)
        
        # If PAC is desired, modulate gamma amplitude by theta phase
        if pac_strength_factor > 0:
            # Simple amplitude modulation: gamma amplitude varies with theta phase
            # Ensure theta_phase_for_gamma is normalized for modulation
            theta_phase_for_modulation = np.sin(2 * np.pi * np.mean(THETA_BAND) * t + theta_base_phase)
            # Create a modulator based on theta phase, scaled by pac_strength_factor
            # Modulator should be >= 0. A simple way: (1 + sin(theta_phase)) / 2 gives 0-1 range.
            # Then scale this by pac_strength_factor and add to base gamma amplitude.
            modulated_gamma_amplitude = gamma_amp * (1 + pac_strength_factor * ((np.sin(theta_phase_for_modulation) + 1) / 2))
            signal += modulated_gamma_amplitude * np.sin(2 * np.pi * np.mean(GAMMA_BAND) * t + gamma_base_phase)
        else:
            signal += gamma_carrier
        
        # Add random noise
        signal += noise_level * np.random.randn(len(t))
        return signal

    SR = 256  # Sampling rate
    BUFFER_DUR = 2.0 # Analyze 2 seconds of data at a time
    CHUNK_DUR = 0.1 # Simulate receiving data in 0.1 second chunks

    analyzer = NeuralOscillationRealtimeAnalyzer(sampling_rate=SR, buffer_duration=BUFFER_DUR, history_size=20)
    # Initialize the new intelligent components, providing them with the core analyzer
    brain_estimator = BrainStateEstimator(analyzer)
    cfc_analyzer = CrossFrequencyCouplingAnalyzer(analyzer.sampling_rate)
    phase_controller = PhaseLockingController(analyzer, brain_estimator, cfc_analyzer)

    # Link the analyzer to the new components for its (now overridden) public methods
    analyzer._brain_state_estimator = brain_estimator
    analyzer._phase_locking_controller = phase_controller
    analyzer._cfc_analyzer = cfc_analyzer # For future potential direct access

    print("\n--- Simulating Real-time EEG Data Stream (Enhanced) ---")
    print("Watching for subtle shifts, uncovering hidden conversations between rhythms...")

    simulation_time = 0
    total_sim_duration = 40 # seconds

    while simulation_time < total_sim_duration:
        eeg_chunk = np.array([])
        # Simulate different brain states over time, with increased complexity for testing new features
        if simulation_time < 5:
            # Awake/Relaxed state (dominant alpha)
            eeg_chunk = generate_eeg_chunk(SR, CHUNK_DUR, dominant_freq=10, amplitude=1.0,
                                           theta_amp=0.2, gamma_amp=0.1, delta_amp=0.1)
            print(f"\nSim Time: {simulation_time:.1f}s - State: Awake/Relaxed (Alpha Focus)")
        elif simulation_time < 15:
            # Transition to REM-like state (more theta, less alpha)
            eeg_chunk = generate_eeg_chunk(SR, CHUNK_DUR, dominant_freq=6, amplitude=0.8, noise_level=0.2,
                                           theta_amp=0.7, gamma_amp=0.2, delta_amp=0.05)
            print(f"\nSim Time: {simulation_time:.1f}s - State: Entering REM (Theta Rising)")
        elif simulation_time < 25:
            # Lucid state (strong gamma with theta and potential PAC)
            eeg_chunk = generate_eeg_chunk(SR, CHUNK_DUR, dominant_freq=40, amplitude=0.7, noise_level=0.1,
                                           theta_amp=0.5, gamma_amp=0.4, delta_amp=0.05, pac_strength_factor=0.8) # Simulate strong gamma & PAC
            print(f"\nSim Time: {simulation_time:.1f}s - State: Lucid Dream Inducement Attempted! (Gamma & PAC Focus)")
        elif simulation_time < 35:
            # Deep Sleep (more delta) - Test for robustness
            eeg_chunk = generate_eeg_chunk(SR, CHUNK_DUR, dominant_freq=2, amplitude=1.2, noise_level=0.3,
                                           theta_amp=0.1, gamma_amp=0.05, delta_amp=1.5)
            print(f"\nSim Time: {simulation_time:.1f}s - State: Deep Sleep (Delta Dominant)")
        else:
            # Another lucid attempt with different parameters
            eeg_chunk = generate_eeg_chunk(SR, CHUNK_DUR, dominant_freq=35, amplitude=0.6, noise_level=0.1,
                                           theta_amp=0.6, gamma_amp=0.3, delta_amp=0.0, pac_strength_factor=0.6)
            print(f"\nSim Time: {simulation_time:.1f}s - State: Second Lucid Attempt!")


        analyzer.add_data_chunk(eeg_chunk)
        current_analysis = analyzer.analyze_brainwaves()

        if current_analysis and current_analysis["status"] == "OK":
            # New: Get sleep stage probabilities and lucid readiness from the estimator
            dominant_state, lucid_readiness = brain_estimator.infer_brain_state(current_analysis)
            print(f"  Inferred State: {dominant_state} (LRI: {lucid_readiness:.2f})")
            
            # Get sleep stage probabilities
            stage_probs = brain_estimator.get_sleep_stage_probabilities()
            # print(f"  Probabilities: {', '.join([f'{s}: {p:.2f}' for s, p in stage_probs.items()])}")

            # New: Calculate Cross-Frequency Coupling
            theta_gamma_pac = cfc_analyzer.calculate_pac(analyzer, current_analysis, "theta", "gamma")
            print(f"  Theta-Gamma PAC: Strength={theta_gamma_pac['pac_strength']:.3f}, "
                  f"Preferred Phase={theta_gamma_pac['preferred_phase_deg']:.1f} deg")

            # Example of how DSHLI would use this for adaptive stimulation:
            if "REM" in dominant_state or "Lucid" in dominant_state or lucid_readiness > 0.4:
                # Use the new adaptive stimulus generation
                lucid_stimulus, stim_params = phase_controller.generate_adaptive_stimulus(
                    target_band_name="gamma",
                    desired_phase_offset_rad=np.pi/2, # Initial target offset
                    duration=0.2 # Short stimulus burst
                )
                print(f"  Generated {len(lucid_stimulus)} samples of adaptive stimulus.")
                # In a real system, this signal would be sent to EM field emitters or auditory cues.
            
            # Print the most recent oscillation parameters for one band as an example
            oscillations = analyzer.get_brainwave_oscillations()
            if "gamma" in oscillations:
                gamma_data = oscillations["gamma"]
                print(f"  Gamma: Amp={gamma_data['amplitude']:.2f}, Freq={gamma_data['frequency']:.2f}Hz, "
                      f"Phase={np.degrees(gamma_data['phase']):.2f} deg, Power={gamma_data['power']:.2f}")
            if "theta" in oscillations:
                theta_data = oscillations["theta"]
                print(f"  Theta: Amp={theta_data['amplitude']:.2f}, Freq={theta_data['frequency']:.2f}Hz, "
                      f"Phase={np.degrees(theta_data['phase']):.2f} deg, Power={theta_data['power']:.2f}")

        elif current_analysis: # Status is not OK
            print(f"  Analysis Status: {current_analysis['status']} - Reason: {current_analysis['quality_metrics']['reason']}")

        time.sleep(CHUNK_DUR / 2) # Simulate processing time slightly faster than data chunks
        simulation_time += CHUNK_DUR

    print("\n--- Simulation Complete ---")
    print("The DSHLI relentlessly seeks to unlock the mind's ultimate canvas. Truly, an engineering optimism with a caffeine problem.")
    print("It has diagnosed the code's condition: an insatiable thirst for deeper truth, perpetually pushing beyond superficial understanding.")
    print("This code, now infused with the 'why', strives for an eternal homeostasis not of stagnation, but of continuous, profound refinement.")