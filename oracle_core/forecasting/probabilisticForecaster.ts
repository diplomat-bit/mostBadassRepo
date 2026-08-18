// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/oracle_core/forecasting/probabilisticForecaster.ts
================================================================================

/**
 * @file oracle_core/forecasting/probabilisticForecaster.ts
 * @purpose Provides a robust service for generating probabilistic forecasts from aggregated simulation results.
 * This service analyzes datasets of outcomes to derive statistical insights, fit probability distributions,
 * and generate forecasts that quantify uncertainty, enabling more sophisticated risk analysis and decision-making.
 * It is designed for use in financial modeling, risk management, and strategic planning applications within a
 * Fortune 500 context.
 */

import * as ss from 'simple-statistics';

// --- Type Definitions ---

/**
 * Represents a single outcome from a simulation run.
 */
export interface SimulationResult {
    /** The numerical result of the simulation. */
    value: number;
    /** A record of the input parameters that produced this result. */
    parameters: Record<string, any>;
    /** Optional timestamp for time-series based simulations. */
    timestamp?: number;
}

/**
 * Core statistical measures calculated from the simulation data.
 */
export interface BasicStatistics {
    mean: number;
    median: number;
    mode: number | number[];
    variance: number;
    standardDeviation: number;
    min: number;
    max: number;
    count: number;
    skewness: number;
    kurtosis: number;
}

/**
 * Represents a specific quantile value within the dataset.
 */
export interface QuantileResult {
    /** The quantile level, e.g., 0.25 for the 25th percentile. */
    quantile: number;
    /** The corresponding value at that quantile. */
    value: number;
}

/**
 * Supported probability distributions for fitting the data.
 * 'auto' will attempt to find the best fit among the available options.
 */
export type DistributionType = 'normal' | 'log-normal' | 'uniform' | 'exponential' | 'auto';

/**
 * Describes a probability distribution fitted to the simulation data.
 */
export interface FittedDistribution {
    /** The type of the distribution that was fitted. */
    type: DistributionType;
    /** The estimated parameters for the distribution (e.g., mean, stdDev for Normal). */
    parameters: Record<string, number>;
    /** Goodness-of-fit test results to indicate how well the distribution matches the data. */
    goodnessOfFit: {
        /** Name of the statistical test used (e.g., 'Kolmogorov-Smirnov'). */
        test: string;
        /** The test statistic. Lower values typically indicate a better fit. */
        statistic: number;
        /** The p-value of the test. A higher p-value suggests the data is consistent with the distribution. */
        pValue: number;
    };
}

/**
 * Represents a confidence interval for the mean of the simulation outcomes.
 */
export interface ConfidenceInterval {
    /** The confidence level, e.g., 0.95 for a 95% confidence interval. */
    level: number;
    /** The lower bound of the interval. */
    lowerBound: number;
    /** The upper bound of the interval. */
    upperBound: number;
}

/**
 * Represents a histogram bin.
 */
export interface HistogramBin {
    /** The lower bound of the bin. */
    binStart: number;
    /** The upper bound of the bin. */
    binEnd: number;
    /** The number of data points in the bin. */
    count: number;
}

/**
 * The primary output object, containing a comprehensive probabilistic forecast.
 */
export interface ProbabilisticForecast {
    /** The timestamp when the forecast was generated. */
    generatedAt: Date;
    /** The number of simulation results used to generate the forecast. */
    inputDataSize: number;
    /** Core descriptive statistics of the dataset. */
    statistics: BasicStatistics;
    /** A series of calculated quantiles (percentiles). */
    quantiles: QuantileResult[];
    /** The best-fitting probability distribution found for the data. */
    fittedDistribution: FittedDistribution | null;
    /** A set of confidence intervals for the mean. */
    confidenceIntervals: ConfidenceInterval[];
    /** A data structure representing the histogram of the results. */
    histogram: HistogramBin[];
    /** A message providing a high-level summary or any warnings about the forecast. */
    summary: string;
}

/**
 * Configuration options for the ProbabilisticForecaster.
 */
export interface ForecasterConfig {
    /** Default quantile levels to calculate. */
    defaultQuantiles?: number[];
    /** Default confidence levels for intervals. */
    defaultConfidenceLevels?: number[];
    /** The number of bins to use for histogram generation. */
    histogramBins?: number;
    /** The significance level for goodness-of-fit tests. */
    fitTestAlpha?: number;
}

// --- ProbabilisticForecaster Service ---

/**
 * A sophisticated service to generate probabilistic forecasts from simulation data.
 * It transforms raw simulation outputs into actionable insights by quantifying uncertainty
 * and modeling the entire range of potential future outcomes.
 */
export class ProbabilisticForecaster {
    private config: Required<ForecasterConfig>;

