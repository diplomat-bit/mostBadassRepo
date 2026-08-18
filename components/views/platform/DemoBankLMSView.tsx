// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankLMSView.tsx
================================================================================

```typescript
// components/views/platform/DemoBankLMSView.tsx
import React, { useState, useContext, useEffect, useMemo, useCallback, useRef, createContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import { FaBook, FaUsers, FaChartBar, FaCogs, FaTachometerAlt, FaPlus, FaEdit, FaTrash, FaVideo, FaFileAlt, FaQuestionCircle, FaSave, FaTimes, FaSpinner, FaBullhorn, FaGraduationCap, FaAward } from 'react-icons/fa';

import Card from '../../Card';
import { DataContext } from '../../../context/DataContext';
import { GoogleGenAI, Type } from "@google/genai";
import { Course, User, Enrollment, Module, Lesson, Quiz, Question, Assignment, Submission, Report, SystemSettings, Notification, GamificationStats, AuditLog, ContentType } from '../../../types';

// =================================================================================================
// 1. ENHANCED TYPES & INTERFACES
// In a real app, these would be in separate files.
// =================================================================================================

export type DetailedCourse = Course & {
    modules: DetailedModule[];
    instructors: User[];
    assignments: Assignment[];
    forumThreads: ForumThread[];
    resources: CourseResource[];
    tags: string[];
};

export type DetailedModule = Module & {
    lessons: DetailedLesson[];
};

export type DetailedLesson = Lesson & {
    quiz?: Quiz;
    videoUrl?: string;
    attachments?: CourseResource[];
};

export type ForumThread = {
    id: string;
    courseId: string;
    title: string;
    author: User;
    createdAt: Date;
    posts: ForumPost[];
};

export type ForumPost = {
    id: string;
    author: User;
    content: string;
    createdAt: Date;
};

export type CourseResource = {
    id: string;
    title: string;
    type: 'pdf' | 'video' | 'link' | 'scorm';
    url: string;
};

export type UserProfile = User & {
    enrollments: Enrollment[];
    submissions: Submission[];
    gamification: GamificationStats;
    activity: AuditLog[];
    bio: string;
    avatarUrl: string;
};

export type QuizSubmission = {
    quizId: string;
    userId: string;
    answers: { questionId: string; answer: string | string[] }[];
    submittedAt: Date;
    score?: number;
};

// =================================================================================================
// 2. MOCK DATA GENERATION
// Simulates a realistic backend database.
// =================================================================================================

const generateMockUsers = (count: number): UserProfile[] => {
    const firstNames = ['John', 'Jane', 'Peter', 'Alice', 'Michael', 'Emily', 'David', 'Sarah', 'Chris', 'Laura'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const roles: ('Learner' | 'Instructor' | 'Admin')[] = ['Learner', 'Instructor', 'Admin'];
    return Array.from({ length: count }, (_, i) => ({
        id: `user_${i + 1}`,
        name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
        email: `user${i + 1}@demobank.com`,
        role: roles[i % roles.length],
        enrollments: [],
        submissions: [],
        gamification: { points: Math.floor(Math.random() * 5000), badges: [] },
        activity: [],
        bio: `A dedicated ${roles[i % roles.length]} passionate about continuous learning and finance.`,
        avatarUrl: `https://i.pravatar.cc/150?u=user${i + 1}`,
    }));
};

