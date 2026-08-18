// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/oracle_core/visualization/multiverseComparisonView.tsx
================================================================================

```tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Typography, Grid, Slider, Box, Button, CircularProgress } from '@mui/material';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import { useTheme } from '@mui/material/styles';

// Placeholder for importing simulation data types - replace with actual type definitions
interface SimulationDataPoint {
    time: number;
    value: number;
}

interface MultiverseSimulationResult {
    id: string;
    name: string;
    description: string;
    data: SimulationDataPoint[];
    metadata?: Record<string, any>;
}

interface ComparisonConfiguration {
    selectedMetrics: string[];
    timeRange: [number, number];
    weightingFactors: Record<string, number>;
}

interface ComparisonVisualizationProps {
    simulationResults: MultiverseSimulationResult[];
    defaultConfiguration?: Partial<ComparisonConfiguration>;
    onConfigurationChange?: (config: ComparisonConfiguration) => void;
}

const useDebounce = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const MultiverseComparisonView: React.FC<ComparisonVisualizationProps> = ({ simulationResults, defaultConfiguration, onConfigurationChange }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [configuration, setConfiguration] = useState<ComparisonConfiguration>({
        selectedMetrics: [],
        timeRange: [0, 100],
        weightingFactors: {},
        ...(defaultConfiguration || {}),
    });
    const debouncedConfiguration = useDebounce(configuration, 500);

    useEffect(() => {
        if (onConfigurationChange) {
            onConfigurationChange(debouncedConfiguration);
        }
    }, [debouncedConfiguration, onConfigurationChange]);

    const handleMetricSelection = useCallback(
        (metric: string) => {
            setConfiguration((prevConfig) => {
                const selectedMetrics = prevConfig.selectedMetrics.includes(metric)
                    ? prevConfig.selectedMetrics.filter((m) => m !== metric)
                    : [...prevConfig.selectedMetrics, metric];
                return { ...prevConfig, selectedMetrics };
            });
        },
        [setConfiguration]
    );


    const handleTimeRangeChange = useCallback(
        (event: Event, newValue: number | number[]) => {
            const range = newValue as [number, number]; // Explicitly type assertion
            setConfiguration((prevConfig) => ({ ...prevConfig, timeRange: range }));
        },
        [setConfiguration]
    );

    const handleWeightingFactorChange = useCallback(
        (simulationId: string, value: number) => {
            setConfiguration((prevConfig) => ({
                ...prevConfig,
                weightingFactors: {
                    ...prevConfig.weightingFactors,
                    [simulationId]: value,
                },
            }));
        },
        [setConfiguration]
    );

    const generateChartData = useCallback(() => {
        try {
            if (!simulationResults || simulationResults.length === 0) {
                return null;
            }

            const datasets = simulationResults.map((result) => ({
                label: result.name,
                data: result.data
                    .filter((dp) => dp.time >= configuration.timeRange[0] && dp.time <= configuration.timeRange[1])
                    .map((dp) => ({ x: dp.time, y: dp.value })),
                borderColor: theme.palette.primary.main, // Consistent color
                backgroundColor: theme.palette.primary.light, // Subtle fill
                fill: false,
                tension: 0.4, // Smooth lines
            }));

            return {
                datasets,
            };
        } catch (error) {
            console.error("Error generating chart data:", error);
            setErrorMessage(`Error generating chart data: ${error}`);
            return null;
        }
    }, [simulationResults, configuration.timeRange, theme]);


    const chartData = generateChartData();

    const chartOptions = {
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: 'Time',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Value',
                },
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'Multiverse Simulation Comparison',
                fontSize: 20,
            },
            legend: {
                display: true,
                position: 'top',
            },
        },
    };

    // Example of a heavy computation simulation - could be replaced with an API call to a server doing the heavy lifting
    const runAdvancedAnalysis = useCallback(async () => {
        setLoading(true);
        setErrorMessage(null);
        try {
            // Simulate an asynchronous operation
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate 2 seconds processing

            if (simulationResults.length < 2) {
                throw new Error("Advanced analysis requires at least two simulation results.");
            }

            // Example computation: Calculate correlation between simulation results
            const series1 = simulationResults[0].data.map(d => d.value);
            const series2 = simulationResults[1].data.map(d => d.value);

            if (series1.length !== series2.length) {
                throw new Error("Simulation data series must have the same length for correlation analysis.");
            }

            let sum_x = 0;
            let sum_y = 0;
            let sum_xy = 0;
            let sum_x2 = 0;
            let sum_y2 = 0;

            const n = series1.length;

            for (let i = 0; i < n; i++) {
                sum_x += series1[i];
                sum_y += series2[i];
                sum_xy += series1[i] * series2[i];
                sum_x2 += series1[i] ** 2;
                sum_y2 += series2[i] ** 2;
            }

            const numerator = n * sum_xy - sum_x * sum_y;
            const denominator = Math.sqrt((n * sum_x2 - sum_x ** 2) * (n * sum_y2 - sum_y ** 2));

            if (denominator === 0) {
                throw new Error("Cannot compute correlation due to zero variance in data.");
            }

            const correlation = numerator / denominator;

            alert(`Correlation between ${simulationResults[0].name} and ${simulationResults[1].name}: ${correlation.toFixed(2)}`);

        } catch (error: any) {
            console.error("Advanced analysis failed:", error);
            setErrorMessage(`Advanced analysis failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, [simulationResults]);

    return (
        <Card sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
                Multiverse Simulation Comparison
            </Typography>

            {errorMessage && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {errorMessage}
                </Typography>
            )}

            <Grid container spacing={2} sx={{ flexGrow: 1, overflow: 'auto' }}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ p: 2, height: '100%' }}>
                        <Typography variant="subtitle1">Configuration</Typography>

                        <Typography variant="body2" mt={2}>Time Range:</Typography>
                        <Slider
                            value={configuration.timeRange}
                            onChange={handleTimeRangeChange}
                            valueLabelDisplay="auto"
                            min={0}
                            max={100}
                            sx={{ mt: 2 }}
                        />

                        <Typography variant="body2" mt={2}>Weighting Factors:</Typography>
                        {simulationResults.map((result) => (
                            <Box key={result.id} mt={1}>
                                <Typography variant="caption">{result.name}</Typography>
                                <Slider
                                    defaultValue={1}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={configuration.weightingFactors[result.id] || 1}
                                    onChange={(event, value) => handleWeightingFactorChange(result.id, value as number)}
                                    valueLabelDisplay="auto"
                                />
                            </Box>
                        ))}

                        {/* Implement Metric selection - replace with a more sophisticated UI */}
                        <Typography variant="body2" mt={2}>Selected Metrics (Placeholder):</Typography>
                        {['Metric A', 'Metric B', 'Metric C'].map((metric) => (
                            <Button key={metric} variant={configuration.selectedMetrics.includes(metric) ? 'contained' : 'outlined'} onClick={() => handleMetricSelection(metric)}>
                                {metric}
                            </Button>
                        ))}
                    </Card>
                </Grid>
                <Grid item xs={12} md={8} sx={{ height: '500px' }}>
                    <Card sx={{ p: 2, height: '100%' }}>
                        {chartData ? (
                            <Chart type="line" data={chartData} options={chartOptions} />
                        ) : (
                            <Typography variant="body1">No data to display.</Typography>
                        )}
                    </Card>
                </Grid>
            </Grid>
             <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="primary" onClick={runAdvancedAnalysis} disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Run Advanced Analysis"}
                    </Button>
                </Box>
        </Card>
    );
};

export default MultiverseComparisonView;
```