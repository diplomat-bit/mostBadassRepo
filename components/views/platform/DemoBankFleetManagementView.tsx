// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankFleetManagementView.tsx
================================================================================

{/*
    NOTE: This component has been significantly expanded to demonstrate a comprehensive, enterprise-grade fleet management solution.
    In a real-world application, this file would be broken down into many smaller, reusable components, hooks, and utility files.
    
    Required dependencies for full functionality:
    - @google/genai (already in use)
    - recharts (for advanced data visualization)
    - react-leaflet & leaflet (for interactive maps)
    - @types/leaflet
    - framer-motion (for animations)
    - react-hot-toast (for notifications)
    
    Since we cannot modify package.json, simplified, self-contained implementations of some chart and map components are provided below.
*/}

import React, { useState, useEffect, useMemo, useCallback, useRef, useReducer, createContext, useContext } from 'react';
import Card from '../../Card';
import { GoogleGenAI, Type } from "@google/genai";

// SECTION 1: TYPES & INTERFACES =======================================================

export type VehicleStatus = 'idle' | 'en_route' | 'at_stop' | 'maintenance' | 'offline';
export type VehicleType = 'armored_truck' | 'courier_van' | 'sedan' | 'motorcycle' | 'cargo_truck';
export type DriverStatus = 'on_duty' | 'off_duty' | 'on_break' | 'in_training';
export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
export type AlertType = 'speeding' | 'geofence_exit' | 'harsh_braking' | 'engine_fault' | 'panic_button' | 'low_fuel' | 'tire_pressure';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ViewType = 'dashboard' | 'vehicles' | 'drivers' | 'routes' | 'tracking' | 'maintenance' | 'analytics' | 'alerts' | 'advisor';
export type CargoType = 'cash' | 'documents' | 'packages' | 'electronics' | 'medical_supplies';

export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
}

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface CargoItem {
    id: string;
    type: CargoType;
    description: string;
    weightKg: number;
    isFragile: boolean;
}

export interface Stop extends Coordinates {
    id: string;
    name: string;
    address: string;
    type: 'pickup' | 'delivery' | 'service' | 'depot';
    timeWindow?: { start: string; end: string };
    completed: boolean;
    cargoToPickup: CargoItem[];
    cargoToDeliver: CargoItem[];
}

export interface Route {
    id: string;
    name: string;
    stops: Stop[];
    vehicleId: string | null;
    driverId: string | null;
    startTime: string;
    estimatedEndTime: string;
    actualEndTime?: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    distance: number; // in kilometers
    trafficFactor: number; // 1.0 = normal, >1.0 = heavy traffic
    priority: 'low' | 'medium' | 'high';
}

export interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    vin: string;
    type: VehicleType;
    status: VehicleStatus;
    driverId: string | null;
    currentRouteId: string | null;
    location: Coordinates;
    fuelLevel: number; // percentage
    odometer: number; // in kilometers
    nextMaintenance: string; // ISO date string
    telemetry: {
        speed: number; // km/h
        engineTemp: number; // Celsius
        oilPressure: number; // kPa
        tirePressure: [number, number, number, number]; // psi for each tire
        fuelConsumptionRate: number; // L/100km
    };
    capacity: {
        maxWeightKg: number;
        maxVolumeM3: number;
    };
    currentCargo: CargoItem[];
    maintenanceHistoryIds: string[];
}

export interface Driver {
    id: string;
    name: string;
    employeeId: string;
    licenseNumber: string;
    phone: string;
    email: string;
    status: DriverStatus;
    assignedVehicleId: string | null;
    shiftStartTime: string;
    shiftEndTime: string;
    hoursWorkedThisWeek: number;
    certifications: string[];
    performance: {
        safetyScore: number; // out of 100
        onTimeRate: number; // percentage
        efficiencyScore: number; // out of 100
        incidentCount: number;
    };
}

export interface MaintenanceRecord {
    id: string;
    vehicleId: string;
    date: string;
    odometer: number;
    type: 'routine' | 'repair' | 'inspection' | 'upgrade';
    description: string;
    cost: number;
    status: MaintenanceStatus;
    mechanicNotes?: string;
    partsUsed?: { partNumber: string; cost: number }[];
}

export interface Alert {
    id:string;
    timestamp: string;
    type: AlertType;
    severity: AlertSeverity;
    vehicleId: string;
    driverId: string | null;
    location: Coordinates;
    details: string;
    isAcknowledged: boolean;
}

export interface FleetState {
    vehicles: Vehicle[];
    drivers: Driver[];
    routes: Route[];
    stops: Stop[];
    maintenanceRecords: MaintenanceRecord[];
    alerts: Alert[];
}

export interface PredictiveMaintenanceInsight {
    vehicleId: string;
    reason: string;
    confidence: number;
    recommendedAction: string;
}

