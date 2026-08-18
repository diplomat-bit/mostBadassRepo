// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankIoTHubView.tsx
================================================================================

import React, { useState, useEffect, useMemo, useCallback, FC } from 'react';
import Card from '../../Card';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
    LineChart, Line, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';
import {
    Wifi, WifiOff, AlertTriangle, Server, Smartphone, Video, MapPin, Search,
    Filter, ChevronDown, ChevronLeft, ChevronRight, MoreVertical, Power, RefreshCw, UploadCloud,
    Shield, Bot, Sliders, PlusCircle, X, CheckCircle, BrainCircuit, Cpu, Thermometer, Radio, Zap, Clock
} from 'lucide-react';

// --- TYPES ---
type DeviceStatus = 'Online' | 'Offline' | 'Error' | 'Updating';
type DeviceType = 'ATM' | 'Point-of-Sale' | 'Security Camera' | 'GPS Tracker' | 'Branch Beacon';
type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
type Tab = 'Overview' | 'Devices' | 'Security' | 'Analytics' | 'Rules';

interface Device {
    id: string;
    name: string;
    type: DeviceType;
    status: DeviceStatus;
    location: string;
    lastMessage: Date;
    ipAddress: string;
    firmwareVersion: string;
    provisionDate: Date;
    telemetry: {
        temperature?: number;
        transactions?: number;
        signalStrength?: number;
        uptime?: number;
        lastCashCassetteChange?: Date;
        isRecording?: boolean;
    };
}

interface SecurityAlert {
    id: string;
    timestamp: Date;
    deviceId: string;
    deviceName: string;
    severity: AlertSeverity;
    description: string;
    resolved: boolean;
}

interface AutomationRule {
    id: string;
    name: string;
    condition: string;
    action: string;
    isEnabled: boolean;
}

interface MessageVolume {
    hour: string;
    received: number;
    sent: number;
}

// --- MOCK DATA GENERATION ---
const locations = ['Main Branch Lobby', 'Downtown Branch', 'Eastside ATM Kiosk', 'Westwood Shopping Mall', 'Mobile Banking Van #3', 'Corporate HQ', 'Data Center B', 'Innovation Lab'];
const deviceTypes: DeviceType[] = ['ATM', 'Point-of-Sale', 'Security Camera', 'GPS Tracker', 'Branch Beacon'];
const deviceStatuses: DeviceStatus[] = ['Online', 'Offline', 'Error', 'Updating'];