const generateMockDetailedCourses = (baseCourses: Course[], users: UserProfile[]): DetailedCourse[] => {
    const courseTags = ['Finance', 'Compliance', 'Technology', 'Sales', 'Onboarding', 'Risk Management', 'Leadership'];
    return baseCourses.map((course, courseIndex) => {
        const modules: DetailedModule[] = Array.from({ length: 4 + courseIndex % 3 }, (_, moduleIndex) => ({
            id: `mod_${course.id}_${moduleIndex + 1}`,
            title: `Module ${moduleIndex + 1}: ${course.title} Fundamentals`,
            lessons: Array.from({ length: 5 + moduleIndex % 4 }, (_, lessonIndex) => {
                const lessonType = (lessonIndex % 3 === 0 ? 'video' : lessonIndex % 3 === 1 ? 'text' : 'quiz') as ContentType;
                const lesson: DetailedLesson = {
                    id: `les_${course.id}_${moduleIndex}_${lessonIndex + 1}`,
                    title: `Lesson ${lessonIndex + 1}: Introduction to Topic ${lessonIndex + 1}`,
                    contentType: lessonType,
                    content: `This is the detailed content for lesson ${lessonIndex + 1}. It covers key concepts and provides practical examples.`,
                    durationMinutes: 10 + Math.floor(Math.random() * 20),
                    videoUrl: lessonType === 'video' ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : undefined,
                };
                if (lessonType === 'quiz') {
                    lesson.quiz = {
                        id: `quiz_${lesson.id}`,
                        title: `Knowledge Check for Lesson ${lessonIndex + 1}`,
                        questions: [
                            { id: `q_${lesson.id}_1`, text: 'What is the primary topic of this lesson?', type: 'multiple-choice', options: ['A', 'B', 'C', 'D'] },
                            { id: `q_${lesson.id}_2`, text: 'Explain the key concept in your own words.', type: 'text' },
                        ]
                    };
                }
                return lesson;
            }),
        }));
        return {
            ...course,
            description: `A deep dive into ${course.title}. This course covers everything from the basics to advanced topics, preparing you for real-world challenges in the banking sector.`,
            instructors: users.filter(u => u.role === 'Instructor').slice(courseIndex % 3, courseIndex % 3 + 2),
            modules,
            assignments: [],
            forumThreads: [],
            resources: [],
            tags: [courseTags[courseIndex % courseTags.length], courseTags[(courseIndex + 2) % courseTags.length]]
        };
    });
};

// =================================================================================================
// 3. UTILITY HOOKS & FUNCTIONS
// =================================================================================================

const usePagination = <T,>(items: T[], itemsPerPage: number = 10) => {
    const [currentPage, setCurrentPage] = useState(1);
    const maxPage = Math.ceil(items.length / itemsPerPage);

    const currentData = useMemo(() => {
        const begin = (currentPage - 1) * itemsPerPage;
        const end = begin + itemsPerPage;
        return items.slice(begin, end);
    }, [items, currentPage, itemsPerPage]);

    const next = () => setCurrentPage(page => Math.min(page + 1, maxPage));
    const prev = () => setCurrentPage(page => Math.max(page - 1, 1));
    const jump = (page: number) => {
        const pageNumber = Math.max(1, page);
        setCurrentPage(Math.min(pageNumber, maxPage));
    };

    return { next, prev, jump, currentData, currentPage, maxPage, setCurrentPage };
};

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

const NotificationContext = createContext<{ addNotification: (message: string, type?: 'success' | 'error') => void } | null>(null);

