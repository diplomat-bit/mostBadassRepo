// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/api/routes/userRoutes.ts
================================================================================

import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult, param } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// --- Types & Interfaces ---

interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin' | 'enterprise';
    avatarUrl?: string;
    bio?: string;
    jobTitle?: string;
    department?: string;
    createdAt: Date;
    lastLogin: Date;
    preferences: UserPreferences;
    securitySettings: SecuritySettings;
    subscriptionTier: 'free' | 'pro' | 'enterprise';
}

interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    notifications: {
        email: boolean;
        push: boolean;
        marketing: boolean;
        aiInsights: boolean;
    };
    aiSettings: {
        voiceAssistantEnabled: boolean;
        preferredVoice: string;
        dataSharingOptIn: boolean;
        autoGenerateReports: boolean;
    };
    dashboardLayout: string[];
}

interface SecuritySettings {
    mfaEnabled: boolean;
    lastPasswordChange: Date;
    loginHistory: LoginEvent[];
}

interface LoginEvent {
    timestamp: Date;
    ipAddress: string;
    device: string;
    location: string;
}

// --- Mock Database / Service Layer ---

// Simulating a database for the purpose of this file to ensure "fully coded logic"
const MOCK_USER_DB: Map<string, UserProfile> = new Map();

// Helper to seed a mock user
const seedMockUser = () => {
    const userId = 'usr_1234567890';
    MOCK_USER_DB.set(userId, {
        id: userId,
        email: 'demo@example.com',
        firstName: 'Alex',
        lastName: 'Mercer',
        role: 'user',
        avatarUrl: 'https://ui-avatars.com/api/?name=Alex+Mercer',
        bio: 'Senior Financial Analyst leveraging AI for predictive modeling.',
        jobTitle: 'Lead Analyst',
        department: 'Finance',
        createdAt: new Date('2023-01-15T08:00:00Z'),
        lastLogin: new Date(),
        preferences: {
            theme: 'dark',
            notifications: {
                email: true,
                push: true,
                marketing: false,
                aiInsights: true
            },
            aiSettings: {
                voiceAssistantEnabled: true,
                preferredVoice: 'Nova',
                dataSharingOptIn: true,
                autoGenerateReports: true
            },
            dashboardLayout: ['financial-overview', 'ai-insights', 'market-trends']
        },
        securitySettings: {
            mfaEnabled: true,
            lastPasswordChange: new Date('2023-11-20'),
            loginHistory: [
                {
                    timestamp: new Date(),
                    ipAddress: '192.168.1.1',
                    device: 'Chrome / macOS',
                    location: 'New York, USA'
                }
            ]
        },
        subscriptionTier: 'pro'
    });
};

seedMockUser();

// --- Middleware ---

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    // In a real app, this would verify JWT from headers. 
    // For this fully coded file without external auth service, we simulate a valid token for 'usr_1234567890'
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // Allowing a 'bypass' for demonstration if specific header is present, otherwise 401
        if (req.headers['x-demo-bypass'] === 'true') {
            (req as any).user = { id: 'usr_1234567890' };
            return next();
        }
        return res.status(401).json({ success: false, message: 'Access Token Required' });
    }

    // Mock JWT verification logic
    try {
        // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        // Assuming valid for mock
        (req as any).user = { id: 'usr_1234567890' };
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid Token' });
    }
};

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

// --- Router Definition ---

const router = express.Router();

/**
 * @route   GET /api/users/me
 * @desc    Get current authenticated user's full profile
 * @access  Private
 */
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const user = MOCK_USER_DB.get(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Return user data sans sensitive info if strictly needed, but profile endpoint usually sends most info
        // We create a copy to avoid mutating the "DB"
        const userResponse = { ...user };
        
        // Enhance with dynamic data simulation
        const responsePayload = {
            success: true,
            data: userResponse,
            meta: {
                serverTime: new Date().toISOString(),
                requestId: Math.random().toString(36).substring(7)
            }
        };

        res.status(200).json(responsePayload);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/**
 * @route   PUT /api/users/me
 * @desc    Update basic profile information
 * @access  Private
 */
router.put(
    '/me',
    authenticateToken,
    [
        body('firstName').optional().isString().trim().escape(),
        body('lastName').optional().isString().trim().escape(),
        body('bio').optional().isString().isLength({ max: 500 }),
        body('jobTitle').optional().isString().trim(),
        body('department').optional().isString().trim(),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const user = MOCK_USER_DB.get(userId);

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            const { firstName, lastName, bio, jobTitle, department } = req.body;

            // Update fields if provided
            if (firstName) user.firstName = firstName;
            if (lastName) user.lastName = lastName;
            if (bio !== undefined) user.bio = bio;
            if (jobTitle) user.jobTitle = jobTitle;
            if (department) user.department = department;

            MOCK_USER_DB.set(userId, user);

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: user
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error updating profile' });
        }
    }
);

/**
 * @route   PUT /api/users/me/preferences
 * @desc    Update user application preferences (Theme, AI settings, Notifications)
 * @access  Private
 */