    /**
     * Z-scores for common confidence levels. Used for calculating confidence intervals.
     */
    private static readonly Z_SCORES: { [level: number]: number } = {
        0.80: 1.282,
        0.90: 1.645,
        0.95: 1.960,
        0.98: 2.326,
        0.99: 2.576,
    };

    /**
     * Initializes a new instance of the ProbabilisticForecaster.
     * @param config Optional configuration to customize the forecaster's behavior.
     */
    constructor(config: ForecasterConfig = {}) {
        this.config = {
            defaultQuantiles: config.defaultQuantiles ?? [0.05, 0.1, 0.25, 0.5, 0.75, 0.9, 0.95],
            defaultConfidenceLevels: config.defaultConfidenceLevels ?? [0.90, 0.95, 0.99],
            histogramBins: config.histogramBins ?? 20,
            fitTestAlpha: config.fitTestAlpha ?? 0.05,
        };
    }

    /**
     * Generates a complete probabilistic forecast from a set of simulation results.
     * This is the main entry point of the service.
     * @param simulationResults An array of numbers or SimulationResult objects.
     * @returns A ProbabilisticForecast object, or null if the input data is insufficient.
     */
    public generateForecast(
        simulationResults: number[] | SimulationResult[],
    ): ProbabilisticForecast | null {
        const data = this._extractNumericData(simulationResults);

        if (data.length < 10) {
            console.warn("Insufficient data for a reliable probabilistic forecast. At least 10 data points are recommended.");
            return null;
        }

        const sortedData = [...data].sort((a, b) => a - b);

        try {
            const statistics = this._calculateBasicStatistics(sortedData);
            const quantiles = this._calculateQuantiles(sortedData, this.config.defaultQuantiles);
            const confidenceIntervals = this._calculateConfidenceIntervals(statistics, this.config.defaultConfidenceLevels);
            const histogram = this._generateHistogram(sortedData, statistics);
            const fittedDistribution = this._fitDistribution(sortedData);
            const summary = this._generateSummary(statistics, fittedDistribution);

            return {
                generatedAt: new Date(),
                inputDataSize: data.length,
                statistics,
                quantiles,
                fittedDistribution,
                confidenceIntervals,
                histogram,
                summary,
            };
        } catch (error) {
            console.error("Failed to generate probabilistic forecast:", error);
            return null;
        }
    }

    /**
     * Samples a specified number of random values from a generated forecast's fitted distribution.
     * @param forecast The ProbabilisticForecast object.
     * @param numSamples The number of random values to generate.
     * @returns An array of sampled values.
     */
    public sampleFromForecast(forecast: ProbabilisticForecast, numSamples: number): number[] {
        if (!forecast.fittedDistribution) {
            throw new Error("Forecast does not have a fitted distribution to sample from.");
        }

        const { type, parameters } = forecast.fittedDistribution;
        const samples: number[] = [];
        
        switch (type) {
            case 'normal':
                const { mean, stdDev } = parameters;
                for (let i = 0; i < numSamples; i++) {
                    samples.push(this._sampleNormal(mean, stdDev));
                }
                break;
            case 'log-normal':
                const { mu, sigma } = parameters;
                 for (let i = 0; i < numSamples; i++) {
                    samples.push(Math.exp(this._sampleNormal(mu, sigma)));
                }
                break;
            case 'uniform':
                const { min, max } = parameters;
                for (let i = 0; i < numSamples; i++) {
                    samples.push(min + Math.random() * (max - min));
                }
                break;
            case 'exponential':
                const { rate } = parameters;
                for(let i = 0; i < numSamples; i++) {
                    samples.push(-Math.log(1.0 - Math.random()) / rate);
                }
                break;
            default:
                 throw new Error(`Sampling from distribution type '${type}' is not supported.`);
        }
        return samples;
    }

    /**
     * Calculates the probability of an outcome exceeding a certain threshold based on the fitted distribution.
     * @param forecast The ProbabilisticForecast object.
     * @param threshold The value to check against.
     * @returns The probability (between 0 and 1) of exceeding the threshold.
     */
    public getExceedanceProbability(forecast: ProbabilisticForecast, threshold: number): number {
        if (!forecast.fittedDistribution) {
            throw new Error("Forecast does not have a fitted distribution for probability calculations.");
        }

        const { type, parameters } = forecast.fittedDistribution;

        switch(type) {
            case 'normal':
                const { mean, stdDev } = parameters;
                return 1 - ss.probit((threshold - mean) / stdDev);
            case 'log-normal':
                const { mu, sigma } = parameters;
                return 1 - ss.probit((Math.log(threshold) - mu) / sigma);
            case 'uniform':
                const { min, max } = parameters;
                if (threshold < min) return 1.0;
                if (threshold >= max) return 0.0;
                return (max - threshold) / (max - min);
            case 'exponential':
                const { rate } = parameters;
                return Math.exp(-rate * threshold);
            default:
                throw new Error(`Exceedance probability for distribution type '${type}' is not supported.`);
        }
    }