const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<{ id: number; message: string; type: 'success' | 'error' }[]>([]);

    const addNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        const id = new Date().getTime();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    }, []);

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            <div className="fixed bottom-5 right-5 z-[100] space-y-2">
                {notifications.map(n => (
                    <div key={n.id} className={`px-4 py-2 rounded-lg shadow-lg text-white ${n.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                        {n.message}
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotification must be used within a NotificationProvider");
    return context;
};

// =================================================================================================
// 4. API SIMULATION LAYER
// =================================================================================================

class LmsApiSimulator {
    private users: UserProfile[];
    private courses: DetailedCourse[];
    private enrollments: Map<string, Enrollment[]> = new Map();
    private submissions: QuizSubmission[] = [];

    constructor(initialCourses: Course[]) {
        this.users = generateMockUsers(100);
        this.courses = generateMockDetailedCourses(initialCourses, this.users);
        this.courses.forEach(course => {
            const courseEnrollments: Enrollment[] = this.users
                .filter(user => Math.random() > 0.5 && user.role === 'Learner')
                .map(user => ({
                    userId: user.id,
                    courseId: course.id,
                    enrollmentDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                    progress: Math.floor(Math.random() * 101),
                    status: Math.random() > 0.8 ? 'Completed' : 'In Progress',
                }));
            this.enrollments.set(course.id, courseEnrollments);
        });
    }

    private async simulateDelay(ms: number) {
        return new Promise(res => setTimeout(res, ms));
    }

    async getUsers(page: number = 1, limit: number = 10, filter: string = ''): Promise<{ data: UserProfile[], total: number }> {
        await this.simulateDelay(300);
        const filteredUsers = this.users.filter(u => u.name.toLowerCase().includes(filter.toLowerCase()) || u.email.toLowerCase().includes(filter.toLowerCase()));
        return { data: filteredUsers.slice((page - 1) * limit, page * limit), total: filteredUsers.length };
    }
    
    async updateUser(userData: UserProfile): Promise<UserProfile> {
        await this.simulateDelay(500);
        const index = this.users.findIndex(u => u.id === userData.id);
        if (index === -1) throw new Error("User not found");
        this.users[index] = { ...this.users[index], ...userData };
        return this.users[index];
    }

    async getCourses(filter: string = ''): Promise<DetailedCourse[]> {
        await this.simulateDelay(300);
        return this.courses.filter(c => c.title.toLowerCase().includes(filter.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())));
    }

    async getCourseDetails(courseId: string): Promise<DetailedCourse | undefined> {
        await this.simulateDelay(400);
        return this.courses.find(c => c.id === courseId);
    }
    
    async getEnrollmentsForCourse(courseId: string): Promise<Enrollment[]> {
        await this.simulateDelay(250);
        return this.enrollments.get(courseId) || [];
    }

    async updateCourse(courseData: DetailedCourse): Promise<DetailedCourse> {
        await this.simulateDelay(500);
        const index = this.courses.findIndex(c => c.id === courseData.id);
        if (index !== -1) {
            this.courses[index] = courseData;
            return courseData;
        }
        throw new Error("Course not found");
    }

    async submitQuiz(submission: QuizSubmission): Promise<{ score: number }> {
        await this.simulateDelay(700);
        const score = Math.floor(Math.random() * 101);
        this.submissions.push({ ...submission, score });
        return { score };
    }
    
    async getDashboardMetrics(): Promise<any> {
        await this.simulateDelay(600);
        const totalUsers = this.users.length;
        const totalCourses = this.courses.length;
        let totalEnrollments = 0;
        let totalCompletions = 0;
        this.enrollments.forEach(enrolls => {
            totalEnrollments += enrolls.length;
            totalCompletions += enrolls.filter(e => e.status === 'Completed').length;
        });
        const averageCompletion = totalEnrollments > 0 ? (totalCompletions / totalEnrollments) * 100 : 0;
        
        // Generate monthly enrollment data for the last 6 months
        const enrollmentHistory = Array.from({ length: 6 }, (_, i) => {
            const month = new Date();
            month.setMonth(month.getMonth() - i);
            return { name: format(month, 'MMM'), enrollments: Math.floor(Math.random() * 500) + 100 };
        }).reverse();

        return {
            totalUsers,
            totalCourses,
            totalEnrollments,
            averageCompletionRate: averageCompletion.toFixed(1),
            enrollmentHistory,
        };
    }
}


// =================================================================================================
// 5. UI COMPONENTS
// =================================================================================================

// --- 5.1 Shared Components ---

const Icon: React.FC<{ icon: React.ElementType, className?: string }> = ({ icon: IconComponent, className }) => <IconComponent className={className} />;

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-8">
        <FaSpinner className="animate-spin text-cyan-400 text-4xl" />
    </div>
);

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full border border-gray-700" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white"><FaTimes /></button>
            </div>
            <div className="p-6">{children}</div>
        </div>
    </div>
);


// --- 5.2 Navigation ---

type ViewType = 'dashboard' | 'courses' | 'users' | 'analytics' | 'settings';

const MainNav: React.FC<{ activeView: ViewType; setActiveView: (view: ViewType) => void }> = ({ activeView, setActiveView }) => {
    const navItems: { id: ViewType; label: string; icon: React.ElementType }[] = [
        { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt },
        { id: 'courses', label: 'Courses', icon: FaBook },
        { id: 'users', label: 'Users', icon: FaUsers },
        { id: 'analytics', label: 'Analytics', icon: FaChartBar },
        { id: 'settings', label: 'Settings', icon: FaCogs },
    ];

    return (
        <div className="bg-gray-900/50 rounded-lg p-2 mb-6">
            <nav className="flex space-x-2">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                            activeView === item.id 
                                ? 'bg-cyan-600 text-white' 
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        <Icon icon={item.icon} className="mr-2" />
                        {item.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

// --- 5.3 Main Views ---

const DashboardView: React.FC<{api: LmsApiSimulator}> = ({api}) => {
    const [metrics, setMetrics] = useState<any>(null);
    useEffect(() => { api.getDashboardMetrics().then(setMetrics); }, [api]);

    if (!metrics) return <LoadingSpinner />;

    const COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f97316'];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Total Users"><p className="text-4xl font-bold text-white">{metrics.totalUsers.toLocaleString()}</p></Card>
                <Card title="Total Courses"><p className="text-4xl font-bold text-white">{metrics.totalCourses.toLocaleString()}</p></Card>
                <Card title="Total Enrollments"><p className="text-4xl font-bold text-white">{metrics.totalEnrollments.toLocaleString()}</p></Card>
                <Card title="Avg. Completion"><p className="text-4xl font-bold text-white">{metrics.averageCompletionRate}%</p></Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Enrollment Trends (Last 6 Months)">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={metrics.enrollmentHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                            <Legend />
                            <Line type="monotone" dataKey="enrollments" stroke="#06b6d4" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Course Categories">
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={[{name: 'Finance', value: 400}, {name: 'Tech', value: 300}, {name: 'Compliance', value: 300}, {name: 'Sales', value: 200}]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                                {[{name: 'Finance', value: 400}, {name: 'Tech', value: 300}, {name: 'Compliance', value: 300}, {name: 'Sales', value: 200}].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};


const CourseManagementView: React.FC<{ courses: DetailedCourse[], onSelectCourse: (id: string) => void }> = ({ courses, onSelectCourse }) => {
    const { currentData, currentPage, maxPage, jump } = usePagination(courses);

    return (
        <Card title="Course Catalog">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                        <tr>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Instructors</th>
                            <th className="px-6 py-3">Modules</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map(c => (
                            <tr key={c.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="px-6 py-4 font-medium text-white">{c.title}</td>
                                <td className="px-6 py-4">{c.category}</td>
                                <td className="px-6 py-4">{c.instructors.map(i => i.name).join(', ')}</td>
                                <td className="px-6 py-4">{c.modules.length}</td>
                                <td className="px-6 py-4 space-x-2">
                                    <button onClick={() => onSelectCourse(c.id)} className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold">View Details</button>
                                    <button className="text-yellow-400 hover:text-yellow-300 text-xs font-semibold">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center p-4">
                <span className="text-sm text-gray-400">Page {currentPage} of {maxPage}</span>
                <div className="space-x-2">
                    <button onClick={() => jump(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50">Prev</button>
                    <button onClick={() => jump(currentPage + 1)} disabled={currentPage === maxPage} className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50">Next</button>
                </div>
            </div>
        </Card>
    );
};


const UserManagementView: React.FC<{ api: LmsApiSimulator }> = ({ api }) => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const itemsPerPage = 10;
    const maxPage = Math.ceil(totalUsers / itemsPerPage);

    useEffect(() => {
        setLoading(true);
        api.getUsers(currentPage, itemsPerPage, debouncedSearchTerm).then(({ data, total }) => {
            setUsers(data);
            setTotalUsers(total);
            setLoading(false);
        });
    }, [api, currentPage, debouncedSearchTerm]);
    
    useEffect(() => { setCurrentPage(1); }, [debouncedSearchTerm]);


    const jump = (page: number) => {
        const pageNumber = Math.max(1, page);
        setCurrentPage(Math.min(pageNumber, maxPage));
    };

    return (
        <Card title="User Management">
            <div className="p-4"><input type="text" placeholder="Search users by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-gray-700/50 p-2 rounded text-white"/></div>
            <div className="overflow-x-auto">
                 {loading ? <LoadingSpinner/> : (
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30"><tr><th className="px-6 py-3">Name</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Role</th><th className="px-6 py-3">Actions</th></tr></thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-medium text-white flex items-center"><img src={u.avatarUrl} alt={u.name} className="h-8 w-8 rounded-full mr-3" /> {u.name}</td>
                                    <td className="px-6 py-4">{u.email}</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${u.role === 'Admin' ? 'bg-red-500/50 text-red-200' : u.role === 'Instructor' ? 'bg-blue-500/50 text-blue-200' : 'bg-green-500/50 text-green-200'}`}>{u.role}</span></td>
                                    <td className="px-6 py-4 space-x-2"><button className="text-cyan-400 hover:text-cyan-300 text-xs">Profile</button><button className="text-yellow-400 hover:text-yellow-300 text-xs">Edit</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 )}
            </div>
             <div className="flex justify-between items-center p-4">
                <span className="text-sm text-gray-400">Page {currentPage} of {maxPage} ({totalUsers} users)</span>
                <div className="space-x-2"><button onClick={() => jump(currentPage - 1)} disabled={currentPage === 1 || loading} className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50">Prev</button><button onClick={() => jump(currentPage + 1)} disabled={currentPage === maxPage || loading} className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50">Next</button></div>
            </div>
        </Card>
    );
};

