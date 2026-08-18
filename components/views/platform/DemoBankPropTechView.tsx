// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankPropTechView.tsx
================================================================================

// components/views/platform/DemoBankPropTechView.tsx
import React, { useState, useMemo, FC } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FiHome, FiTool, FiDollarSign, FiUsers, FiSearch, FiMapPin, FiCpu, FiMessageSquare, FiX, FiExternalLink } from 'react-icons/fi';

// Fix for default Leaflet icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


// --- TYPE DEFINITIONS ---
interface Tenant {
    id: number;
    name: string;
    leaseStart: string;
    leaseEnd: string;
    contact: string;
}

interface MaintenanceRequest {
    id: number;
    propertyId: number;
    description: string;
    status: 'New' | 'In Progress' | 'Completed';
    priority: 'Low' | 'Medium' | 'High' | 'Emergency';
    category?: string; // AI-suggested
    reportedDate: string;
    cost: number;
}

interface Financials {
    purchasePrice: number;
    mortgage: number;
    propertyTax: number;
    insurance: number;
    monthlyRevenue: { date: string; amount: number }[];
}

interface Property {
    id: number;
    address: string;
    city: string;
    status: 'Occupied' | 'Vacant' | 'Maintenance';
    rent: number;
    type: 'Apartment' | 'House' | 'Commercial';
    beds: number;
    baths: number;
    sqft: number;
    amenities: string[];
    imageUrl: string;
    location: { lat: number; lng: number };
    tenant?: Tenant;
    maintenanceHistory: MaintenanceRequest[];
    financials: Financials;
}

// --- MOCK DATA ---
// NOTE: In a real app, this data would come from a dedicated API and database.
const propertiesData: Property[] = [
    {
        id: 1,
        address: '123 Cyberpunk Ave, Unit 42',
        city: 'Neo-Kyoto',
        status: 'Occupied',
        rent: 4500,
        type: 'Apartment',
        beds: 2,
        baths: 2,
        sqft: 1200,
        amenities: ['Rooftop Pool', 'Smart Home System', 'Gym', 'City View'],
        imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop',
        location: { lat: 34.0522, lng: -118.2437 },
        tenant: { id: 101, name: 'John Matrix', leaseStart: '2023-01-15', leaseEnd: '2025-01-14', contact: 'john.matrix@example.com' },
        maintenanceHistory: [
            { id: 1001, propertyId: 1, description: 'Leaky faucet in master bath', status: 'Completed', priority: 'Medium', category: 'Plumbing', reportedDate: '2024-03-10', cost: 150 },
            { id: 1002, propertyId: 1, description: 'Smart lock malfunctioning', status: 'Completed', priority: 'High', category: 'Electrical', reportedDate: '2024-05-22', cost: 250 },
        ],
        financials: { purchasePrice: 750000, mortgage: 3200, propertyTax: 625, insurance: 125, monthlyRevenue: [{ date: '2024-07', amount: 4500 }, { date: '2024-06', amount: 4500 }] },
    },
    {
        id: 2,
        address: '456 Neo-Tokyo Blvd',
        city: 'Neo-Kyoto',
        status: 'Vacant',
        rent: 3200,
        type: 'Apartment',
        beds: 1,
        baths: 1,
        sqft: 850,
        amenities: ['Balcony', 'In-unit Laundry', 'Concierge'],
        imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2074&auto=format&fit=crop',
        location: { lat: 34.0600, lng: -118.2500 },
        maintenanceHistory: [],
        financials: { purchasePrice: 550000, mortgage: 2100, propertyTax: 458, insurance: 100, monthlyRevenue: [] },
    },
    {
        id: 3,
        address: '789 Synthwave St',
        city: 'Aethelburg',
        status: 'Maintenance',
        rent: 2800,
        type: 'House',
        beds: 3,
        baths: 2,
        sqft: 1800,
        amenities: ['Backyard', 'Garage', 'Fireplace'],
        imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2e0?q=80&w=2070&auto=format&fit=crop',
        location: { lat: 34.0450, lng: -118.2300 },
        maintenanceHistory: [
            { id: 1003, propertyId: 3, description: 'HVAC unit not cooling', status: 'In Progress', priority: 'High', category: 'HVAC', reportedDate: '2024-07-15', cost: 0 },
        ],
        financials: { purchasePrice: 680000, mortgage: 2900, propertyTax: 560, insurance: 110, monthlyRevenue: [{ date: '2024-06', amount: 2800 }, { date: '2024-05', amount: 2800 }] },
    },
];