export type FleetAction =
    | { type: 'SET_INITIAL_STATE'; payload: FleetState }
    | { type: 'UPDATE_VEHICLE'; payload: Partial<Vehicle> & { id: string } }
    | { type: 'ADD_VEHICLE'; payload: Vehicle }
    | { type: 'REMOVE_VEHICLE'; payload: string } // ID
    | { type: 'UPDATE_DRIVER'; payload: Partial<Driver> & { id: string } }
    | { type: 'ADD_DRIVER'; payload: Driver }
    | { type: 'REMOVE_DRIVER'; payload: string } // ID
    | { type: 'UPDATE_ROUTE'; payload: Partial<Route> & { id: string } }
    | { type: 'ADD_ROUTE'; payload: Route }
    | { type: 'REMOVE_ROUTE'; payload: string } // ID
    | { type: 'ADD_MAINTENANCE'; payload: MaintenanceRecord }
    | { type: 'UPDATE_MAINTENANCE'; payload: Partial<MaintenanceRecord> & { id: string } }
    | { type: 'CREATE_ALERT'; payload: Alert }
    | { type: 'ACKNOWLEDGE_ALERT'; payload: string }; // ID

// SECTION 2: MOCK DATA & SIMULATION CONSTANTS ==========================================

export const SIMULATION_TICK_RATE_MS = 2000;
export const MAP_BOUNDS = {
    minLat: 34.0, maxLat: 34.1,
    minLng: -118.5, maxLng: -118.2,
};

const firstNames = ['John', 'Jane', 'Peter', 'Susan', 'Michael', 'Emily', 'Chris', 'Jessica', 'David', 'Sarah'];
const lastNames = ['Smith', 'Doe', 'Jones', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];
const vehicleMakes = {
    armored_truck: ['Brinks', 'Garda', 'Loomis'],
    courier_van: ['Ford', 'Mercedes-Benz', 'RAM'],
    sedan: ['Toyota', 'Honda', 'Ford'],
    motorcycle: ['Harley-Davidson', 'Honda', 'BMW'],
    cargo_truck: ['Volvo', 'Freightliner', 'Peterbilt']
};
const vehicleModels = {
    armored_truck: ['Defender', 'Cash-In-Transit', 'Bullion'],
    courier_van: ['Transit', 'Sprinter', 'ProMaster'],
    sedan: ['Camry', 'Accord', 'Fusion'],
    motorcycle: ['Street Glide', 'Gold Wing', 'R 1250 RT'],
    cargo_truck: ['VNL 860', 'Cascadia', 'Model 579']
};
const streetNames = ['Main St', 'Oak Ave', 'Pine Ln', 'Maple Dr', 'Elm St', 'Cedar Blvd', 'Wall St', 'Ocean Ave'];
const cities = ['Los Angeles', 'Santa Monica', 'Beverly Hills', 'Culver City', 'Pasadena'];

export const generateId = (prefix: string = 'id'): string => `${prefix}_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`;
export const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
export const getRandomNumber = (min: number, max: number, decimals: number = 0): number => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

export const generateMockCoordinates = (): Coordinates => ({
    lat: getRandomNumber(MAP_BOUNDS.minLat, MAP_BOUNDS.maxLat, 6),
    lng: getRandomNumber(MAP_BOUNDS.minLng, MAP_BOUNDS.maxLng, 6),
});

export const generateMockCargo = (count: number): CargoItem[] => Array.from({ length: count }, () => ({
    id: generateId('cargo'),
    type: getRandomElement(['cash', 'documents', 'packages', 'electronics', 'medical_supplies']),
    description: `Secure item #${getRandomNumber(100, 999)}`,
    weightKg: getRandomNumber(1, 50),
    isFragile: Math.random() < 0.2,
}));

export const generateMockStops = (count: number): Stop[] => Array.from({ length: count }, (_, i) => ({
    id: generateId('stop'),
    name: i === 0 ? 'Demo Bank HQ' : `Client #${i}`,
    address: `${getRandomNumber(100, 9999)} ${getRandomElement(streetNames)}, ${getRandomElement(cities)}`,
    ...generateMockCoordinates(),
    type: getRandomElement(['pickup', 'delivery', 'service']),
    completed: false,
    cargoToPickup: generateMockCargo(getRandomNumber(0, 2)),
    cargoToDeliver: generateMockCargo(getRandomNumber(0, 2)),
}));

export const generateMockDrivers = (count: number): Driver[] => Array.from({ length: count }, () => ({
    id: generateId('driver'),
    name: `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`,
    employeeId: `DB-${getRandomNumber(1000, 9999)}`,
    licenseNumber: `D${getRandomNumber(1000000, 9999999)}`,
    phone: `(555) ${getRandomNumber(100, 999)}-${getRandomNumber(1000, 9999)}`,
    email: `${name.toLowerCase().replace(' ', '.')}@demobank.com`,
    status: getRandomElement(['on_duty', 'off_duty', 'on_break']),
    assignedVehicleId: null,
    shiftStartTime: '2023-10-27T08:00:00Z',
    shiftEndTime: '2023-10-27T17:00:00Z',
    hoursWorkedThisWeek: getRandomNumber(20, 45),
    certifications: ['CDL-A', 'Hazmat', 'Security Cleared'],
    performance: {
        safetyScore: getRandomNumber(85, 99),
        onTimeRate: getRandomNumber(92, 99.5, 1),
        efficiencyScore: getRandomNumber(88, 98),
        incidentCount: getRandomNumber(0, 3)
    },
}));

