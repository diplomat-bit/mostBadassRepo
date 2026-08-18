// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankMapsView.tsx
================================================================================

import React, { useState, useEffect, useMemo, useCallback, useRef, useReducer, FC, ReactNode } from 'react';
import Card from '../../Card';

// SECTION: SVG Icons for UI Elements
// ===================================
// Using inline SVGs to avoid external dependencies and keep the component self-contained.

const BranchIcon: FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 21V10.08l8-6.96 8 6.96V21h-6v-6h-4v6H4z"/>
    </svg>
);

const AtmIcon: FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5 20V4h14v16H5zm1-1h12V5H6v14zm2-1h3v-2H8v2zm0-3h8v-2H8v2zm0-3h8v-2H8v2zm5-1h3v-2h-3v2z"/>
    </svg>
);

const VehicleIcon: FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.5 4.5c-1.42 0-2.73.66-3.5 1.84V6H6c-1.1 0-2 .9-2 2v5H2v2h2v2h2v-2h12v3h2v-4.5c0-2.2-1.8-4-4-4zm-14 3h12v3H4.5v-3zM7 8.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S5.5 10.83 5.5 10s.67-1.5 1.5-1.5zm10 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5z"/>
    </svg>
);

const AlertIcon: FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.636-1.026 2.252-1.026 2.888 0l6.238 10.042c.636 1.026-.178 2.36-1.444 2.36H3.463c-1.266 0-2.08-1.334-1.444-2.36l6.238-10.042zM10 14a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
    </svg>
);


// SECTION: Type Definitions for a Real-World Banking Map Application
// =================================================================