const generateMockDevices = (count: number): Device[] => {
    const devices: Device[] = [];
    for (let i = 0; i < count; i++) {
        const type = deviceTypes[i % deviceTypes.length];
        const status = deviceStatuses[Math.floor(Math.random() * 4)];
        devices.push({
            id: `${type.toLowerCase().replace(/-/g, '')}-${String(i).padStart(4, '0')}`,
            name: `${type} #${i + 1}`,
            type: type,
            status: status,
            location: locations[i % locations.length],
            lastMessage: new Date(Date.now() - Math.random() * 1000 * 60 * 60),
            ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            firmwareVersion: `v${Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
            provisionDate: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365),
            telemetry: {
                temperature: type === 'ATM' ? 25 + Math.random() * 10 : undefined,
                transactions: (type === 'ATM' || type === 'Point-of-Sale') ? Math.floor(Math.random() * 1000) : undefined,
                signalStrength: type === 'GPS Tracker' ? -80 + Math.random() * 30 : undefined,
                uptime: Math.floor(Math.random() * 720),
                lastCashCassetteChange: type === 'ATM' ? new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7) : undefined,
                isRecording: type === 'Security Camera' ? Math.random() > 0.1 : undefined,
            },
        });
    }
    return devices;
};

const generateMockAlerts = (devices: Device[]): SecurityAlert[] => {
    const alerts: SecurityAlert[] = [];
    const severities: AlertSeverity[] = ['Critical', 'High', 'Medium', 'Low'];
    const descriptions = [
        'Unusual number of failed login attempts detected.',
        'Device temperature exceeds threshold.',
        'Firmware tampering detected.',
        'Device has gone offline unexpectedly.',
        'High-frequency data exfiltration pattern observed.'
    ];
    for (let i = 0; i < 15; i++) {
        const device = devices[Math.floor(Math.random() * devices.length)];
        alerts.push({
            id: `alert-${String(i).padStart(4, '0')}`,
            timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24),
            deviceId: device.id,
            deviceName: device.name,
            severity: severities[Math.floor(Math.random() * severities.length)],
            description: descriptions[Math.floor(Math.random() * descriptions.length)],
            resolved: Math.random() > 0.5,
        });
    }
    return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const initialAutomationRules: AutomationRule[] = [
    { id: 'rule-001', name: 'ATM Overheating Alert', condition: 'ATM.temperature > 45°C', action: 'Create maintenance ticket & notify admin', isEnabled: true },
    { id: 'rule-002', name: 'POS Offline Notification', condition: 'POS.status == Offline > 5min', action: 'Send SMS to branch manager', isEnabled: true },
    { id: 'rule-003', name: 'Security Camera Tamper', condition: 'Camera.isRecording == false during business hours', action: 'Trigger silent alarm', isEnabled: false },
];


// --- UTILITY & HELPER COMPONENTS ---

const KpiCard: FC<{ title: string; value: string; icon: React.ReactNode; change?: string; changeType?: 'increase' | 'decrease' }> = ({ title, value, icon, change, changeType }) => (
    <Card>
        <div className="flex items-center">
            <div className="p-3 rounded-full bg-gray-700 mr-4">{icon}</div>
            <div>
                <p className="text-sm text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
            {change && (
                <div className={`ml-auto text-sm ${changeType === 'increase' ? 'text-green-400' : 'text-red-400'}`}>
                    {change}
                </div>
            )}
        </div>
    </Card>
);

const StatusIndicator: FC<{ status: DeviceStatus }> = ({ status }) => {
    const statusConfig = {
        Online: { color: 'green-400', icon: <Wifi size={14} /> },
        Offline: { color: 'red-400', icon: <WifiOff size={14} /> },
        Error: { color: 'yellow-400', icon: <AlertTriangle size={14} /> },
        Updating: { color: 'blue-400', icon: <RefreshCw size={14} className="animate-spin" /> },
    };
    const { color, icon } = statusConfig[status];
    return (
        <span className={`flex items-center text-sm text-${color}`}>
            {icon}
            <span className="ml-2">{status}</span>
        </span>
    );
};

const SeverityBadge: FC<{ severity: AlertSeverity }> = ({ severity }) => {
    const severityConfig = {
        Critical: 'bg-red-900 text-red-300',
        High: 'bg-orange-900 text-orange-300',
        Medium: 'bg-yellow-900 text-yellow-300',
        Low: 'bg-blue-900 text-blue-300',
    };
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${severityConfig[severity]}`}>
            {severity}
        </span>
    );
};

const Tabs: FC<{ tabs: Tab[]; activeTab: Tab; onTabClick: (tab: Tab) => void }> = ({ tabs, activeTab, onTabClick }) => (
    <div className="border-b border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onTabClick(tab)}
                    className={`${
                        activeTab === tab
                            ? 'border-indigo-500 text-indigo-400'
                            : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                >
                    {tab}
                </button>
            ))}
        </nav>
    </div>
);


// --- MAIN VIEW COMPONENT ---
const DemoBankIoTHubView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('Overview');
    const [devices, setDevices] = useState<Device[]>([]);
    const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
    const [automationRules, setAutomationRules] = useState<AutomationRule[]>(initialAutomationRules);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate initial data fetch
        setTimeout(() => {
            const mockDevices = generateMockDevices(150);
            setDevices(mockDevices);
            setAlerts(generateMockAlerts(mockDevices));
            setIsLoading(false);
        }, 1500);

        // Simulate real-time updates
        const interval = setInterval(() => {
            setDevices(prevDevices => prevDevices.map(d => {
                if (Math.random() < 0.05) { // 5% chance to change status
                    return { ...d, status: deviceStatuses[Math.floor(Math.random() * deviceStatuses.length)], lastMessage: new Date() };
                }
                return d;
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const summaryStats = useMemo(() => {
        const online = devices.filter(d => d.status === 'Online').length;
        return {
            total: devices.length,
            online,
            offline: devices.filter(d => d.status === 'Offline').length,
            error: devices.filter(d => d.status === 'Error').length,
            updating: devices.filter(d => d.status === 'Updating').length,
            activeAlerts: alerts.filter(a => !a.resolved).length,
        };
    }, [devices, alerts]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-96 text-white"><Cpu size={48} className="animate-pulse" /> Loading IoT Hub Data...</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank IoT Hub</h2>
            <Tabs tabs={['Overview', 'Devices', 'Security', 'Analytics', 'Rules']} activeTab={activeTab} onTabClick={setActiveTab} />
            
            <div className="mt-6">
                {activeTab === 'Overview' && <OverviewTab summary={summaryStats} devices={devices} alerts={alerts} />}
                {activeTab === 'Devices' && <DeviceManagementTab devices={devices} setDevices={setDevices} />}
                {activeTab === 'Security' && <SecurityTab alerts={alerts} setAlerts={setAlerts} />}
                {activeTab === 'Analytics' && <AnalyticsTab devices={devices} />}
                {activeTab === 'Rules' && <AutomationRulesTab rules={automationRules} setRules={setAutomationRules} />}
            </div>
        </div>
    );
};

// --- TAB COMPONENTS ---

const OverviewTab: FC<{ summary: any, devices: Device[], alerts: SecurityAlert[] }> = ({ summary, devices, alerts }) => {
    const deviceStatusData = [
        { name: 'Online', value: summary.online },
        { name: 'Offline', value: summary.offline },
        { name: 'Error', value: summary.error },
        { name: 'Updating', value: summary.updating },
    ];
    const COLORS = ['#4ade80', '#f87171', '#facc15', '#60a5fa'];
    const messageVolumeData: MessageVolume[] = [
        { hour: '12:00', received: 1.2, sent: 0.8 }, { hour: '13:00', received: 1.5, sent: 1.1 },
        { hour: '14:00', received: 1.4, sent: 0.9 }, { hour: '15:00', received: 1.8, sent: 1.3 },
        { hour: '16:00', received: 2.1, sent: 1.5 }, { hour: '17:00', received: 1.9, sent: 1.2 },
    ];
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Total Devices" value={summary.total.toLocaleString()} icon={<Server size={24} className="text-indigo-400" />} />
                <KpiCard title="Online Devices" value={summary.online.toLocaleString()} icon={<Wifi size={24} className="text-green-400" />} />
                <KpiCard title="Active Alerts" value={summary.activeAlerts.toLocaleString()} icon={<AlertTriangle size={24} className="text-red-400" />} />
                <KpiCard title="Messages (24h)" value="10.2M" icon={<BarChart2 size={24} className="text-blue-400" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Message Volume (Millions)" className="lg:col-span-2">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={messageVolumeData}>
                            <XAxis dataKey="hour" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }}/>
                            <Legend />
                            <Bar dataKey="received" name="Device-to-Cloud" fill="#8884d8" stackId="a" />
                            <Bar dataKey="sent" name="Cloud-to-Device" fill="#82ca9d" stackId="a" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Device Status">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={deviceStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {deviceStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }}/>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Recent Critical Alerts">
                     <div className="space-y-4">
                        {alerts.filter(a => !a.resolved && a.severity === 'Critical').slice(0, 4).map(alert => (
                            <div key={alert.id} className="flex items-start">
                                <AlertTriangle className="text-red-500 mt-1 mr-3 flex-shrink-0" size={20} />
                                <div>
                                    <p className="font-semibold text-white">{alert.deviceName}: {alert.description}</p>
                                    <p className="text-sm text-gray-400">{alert.timestamp.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                     </div>
                </Card>
                <Card title="AI-Powered Insights">
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <Bot className="text-teal-400 mt-1 mr-3 flex-shrink-0" size={20} />
                            <div>
                                <p className="font-semibold text-white">Predictive Maintenance</p>
                                <p className="text-sm text-gray-400">ATM-0012 in 'Downtown Branch' shows abnormal temperature fluctuations. Recommend scheduling maintenance within 48 hours to prevent failure.</p>
                            </div>
                        </div>
                         <div className="flex items-start">
                            <Bot className="text-teal-400 mt-1 mr-3 flex-shrink-0" size={20} />
                            <div>
                                <p className="font-semibold text-white">Network Optimization</p>
                                <p className="text-sm text-gray-400">Multiple GPS Trackers in the 'Mobile Banking Van' fleet have low signal strength. Consider upgrading cellular modems for improved reliability.</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const DeviceManagementTab: FC<{ devices: Device[], setDevices: React.Dispatch<React.SetStateAction<Device[]>> }> = ({ devices, setDevices }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const itemsPerPage = 10;

    const filteredDevices = useMemo(() => {
        return devices
            .filter(d => searchTerm ? d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.id.toLowerCase().includes(searchTerm.toLowerCase()) : true)
            .filter(d => statusFilter !== 'All' ? d.status === statusFilter : true)
            .filter(d => typeFilter !== 'All' ? d.type === typeFilter : true);
    }, [devices, searchTerm, statusFilter, typeFilter]);

    const paginatedDevices = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredDevices.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredDevices, currentPage]);

    const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);
    
    const rebootDevice = (deviceId: string) => {
        console.log(`Rebooting ${deviceId}`);
        setDevices(prev => prev.map(d => d.id === deviceId ? {...d, status: 'Updating'} : d));
        setTimeout(() => setDevices(prev => prev.map(d => d.id === deviceId ? {...d, status: 'Online'} : d)), 3000);
    };

    return (
        <Card>
            {selectedDevice && <DeviceDetailsModal device={selectedDevice} onClose={() => setSelectedDevice(null)} />}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input type="text" placeholder="Search devices..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="flex space-x-2">
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="All">All Statuses</option>
                        {deviceStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                     <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="All">All Types</option>
                        {deviceTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                        <tr>
                            <th className="px-6 py-3">Device Name</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Location</th>
                            <th className="px-6 py-3">Last Message</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedDevices.map(d => (
                            <tr key={d.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-white">{d.name}</div>
                                    <div className="text-xs text-gray-500 font-mono">{d.id}</div>
                                </td>
                                <td className="px-6 py-4">{d.type}</td>
                                <td className="px-6 py-4"><StatusIndicator status={d.status} /></td>
                                <td className="px-6 py-4">{d.location}</td>
                                <td className="px-6 py-4">{d.lastMessage.toLocaleTimeString()}</td>
                                <td className="px-6 py-4">
                                    <div className="relative">
                                        <button onClick={() => rebootDevice(d.id)} className="mr-2 p-2 hover:bg-gray-700 rounded-full"><RefreshCw size={16} /></button>
                                        <button onClick={() => setSelectedDevice(d)} className="p-2 hover:bg-gray-700 rounded-full"><MoreVertical size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-400">Showing {paginatedDevices.length} of {filteredDevices.length} devices</span>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-md disabled:opacity-50 enabled:hover:bg-gray-700"><ChevronLeft size={16} /></button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-md disabled:opacity-50 enabled:hover:bg-gray-700"><ChevronRight size={16} /></button>
                </div>
            </div>
        </Card>
    );
};

const DeviceDetailsModal: FC<{ device: Device; onClose: () => void }> = ({ device, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl border border-gray-700">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">{device.name}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold text-gray-300 mb-2">Device Information</h4>
                    <p><strong>ID:</strong> <span className="font-mono">{device.id}</span></p>
                    <p><strong>Type:</strong> {device.type}</p>
                    <p><strong>Status:</strong> <StatusIndicator status={device.status} /></p>
                    <p><strong>Location:</strong> {device.location}</p>
                    <p><strong>IP Address:</strong> {device.ipAddress}</p>
                    <p><strong>Firmware:</strong> {device.firmwareVersion}</p>
                    <p><strong>Provisioned:</strong> {device.provisionDate.toLocaleDateString()}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-300 mb-2">Live Telemetry</h4>
                    {device.telemetry.temperature && <p className="flex items-center"><Thermometer size={16} className="mr-2 text-blue-400" /> Temperature: {device.telemetry.temperature.toFixed(1)}°C</p>}
                    {device.telemetry.transactions && <p className="flex items-center"><Zap size={16} className="mr-2 text-yellow-400" /> Transactions (24h): {device.telemetry.transactions}</p>}
                    {device.telemetry.signalStrength && <p className="flex items-center"><Radio size={16} className="mr-2 text-green-400" /> Signal: {device.telemetry.signalStrength.toFixed(1)} dBm</p>}
                    {device.telemetry.uptime && <p className="flex items-center"><Clock size={16} className="mr-2 text-indigo-400" /> Uptime: {device.telemetry.uptime} hours</p>}
                </div>
            </div>
             <div className="p-6 bg-gray-900/50 rounded-b-lg flex justify-end space-x-3">
                <button className="flex items-center bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition-colors"><RefreshCw size={16} className="mr-2" /> Reboot Device</button>
                <button className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors"><UploadCloud size={16} className="mr-2" /> Push Firmware Update</button>
            </div>
        </div>
    </div>
);


const SecurityTab: FC<{ alerts: SecurityAlert[], setAlerts: React.Dispatch<React.SetStateAction<SecurityAlert[]>> }> = ({ alerts, setAlerts }) => {
    
    const resolveAlert = (alertId: string) => {
        setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, resolved: true } : a));
    };

    return (
        <Card title="Security Center">
            <h3 className="text-xl font-semibold text-white mb-4">Active Alerts</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                        <tr>
                            <th className="px-6 py-3">Timestamp</th>
                            <th className="px-6 py-3">Device</th>
                            <th className="px-6 py-3">Severity</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alerts.filter(a => !a.resolved).map(a => (
                            <tr key={a.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="px-6 py-4">{a.timestamp.toLocaleString()}</td>
                                <td className="px-6 py-4 font-medium text-white">{a.deviceName}</td>
                                <td className="px-6 py-4"><SeverityBadge severity={a.severity} /></td>
                                <td className="px-6 py-4">{a.description}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => resolveAlert(a.id)} className="flex items-center text-green-400 hover:text-green-300">
                                        <CheckCircle size={16} className="mr-1" /> Mark as Resolved
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

const AnalyticsTab: FC<{ devices: Device[] }> = ({ devices }) => {
    const atmData = devices.filter(d => d.type === 'ATM').map((d, i) => ({
        name: d.name,
        temperature: d.telemetry.temperature || 25,
        transactions: d.telemetry.transactions || 0,
        predictedFailure: i % 5 === 0 ? Math.random() * 100 : 0
    }));

    return (
         <div className="space-y-6">
            <Card title="ATM Predictive Maintenance Analytics">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={atmData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis yAxisId="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }}/>
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="temperature" name="Temperature (°C)" stroke="#8884d8" />
                        <Line yAxisId="right" type="monotone" dataKey="predictedFailure" name="Failure Probability (%)" stroke="#ffc658" />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
            <Card title="AI-Generated Strategic Recommendations">
                <div className="flex items-start p-4 bg-gray-900/50 rounded-lg">
                    <BrainCircuit size={40} className="text-indigo-400 mr-4 flex-shrink-0" />
                    <div>
                        <h4 className="text-lg font-semibold text-white">Data-Driven Fleet Optimization</h4>
                        <p className="text-gray-300 mt-1">Analysis of GPS tracker data from Mobile Banking Vans shows significant route overlaps and idle time in the downtown core between 2 PM and 4 PM. We project a 15% reduction in fuel costs and a 10% increase in customer visits by dynamically re-routing Van #3 to the underserved Eastside industrial park during this period.
                        </p>
                        <button className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm">Implement Recommendation</button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

const AutomationRulesTab: FC<{ rules: AutomationRule[], setRules: React.Dispatch<React.SetStateAction<AutomationRule[]>> }> = ({ rules, setRules }) => {
    const toggleRule = (ruleId: string) => {
        setRules(prev => prev.map(r => r.id === ruleId ? {...r, isEnabled: !r.isEnabled} : r));
    };
    
    return (
        <Card title="Automation Rules Engine">
            <div className="flex justify-end mb-4">
                <button className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">
                    <PlusCircle size={16} className="mr-2" /> New Rule
                </button>
            </div>
            <div className="space-y-4">
                {rules.map(rule => (
                    <div key={rule.id} className="p-4 rounded-lg bg-gray-900/50 border border-gray-700 flex items-center justify-between">
                        <div>
                            <p className="font-bold text-white">{rule.name}</p>
                            <p className="text-sm text-gray-400 font-mono"><span className="text-cyan-400">IF</span> {rule.condition} <span className="text-cyan-400">THEN</span> {rule.action}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="text-gray-400 hover:text-white">Edit</button>
                            <label htmlFor={`toggle-${rule.id}`} className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input type="checkbox" id={`toggle-${rule.id}`} className="sr-only" checked={rule.isEnabled} onChange={() => toggleRule(rule.id)} />
                                    <div className={`block w-14 h-8 rounded-full ${rule.isEnabled ? 'bg-indigo-600' : 'bg-gray-600'}`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${rule.isEnabled ? 'translate-x-6' : ''}`}></div>
                                </div>
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};


export default DemoBankIoTHubView;