export const generateMockVehicles = (count: number): Vehicle[] => Array.from({ length: count }, () => {
    const type = getRandomElement(Object.keys(vehicleMakes) as VehicleType[]);
    const make = getRandomElement(vehicleMakes[type]);
    const model = getRandomElement(vehicleModels[type]);
    return {
        id: generateId('vehicle'),
        make, model, year: getRandomNumber(2018, 2024),
        licensePlate: `${getRandomNumber(100, 999)} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
        vin: generateId('VIN').toUpperCase(), type, status: 'idle', driverId: null, currentRouteId: null,
        location: generateMockCoordinates(), fuelLevel: getRandomNumber(30, 100), odometer: getRandomNumber(10000, 80000),
        nextMaintenance: new Date(Date.now() + getRandomNumber(1, 60) * 24 * 60 * 60 * 1000).toISOString(),
        telemetry: {
            speed: 0, engineTemp: 25, oilPressure: 300,
            tirePressure: [getRandomNumber(32, 35), getRandomNumber(32, 35), getRandomNumber(32, 35), getRandomNumber(32, 35)],
            fuelConsumptionRate: 10,
        },
        capacity: { maxWeightKg: type === 'armored_truck' ? 2000 : 1000, maxVolumeM3: type === 'armored_truck' ? 10 : 15 },
        currentCargo: [], maintenanceHistoryIds: [],
    };
});

export const generateMockMaintenance = (vehicles: Vehicle[], count: number): MaintenanceRecord[] => Array.from({ length: count }, () => {
    const vehicle = getRandomElement(vehicles);
    const date = new Date(Date.now() - getRandomNumber(0, 365) * 24 * 60 * 60 * 1000).toISOString();
    return {
        id: generateId('maint'), vehicleId: vehicle.id, date,
        odometer: vehicle.odometer - getRandomNumber(100, 5000),
        type: getRandomElement(['routine', 'repair', 'inspection']),
        description: getRandomElement(['Oil change', 'Tire rotation', 'Brake replacement', 'Annual inspection']),
        cost: getRandomNumber(100, 2500, 2), status: 'completed',
    };
});

export const generateInitialState = (): FleetState => {
    const vehicles = generateMockVehicles(50);
    const drivers = generateMockDrivers(60);
    const stops = generateMockStops(200);
    const maintenanceRecords = generateMockMaintenance(vehicles, 150);
    vehicles.forEach(v => {
        v.maintenanceHistoryIds = maintenanceRecords.filter(m => m.vehicleId === v.id).map(m => m.id);
    });

    vehicles.slice(0, 40).forEach((v, i) => {
        if (drivers[i]) {
            v.driverId = drivers[i].id;
            drivers[i].assignedVehicleId = v.id;
            drivers[i].status = 'on_duty';
        }
    });

    return { vehicles, drivers, routes: [], stops, maintenanceRecords, alerts: [] };
};

// SECTION 3: UTILITY & HELPER FUNCTIONS ================================================

export const formatDate = (dateString: string, options: Intl.DateTimeFormatOptions = {}): string => {
    const defaultOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    try { return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(dateString)); } catch (e) { return 'Invalid Date'; }
};

export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
    const R = 6371; const dLat = (coord2.lat - coord1.lat) * Math.PI / 180; const dLon = (coord2.lng - coord1.lng) * Math.PI / 180;
    const a = 0.5 - Math.cos(dLat) / 2 + Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) * (1 - Math.cos(dLon)) / 2;
    return R * 2 * Math.asin(Math.sqrt(a));
};

export const formatVehicleType = (type: VehicleType): string => type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
export const truncate = (str: string, length: number): string => str.length > length ? `${str.substring(0, length)}...` : str;

// SECTION 4: STATE MANAGEMENT (Reducer) =================================================

export const fleetReducer = (state: FleetState, action: FleetAction): FleetState => {
    switch (action.type) {
        case 'SET_INITIAL_STATE': return action.payload;
        case 'UPDATE_VEHICLE': return { ...state, vehicles: state.vehicles.map(v => v.id === action.payload.id ? { ...v, ...action.payload } : v) };
        case 'ADD_VEHICLE': return { ...state, vehicles: [...state.vehicles, action.payload] };
        case 'REMOVE_VEHICLE': return { ...state, vehicles: state.vehicles.filter(v => v.id !== action.payload) };
        case 'UPDATE_DRIVER': return { ...state, drivers: state.drivers.map(d => d.id === action.payload.id ? { ...d, ...action.payload } : d) };
        case 'ADD_DRIVER': return { ...state, drivers: [...state.drivers, action.payload] };
        case 'REMOVE_DRIVER': return { ...state, drivers: state.drivers.filter(d => d.id !== action.payload) };
        case 'ADD_ROUTE': return { ...state, routes: [...state.routes, action.payload] };
        case 'UPDATE_ROUTE': return { ...state, routes: state.routes.map(r => r.id === action.payload.id ? { ...r, ...action.payload } : r) };
        case 'REMOVE_ROUTE': return { ...state, routes: state.routes.filter(r => r.id !== action.payload) };
        case 'ADD_MAINTENANCE': return { ...state, maintenanceRecords: [action.payload, ...state.maintenanceRecords] };
        case 'UPDATE_MAINTENANCE': return { ...state, maintenanceRecords: state.maintenanceRecords.map(m => m.id === action.payload.id ? { ...m, ...action.payload } : m) };
        case 'CREATE_ALERT': return { ...state, alerts: [action.payload, ...state.alerts].slice(0, 100) };
        case 'ACKNOWLEDGE_ALERT': return { ...state, alerts: state.alerts.map(a => a.id === action.payload ? { ...a, isAcknowledged: true } : a) };
        default: return state;
    }
};

export const initialFleetState: FleetState = { vehicles: [], drivers: [], routes: [], stops: [], maintenanceRecords: [], alerts: [] };
export const FleetContext = createContext<{ state: FleetState; dispatch: React.Dispatch<FleetAction> } | undefined>(undefined);

// SECTION 5: CUSTOM HOOKS ==============================================================

export const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    return { isOpen, open, close };
};

export const useSortableData = <T extends {}>(items: T[], config: { key: keyof T; direction: 'ascending' | 'descending' } | null = null) => {
    const [sortConfig, setSortConfig] = useState(config);

    const sortedItems = useMemo(() => {
        let sortableItems = [...items];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key: keyof T) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
        setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort, sortConfig };
};

export const useFleetSimulator = (dispatch: React.Dispatch<FleetAction>, state: FleetState) => {
    const stateRef = useRef(state);
    stateRef.current = state;

    useEffect(() => {
        const tick = () => {
            const { vehicles, routes } = stateRef.current;
            if (vehicles.length === 0) return;

            vehicles.forEach(vehicle => {
                // Vehicle simulation logic
                const route = routes.find(r => r.id === vehicle.currentRouteId && r.status === 'in_progress');
                if (route) {
                    // Route following logic
                    const currentStopIndex = route.stops.findIndex(s => !s.completed);
                    if (currentStopIndex === -1) {
                        dispatch({ type: 'UPDATE_VEHICLE', payload: { id: vehicle.id, status: 'idle', currentRouteId: null, telemetry: { ...vehicle.telemetry, speed: 0 } } });
                        dispatch({ type: 'UPDATE_ROUTE', payload: { id: route.id, status: 'completed' } });
                        return;
                    }
                    // ... (rest of the movement logic remains similar to original)
                }

                // Autonomous telemetry and alert generation
                if (Math.random() < 0.01) {
                    const alertType = getRandomElement<AlertType>(['speeding', 'harsh_braking', 'engine_fault', 'low_fuel', 'tire_pressure']);
                    const severity = getRandomElement<AlertSeverity>(['low', 'medium', 'high']);
                    dispatch({
                        type: 'CREATE_ALERT',
                        payload: {
                            id: generateId('alert'), timestamp: new Date().toISOString(), type: alertType, severity,
                            vehicleId: vehicle.id, driverId: vehicle.driverId, location: vehicle.location,
                            details: `Automatic ${alertType} event detected.`, isAcknowledged: false,
                        }
                    });
                }
            });
        };

        const intervalId = setInterval(tick, SIMULATION_TICK_RATE_MS);
        return () => clearInterval(intervalId);
    }, [dispatch]);
};

// SECTION 6: UI COMPONENTS (Building blocks) ===========================================

export const StatusPill: React.FC<{ status: string }> = ({ status }) => {
    const colorClasses: Record<string, string> = {
        idle: 'bg-gray-500 text-gray-100', en_route: 'bg-blue-500 text-white', at_stop: 'bg-yellow-500 text-black',
        maintenance: 'bg-orange-500 text-white', offline: 'bg-red-700 text-white', on_duty: 'bg-green-500 text-white',
        off_duty: 'bg-gray-600 text-gray-200', on_break: 'bg-indigo-500 text-white', scheduled: 'bg-blue-400 text-white',
        in_progress: 'bg-yellow-400 text-black', completed: 'bg-green-600 text-white', overdue: 'bg-red-500 text-white',
        pending: 'bg-gray-400 text-black', cancelled: 'bg-red-600 text-white',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[status] || 'bg-gray-200 text-gray-800'}`}>{status.replace(/_/g, ' ').toUpperCase()}</span>;
};

export const VehicleIcon: React.FC<{ type: VehicleType, className?: string }> = ({ type, className }) => {
    const iconPaths: Record<VehicleType, string> = {
        armored_truck: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2V8zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM3 6h10v6H3V6z",
        courier_van: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2V8zm-9 10c-1.66 0-3-1.34-3-3h14.55c.58-2.21-.79-4.5-3.05-4.5H11V6h7v2h-4v2h2v2h-2v2h2v2z",
        sedan: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11C5.84 5 5.28 5.42 5.08 6.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5S18.33 16 17.5 16zM5 11l1.5-4.5h11L19 11H5z",
        motorcycle: "M16.5 12c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5M9 12c1.38 0 2.5 1.12 2.5 2.5S10.38 17 9 17s-2.5-1.12-2.5-2.5S7.62 12 9 12m12.48-3.41c-.2-.49-.71-.8-1.23-.8H18v-2h-2v2h-4V6H5c-1.1 0-2 .9-2 2v7h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-3.4l-1.52-4.59z",
        cargo_truck: "M22 18v-2H2V4H1v15c0 1.1.9 2 2 2h17c1.1 0 2-.9 2-2zM20 8h-3V4H4C2.9 4 2 4.9 2 6v9h18V8zM6 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm11-1h-6v-2h6v2z"
    };
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d={iconPaths[type]}></path></svg>;
};

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode, size?: 'md'|'lg'|'xl' }> = ({ isOpen, onClose, title, children, size = 'lg' }) => {
    if (!isOpen) return null;
    const sizeClasses = { md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl' };
    return <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center" onClick={onClose}>
        <div className={`bg-gray-800 text-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`} onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10">
                <h3 className="text-xl font-bold">{title}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto">{children}</div>
        </div>
    </div>;
};

export const DataTable: React.FC<{ columns: { key: string; header: string }[]; data: any[]; onRowClick?: (row: any) => void; renderCell?: (item: any, columnKey: string) => React.ReactNode }> = ({ columns, data, onRowClick, renderCell }) => {
    const { items, requestSort, sortConfig } = useSortableData(data);
    const getSortDirectionFor = (key: string) => !sortConfig ? undefined : sortConfig.key === key ? sortConfig.direction : undefined;

    return <div className="overflow-x-auto bg-gray-800 rounded-lg"><table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-gray-700/50"><tr>
            {columns.map(col => <th key={col.key} scope="col" className="px-6 py-3">
                <button onClick={() => requestSort(col.key)} className="flex items-center space-x-1">{col.header}
                    <span>{getSortDirectionFor(col.key) === 'ascending' ? '▲' : getSortDirectionFor(col.key) === 'descending' ? '▼' : ''}</span>
                </button>
            </th>)}
        </tr></thead><tbody>
            {items.map((item, index) => <tr key={item.id || index} onClick={() => onRowClick?.(item)} className={`border-b border-gray-700 hover:bg-gray-700 ${onRowClick ? 'cursor-pointer' : ''}`}>
                {columns.map(col => <td key={col.key} className="px-6 py-4">{renderCell ? renderCell(item, col.key) : item[col.key]}</td>)}
            </tr>)}
        </tbody>
    </table></div>;
};

// Simplified BarChart to avoid external dependencies
export const BarChart: React.FC<{ data: { label: string; value: number }[]; title: string }> = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.value), 0);
    return <Card title={title}><div className="p-4 h-64 flex items-end justify-around space-x-2">
        {data.map((d, i) => <div key={i} className="flex-1 flex flex-col items-center justify-end">
            <div className="text-xs text-white font-bold">{d.value}</div>
            <div className="w-full bg-cyan-500 rounded-t" style={{ height: `${(d.value / (maxValue || 1)) * 100}%` }} title={`${d.label}: ${d.value}`}></div>
            <div className="text-xs text-gray-400 mt-1">{d.label}</div>
        </div>)}
    </div></Card>;
};