    // --- Private Helper Methods ---

    /**
     * Extracts a simple array of numbers from the input.
     */
    private _extractNumericData(results: number[] | SimulationResult[]): number[] {
        if (results.length === 0) return [];

        if (typeof results[0] === 'number') {
            return results as number[];
        }

        return (results as SimulationResult[]).map(r => r.value).filter(v => typeof v === 'number' && isFinite(v));
    }

    /**
     * Calculates a comprehensive set of descriptive statistics.
     */
    private _calculateBasicStatistics(sortedData: number[]): BasicStatistics {
        return {
            count: sortedData.length,
            min: sortedData[0],
            max: sortedData[sortedData.length - 1],
            mean: ss.mean(sortedData),
            median: ss.medianSorted(sortedData),
            mode: ss.mode(sortedData),
            variance: ss.variance(sortedData),
            standardDeviation: ss.standardDeviation(sortedData),
            skewness: ss.skewness(sortedData),
            kurtosis: ss.kurtosis(sortedData),
        };
    }

    /**
     * Calculates values at specified quantile levels.
     */
    private _calculateQuantiles(sortedData: number[], quantiles: number[]): QuantileResult[] {
        return quantiles.map(q => ({
            quantile: q,
            value: ss.quantileSorted(sortedData, q),
        }));
    }

    /**
     * Generates confidence intervals for the mean at specified levels.
     */
    private _calculateConfidenceIntervals(stats: BasicStatistics, levels: number[]): ConfidenceInterval[] {
        const standardError = stats.standardDeviation / Math.sqrt(stats.count);
        return levels
            .map(level => {
                const zScore = ProbabilisticForecaster.Z_SCORES[level];
                if (!zScore) return null;

                const marginOfError = zScore * standardError;
                return {
                    level,
                    lowerBound: stats.mean - marginOfError,
                    upperBound: stats.mean + marginOfError,
                };
            })
            .filter((ci): ci is ConfidenceInterval => ci !== null);
    }

    /**
     * Generates histogram data from the sorted input data.
     */
    private _generateHistogram(sortedData: number[], stats: BasicStatistics): HistogramBin[] {
        const binCount = Math.min(this.config.histogramBins, Math.floor(Math.sqrt(stats.count)));
        const binWidth = (stats.max - stats.min) / binCount;
        const bins: HistogramBin[] = [];

        if (binWidth <= 0) { // Handle case where all values are the same
            return [{ binStart: stats.min, binEnd: stats.max, count: stats.count }];
        }

        for (let i = 0; i < binCount; i++) {
            const binStart = stats.min + i * binWidth;
            bins.push({
                binStart: binStart,
                binEnd: binStart + binWidth,
                count: 0,
            });
        }
        
        for (const value of sortedData) {
            let binIndex = Math.floor((value - stats.min) / binWidth);
            // Handle edge case for the max value
            binIndex = Math.min(binIndex, binCount - 1);
            bins[binIndex].count++;
        }

        return bins;
    }