const AnalyticsView: React.FC = () => (
    <Card title="Analytics & Reporting">
        <div className="p-6">
            <p className="text-gray-400 mb-6">Detailed reports on course completions, user engagement, and quiz performance.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card title="Completions by Department">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={[{name: 'Sales', completions: 120}, {name: 'Engineering', completions: 250}, {name: 'HR', completions: 80}, {name: 'Marketing', completions: 150}]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                            <Bar dataKey="completions" fill="#8b5cf6" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                 <Card title="User Activity (Last 30 Days)">
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={Array.from({length: 30}, (_, i) => ({name: `${i+1}`, logins: Math.floor(Math.random()*100)+200}))}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                            <Line type="monotone" dataKey="logins" stroke="#ec4899" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    </Card>
);

const SettingsView: React.FC = () => (
    <Card title="System Settings">
        <div className="p-6 space-y-8">
            <div>
                <h4 className="text-lg font-semibold text-white">Branding</h4>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm text-gray-300">Company Name</label><input type="text" defaultValue="Demo Bank" className="w-full mt-1 bg-gray-700/50 p-2 rounded text-white" /></div>
                    <div><label className="block text-sm text-gray-300">Logo Upload</label><input type="file" className="w-full mt-1 bg-gray-700/50 p-1.5 rounded text-gray-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"/></div>
                </div>
            </div>
             <div>
                <h4 className="text-lg font-semibold text-white">Notifications</h4>
                <div className="mt-4 space-y-2">
                     <label className="flex items-center space-x-2"><input type="checkbox" className="form-checkbox bg-gray-700 border-gray-600" defaultChecked /><span className="text-sm text-gray-300">Email users on new enrollment</span></label>
                     <label className="flex items-center space-x-2"><input type="checkbox" className="form-checkbox bg-gray-700 border-gray-600" defaultChecked /><span className="text-sm text-gray-300">Send weekly progress reminders</span></label>
                </div>
            </div>
            <div>
                <h4 className="text-lg font-semibold text-white">Integrations</h4>
                 <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between"><span className="text-gray-300">Slack</span><button className="px-3 py-1 bg-green-600 text-white rounded text-sm">Connect</button></div>
                    <div className="flex items-center justify-between"><span className="text-gray-300">Microsoft Teams</span><button className="px-3 py-1 bg-gray-600 text-white rounded text-sm disabled:opacity-50" disabled>Connected</button></div>
                 </div>
            </div>
        </div>
    </Card>
);


// --- 5.4 Course Detail View ---
const CourseDetailView: React.FC<{ courseId: string; api: LmsApiSimulator; onBack: () => void }> = ({ courseId, api, onBack }) => {
    const [course, setCourse] = useState<DetailedCourse | null>(null);
    const [activeLesson, setActiveLesson] = useState<DetailedLesson | null>(null);

    useEffect(() => {
        api.getCourseDetails(courseId).then(data => {
            if (data) {
                setCourse(data);
                // Set first lesson as active by default
                if (data.modules[0]?.lessons[0]) {
                    setActiveLesson(data.modules[0].lessons[0]);
                }
            }
        });
    }, [courseId, api]);

    if (!course) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <button onClick={onBack} className="text-cyan-400 hover:text-cyan-300 mb-2 text-sm">&larr; Back to Courses</button>
                    <h2 className="text-3xl font-bold text-white">{course.title}</h2>
                    <p className="text-gray-400 mt-1">{course.description}</p>
                    <div className="mt-2 text-sm text-gray-500">Instructors: {course.instructors.map(i => i.name).join(', ')}</div>
                </div>
                <div className="text-right flex-shrink-0">
                    <p className="text-lg text-white">Your Progress</p>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${course.completionRate}%` }}></div>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{course.completionRate}% Complete</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title={activeLesson?.title || "Select a Lesson"}>
                        {activeLesson ? (
                            <div className="p-4 space-y-4">
                                {activeLesson.contentType === 'video' && <div className="aspect-video bg-black rounded"><p className="text-center text-gray-400 pt-20">Video player for: {activeLesson.videoUrl}</p></div>}
                                {activeLesson.contentType === 'text' && <div className="prose prose-invert max-w-none text-gray-300"><p>{activeLesson.content}</p></div>}
                                {activeLesson.contentType === 'quiz' && activeLesson.quiz && <QuizView quiz={activeLesson.quiz} api={api} />}
                            </div>
                        ) : <div className="p-8 text-center text-gray-500">Select a lesson from the curriculum to begin.</div> }
                    </Card>
                </div>
                <div>
                    <Card title="Curriculum">
                        <div className="p-2 max-h-[600px] overflow-y-auto">
                            {course.modules.map(module => (
                                <div key={module.id} className="mb-4">
                                    <h4 className="font-semibold text-cyan-300 px-2 py-1 bg-gray-800/50 rounded">{module.title}</h4>
                                    <ul className="mt-2 space-y-1">
                                        {module.lessons.map(lesson => (
                                            <li key={lesson.id}>
                                                <button onClick={() => setActiveLesson(lesson)} className={`w-full text-left p-2 rounded flex items-center text-sm ${activeLesson?.id === lesson.id ? 'bg-cyan-600/30 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}>
                                                    {lesson.contentType === 'video' && <FaVideo className="mr-2 text-red-400" />}
                                                    {lesson.contentType === 'text' && <FaFileAlt className="mr-2 text-blue-400" />}
                                                    {lesson.contentType === 'quiz' && <FaQuestionCircle className="mr-2 text-yellow-400" />}
                                                    {lesson.title}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const QuizView: React.FC<{ quiz: Quiz; api: LmsApiSimulator }> = ({ quiz, api }) => {
    const [submissionResult, setSubmissionResult] = useState<{ score: number } | null>(null);
    const { handleSubmit, control, getValues } = useForm();
    const { addNotification } = useNotification();

    const onSubmit = async () => {
        const values = getValues();
        const submission: QuizSubmission = {
            quizId: quiz.id,
            userId: 'user_1', // Mocked user
            answers: Object.entries(values).map(([questionId, answer]) => ({ questionId, answer: answer as string })),
            submittedAt: new Date(),
        };
        const result = await api.submitQuiz(submission);
        setSubmissionResult(result);
        addNotification(`Quiz submitted! Your score: ${result.score}%`, 'success');
    };

    if (submissionResult) {
        return <div className="text-center p-8 bg-gray-900/50 rounded-lg">
            <FaAward className="text-5xl text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white">Quiz Completed!</h3>
            <p className="text-4xl font-bold text-cyan-400 my-2">{submissionResult.score}%</p>
            <button onClick={() => setSubmissionResult(null)} className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm">Retake Quiz</button>
        </div>;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {quiz.questions.map((q, index) => (
                <div key={q.id}>
                    <p className="font-semibold text-white">{index + 1}. {q.text}</p>
                    {q.type === 'multiple-choice' && q.options && (
                         <div className="mt-2 space-y-2">
                             {q.options.map(opt => (
                                 <label key={opt} className="flex items-center space-x-2 text-gray-300">
                                     <Controller name={q.id} control={control} render={({ field }) => <input type="radio" {...field} value={opt} className="form-radio bg-gray-700 border-gray-600"/>} />
                                     <span>{opt}</span>
                                 </label>
                             ))}
                         </div>
                    )}
                     {q.type === 'text' && (
                         <Controller name={q.id} control={control} render={({ field }) => <textarea {...field} rows={3} className="w-full mt-2 bg-gray-700/50 p-2 rounded text-white" />} />
                    )}
                </div>
            ))}
            <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">Submit Quiz</button>
        </form>
    );
};


// --- 5.5 AI Modal ---
const AICourseOutlinerModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [topic, setTopic] = useState("Introduction to Corporate Finance");
    const [generatedOutline, setGeneratedOutline] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedOutline(null);
        try {
            // NOTE: In a real app, the API key should be handled securely on a backend.
            const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
            if (!apiKey) {
                console.error("API key not found.");
                setGeneratedOutline({ error: "API Key not configured. Please set REACT_APP_GEMINI_API_KEY." });
                return;
            }
            const ai = new GoogleGenAI({ apiKey });
            const prompt = `Generate a 4-module course outline for the topic: "${topic}". For each module, provide a title and 3-4 lesson titles.`;
            const schema = { type: Type.OBJECT, properties: { modules: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, lessons: { type: Type.ARRAY, items: { type: Type.STRING } } } } } } };
            const response = await ai.models.generateContent({ model: 'gemini-1.5-flash', contents: [{role: "user", parts: [{text: prompt}]}], generationConfig: { responseMimeType: "application/json", responseSchema: schema }});
            setGeneratedOutline(JSON.parse(response.response.text()));
        } catch (error) {
            console.error(error);
            setGeneratedOutline({ error: `An error occurred while generating the outline. ${error}` });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal title="AI Course Outliner" onClose={onClose}>
            <div className="space-y-4">
                <div>
                    <label className="text-sm text-gray-300 block mb-1">Course Topic</label>
                    <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Enter a course topic..." className="w-full bg-gray-700/50 p-2 rounded text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                </div>
                <button onClick={handleGenerate} disabled={isLoading} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50 transition-colors flex items-center justify-center">
                    {isLoading ? <FaSpinner className="animate-spin mr-2"/> : null}
                    {isLoading ? 'Generating...' : 'Generate Outline'}
                </button>
                {(isLoading || generatedOutline) && 
                    <Card title="Generated Outline">
                        <div className="min-h-[15rem] max-h-80 overflow-y-auto space-y-4 p-4 bg-gray-900/30 rounded-lg">
                            {isLoading ? <LoadingSpinner/> :
                                generatedOutline.error ? <p className="text-red-400">{generatedOutline.error}</p> :
                                generatedOutline.modules.map((m: any, i: number) => (
                                    <div key={i}>
                                        <h4 className="font-semibold text-cyan-300">{`Module ${i+1}: ${m.title}`}</h4>
                                        <ul className="list-disc list-inside text-sm text-gray-300 mt-1 space-y-1">
                                            {m.lessons.map((l: string, j: number) => <li key={j}>{l}</li>)}
                                        </ul>
                                    </div>
                                ))
                            }
                        </div>
                        {!isLoading && generatedOutline && !generatedOutline.error && (
                            <div className="mt-4 flex justify-end">
                                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center"><FaPlus className="mr-2"/> Create Course from Outline</button>
                            </div>
                        )}
                    </Card>
                }
            </div>
        </Modal>
    );
};