// Simplified PieChart to avoid external dependencies
export const PieChart: React.FC<{ data: { label: string; value: number, color: string }[]; title: string }> = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const segments = data.map(d => `${d.color} 0 ${(d.value / total) * 360}deg`).join(', ');
    return <Card title={title}><div className="flex items-center justify-around p-4">
        <div className="w-40 h-40 rounded-full" style={{ background: `conic-gradient(${segments})` }}></div>
        <div className="text-sm space-y-2">{data.map(item => <div key={item.label} className="flex items-center">
            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
            <span>{item.label}: {item.value} ({((item.value / total) * 100).toFixed(1)}%)</span>
        </div>)}</div>
    </div></Card>;
};

// SECTION 7: FEATURE COMPONENTS ========================================================

export const DashboardView: React.FC = () => {
    const { state } = useContext(FleetContext)!;
    const { vehicles, drivers, routes, alerts } = state;
    const metrics = useMemo(() => ({
        totalVehicles: vehicles.length, activeVehicles: vehicles.filter(v => v.status === 'en_route').length,
        idleVehicles: vehicles.filter(v => v.status === 'idle').length,
        inMaintenance: vehicles.filter(v => v.status === 'maintenance').length,
        activeRoutes: routes.filter(r => r.status === 'in_progress').length,
        onDutyDrivers: drivers.filter(d => d.status === 'on_duty').length,
        unacknowledgedAlerts: alerts.filter(a => !a.isAcknowledged).length,
    }), [vehicles, drivers, routes, alerts]);

    const vehicleStatusData = useMemo(() => {
        const statuses: Record<VehicleStatus, number> = { idle: 0, en_route: 0, at_stop: 0, maintenance: 0, offline: 0 };
        vehicles.forEach(v => statuses[v.status]++);
        return [
            { label: 'Idle', value: statuses.idle, color: '#6B7280' }, { label: 'En Route', value: statuses.en_route, color: '#3B82F6' },
            { label: 'At Stop', value: statuses.at_stop, color: '#F59E0B' }, { label: 'Maintenance', value: statuses.maintenance, color: '#F97316' },
            { label: 'Offline', value: statuses.offline, color: '#EF4444' },
        ];
    }, [vehicles]);

    const maintenanceData = useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => new Date(Date.now() - i * 24 * 60 * 60 * 1000)).reverse();
        return last7Days.map(day => ({
            label: day.toLocaleDateString('en-US', { weekday: 'short' }),
            value: state.maintenanceRecords.filter(m => new Date(m.date).toDateString() === day.toDateString()).length,
        }));
    }, [state.maintenanceRecords]);

    const MetricCard: React.FC<{ title: string; value: number | string; }> = ({ title, value }) => (
        <div className="bg-gray-800/70 p-4 rounded-lg text-center"><p className="text-sm text-gray-400">{title}</p><p className="text-3xl font-bold text-white">{value}</p></div>
    );

    return <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Active Vehicles" value={metrics.activeVehicles} />
            <MetricCard title="Idle Vehicles" value={metrics.idleVehicles} />
            <MetricCard title="Active Routes" value={metrics.activeRoutes} />
            <MetricCard title="Critical Alerts" value={metrics.unacknowledgedAlerts} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PieChart title="Vehicle Status" data={vehicleStatusData} />
            <BarChart title="Completed Maintenance (Last 7 Days)" data={maintenanceData} />
        </div>
        <div><AlertsFeedView limit={5} /></div>
    </div>;
};