    /**
     * Attempts to fit the data to several known probability distributions and selects the best one.
     */
    private _fitDistribution(sortedData: number[]): FittedDistribution | null {
        const candidateFits: FittedDistribution[] = [];

        // Candidate 1: Normal Distribution
        try {
            const mean = ss.mean(sortedData);
            const stdDev = ss.standardDeviation(sortedData);
            if (stdDev > 0) {
                const params = { mean, stdDev };
                const cdf = (x: number) => ss.probit((x - mean) / stdDev);
                const ksTest = this._kolmogorovSmirnovTest(sortedData, cdf);
                candidateFits.push({ type: 'normal', parameters: params, goodnessOfFit: ksTest });
            }
        } catch (e) { /* ignore fit errors */ }

        // Candidate 2: Log-Normal Distribution
        if (sortedData[0] > 0) {
            try {
                const logData = sortedData.map(Math.log);
                const mu = ss.mean(logData);
                const sigma = ss.standardDeviation(logData);
                if (sigma > 0) {
                    const params = { mu, sigma };
                    const cdf = (x: number) => ss.probit((Math.log(x) - mu) / sigma);
                    const ksTest = this._kolmogorovSmirnovTest(sortedData, cdf);
                    candidateFits.push({ type: 'log-normal', parameters: params, goodnessOfFit: ksTest });
                }
            } catch (e) { /* ignore fit errors */ }
        }

        // Candidate 3: Uniform Distribution
        try {
            const min = sortedData[0];
            const max = sortedData[sortedData.length - 1];
            if (max > min) {
                const params = { min, max };
                const cdf = (x: number) => {
                    if (x < min) return 0;
                    if (x >= max) return 1;
                    return (x - min) / (max - min);
                };
                const ksTest = this._kolmogorovSmirnovTest(sortedData, cdf);
                candidateFits.push({ type: 'uniform', parameters: params, goodnessOfFit: ksTest });
            }
        } catch (e) { /* ignore fit errors */ }

        // Candidate 4: Exponential Distribution
        if (sortedData[0] >= 0) {
            try {
                const mean = ss.mean(sortedData);
                const rate = 1 / mean;
                if (rate > 0) {
                    const params = { rate };
                    const cdf = (x: number) => 1 - Math.exp(-rate * x);
                    const ksTest = this._kolmogorovSmirnovTest(sortedData, cdf);
                    candidateFits.push({ type: 'exponential', parameters: params, goodnessOfFit: ksTest });
                }
            } catch(e) { /* ignore fit errors */ }
        }
        
        if (candidateFits.length === 0) return null;

        // Select the best fit based on the lowest K-S statistic (and a p-value above significance level)
        const validFits = candidateFits.filter(fit => fit.goodnessOfFit.pValue > this.config.fitTestAlpha);
        if (validFits.length === 0) {
            // If no fit is statistically valid, return the one with the lowest D statistic as a "best guess"
            return candidateFits.reduce((best, current) => 
                current.goodnessOfFit.statistic < best.goodnessOfFit.statistic ? current : best
            );
        }

        return validFits.reduce((best, current) => 
            current.goodnessOfFit.statistic < best.goodnessOfFit.statistic ? current : best
        );
    }
    
    /**
     * Performs a Kolmogorov-Smirnov test for goodness-of-fit.
     * @param sortedData The empirical data, sorted in ascending order.
     * @param cdf A function representing the cumulative distribution function of the theoretical distribution.
     * @returns The K-S statistic and p-value.
     */
    private _kolmogorovSmirnovTest(sortedData: number[], cdf: (x: number) => number): { test: string, statistic: number, pValue: number } {
        const n = sortedData.length;
        let d = 0;

        for (let i = 0; i < n; i++) {
            const empiricalCdfUpper = (i + 1) / n;
            const empiricalCdfLower = i / n;
            const theoreticalCdf = cdf(sortedData[i]);
            const dPlus = Math.abs(empiricalCdfUpper - theoreticalCdf);
            const dMinus = Math.abs(theoreticalCdf - empiricalCdfLower);
            d = Math.max(d, dPlus, dMinus);
        }

        // Approximate p-value using the Kolmogorov distribution formula.
        // This is a complex calculation; we'll use a standard approximation.
        const pValue = this._kolmogorovCdf(d * Math.sqrt(n));

        return {
            test: 'Kolmogorov-Smirnov',
            statistic: d,
            pValue: 1 - pValue,
        };
    }

    /**
     * Approximates the CDF of the Kolmogorov distribution.
     */
    private _kolmogorovCdf(x: number): number {
        if (x <= 0) return 0;
        let sum = 0;
        for (let k = 1; k <= 100; k++) { // 100 iterations is sufficient for high precision
            const term = Math.exp(-2 * k * k * x * x);
            if (k % 2 === 1) {
                sum += term;
            } else {
                sum -= term;
            }
        }
        return 1 - 2 * sum;
    }

    /**
     * Generates a human-readable summary of the forecast.
     */
    private _generateSummary(stats: BasicStatistics, fit: FittedDistribution | null): string {
        let summary = `Forecast based on ${stats.count} simulations. The average outcome is ${stats.mean.toFixed(2)} with a standard deviation of ${stats.standardDeviation.toFixed(2)}.`;
        
        if (fit) {
            summary += ` The data appears to follow a ${fit.type} distribution (p-value=${fit.goodnessOfFit.pValue.toFixed(3)}).`;
        } else {
            summary += ` No standard probability distribution could be reliably fitted to the data.`;
        }

        if (stats.skewness > 0.5) {
            summary += ` The distribution is positively skewed, indicating a longer tail of higher-value outcomes.`;
        } else if (stats.skewness < -0.5) {
            summary += ` The distribution is negatively skewed, suggesting a longer tail of lower-value outcomes.`;
        }
        return summary;
    }

    /**
     * Generates a random sample from a normal distribution using the Box-Muller transform.
     */
    private _sampleNormal(mean: number, stdDev: number): number {
        let u1 = 0, u2 = 0;
        // Convert [0,1) to (0,1)
        while (u1 === 0) u1 = Math.random();
        while (u2 === 0) u2 = Math.random();
        
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return z * stdDev + mean;
    }
}