export type GeoCoordinate = { lat: number; lng: number; };
export type BranchStatus = 'operational' | 'under_maintenance' | 'closed' | 'newly_opened';
export type ATMStatus = 'in_service' | 'out_of_service' | 'low_cash' | 'maintenance_required' | 'error_state';
export type VehicleStatus = 'en_route' | 'servicing_atm' | 'idle' | 'in_depot' | 'security_alert';
export type AnomalySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Address { street: string; city: string; state: string; zipCode: string; country: string; }
export interface OpeningHours { day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'; open: string; close: string; }

export interface BankAsset { id: string; name: string; location: GeoCoordinate; address: Address; }

export interface Branch extends BankAsset {
    type: 'branch';
    status: BranchStatus;
    manager: string;
    staffCount: number;
    openingHours: OpeningHours[];
    services: string[];
    contactPhone: string;
    lastMaintenance: string; // ISO 8601
    customerTraffic: { lastHour: number; lastDay: number; weeklyAverage: number; };
    securityRating: number; // 1 to 5
    realtimeWaitTime: number; // in minutes
    appointmentSlotsAvailable: number;
}

export interface ATM extends BankAsset {
    type: 'atm';
    status: ATMStatus;
    currency: 'USD' | 'EUR' | 'GBP' | 'JPY';
    cashLevel: number; // Percentage
    services: ('deposit' | 'withdrawal' | 'balance_inquiry' | 'transfer')[];
    lastServiced: string; // ISO 8601
    transactionVolume: { lastHour: number; lastDay: number; };
    isWheelchairAccessible: boolean;
    lastErrorCode: string | null;
    cameraStatus: 'online' | 'offline';
}

export interface FleetVehicle {
    id: string;
    model: string;
    licensePlate: string;
    status: VehicleStatus;
    currentLocation: GeoCoordinate;
    route: GeoCoordinate[];
    destinationId?: string;
    lastUpdate: string; // ISO 8601
    speed: number; // in km/h
    fuelLevel: number; // Percentage
    assignedPersonnel: string[];
    estimatedArrivalTime?: string; // ISO 8601
}

export interface AIAnomaly {
    id: string;
    assetId: string;
    assetType: 'atm' | 'branch' | 'fleet';
    timestamp: string;
    severity: AnomalySeverity;
    title: string;
    description: string;
    suggestedAction: string;
    location: GeoCoordinate;
}

export interface MapViewState { longitude: number; latitude: number; zoom: number; pitch: number; bearing: number; }
export interface MapFilters {
    showBranches: boolean;
    showATMs: boolean;
    showFleet: boolean;
    showHeatmap: boolean;
    showAnomalies: boolean;
    atmStatus: ATMStatus[];
    branchStatus: BranchStatus[];
    minCashLevel: number;
    anomalySeverity: AnomalySeverity[];
}
export type MapLayerType = 'branches' | 'atms' | 'fleet' | 'heatmap' | 'demographics' | 'anomalies';
export type SelectedAsset = Branch | ATM | FleetVehicle | AIAnomaly | null;

// SECTION: Mock Data Generation Utilities
// =======================================

const MOCK_CITIES = [{ name: 'New York', coords: { lat: 40.7128, lng: -74.0060 } }, { name: 'Los Angeles', coords: { lat: 34.0522, lng: -118.2437 } }, { name: 'Chicago', coords: { lat: 41.8781, lng: -87.6298 } }, { name: 'Houston', coords: { lat: 29.7604, lng: -95.3698 } }, { name: 'Phoenix', coords: { lat: 33.4484, lng: -112.0740 } },];
const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomNumber = (min: number, max: number, decimals: number = 0): number => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

export const generateMockAddress = (city: { name: string, coords: GeoCoordinate }): Address => ({ street: `${getRandomNumber(100, 9999)} ${getRandomElement(['Main', 'Oak', 'Pine', 'Maple', 'Elm'])} St`, city: city.name, state: getRandomElement(['NY', 'CA', 'IL', 'TX', 'AZ']), zipCode: `${getRandomNumber(10000, 99999)}`, country: 'USA',});
export const generateMockBranches = (count: number): Branch[] => Array.from({ length: count }, (_, i) => {
    const city = getRandomElement(MOCK_CITIES);
    const location = { lat: city.coords.lat + getRandomNumber(-0.1, 0.1, 6), lng: city.coords.lng + getRandomNumber(-0.1, 0.1, 6) };
    return { id: `BR_${1000 + i}`, name: `${city.name} ${getRandomElement(['Downtown', 'Uptown', 'Financial District'])} Branch`, location, address: generateMockAddress(city), type: 'branch', status: getRandomElement(['operational', 'under_maintenance', 'closed', 'newly_opened']), manager: `${getRandomElement(['John', 'Jane', 'Alex'])} ${getRandomElement(['Doe', 'Smith'])}`, staffCount: getRandomNumber(5, 25), openingHours: [{ day: 'Monday', open: '09:00', close: '17:00' }, { day: 'Friday', open: '09:00', close: '18:00' }, { day: 'Saturday', open: '10:00', close: '14:00' }], services: ['Personal Banking', 'Business Banking', 'Mortgages', 'Wealth Management'], contactPhone: `(555) ${getRandomNumber(100, 999)}-${getRandomNumber(1000, 9999)}`, lastMaintenance: new Date(Date.now() - getRandomNumber(1, 90) * 864e5).toISOString(), customerTraffic: { lastHour: getRandomNumber(0, 50), lastDay: getRandomNumber(100, 800), weeklyAverage: getRandomNumber(2000, 5000), }, securityRating: getRandomNumber(3, 5), realtimeWaitTime: getRandomNumber(2, 25), appointmentSlotsAvailable: getRandomNumber(0, 15) };
});
export const generateMockATMs = (count: number): ATM[] => Array.from({ length: count }, (_, i) => {
    const city = getRandomElement(MOCK_CITIES);
    const location = { lat: city.coords.lat + getRandomNumber(-0.2, 0.2, 6), lng: city.coords.lng + getRandomNumber(-0.2, 0.2, 6) };
    return { id: `ATM_${5000 + i}`, name: `ATM at ${getRandomElement(['Mall', 'Gas Station', 'Supermarket', 'Airport'])}`, location, address: generateMockAddress(city), type: 'atm', status: getRandomElement(['in_service', 'out_of_service', 'low_cash', 'maintenance_required', 'error_state']), currency: 'USD', cashLevel: getRandomNumber(5, 100), services: ['withdrawal', 'balance_inquiry', ...(Math.random() > 0.5 ? ['deposit'] : []), ...(Math.random() > 0.3 ? ['transfer'] : [])], lastServiced: new Date(Date.now() - getRandomNumber(1, 30) * 864e5).toISOString(), transactionVolume: { lastHour: getRandomNumber(0, 20), lastDay: getRandomNumber(50, 300), }, isWheelchairAccessible: Math.random() > 0.2, lastErrorCode: Math.random() > 0.9 ? `E${getRandomNumber(100, 500)}` : null, cameraStatus: Math.random() > 0.1 ? 'online' : 'offline' };
});
export const generateMockFleet = (count: number, destinations: (ATM | Branch)[]): FleetVehicle[] => Array.from({ length: count }, (_, i) => {
    const status = getRandomElement<VehicleStatus>(['en_route', 'servicing_atm', 'idle', 'in_depot', 'security_alert']);
    const startLocation = getRandomElement(MOCK_CITIES).coords;
    const destination = status === 'en_route' && destinations.length > 0 ? getRandomElement(destinations) : undefined;
    const eta = destination ? new Date(Date.now() + getRandomNumber(15, 90) * 60000).toISOString() : undefined;
    return { id: `VHC_${800 + i}`, model: `Armored Van ${getRandomElement(['Model S', 'Model T'])}`, licensePlate: `${getRandomElement(['NY', 'CA', 'TX'])}-${getRandomNumber(1000, 9999)}`, status, currentLocation: { lat: startLocation.lat + getRandomNumber(-0.5, 0.5, 6), lng: startLocation.lng + getRandomNumber(-0.5, 0.5, 6), }, route: destination ? [startLocation, destination.location] : [], destinationId: destination?.id, estimatedArrivalTime: eta, lastUpdate: new Date().toISOString(), speed: status === 'en_route' ? getRandomNumber(40, 90) : 0, fuelLevel: getRandomNumber(10, 100), assignedPersonnel: [`Officer ${getRandomElement(['Miller', 'Davis'])}`, `Driver ${getRandomElement(['Wilson', 'Taylor'])}`] };
});
export const generateMockAnomalies = (count: number, assets: (ATM | Branch | FleetVehicle)[]): AIAnomaly[] => {
    if (assets.length === 0) return [];
    return Array.from({ length: count }, (_, i) => {
        const asset = getRandomElement(assets);
        return { id: `ANM_${9000 + i}`, assetId: asset.id, assetType: asset.type, timestamp: new Date(Date.now() - getRandomNumber(1, 60) * 60000).toISOString(), severity: getRandomElement(['low', 'medium', 'high', 'critical']), title: `Unusual Activity at ${asset.id}`, description: `AI detected ${getRandomElement(['an abnormal transaction pattern', 'a route deviation', 'an unexpected status change'])} for asset ${asset.id}. This may indicate a potential issue.`, suggestedAction: `Dispatch a team to investigate asset ${asset.id} immediately. Review security footage.`, location: 'currentLocation' in asset ? asset.currentLocation : asset.location };
    });
};

// SECTION: Mock AI & Geocoding API Service
// =========================================

export const mockApiService = {
    fetchBranches: async (): Promise<Branch[]> => new Promise(res => setTimeout(() => res(generateMockBranches(50)), 1000)),
    fetchATMs: async (): Promise<ATM[]> => new Promise(res => setTimeout(() => res(generateMockATMs(200)), 1200)),
    fetchFleet: async (destinations: (ATM|Branch)[]): Promise<FleetVehicle[]> => new Promise(res => setTimeout(() => res(generateMockFleet(25, destinations)), 800)),
    fetchAnomalies: async (assets: (ATM|Branch|FleetVehicle)[]): Promise<AIAnomaly[]> => new Promise(res => setTimeout(() => res(generateMockAnomalies(5, assets)), 2000)),
    getRoute: async (start: GeoCoordinate, end: GeoCoordinate): Promise<GeoCoordinate[]> => {
        const points: GeoCoordinate[] = [start];
        const steps = 20;
        for (let i = 1; i <= steps; i++) {
            points.push({ lat: start.lat + (end.lat - start.lat) * (i / steps), lng: start.lng + (end.lng - start.lng) * (i / steps) });
        }
        return new Promise(res => setTimeout(() => res(points), 1800));
    },
    runSiteSelectionAI: async (criteria: string): Promise<GeoCoordinate[]> => {
        console.log(`AI: Analyzing best sites based on: "${criteria}"...`);
        const city = getRandomElement(MOCK_CITIES);
        const results = Array.from({length: 3}, () => ({
            lat: city.coords.lat + getRandomNumber(-0.1, 0.1, 6),
            lng: city.coords.lng + getRandomNumber(-0.1, 0.1, 6),
        }));
        return new Promise(res => setTimeout(() => res(results), 2500));
    }
};

// SECTION: Utility Functions
// ==========================

export const formatTimestamp = (isoString: string): string => new Date(isoString).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
export const getStatusColor = (status: BranchStatus | ATMStatus | VehicleStatus | AnomalySeverity): string => {
    switch (status) {
        case 'operational': case 'in_service': case 'en_route': case 'low': return 'text-green-400';
        case 'under_maintenance': case 'low_cash': case 'maintenance_required': case 'servicing_atm': case 'medium': return 'text-yellow-400';
        case 'closed': case 'out_of_service': case 'error_state': case 'high': return 'text-orange-500';
        case 'security_alert': case 'critical': return 'text-red-500 animate-pulse font-bold';
        default: return 'text-blue-400';
    }
};
export const getSeverityBgColor = (severity: AnomalySeverity): string => {
     switch (severity) {
        case 'low': return 'bg-green-500/20 border-green-500';
        case 'medium': return 'bg-yellow-500/20 border-yellow-500';
        case 'high': return 'bg-orange-500/20 border-orange-500';
        case 'critical': return 'bg-red-500/20 border-red-500 animate-pulse';
        default: return 'bg-gray-700/20 border-gray-700';
    }
}

// SECTION: Reusable UI Components
// ===============================

export const LoadingSpinner: FC<{ size?: number }> = ({ size = 24 }) => (<svg className="animate-spin text-white" style={{ width: size, height: size }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);
export const ControlPanelSection: FC<{ title: string, children: ReactNode }> = ({ title, children }) => (<div className="py-4 border-b border-gray-700"><h4 className="text-lg font-semibold text-white px-4 mb-2">{title}</h4><div className="px-4 space-y-2">{children}</div></div>);
export const FilterCheckbox: FC<{ label: string, isChecked: boolean, onChange: (checked: boolean) => void }> = ({ label, isChecked, onChange }) => (<label className="flex items-center space-x-2 text-gray-300 cursor-pointer hover:text-white"><input type="checkbox" checked={isChecked} onChange={(e) => onChange(e.target.checked)} className="form-checkbox bg-gray-800 border-gray-600 rounded text-blue-500 focus:ring-blue-500" /><span>{label}</span></label>);

export const AssetDetailPanel: FC<{ asset: SelectedAsset, onClose: () => void }> = ({ asset, onClose }) => {
    if (!asset) return null;
    return (
        <div className="absolute top-0 right-0 z-10 bg-gray-900/80 backdrop-blur-sm h-full w-96 border-l border-gray-700 text-white p-4 overflow-y-auto">
            <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl">&times;</button>
            <h3 className="text-xl font-bold mb-2">{ 'name' in asset ? asset.name : asset.title }</h3>
            <p className="text-sm text-gray-400 mb-2">{ 'address' in asset ? `${asset.address.street}, ${asset.address.city}` : `Asset ID: ${asset.assetId}`}</p>
            
            {asset.type === 'branch' && <>
                <div className={`mt-2 text-sm font-semibold ${getStatusColor(asset.status)}`}>Status: {asset.status.replace(/_/g, ' ').toUpperCase()}</div>
                <p>Manager: {asset.manager}</p><p>Staff: {asset.staffCount}</p><p>Wait Time: {asset.realtimeWaitTime} min</p><p>Traffic (Last Day): {asset.customerTraffic.lastDay}</p>
            </>}
            {asset.type === 'atm' && <>
                <div className={`mt-2 text-sm font-semibold ${getStatusColor(asset.status)}`}>Status: {asset.status.replace(/_/g, ' ').toUpperCase()}</div>
                <p>Cash Level: {asset.cashLevel}%</p>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1"><div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${asset.cashLevel}%` }}></div></div>
                <p>Last Error: {asset.lastErrorCode || 'None'}</p>
            </>}
            {asset.type === 'fleet' && <>
                 <div className={`mt-2 text-sm font-semibold ${getStatusColor(asset.status)}`}>Status: {asset.status.replace(/_/g, ' ').toUpperCase()}</div>
                 <p>Speed: {asset.speed} km/h</p><p>Fuel: {asset.fuelLevel}%</p><p>ETA: {asset.estimatedArrivalTime ? formatTimestamp(asset.estimatedArrivalTime) : 'N/A'}</p>
            </>}
            {asset.type !== 'branch' && asset.type !== 'atm' && asset.type !== 'fleet' && /* Anomaly */ <>
                <div className={`mt-2 text-sm font-semibold ${getStatusColor(asset.severity)}`}>Severity: {asset.severity.toUpperCase()}</div>
                <p className="mt-2 text-gray-300">{asset.description}</p>
                <div className="mt-4 p-3 bg-blue-900/50 rounded-lg">
                    <h5 className="font-bold">AI Suggested Action:</h5>
                    <p className="text-sm text-blue-200">{asset.suggestedAction}</p>
                </div>
            </>}

            <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View Full Report</button>
        </div>
    );
};

const SiteSelectionTool: FC = () => {
    const [criteria, setCriteria] = useState('High population density, high median income, low competitor presence');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<GeoCoordinate[]>([]);
    
    const handleAnalyze = async () => {
        setIsLoading(true);
        setResults([]);
        const newResults = await mockApiService.runSiteSelectionAI(criteria);
        setResults(newResults);
        setIsLoading(false);
    };

    return (
        <div className="space-y-2">
            <textarea
                value={criteria}
                onChange={e => setCriteria(e.target.value)}
                className="w-full bg-gray-800 border-gray-600 rounded p-2 text-sm text-white focus:ring-blue-500"
                rows={3}
            />
            <button onClick={handleAnalyze} disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:bg-indigo-800 disabled:cursor-not-allowed">
                {isLoading ? <span className="flex items-center justify-center"><LoadingSpinner size={16}/> Analyzing...</span> : 'AI Site Analysis'}
            </button>
            {results.length > 0 && <div className="text-xs text-green-300 pt-2">Analysis complete. 3 optimal sites highlighted on map.</div>}
        </div>
    );
};

// SECTION: Main Application State Management
// ===========================================

type AppState = {
    branches: Branch[];
    atms: ATM[];
    fleet: FleetVehicle[];
    anomalies: AIAnomaly[];
    loading: { branches: boolean; atms: boolean; fleet: boolean; anomalies: boolean; };
    error: string | null;
};
type Action =
    | { type: 'FETCH_INIT' }
    | { type: 'FETCH_BRANCHES_SUCCESS'; payload: Branch[] }
    | { type: 'FETCH_ATMS_SUCCESS'; payload: ATM[] }
    | { type: 'FETCH_FLEET_SUCCESS'; payload: FleetVehicle[] }
    | { type: 'FETCH_ANOMALIES_SUCCESS'; payload: AIAnomaly[] }
    | { type: 'UPDATE_FLEET'; payload: FleetVehicle[] }
    | { type: 'FETCH_FAILURE'; payload: string };

const initialState: AppState = {
    branches: [], atms: [], fleet: [], anomalies: [],
    loading: { branches: true, atms: true, fleet: true, anomalies: true },
    error: null,
};

const dataReducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case 'FETCH_INIT': return { ...state, error: null };
        case 'FETCH_BRANCHES_SUCCESS': return { ...state, branches: action.payload, loading: { ...state.loading, branches: false } };
        case 'FETCH_ATMS_SUCCESS': return { ...state, atms: action.payload, loading: { ...state.loading, atms: false } };
        case 'FETCH_FLEET_SUCCESS': return { ...state, fleet: action.payload, loading: { ...state.loading, fleet: false } };
        case 'FETCH_ANOMALIES_SUCCESS': return { ...state, anomalies: action.payload, loading: { ...state.loading, anomalies: false } };
        case 'UPDATE_FLEET': return { ...state, fleet: action.payload };
        case 'FETCH_FAILURE': return { ...state, error: action.payload, loading: { branches: false, atms: false, fleet: false, anomalies: false } };
        default: throw new Error();
    }
};