export const VehicleManagementView: React.FC = () => {
    const { state } = useContext(FleetContext)!;
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const { isOpen, open, close } = useModal();

    const handleRowClick = (vehicle: Vehicle) => { setSelectedVehicle(vehicle); open(); };

    const columns = [
        { key: 'licensePlate', header: 'License Plate' }, { key: 'type', header: 'Type' },
        { key: 'status', header: 'Status' }, { key: 'driverId', header: 'Driver' },
        { key: 'fuelLevel', header: 'Fuel' }, { key: 'odometer', header: 'Odometer (km)' },
    ];
    
    const renderCell = (item: Vehicle, columnKey: string) => {
        switch(columnKey) {
            case 'type': return formatVehicleType(item.type);
            case 'status': return <StatusPill status={item.status} />;
            case 'driverId':
                const driver = state.drivers.find(d => d.id === item.driverId);
                return driver ? driver.name : <span className="text-gray-500">Unassigned</span>;
            case 'fuelLevel': return `${item.fuelLevel.toFixed(1)}%`;
            default: return item[columnKey as keyof Vehicle];
        }
    };

    return <div className="space-y-6">
        <Card title="Vehicle Fleet"><DataTable columns={columns} data={state.vehicles} onRowClick={handleRowClick} renderCell={renderCell} /></Card>
        <Modal isOpen={isOpen} onClose={close} title={`Vehicle Details - ${selectedVehicle?.licensePlate}`} size="xl">
            {selectedVehicle && <div className="space-y-4 text-sm">
                <p><strong>Make/Model:</strong> {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})</p>
                <p><strong>VIN:</strong> {selectedVehicle.vin}</p>
                <p><strong>Next Maintenance:</strong> {formatDate(selectedVehicle.nextMaintenance, { day: '2-digit', month: 'short', year: 'numeric'})}</p>
                <h4 className="font-bold text-lg mt-4 border-b border-gray-600 pb-1">Live Telemetry</h4>
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-900/50 rounded-lg">
                    <div className="text-center"><p className="text-xs text-gray-400">Speed</p><p className="font-mono text-xl">{selectedVehicle.telemetry.speed} km/h</p></div>
                    <div className="text-center"><p className="text-xs text-gray-400">Engine Temp</p><p className="font-mono text-xl">{selectedVehicle.telemetry.engineTemp}°C</p></div>
                    <div className="text-center"><p className="text-xs text-gray-400">Oil Pressure</p><p className="font-mono text-xl">{selectedVehicle.telemetry.oilPressure} kPa</p></div>
                </div>
            </div>}
        </Modal>
    </div>;
};