const maintenanceData: MaintenanceRequest[] = [
    ...propertiesData.flatMap(p => p.maintenanceHistory),
    { id: 1004, propertyId: 1, description: 'Window seal broken in living room.', status: 'New', priority: 'Medium', reportedDate: '2024-07-20', cost: 0 }
];


// --- UI SUB-COMPONENTS ---

const StatCard: FC<{ title: string; value: string; icon: React.ReactElement }> = ({ title, value, icon }) => (
    <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg border border-gray-700 flex items-center space-x-4">
        <div className="text-3xl text-cyan-400">{icon}</div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const AIListingGeneratorModal: FC<{ features: string; onClose: () => void }> = ({ features: initialFeatures, onClose }) => {
    const [features, setFeatures] = useState(initialFeatures);
    const [tone, setTone] = useState('Exciting and Modern');
    const [generatedDesc, setGeneratedDesc] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedDesc('');
        if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
            setGeneratedDesc("Error: API key not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.");
            setIsLoading(false);
            return;
        }
        try {
            const ai = new GoogleGenAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
            const model = ai.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `You are a creative real estate copywriter. Write a property listing description with a ${tone} tone. Based on these features: ${features}. The description should be engaging, well-structured with a catchy title, a main paragraph, and a bulleted list of key features.`;
            const result = await model.generateContent(prompt);
            const response = result.response;
            setGeneratedDesc(response.text());
        } catch (error) {
            console.error(error);
            setGeneratedDesc("Error: Could not generate description. Check the API key and console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full border border-gray-700 transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white flex items-center"><FiCpu className="mr-2 text-cyan-400"/>AI Listing Description Generator</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><FiX size={20}/></button>
                </div>
                <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div>
                        <label className="text-sm font-medium text-gray-300">Property Features</label>
                        <textarea value={features} onChange={e => setFeatures(e.target.value)} placeholder="Enter property features..." className="w-full h-24 bg-gray-700/50 p-2 rounded text-white mt-1 border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-300">Writing Tone</label>
                        <select value={tone} onChange={e => setTone(e.target.value)} className="w-full bg-gray-700/50 p-2 rounded text-white mt-1 border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none">
                            <option>Exciting and Modern</option>
                            <option>Luxurious and Elegant</option>
                            <option>Cozy and Family-Friendly</option>
                            <option>Professional and Concise</option>
                        </select>
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50 transition-colors font-semibold text-white">
                        {isLoading ? 'Generating...' : 'Generate Description'}
                    </button>
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                        <h4 className="font-semibold text-white mb-2">Generated Description</h4>
                        <div className="min-h-[10rem] max-h-60 overflow-y-auto text-sm text-gray-300 prose prose-invert max-w-none whitespace-pre-wrap">
                            {isLoading ? <div className="animate-pulse">Generating creative copy...</div> : generatedDesc || "AI output will appear here..."}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PropertyDetailModal: FC<{ property: Property, onClose: () => void }> = ({ property, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full border border-gray-700 transform transition-all max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                     <h3 className="text-xl font-semibold text-white">{property.address}</h3>
                     <button onClick={onClose} className="text-gray-400 hover:text-white"><FiX size={24}/></button>
                </div>
                <div className="p-6 space-y-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <img src={property.imageUrl} alt={property.address} className="rounded-lg object-cover w-full h-64" />
                            <div className="mt-4 h-64 rounded-lg overflow-hidden border border-gray-700">
                                <MapContainer center={[property.location.lat, property.location.lng]} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                    />
                                    <Marker position={[property.location.lat, property.location.lng]}>
                                        <Popup>{property.address}</Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        </div>
                        <div className="space-y-4">
                             <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                                 <h4 className="font-semibold text-white mb-2">Property Details</h4>
                                 <ul className="text-sm text-gray-300 space-y-2">
                                     <li><strong>Type:</strong> {property.type}</li>
                                     <li><strong>Rent:</strong> ${property.rent.toLocaleString()}/mo</li>
                                     <li><strong>Specs:</strong> {property.beds} bed, {property.baths} bath, {property.sqft} sqft</li>
                                     <li><strong>Amenities:</strong> {property.amenities.join(', ')}</li>
                                 </ul>
                             </div>
                             <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                                 <h4 className="font-semibold text-white mb-2">Tenant Information</h4>
                                 {property.tenant ? (
                                    <ul className="text-sm text-gray-300 space-y-2">
                                        <li><strong>Name:</strong> {property.tenant.name}</li>
                                        <li><strong>Lease End:</strong> {property.tenant.leaseEnd}</li>
                                        <li><strong>Contact:</strong> {property.tenant.contact}</li>
                                    </ul>
                                 ) : <p className="text-sm text-yellow-400">Currently Vacant</p>}
                             </div>
                              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                                <h4 className="font-semibold text-white mb-2 flex items-center"><FiCpu className="mr-2 text-cyan-400"/>AI Rent Advisor</h4>
                                {property.status === 'Vacant' ? (
                                    <p className="text-sm text-green-300">Suggested Rent: <strong>${(property.rent * 1.05).toLocaleString()}</strong> (Based on market trends & amenities)</p>
                                ) : (
                                    <p className="text-sm text-gray-400">Rent analysis available for vacant properties.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN VIEW COMPONENT ---

const DemoBankPropTechView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [isGeneratorOpen, setGeneratorOpen] = useState(false);

    const filteredProperties = useMemo(() => {
        return propertiesData.filter(p =>
            p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.city.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);
    
    const occupancyRate = (propertiesData.filter(p => p.status === 'Occupied').length / propertiesData.length) * 100;
    const portfolioValue = propertiesData.reduce((sum, p) => sum + p.financials.purchasePrice, 0);
    const openMaintenanceTickets = maintenanceData.filter(t => t.status !== 'Completed').length;
    
    const financialChartData = [
        { name: 'Jan', revenue: 11000, expenses: 8000 },
        { name: 'Feb', revenue: 11000, expenses: 8200 },
        { name: 'Mar', revenue: 11000, expenses: 8550 },
        { name: 'Apr', revenue: 11000, expenses: 8100 },
        { name: 'May', revenue: 8200, expenses: 8300 },
        { name: 'Jun', revenue: 8200, expenses: 8400 },
        { name: 'Jul', revenue: 4500, expenses: 9000 },
    ];

    const maintenanceStatusData = [
        { name: 'New', value: maintenanceData.filter(t => t.status === 'New').length },
        { name: 'In Progress', value: maintenanceData.filter(t => t.status === 'In Progress').length },
        { name: 'Completed', value: maintenanceData.filter(t => t.status === 'Completed').length },
    ];
    const PIE_COLORS = ['#34D399', '#FBBF24', '#60A5FA'];

    const renderStatusBadge = (status: Property['status']) => {
        const colorMap = {
            Occupied: 'bg-green-500/20 text-green-300',
            Vacant: 'bg-yellow-500/20 text-yellow-300',
            Maintenance: 'bg-blue-500/20 text-blue-300',
        };
        return <span className={`px-2 py-1 text-xs rounded-full ${colorMap[status]}`}>{status}</span>;
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <FiHome/> },
        { id: 'properties', label: 'Properties', icon: <FiUsers/> },
        { id: 'maintenance', label: 'Maintenance', icon: <FiTool/> },
    ];

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank PropTech</h2>
                     <button onClick={() => setGeneratorOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium flex items-center">
                       <FiCpu className="mr-2"/> AI Listing Generator
                    </button>
                </div>
                
                <div className="border-b border-gray-700">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${
                                    activeTab === tab.id
                                        ? 'border-cyan-500 text-cyan-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <StatCard title="Occupancy Rate" value={`${occupancyRate.toFixed(1)}%`} icon={<FiHome/>} />
                           <StatCard title="Open Maintenance Tickets" value={openMaintenanceTickets.toString()} icon={<FiTool/>} />
                           <StatCard title="Estimated Portfolio Value" value={`$${(portfolioValue / 1_000_000).toFixed(1)}M`} icon={<FiDollarSign/>} />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-lg shadow-lg border border-gray-700">
                                <h3 className="text-lg font-semibold text-white mb-4">Revenue vs. Expenses</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={financialChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                                        <XAxis dataKey="name" stroke="#A0AEC0" />
                                        <YAxis stroke="#A0AEC0" />
                                        <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}/>
                                        <Legend />
                                        <Bar dataKey="revenue" fill="#38B2AC" />
                                        <Bar dataKey="expenses" fill="#E53E3E" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                             <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg border border-gray-700">
                                <h3 className="text-lg font-semibold text-white mb-4">Maintenance Status</h3>
                                 <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={maintenanceStatusData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                            {maintenanceStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                                        </Pie>
                                         <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'properties' && (
                     <div className="space-y-4 animate-fadeIn">
                        <div className="relative">
                            <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder="Search by address or city..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-gray-700/50 p-2 pl-10 rounded text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none" />
                        </div>
                        <div className="bg-gray-800/50 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-400">
                                    <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                                        <tr>
                                            <th className="px-6 py-3">Address</th>
                                            <th className="px-6 py-3">Type</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Monthly Rent</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProperties.map(p => (
                                            <tr key={p.id} className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer" onClick={() => setSelectedProperty(p)}>
                                                <td className="px-6 py-4 font-medium text-white">{p.address}</td>
                                                <td className="px-6 py-4">{p.type}</td>
                                                <td className="px-6 py-4">{renderStatusBadge(p.status)}</td>
                                                <td className="px-6 py-4 font-mono">${p.rent.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-right"><FiExternalLink/></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                     </div>
                )}

                {activeTab === 'maintenance' && (
                     <div className="space-y-4 animate-fadeIn">
                          <div className="bg-gray-800/50 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
                             <div className="overflow-x-auto">
                                 <table className="w-full text-sm text-left text-gray-400">
                                     <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                                         <tr>
                                             <th className="px-6 py-3">Property</th>
                                             <th className="px-6 py-3">Issue</th>
                                             <th className="px-6 py-3">Status</th>
                                             <th className="px-6 py-3">AI Priority</th>
                                             <th className="px-6 py-3">Reported</th>
                                         </tr>
                                     </thead>
                                     <tbody>
                                         {maintenanceData.map(m => (
                                             <tr key={m.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                                 <td className="px-6 py-4 font-medium text-white">{propertiesData.find(p=>p.id === m.propertyId)?.address}</td>
                                                 <td className="px-6 py-4">{m.description}</td>
                                                 <td className="px-6 py-4">{m.status}</td>
                                                 <td className="px-6 py-4">{m.priority}</td>
                                                 <td className="px-6 py-4">{m.reportedDate}</td>
                                             </tr>
                                         ))}
                                     </tbody>
                                 </table>
                             </div>
                         </div>
                     </div>
                )}
            </div>
             {isGeneratorOpen && <AIListingGeneratorModal features="2 bed, 2 bath, downtown, balcony with city view, newly renovated kitchen, rooftop pool" onClose={() => setGeneratorOpen(false)} />}
             {selectedProperty && <PropertyDetailModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />}
        </>
    );
};

export default DemoBankPropTechView;