// SECTION: Main Application View
// ==============================

const DemoBankMapsView: React.FC = () => {
    const [state, dispatch] = useReducer(dataReducer, initialState);
    const { branches, atms, fleet, anomalies, loading, error } = state;

    const [selectedAsset, setSelectedAsset] = useState<SelectedAsset>(null);
    const [mapViewport, setMapViewport] = useState<MapViewState>({ longitude: -98.5795, latitude: 39.8283, zoom: 3.5, pitch: 45, bearing: 0 });
    const [filters, setFilters] = useState<MapFilters>({ showBranches: true, showATMs: true, showFleet: true, showHeatmap: false, showAnomalies: true, atmStatus: [], branchStatus: [], minCashLevel: 0, anomalySeverity: ['high', 'critical']});

    const fleetUpdateInterval = useRef<NodeJS.Timeout | null>(null);

    // Data Fetching Effect
    useEffect(() => {
        const loadData = async () => {
            dispatch({ type: 'FETCH_INIT' });
            try {
                const [branchData, atmData] = await Promise.all([ mockApiService.fetchBranches(), mockApiService.fetchATMs() ]);
                dispatch({ type: 'FETCH_BRANCHES_SUCCESS', payload: branchData });
                dispatch({ type: 'FETCH_ATMS_SUCCESS', payload: atmData });
                const allDestinations = [...branchData, ...atmData];
                const fleetData = await mockApiService.fetchFleet(allDestinations);
                dispatch({ type: 'FETCH_FLEET_SUCCESS', payload: fleetData });
                const allAssets = [...branchData, ...atmData, ...fleetData];
                const anomalyData = await mockApiService.fetchAnomalies(allAssets);
                dispatch({ type: 'FETCH_ANOMALIES_SUCCESS', payload: anomalyData });
            } catch (err) {
                dispatch({ type: 'FETCH_FAILURE', payload: "Failed to load map data. Please try again later." });
                console.error(err);
            }
        };
        loadData();
    }, []);

    // Fleet Live Simulation Effect
    useEffect(() => {
        fleetUpdateInterval.current = setInterval(() => {
            const updatedFleet = state.fleet.map(vehicle => {
                if (vehicle.status !== 'en_route') return vehicle;
                const newLocation = { lat: vehicle.currentLocation.lat + getRandomNumber(-0.001, 0.001, 6), lng: vehicle.currentLocation.lng + getRandomNumber(-0.001, 0.001, 6) };
                return { ...vehicle, currentLocation: newLocation, lastUpdate: new Date().toISOString() };
            });
            dispatch({ type: 'UPDATE_FLEET', payload: updatedFleet });
        }, 5000);
        return () => { if (fleetUpdateInterval.current) clearInterval(fleetUpdateInterval.current) };
    }, [state.fleet]);

    // Memoized filtering logic
    const filteredBranches = useMemo(() => filters.showBranches ? branches.filter(b => filters.branchStatus.length === 0 || filters.branchStatus.includes(b.status)) : [], [branches, filters.showBranches, filters.branchStatus]);
    const filteredATMs = useMemo(() => filters.showATMs ? atms.filter(a => (filters.atmStatus.length === 0 || filters.atmStatus.includes(a.status)) && a.cashLevel >= filters.minCashLevel) : [], [atms, filters.showATMs, filters.atmStatus, filters.minCashLevel]);
    const filteredFleet = useMemo(() => filters.showFleet ? fleet : [], [fleet, filters.showFleet]);
    const filteredAnomalies = useMemo(() => filters.showAnomalies ? anomalies.filter(a => filters.anomalySeverity.length === 0 || filters.anomalySeverity.includes(a.severity)) : [], [anomalies, filters.showAnomalies, filters.anomalySeverity]);
    
    // Aggregate statistics
    const stats = useMemo(() => ({
        totalBranches: branches.length, operationalBranches: branches.filter(b => b.status === 'operational').length,
        totalATMs: atms.length, inServiceATMs: atms.filter(a => a.status === 'in_service').length,
        activeVehicles: fleet.filter(v => v.status === 'en_route').length,
        criticalAnomalies: anomalies.filter(a => a.severity === 'critical').length
    }), [branches, atms, fleet, anomalies]);

    const handleFilterChange = useCallback((filterName: keyof MapFilters, value: any) => setFilters(prev => ({ ...prev, [filterName]: value })), []);
    const handleToggleStatusFilter = useCallback(<T extends BranchStatus | ATMStatus | AnomalySeverity>(filterKey: 'branchStatus' | 'atmStatus' | 'anomalySeverity', status: T) => {
        setFilters(prev => {
            const currentList = prev[filterKey] as T[];
            const newList = currentList.includes(status) ? currentList.filter(s => s !== status) : [...currentList, status];
            return { ...prev, [filterKey]: newList };
        });
    }, []);
    
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Maps - Operations Dashboard</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-white">{stats.totalBranches}</p><p className="text-sm text-gray-400 mt-1">Total Branches ({stats.operationalBranches} Op.)</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">{stats.totalATMs}</p><p className="text-sm text-gray-400 mt-1">Total ATMs ({stats.inServiceATMs} Online)</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">{stats.activeVehicles}</p><p className="text-sm text-gray-400 mt-1">Fleet Vehicles Active</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-red-500">{stats.criticalAnomalies}</p><p className="text-sm text-gray-400 mt-1">Critical Anomalies</p></Card>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6">
                <Card title="Map Controls" className="w-full lg:w-1/4 lg:max-w-sm flex-shrink-0">
                    <div className="h-[600px] overflow-y-auto">
                        <ControlPanelSection title="Layers"><FilterCheckbox label="Branches" isChecked={filters.showBranches} onChange={v => handleFilterChange('showBranches', v)} /><FilterCheckbox label="ATMs" isChecked={filters.showATMs} onChange={v => handleFilterChange('showATMs', v)} /><FilterCheckbox label="Fleet Vehicles" isChecked={filters.showFleet} onChange={v => handleFilterChange('showFleet', v)} /><FilterCheckbox label="AI Anomalies" isChecked={filters.showAnomalies} onChange={v => handleFilterChange('showAnomalies', v)} /></ControlPanelSection>
                        <ControlPanelSection title="Anomaly Filters">{(['low', 'medium', 'high', 'critical'] as AnomalySeverity[]).map(s => (<FilterCheckbox key={s} label={s} isChecked={filters.anomalySeverity.includes(s)} onChange={() => handleToggleStatusFilter('anomalySeverity', s)} />))}</ControlPanelSection>
                        <ControlPanelSection title="Branch Filters">{(['operational', 'under_maintenance', 'closed', 'newly_opened'] as BranchStatus[]).map(s => (<FilterCheckbox key={s} label={s.replace(/_/g, ' ')} isChecked={filters.branchStatus.includes(s)} onChange={() => handleToggleStatusFilter('branchStatus', s)} />))}</ControlPanelSection>
                        <ControlPanelSection title="ATM Filters">{(['in_service', 'out_of_service', 'low_cash', 'maintenance_required', 'error_state'] as ATMStatus[]).map(s => (<FilterCheckbox key={s} label={s.replace(/_/g, ' ')} isChecked={filters.atmStatus.includes(s)} onChange={() => handleToggleStatusFilter('atmStatus', s)} />))}<label className="text-gray-300 block mt-2">Min Cash Level: {filters.minCashLevel}%</label><input type="range" min="0" max="100" value={filters.minCashLevel} onChange={e => handleFilterChange('minCashLevel', parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" /></ControlPanelSection>
                        <ControlPanelSection title="AI Analytics Tools"><SiteSelectionTool /></ControlPanelSection>
                    </div>
                </Card>

                <Card title="Live Operations Map" className="flex-grow">
                    <div className="bg-gray-900/50 p-2 rounded-lg border border-gray-700 h-[600px] overflow-hidden relative">
                         {Object.values(loading).some(Boolean) && (<div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center z-20"><div className="flex flex-col items-center"><LoadingSpinner size={48} /><p className="mt-4 text-white text-lg">Loading Asset Data...</p></div></div>)}
                        {error && (<div className="absolute inset-0 bg-red-900/70 flex items-center justify-center z-20"><p className="text-white text-lg">{error}</p></div>)}
                        
                        <img src="https://images.unsplash.com/photo-1564939558297-fc319db62982?q=80&w=2940&auto=format&fit=crop" alt="Map with data layers" className="w-full h-full object-cover rounded-md" />
                        
                        <div className="absolute inset-0">
                            {filteredBranches.map(branch => (<div key={branch.id} className="absolute cursor-pointer" style={{ left: `${getRandomNumber(10, 90)}%`, top: `${getRandomNumber(10, 90)}%` }} onClick={() => setSelectedAsset(branch)} title={branch.name}><BranchIcon className="w-6 h-6 text-blue-400 drop-shadow-lg" /></div>))}
                            {filteredATMs.map(atm => (<div key={atm.id} className="absolute cursor-pointer" style={{ left: `${getRandomNumber(10, 90)}%`, top: `${getRandomNumber(10, 90)}%` }} onClick={() => setSelectedAsset(atm)} title={atm.name}><AtmIcon className="w-5 h-5 text-green-400 drop-shadow-lg" /></div>))}
                            {filteredFleet.map(vehicle => (<div key={vehicle.id} className="absolute cursor-pointer" style={{ left: `${getRandomNumber(10, 90)}%`, top: `${getRandomNumber(10, 90)}%` }} onClick={() => setSelectedAsset(vehicle)} title={vehicle.id}><VehicleIcon className="w-5 h-5 text-yellow-400 drop-shadow-lg" /></div>))}
                            {filteredAnomalies.map(anomaly => (<div key={anomaly.id} className={`absolute cursor-pointer ${getSeverityBgColor(anomaly.severity)} rounded-full p-1 border-2`} style={{ left: `${getRandomNumber(10, 90)}%`, top: `${getRandomNumber(10, 90)}%` }} onClick={() => setSelectedAsset(anomaly)} title={anomaly.title}><AlertIcon className={`w-5 h-5 ${getStatusColor(anomaly.severity)}`} /></div>))}
                        </div>
                        
                        <AssetDetailPanel asset={selectedAsset} onClose={() => setSelectedAsset(null)} />

                        <div className="absolute bottom-4 right-4 bg-gray-900/80 p-2 rounded-md text-white text-xs">
                           <p>Longitude: {mapViewport.longitude.toFixed(4)} | Latitude: {mapViewport.latitude.toFixed(4)} | Zoom: {mapViewport.zoom.toFixed(2)}</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DemoBankMapsView;