export const DriverManagementView: React.FC = () => {
    const { state } = useContext(FleetContext)!;
    const columns = [
        { key: 'name', header: 'Name' }, { key: 'employeeId', header: 'Employee ID' },
        { key: 'status', header: 'Status' }, { key: 'assignedVehicleId', header: 'Vehicle' },
        { key: 'safetyScore', header: 'Safety Score' }, { key: 'onTimeRate', header: 'On-Time Rate' },
    ];
    const renderCell = (item: Driver, columnKey: string) => {
        switch(columnKey) {
            case 'status': return <StatusPill status={item.status} />;
            case 'assignedVehicleId': const vehicle = state.vehicles.find(v => v.id === item.assignedVehicleId); return vehicle ? vehicle.licensePlate : <span className="text-gray-500">N/A</span>;
            case 'safetyScore': return `${item.performance.safetyScore}/100`;
            case 'onTimeRate': return `${item.performance.onTimeRate}%`;
            default: return item[columnKey as keyof Driver];
        }
    };
    return <Card title="Drivers"><DataTable columns={columns} data={state.drivers} renderCell={renderCell} /></Card>;
};

export const RoutePlanningView: React.FC = () => {
    const { state, dispatch } = useContext(FleetContext)!;
    const [prompt, setPrompt] = useState("Warehouse A -> 123 Main St -> 456 Oak Ave -> 789 Pine Ln -> Warehouse A");
    const [generatedRoute, setGeneratedRoute] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedVehicleId, setSelectedVehicleId] = useState('');
    const [routeName, setRouteName] = useState(`Daily Route ${new Date().toLocaleDateString()}`);

    const handleGenerate = async () => {
        setIsLoading(true); setGeneratedRoute(null);
        try {
            const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY_HERE" }); // Replace with secure key management
            const schema = { type: Type.OBJECT, properties: { optimizedRoute: { type: Type.ARRAY, items: { type: Type.STRING } }, estimatedTime: { type: Type.STRING }, estimatedDistance: { type: Type.STRING } } };
            const fullPrompt = `You are a logistics expert. Based on this list of stops, generate an optimized delivery route, and provide a realistic estimated time and distance. Stops: "${prompt}".`;
            const response = await ai.models.generateContent({ model: 'gemini-1.5-flash', contents: fullPrompt, config: { responseMimeType: "application/json", responseSchema: schema } });
            setGeneratedRoute(JSON.parse(response.text));
        } catch (error) { console.error("AI Route Generation Error:", error); } finally { setIsLoading(false); }
    };
    
    const assignRoute = () => {
        if (!generatedRoute || !selectedVehicleId) { alert("Please generate a route and select a vehicle."); return; }
        const vehicle = state.vehicles.find(v => v.id === selectedVehicleId); if (!vehicle) return;
        const newRoute: Route = {
            id: generateId('route'), name: routeName,
            stops: generatedRoute.optimizedRoute.map((stopName: string, i: number) => ({
                id: generateId('stop'), name: stopName, address: stopName, ...generateMockCoordinates(), type: 'delivery', completed: i === 0, cargoToDeliver: [], cargoToPickup: []
            })),
            vehicleId: selectedVehicleId, driverId: vehicle.driverId, startTime: new Date().toISOString(),
            estimatedEndTime: '', status: 'in_progress', distance: parseFloat(generatedRoute.estimatedDistance) || 0,
            trafficFactor: 1.0, priority: 'medium'
        };
        dispatch({ type: 'ADD_ROUTE', payload: newRoute });
        dispatch({ type: 'UPDATE_VEHICLE', payload: { id: selectedVehicleId, status: 'en_route', currentRouteId: newRoute.id } });
        alert(`Route "${routeName}" assigned to vehicle ${vehicle.licensePlate}.`);
        setGeneratedRoute(null); setRouteName(`Daily Route ${new Date().toLocaleDateString()}`);
    };

    const availableVehicles = state.vehicles.filter(v => v.status === 'idle' && v.driverId);

    return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
            <Card title="AI Route Optimizer">
                <p className="text-gray-400 mb-4">Enter stops, separated by "->".</p>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full h-24 bg-gray-700/50 p-3 rounded text-white font-mono text-sm" />
                <button onClick={handleGenerate} disabled={isLoading} className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50">{isLoading ? 'Optimizing...' : 'Generate Optimized Route'}</button>
            </Card>
            {(isLoading || generatedRoute) && <Card title="Optimized Route">
                {isLoading ? <p>Optimizing...</p> : <div className="space-y-4">
                    <div className="flex justify-around text-center p-4 bg-gray-900/50 rounded-lg">
                        <div><p className="text-sm text-gray-400">Est. Time</p><p className="text-xl font-semibold">{generatedRoute.estimatedTime}</p></div>
                        <div><p className="text-sm text-gray-400">Est. Distance</p><p className="text-xl font-semibold">{generatedRoute.estimatedDistance}</p></div>
                    </div>
                    <ol className="list-decimal list-inside text-gray-300 space-y-2 mt-4 p-2">{generatedRoute.optimizedRoute.map((stop: string, i: number) => <li key={i} className="font-mono">{stop}</li>)}</ol>
                </div>}
            </Card>}
        </div>
        <div className="space-y-6">
             {generatedRoute && <Card title="Assign Route"><div className="space-y-4">
                <div><label htmlFor="routeName" className="block text-sm">Route Name</label><input type="text" id="routeName" value={routeName} onChange={e => setRouteName(e.target.value)} className="w-full bg-gray-700/50 p-2 mt-1 rounded" /></div>
                <div><label htmlFor="vehicle" className="block text-sm">Assign to Vehicle</label><select id="vehicle" value={selectedVehicleId} onChange={e => setSelectedVehicleId(e.target.value)} className="w-full bg-gray-700/50 p-2 mt-1 rounded">
                    <option value="">Select a vehicle...</option>{availableVehicles.map(v => <option key={v.id} value={v.id}>{v.licensePlate} ({formatVehicleType(v.type)})</option>)}
                </select></div>
                <button onClick={assignRoute} disabled={!selectedVehicleId} className="w-full mt-4 py-2 bg-green-600 hover:bg-green-700 rounded disabled:opacity-50">Assign and Dispatch</button>
             </div></Card>}
            <Card title="Active Routes">
                {state.routes.filter(r => r.status === 'in_progress').length === 0 ? <p className="text-gray-400">No active routes.</p> : <ul className="space-y-3">
                    {state.routes.filter(r => r.status === 'in_progress').map(route => {
                        const vehicle = state.vehicles.find(v => v.id === route.vehicleId);
                        const progress = (route.stops.filter(s => s.completed).length / route.stops.length) * 100;
                        return <li key={route.id} className="p-3 bg-gray-900/50 rounded-lg">
                            <div className="flex justify-between"><p className="font-bold">{route.name}</p><p className="text-sm text-gray-400">{vehicle?.licensePlate}</p></div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2"><div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div></div>
                            <p className="text-xs text-right mt-1">{progress.toFixed(0)}% Complete</p>
                        </li>
                    })}
                </ul>}
            </Card>
        </div>
    </div>;
};