router.put(
    '/me/preferences',
    authenticateToken,
    [
        body('theme').optional().isIn(['light', 'dark', 'system']),
        body('notifications').optional().isObject(),
        body('aiSettings').optional().isObject(),
        body('dashboardLayout').optional().isArray()
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const user = MOCK_USER_DB.get(userId);

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            const { theme, notifications, aiSettings, dashboardLayout } = req.body;

            // Deep merge logic simulation
            if (theme) user.preferences.theme = theme;
            
            if (notifications) {
                user.preferences.notifications = {
                    ...user.preferences.notifications,
                    ...notifications
                };
            }

            if (aiSettings) {
                user.preferences.aiSettings = {
                    ...user.preferences.aiSettings,
                    ...aiSettings
                };
            }

            if (dashboardLayout) {
                user.preferences.dashboardLayout = dashboardLayout;
            }

            MOCK_USER_DB.set(userId, user);

            res.status(200).json({
                success: true,
                message: 'Preferences updated',
                data: user.preferences
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error updating preferences' });
        }
    }
);

/**
 * @route   PUT /api/users/me/security/password
 * @desc    Change user password
 * @access  Private
 */
router.put(
    '/me/security/password',
    authenticateToken,
    [
        body('currentPassword').notEmpty().withMessage('Current password is required'),
        body('newPassword')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')
            .matches(/\d/)
            .withMessage('Password must contain a number')
            .matches(/[A-Z]/)
            .withMessage('Password must contain an uppercase letter'),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        })
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            // In a real app, verify current password hash here
            // const isMatch = await bcrypt.compare(req.body.currentPassword, user.passwordHash);
            
            // Simulating correct password check
            if (req.body.currentPassword === 'WrongPassword123!') {
                return res.status(400).json({ success: false, message: 'Incorrect current password' });
            }

            const user = MOCK_USER_DB.get(userId);
            if (user) {
                user.securitySettings.lastPasswordChange = new Date();
                // user.passwordHash = await bcrypt.hash(req.body.newPassword, 12);
                MOCK_USER_DB.set(userId, user);
            }

            res.status(200).json({
                success: true,
                message: 'Password changed successfully. Please log in everywhere with your new password.'
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error changing password' });
        }
    }
);

/**
 * @route   POST /api/users/me/avatar
 * @desc    Upload user avatar (Mock implementation)
 * @access  Private
 */
router.post(
    '/me/avatar',
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            // Assume file upload middleware (like multer) processed the file and put it in req.file
            // or we receive a base64 string or URL in body for this mock
            
            // Mocking a successful upload to a cloud storage (AWS S3 / Google Cloud Storage)
            const mockNewUrl = `https://storage.googleapis.com/enterprise-app-avatars/${userId}_${Date.now()}.png`;
            
            const user = MOCK_USER_DB.get(userId);
            if (user) {
                user.avatarUrl = mockNewUrl;
                MOCK_USER_DB.set(userId, user);
            }

            // Simulate latency
            setTimeout(() => {
                res.status(200).json({
                    success: true,
                    message: 'Avatar uploaded successfully',
                    data: {
                        avatarUrl: mockNewUrl
                    }
                });
            }, 500);

        } catch (error) {
            res.status(500).json({ success: false, message: 'Avatar upload failed' });
        }
    }
);

/**
 * @route   GET /api/users/:id/public
 * @desc    Get public profile of another user
 * @access  Public (or Protected based on policy)
 */
router.get(
    '/:id/public',
    authenticateToken,
    param('id').isString(),
    validateRequest,
    async (req: Request, res: Response) => {
        try {
            const requestedId = req.params.id;
            
            // In a real DB we would findById
            // For mock, we only have one user, so let's pretend we found one or return 404
            if (requestedId === 'usr_1234567890') {
                 const user = MOCK_USER_DB.get(requestedId);
                 if (!user) return res.sendStatus(404);

                 // Filter strictly for public fields
                 const publicProfile = {
                     firstName: user.firstName,
                     lastName: user.lastName,
                     avatarUrl: user.avatarUrl,
                     jobTitle: user.jobTitle,
                     department: user.department,
                     bio: user.bio,
                     role: user.role
                 };

                 return res.status(200).json({ success: true, data: publicProfile });
            }

            res.status(404).json({ success: false, message: 'User not found' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
);

/**
 * @route   DELETE /api/users/me
 * @desc    Deactivate user account
 * @access  Private
 */
router.delete('/me', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        
        // In real app: Soft delete, archive data, trigger GDPR workflows, etc.
        MOCK_USER_DB.delete(userId);

        res.status(200).json({
            success: true,
            message: 'Account successfully deactivated. We are sorry to see you go.'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deactivating account' });
    }
});

/**
 * @route   GET /api/users/me/activity
 * @desc    Get recent user activity log (Security & Usage)
 * @access  Private
 */
router.get('/me/activity', authenticateToken, async (req: Request, res: Response) => {
    try {
        // Mock data generator for activity
        const activities = [
            { id: 1, type: 'LOGIN', description: 'Successful login from Chrome/macOS', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), ip: '192.168.1.1' },
            { id: 2, type: 'UPDATE_PROFILE', description: 'Updated bio information', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), ip: '192.168.1.1' },
            { id: 3, type: 'API_KEY_GEN', description: 'Generated new API key "Dev_Test_Key"', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), ip: '192.168.1.1' },
            { id: 4, type: 'AI_PROMPT', description: 'Executed complex financial modeling via Gemini', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(), ip: '192.168.1.1' },
        ];

        res.status(200).json({
            success: true,
            count: activities.length,
            data: activities
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching activity logs' });
    }
});

/**
 * @route   POST /api/users/me/export
 * @desc    Request a data export (GDPR Compliance)
 * @access  Private
 */
router.post('/me/export', authenticateToken, async (req: Request, res: Response) => {
    try {
        // Simulate triggering an async job
        const jobId = `job_${Math.random().toString(36).substr(2, 9)}`;
        
        res.status(202).json({
            success: true,
            message: 'Data export request received. You will receive an email when the archive is ready.',
            jobId: jobId,
            estimatedCompletion: '15 minutes'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error initiating export' });
    }
});

export default router;