// =================================================================================================
// 6. MAIN COMPONENT
// =================================================================================================

const DemoBankLMSView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("LMSView must be within a DataProvider");
    const { courses } = context;

    const [isOutlineModalOpen, setOutlineModalOpen] = useState(false);
    const [activeView, setActiveView] = useState<ViewType>('dashboard');
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

    const apiRef = useRef<LmsApiSimulator | null>(null);
    if (!apiRef.current) {
        apiRef.current = new LmsApiSimulator(courses);
    }
    const api = apiRef.current;

    const handleSelectCourse = (courseId: string) => {
        setSelectedCourseId(courseId);
    };

    const handleBackToCourses = () => {
        setSelectedCourseId(null);
        setActiveView('courses');
    };

    const renderActiveView = () => {
        if (selectedCourseId) {
            return <CourseDetailView courseId={selectedCourseId} api={api} onBack={handleBackToCourses} />;
        }

        switch(activeView) {
            case 'dashboard': return <DashboardView api={api} />;
            case 'courses': return <CourseManagementView courses={courses as DetailedCourse[]} onSelectCourse={handleSelectCourse} />;
            case 'users': return <UserManagementView api={api} />;
            case 'analytics': return <AnalyticsView />;
            case 'settings': return <SettingsView />;
            default: return <DashboardView api={api} />;
        }
    };

    return (
        <NotificationProvider>
            <div className="space-y-6">
                {!selectedCourseId && (
                    <>
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank LMS</h2>
                            <button onClick={() => setOutlineModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium flex items-center"><FaGraduationCap className="mr-2"/> AI Course Outliner</button>
                        </div>
                        <MainNav activeView={activeView} setActiveView={setActiveView} />
                    </>
                )}
                
                <div>
                    {renderActiveView()}
                </div>
            </div>

             {isOutlineModalOpen && <AICourseOutlinerModal onClose={() => setOutlineModalOpen(false)} />}
        </NotificationProvider>
    );
};

export default DemoBankLMSView;
```