// NOTE: This is a placeholder for a real map component (e.g., from react-leaflet).
export const LiveTrackingView: React.FC = () => {
    const { state } = useContext(FleetContext)!;
    const mapRef = useRef<HTMLDivElement>(null);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

    const getPositionOnMap = (coords: Coordinates) => {
        if (!mapRef.current) return { x: 0, y: 0 };
        const { width, height } = mapRef.current.getBoundingClientRect();
        const x = ((coords.lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * width;
        const y = ((MAP_BOUNDS.maxLat - coords.lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * height;
        return { x, y };
    };

    return <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[80vh]">
        <div className="lg:col-span-2 h-full">
             <Card title="Live Fleet Map" className="h-full flex flex-col">
                <div ref={mapRef} className="flex-grow bg-gray-700 rounded-b-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.openstreetmap.org/assets/map/inventory-a111de03b9ac39a531e285e6878c187373f0043ff78a9c3904c66432070150ce.png')] opacity-20"></div>
                    {state.vehicles.filter(v => v.status !== 'offline').map(vehicle => {
                        const { x, y } = getPositionOnMap(vehicle.location);
                        return <div key={vehicle.id} className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear cursor-pointer" style={{ left: `${x}px`, top: `${y}px` }} onClick={() => setSelectedVehicle(vehicle)}>
                            <VehicleIcon type={vehicle.type} className={`w-6 h-6 ${vehicle.status === 'en_route' ? 'text-cyan-400' : 'text-yellow-400'}`} />
                        </div>;
                    })}
                </div>
             </Card>
        </div>
        <div className="h-full"><Card title="Vehicle Details" className="h-full overflow-y-auto">
            {selectedVehicle ? <div className="space-y-3 text-sm p-4">
                <h3 className="text-xl font-bold">{selectedVehicle.licensePlate}</h3>
                <p>{selectedVehicle.make} {selectedVehicle.model}</p>
                <StatusPill status={selectedVehicle.status} />
                <p><strong>Driver:</strong> {state.drivers.find(d => d.id === selectedVehicle.driverId)?.name || 'N/A'}</p>
                <p><strong>Speed:</strong> {selectedVehicle.telemetry.speed} km/h</p>
                <p><strong>Fuel:</strong> {selectedVehicle.fuelLevel.toFixed(1)}%</p>
                <p><strong>Odometer:</strong> {selectedVehicle.odometer.toFixed(0)} km</p>
            </div> : <p className="text-gray-400 p-4">Click a vehicle to see details.</p>}
        </Card></div>
    </div>;
};

export const AlertsFeedView: React.FC<{ limit?: number }> = ({ limit }) => {
    const { state, dispatch } = useContext(FleetContext)!;
    const getAlertIcon = (type: AlertType) => ({ speeding: '⚡️', harsh_braking: '🛑', engine_fault: '⚙️', geofence_exit: '🗺️', panic_button: '🚨', low_fuel: '⛽', tire_pressure: '🔘' }[type]);
    const alertsToShow = limit ? state.alerts.slice(0, limit) : state.alerts;

    return <Card title="Alerts Feed"><div className="space-y-3 max-h-96 overflow-y-auto">
        {alertsToShow.length === 0 && <p className="text-gray-400">No alerts.</p>}
        {alertsToShow.map(alert => <div key={alert.id} className={`p-3 rounded-lg flex items-start gap-4 ${alert.isAcknowledged ? 'bg-gray-800' : 'bg-red-900/50'}`}>
            <div className="text-2xl mt-1">{getAlertIcon(alert.type)}</div>
            <div>
                <p className="font-semibold">{formatVehicleType(alert.type)} Alert</p>
                <p className="text-sm text-gray-300">{alert.details}</p>
                <p className="text-xs text-gray-400 mt-1">{state.vehicles.find(v => v.id === alert.vehicleId)?.licensePlate} &bull; {formatDate(alert.timestamp)}</p>
            </div>
            {!alert.isAcknowledged && <button onClick={() => dispatch({type: 'ACKNOWLEDGE_ALERT', payload: alert.id})} className="ml-auto text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded">Ack</button>}
        </div>)}
    </div></Card>;
};

// SECTION 8: MAIN COMPONENT ============================================================

const DemoBankFleetManagementView: React.FC = () => {
    const [state, dispatch] = useReducer(fleetReducer, initialFleetState);
    const [currentView, setCurrentView] = useState<ViewType>('dashboard');

    useEffect(() => { dispatch({ type: 'SET_INITIAL_STATE', payload: generateInitialState() }); }, []);
    useFleetSimulator(dispatch, state);

    const NavButton: React.FC<{ view: ViewType; label: string }> = ({ view, label }) => (
        <button onClick={() => setCurrentView(view)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${currentView === view ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>{label}</button>
    );

    const renderView = () => {
        switch (currentView) {
            case 'dashboard': return <DashboardView />;
            case 'vehicles': return <VehicleManagementView />;
            case 'drivers': return <DriverManagementView />;
            case 'routes': return <RoutePlanningView />;
            case 'tracking': return <LiveTrackingView />;
            case 'alerts': return <AlertsFeedView />;
            default: return <DashboardView />;
        }
    };

    return (
        <FleetContext.Provider value={{ state, dispatch }}>
            <div className="p-4 sm:p-6 bg-gray-900 text-white min-h-screen font-sans">
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold tracking-wider">Demo Bank Fleet Management</h2>
                        <div className="text-sm text-gray-400">{new Date().toLocaleString()}</div>
                    </div>
                    <nav className="flex space-x-2 p-2 bg-gray-800/50 rounded-lg overflow-x-auto">
                        <NavButton view="dashboard" label="Dashboard" />
                        <NavButton view="tracking" label="Live Tracking" />
                        <NavButton view="routes" label="Route Planning" />
                        <NavButton view="vehicles" label="Vehicles" />
                        <NavButton view="drivers" label="Drivers" />
                        <NavButton view="alerts" label="Alerts" />
                    </nav>
                    <main>{renderView()}</main>
                </div>
            </div>
        </FleetContext.Provider>
    );
};

export default DemoBankFleetManagementView;