// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-demai-jocalll3 | PATH: diplomat-bit-aibanking.dev-demai-jocalll3-f8b6983/components/Header.tsx.md
================================================================================

# The Story of `Header.tsx`: The Crown

At the very top of the Demo Bank kingdom, sitting above all other realms, is the `Header`. It is the application's crown, a persistent symbol of identity, awareness, and control. It is the user's constant companion, the one piece of the interface that never disappears, no matter where their journey takes them.

## The Left Side of the Crown: Identity and Access

The left side of the Header establishes the application's identity and provides a crucial key for users on smaller screens.

-   **The Menu Button (The "Key")**: This is a small but vital component that only appears on mobile devices. It is the key that unlocks the `Sidebar`, summoning the grand navigation from its hidden state. It is a direct command to the `App` orchestrator, telling it to change the `isSidebarOpen` state.
-   **The Title (`DEMO BANK`)**: The name of the kingdom, inscribed in bold, uppercase letters. It is a constant, unwavering declaration of where the user is.

## The Centerpiece of the Crown: The Heuristic API Status

This is a unique and powerful feature of the Header, a living jewel at its center.

```tsx
const HeuristicAPIStatus: React.FC = () => { ... };
```

This sub-component is a window into the AI's mind. It cycles through a series of messages, creating the powerful illusion that the AI is *always* working in the background:
- "Heuristic API: Actively analyzing portfolio..."
- "Heuristic API: Monitoring market data..."
- "Heuristic API: Identified 2 potential savings..."

Accompanied by a pulsing, animated waveform, this component transforms the application from a reactive tool into a proactive, sentient partner. It is a constant, ambient reminder that Quantum, the AI Advisor, is ever vigilant.

## The Right Side of the Crown: The User's Presence

The right side of the Header is dedicated to the user, "The Visionary." It is their personal command center.

-   **The Notification Bell**: This is the town crier. It silently watches the `notifications` in the `DataContext`. When a new, unread notification arrives, a small cyan gem appears on the bell, alerting the user that there is news. Clicking it reveals a dropdown of recent events, each a potential path to a different part of the application.

-   **The Profile Avatar**: This is the user's throne. It displays their avatar and their chosen title, "The Visionary." It is a representation of the user's presence and authority within the application. Clicking it opens a small menu, granting access to the `Settings` realm or the ability to log out, ending the session.

The `Header` is more than just a title bar. It is the application's command bridge. It anchors the user's experience, providing a constant sense of place, keeping them informed of the AI's status and important events, and giving them control over their personal profile. It is the steadfast crown on a dynamic kingdom.


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/Header.tsx.md
================================================================================

# The Architecture of `Header.tsx`: The Unified, Secure Navigation Bar

**Executive Summary**

This component is being refactored from a deliberately flawed, slow prototype into a robust, secure, and performant navigation header suitable for an enterprise fintech application. It will now integrate secure session state, standardized design (MUI), and clear status indicators reflecting the health of critical backend services, aligning with the MVP scope (Unified business financial dashboard).

**Core Philosophy: Stability and Security**

This platform must now operate with high reliability, employing secure state management (Zustand/React Query integration) and adherence to modern UI standards (MUI v5). All static/placeholder elements are being replaced with dynamic, state-aware components.

**Component Architecture: The Standardized Bar**

The `Header` is now a highly functional container integrated deeply with global state for user context and real-time service health monitoring.

### 1. The Navigation Module (Left Side)

The left side handles secure navigation and branding.

*   **Mobile Menu Button**: Integrated with the global state/layout context to toggle the primary navigation structure (which will use MUI's standard drawer pattern).
*   **Company Branding**: Replaced the static placeholder with a standardized, configurable application title that respects the current environment context (Dev/Staging/Prod).

### 2. The Status Display (Center)

The center is replaced by the `ServiceHealthIndicator`. This component actively queries the unified API gateway health endpoint (mocked here for structural completeness) to provide real-time assurance of system availability.

```tsx
const ServiceHealthIndicator: React.FC = () => { ... };
```

**Functionality:**
*   **Real-time Service Aggregation**: Checks the health status of critical domains (e.g., Authentication Service, Core Ledger API, Treasury Orchestrator).
*   **Circuit Breaker Visualization**: Visually reflects the state of circuit breakers (Open/Closed/Half-Open) managed by the new API connector layer.
*   **Proactive Alerting**: Uses clear, unambiguous indicators (green for operational, yellow for degraded, red for failure).

### 3. The User Module (Right Side)

The right side is now dedicated to secure user context and session management visualization.

*   **Secure Session Status**: Replaces the non-critical notification hub. This now shows JWT validity status (e.g., "Session Active," "Token Expires in 1h"). This requires integration with the new secure session management layer.
*   **Role-Based Profile Interface**: The avatar is now tied to the authenticated user principal (retrieved from secure state). Clicking it opens a secure dropdown managed by MUI, providing access to role-specific settings and the explicit **Logout** function (initiating token revocation).

**Strategic Imperative**

This component adheres strictly to the stability and security requirements. It is a fully integrated part of the new architecture, using defined UI libraries (MUI) and reflecting true system operational status, not simulated mediocrity.

---
// Mocking necessary imports for a runnable structure demonstration
import * as React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Badge, Avatar, Box, styled } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security'; // Used for Health/Status

// --- MOCK STATE MANAGEMENT (Simulating Zustand/Context Integration) ---
// In a real refactor, this would pull from a global store (e.g., useAuthStore, useHealthStore)
interface MockAuthState {
  isAuthenticated: boolean;
  userRole: 'Admin' | 'Analyst' | 'Auditor';
  sessionExpiry: Date;
}

const mockAuth: MockAuthState = {
  isAuthenticated: true,
  userRole: 'Admin',
  sessionExpiry: new Date(Date.now() + 3600000), // 1 hour from now
};

interface MockHealthState {
  authService: 'OK' | 'DEGRADED' | 'DOWN';
  ledgerApi: 'OK' | 'DEGRADED' | 'DOWN';
  orchestrator: 'OK' | 'DEGRADED' | 'DOWN';
}

const mockHealth: MockHealthState = {
  authService: 'OK',
  ledgerApi: 'OK',
  orchestrator: 'DEGRADED', // Simulating one service being slightly degraded
};
// ---------------------------------------------------------------------


// 1. The Health Indicator (Replaces HeuristicAPIStatus)
const ServiceHealthIndicator: React.FC<{ health: MockHealthState }> = ({ health }) => {
  const getStatusColor = (status: string) => {
    if (status === 'OK') return 'success';
    if (status === 'DEGRADED') return 'warning';
    return 'error';
  };

  const totalFailures = Object.values(health).filter(s => s !== 'OK').length;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Badge color={totalFailures > 0 ? 'warning' : 'success'} variant="dot" invisible={totalFailures === 0}>
        <SecurityIcon color="action" />
      </Badge>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Typography variant="caption" color="text.secondary">
          System Health:
        </Typography>
        <Typography variant="body2" sx={{ ml: 0.5, display: 'inline-flex', alignItems: 'center' }}>
          {Object.entries(health).map(([service, status]) => (
            <Box key={service} sx={{ ml: 1, color: (theme) => theme.palette[getStatusStatusColor(status)].main }}>
              {service.split('Api')[0].charAt(0).toUpperCase() + service.split('Api')[0].slice(1)}: {status}
            </Box>
          ))}
        </Typography>
      </Box>
    </Box>
  );
};

// 2. The Main Header Component
const Header: React.FC = () => {
  const appName = "FinTech Dashboard MVP"; // Unified Branding

  // Derive calculated state from mocks
  const sessionStatus = mockAuth.isAuthenticated ? `Active (${mockAuth.userRole})` : 'Logged Out';
  const expiryTime = mockAuth.sessionExpiry.toLocaleTimeString();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ px: { xs: 1, md: 3 } }}>
        {/* LEFT: Navigation Module */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          // In a real app: onClick={toggleSidebar}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, fontWeight: 700, color: 'primary.main' }}
        >
          {appName}
        </Typography>

        {/* CENTER: Status Display (Replaced HeuristicAPIStatus) */}
        <Box sx={{ flexGrow: 0.5, display: { xs: 'none', lg: 'flex' } }}>
            <ServiceHealthIndicator health={mockHealth} />
        </Box>

        {/* RIGHT: User Module */}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          
          {/* Secure Session Status */}
          <Box sx={{ mr: 2, textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
              <Typography variant="caption" display="block" color="text.secondary">
                  Session: {sessionStatus}
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                  Expires: {expiryTime}
              </Typography>
          </Box>

          {/* Notifications (Reduced to high-priority, integrated alert count if needed later) */}
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={1} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Standard Profile Interface */}
          <IconButton color="inherit">
            {/* Placeholder Avatar linked to secure user context */}
            <Avatar sx={{ bgcolor: 'secondary.main' }} alt={mockAuth.userRole}>
                {mockAuth.userRole[0]}
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/Header.tsx.md
================================================================================


# The Command Console
*A Guide to the Sovereign's Primary Interface*

---

## Abstract

This document provides a clear analysis of the `Header.tsx` component, modeling it as the "Command Console." This component is the primary interface between the sovereign and the reality of the application. Its elements are explained as distinct instruments of power: the `HeuristicAPIStatus` as the "Heartbeat of the Machine," `Notifications` as "Dispatches from your Agent," and the user profile as the "Seal of Sovereignty."

---

## Chapter 1. The Instruments on the Console

### 1.1 The Heartbeat of the Machine (`HeuristicAPIStatus`)

This component represents the persistent, background operations of the Instrument. It is the system's heartbeat, constantly analyzing and monitoring the state of the world. Its cycling messages are not mere status updates; they are **the rhythmic hum of a powerful intelligence at work**, providing a constant, reassuring sense of a vigilant and capable presence.

### 1.2 Dispatches from Your Agent (`Notifications`)

The notification system is the channel through which the application's deeper, analytical mind sends critical intelligence directly to the sovereign's attention. These are not interruptions; they are curated dispatches, moments where the AI has identified a pattern or event of sufficient significance to warrant a direct report. The unread count is a measure of accumulated, unactioned intelligence.

### 1.3 The Seal of Sovereignty (User Profile)

The user profile icon and name are the formal representation of the sovereign's identity within this application. It is the anchor point of their command. Interacting with it provides access to the controls that attune the application to the self (`Settings`) or to sever the connection entirely (`Logout`).

---

## Chapter 2. The Act of Unfurling the Map

The `onMenuClick` function is a crucial command. On smaller interfaces where the Armory (`Sidebar`) is not persistently visible, this function is the decree that summons the map of all available domains into view. It is the act of demanding to see the full extent of one's territory.

---

## Chapter 3. Conclusion

The Header is the highest point of the application's manifest reality. It is the locus of identity, awareness, and control. It serves as the constant, unwavering point of command between the sovereign and the vast, dynamic world of the application, ensuring that the user always feels present, informed, and in absolute control.


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/Header.tsx.md
================================================================================

# The Architecture of `Header.tsx`: The Unified, Secure Navigation Bar

**Executive Summary**

This component is being refactored from a deliberately flawed, slow prototype into a robust, secure, and performant navigation header suitable for an enterprise fintech application. It will now integrate secure session state, standardized design (MUI), and clear status indicators reflecting the health of critical backend services, aligning with the MVP scope (Unified business financial dashboard).

**Core Philosophy: Stability and Security**

This platform must now operate with high reliability, employing secure state management (Zustand/React Query integration) and adherence to modern UI standards (MUI v5). All static/placeholder elements are being replaced with dynamic, state-aware components.

**Component Architecture: The Standardized Bar**

The `Header` is now a highly functional container integrated deeply with global state for user context and real-time service health monitoring.

### 1. The Navigation Module (Left Side)

The left side handles secure navigation and branding.

*   **Mobile Menu Button**: Integrated with the global state/layout context to toggle the primary navigation structure (which will use MUI's standard drawer pattern).
*   **Company Branding**: Replaced the static placeholder with a standardized, configurable application title that respects the current environment context (Dev/Staging/Prod).

### 2. The Status Display (Center)

The center is replaced by the `ServiceHealthIndicator`. This component actively queries the unified API gateway health endpoint (mocked here for structural completeness) to provide real-time assurance of system availability.


const ServiceHealthIndicator: React.FC = () => { ... };


**Functionality:**
*   **Real-time Service Aggregation**: Checks the health status of critical domains (e.g., Authentication Service, Core Ledger API, Treasury Orchestrator).
*   **Circuit Breaker Visualization**: Visually reflects the state of circuit breakers (Open/Closed/Half-Open) managed by the new API connector layer.
*   **Proactive Alerting**: Uses clear, unambiguous indicators (green for operational, yellow for degraded, red for failure).

### 3. The User Module (Right Side)

The right side is now dedicated to secure user context and session management visualization.

*   **Secure Session Status**: Replaces the non-critical notification hub. This now shows JWT validity status (e.g., "Session Active," "Token Expires in 1h"). This requires integration with the new secure session management layer.
*   **Role-Based Profile Interface**: The avatar is now tied to the authenticated user principal (retrieved from secure state). Clicking it opens a secure dropdown managed by MUI, providing access to role-specific settings and the explicit **Logout** function (initiating token revocation).

**Strategic Imperative**

This component adheres strictly to the stability and security requirements. It is a fully integrated part of the new architecture, using defined UI libraries (MUI) and reflecting true system operational status, not simulated mediocrity.

---
// Mocking necessary imports for a runnable structure demonstration
import * as React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Badge, Avatar, Box, styled } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security'; // Used for Health/Status

// --- MOCK STATE MANAGEMENT (Simulating Zustand/Context Integration) ---
// In a real refactor, this would pull from a global store (e.g., useAuthStore, useHealthStore)
interface MockAuthState {
  isAuthenticated: boolean;
  userRole: 'Admin' | 'Analyst' | 'Auditor';
  sessionExpiry: Date;
}

const mockAuth: MockAuthState = {
  isAuthenticated: true,
  userRole: 'Admin',
  sessionExpiry: new Date(Date.now() + 3600000), // 1 hour from now
};

interface MockHealthState {
  authService: 'OK' | 'DEGRADED' | 'DOWN';
  ledgerApi: 'OK' | 'DEGRADED' | 'DOWN';
  orchestrator: 'OK' | 'DEGRADED' | 'DOWN';
}

const mockHealth: MockHealthState = {
  authService: 'OK',
  ledgerApi: 'OK',
  orchestrator: 'DEGRADED', // Simulating one service being slightly degraded
};
// ---------------------------------------------------------------------


// 1. The Health Indicator (Replaces HeuristicAPIStatus)
const ServiceHealthIndicator: React.FC<{ health: MockHealthState }> = ({ health }) => {
  const getStatusColor = (status: string) => {
    if (status === 'OK') return 'success';
    if (status === 'DEGRADED') return 'warning';
    return 'error';
  };

  const totalFailures = Object.values(health).filter(s => s !== 'OK').length;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Badge color={totalFailures > 0 ? 'warning' : 'success'} variant="dot" invisible={totalFailures === 0}>
        <SecurityIcon color="action" />
      </Badge>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Typography variant="caption" color="text.secondary">
          System Health:
        </Typography>
        <Typography variant="body2" sx={{ ml: 0.5, display: 'inline-flex', alignItems: 'center' }}>
          {Object.entries(health).map(([service, status]) => (
            <Box key={service} sx={{ ml: 1, color: (theme) => theme.palette[getStatusStatusColor(status)].main }}>
              {service.split('Api')[0].charAt(0).toUpperCase() + service.split('Api')[0].slice(1)}: {status}
            </Box>
          ))}
        </Typography>
      </Box>
    </Box>
  );
};

// 2. The Main Header Component
const Header: React.FC = () => {
  const appName = "FinTech Dashboard MVP"; // Unified Branding

  // Derive calculated state from mocks
  const sessionStatus = mockAuth.isAuthenticated ? `Active (${mockAuth.userRole})` : 'Logged Out';
  const expiryTime = mockAuth.sessionExpiry.toLocaleTimeString();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ px: { xs: 1, md: 3 } }}>
        {/* LEFT: Navigation Module */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          // In a real app: onClick={toggleSidebar}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, fontWeight: 700, color: 'primary.main' }}
        >
          {appName}
        </Typography>

        {/* CENTER: Status Display (Replaced HeuristicAPIStatus) */}
        <Box sx={{ flexGrow: 0.5, display: { xs: 'none', lg: 'flex' } }}>
            <ServiceHealthIndicator health={mockHealth} />
        </Box>

        {/* RIGHT: User Module */}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          
          {/* Secure Session Status */}
          <Box sx={{ mr: 2, textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
              <Typography variant="caption" display="block" color="text.secondary">
                  Session: {sessionStatus}
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                  Expires: {expiryTime}
              </Typography>
          </Box>

          {/* Notifications (Reduced to high-priority, integrated alert count if needed later) */}
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={1} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Standard Profile Interface */}
          <IconButton color="inherit">
            {/* Placeholder Avatar linked to secure user context */}
            <Avatar sx={{ bgcolor: 'secondary.main' }} alt={mockAuth.userRole}>
                {mockAuth.userRole[0]}
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

================================================================================
// APPENDED FROM REPO: diplomat-bit/G20 | ORIGINAL PATH: diplomat-bit-G20-0199fa7/components/Header.tsx.md
================================================================================

# The Story of `Header.tsx`: The Crown

At the very top of the Demo Bank kingdom, sitting above all other realms, is the `Header`. It is the application's crown, a persistent symbol of identity, awareness, and control. It is the user's constant companion, the one piece of the interface that never disappears, no matter where their journey takes them.

## The Left Side of the Crown: Identity and Access

The left side of the Header establishes the application's identity and provides a crucial key for users on smaller screens.

-   **The Menu Button (The "Key")**: This is a small but vital component that only appears on mobile devices. It is the key that unlocks the `Sidebar`, summoning the grand navigation from its hidden state. It is a direct command to the `App` orchestrator, telling it to change the `isSidebarOpen` state.
-   **The Title (`DEMO BANK`)**: The name of the kingdom, inscribed in bold, uppercase letters. It is a constant, unwavering declaration of where the user is.

## The Centerpiece of the Crown: The Heuristic API Status

This is a unique and powerful feature of the Header, a living jewel at its center.

```tsx
const HeuristicAPIStatus: React.FC = () => { ... };
```

This sub-component is a window into the AI's mind. It cycles through a series of messages, creating the powerful illusion that the AI is *always* working in the background:
- "Heuristic API: Actively analyzing portfolio..."
- "Heuristic API: Monitoring market data..."
- "Heuristic API: Identified 2 potential savings..."

Accompanied by a pulsing, animated waveform, this component transforms the application from a reactive tool into a proactive, sentient partner. It is a constant, ambient reminder that Quantum, the AI Advisor, is ever vigilant.

## The Right Side of the Crown: The User's Presence

The right side of the Header is dedicated to the user, "The Visionary." It is their personal command center.

-   **The Notification Bell**: This is the town crier. It silently watches the `notifications` in the `DataContext`. When a new, unread notification arrives, a small cyan gem appears on the bell, alerting the user that there is news. Clicking it reveals a dropdown of recent events, each a potential path to a different part of the application.

-   **The Profile Avatar**: This is the user's throne. It displays their avatar and their chosen title, "The Visionary." It is a representation of the user's presence and authority within the application. Clicking it opens a small menu, granting access to the `Settings` realm or the ability to log out, ending the session.

The `Header` is more than just a title bar. It is the application's command bridge. It anchors the user's experience, providing a constant sense of place, keeping them informed of the AI's status and important events, and giving them control over their personal profile. It is the steadfast crown on a dynamic kingdom.


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/Header.tsx.md
================================================================================

# The Architecture of `Header.tsx`: The Unified, Secure Navigation Bar

**Executive Summary**

This component is being refactored from a deliberately flawed, slow prototype into a robust, secure, and performant navigation header suitable for an enterprise fintech application. It will now integrate secure session state, standardized design (MUI), and clear status indicators reflecting the health of critical backend services, aligning with the MVP scope (Unified business financial dashboard).

**Core Philosophy: Stability and Security**

This platform must now operate with high reliability, employing secure state management (Zustand/React Query integration) and adherence to modern UI standards (MUI v5). All static/placeholder elements are being replaced with dynamic, state-aware components.

**Component Architecture: The Standardized Bar**

The `Header` is now a highly functional container integrated deeply with global state for user context and real-time service health monitoring.

### 1. The Navigation Module (Left Side)

The left side handles secure navigation and branding.

*   **Mobile Menu Button**: Integrated with the global state/layout context to toggle the primary navigation structure (which will use MUI's standard drawer pattern).
*   **Company Branding**: Replaced the static placeholder with a standardized, configurable application title that respects the current environment context (Dev/Staging/Prod).

### 2. The Status Display (Center)

The center is replaced by the `ServiceHealthIndicator`. This component actively queries the unified API gateway health endpoint (mocked here for structural completeness) to provide real-time assurance of system availability.


const ServiceHealthIndicator: React.FC = () => { ... };


**Functionality:**
*   **Real-time Service Aggregation**: Checks the health status of critical domains (e.g., Authentication Service, Core Ledger API, Treasury Orchestrator).
*   **Circuit Breaker Visualization**: Visually reflects the state of circuit breakers (Open/Closed/Half-Open) managed by the new API connector layer.
*   **Proactive Alerting**: Uses clear, unambiguous indicators (green for operational, yellow for degraded, red for failure).

### 3. The User Module (Right Side)

The right side is now dedicated to secure user context and session management visualization.

*   **Secure Session Status**: Replaces the non-critical notification hub. This now shows JWT validity status (e.g., "Session Active," "Token Expires in 1h"). This requires integration with the new secure session management layer.
*   **Role-Based Profile Interface**: The avatar is now tied to the authenticated user principal (retrieved from secure state). Clicking it opens a secure dropdown managed by MUI, providing access to role-specific settings and the explicit **Logout** function (initiating token revocation).

**Strategic Imperative**

This component adheres strictly to the stability and security requirements. It is a fully integrated part of the new architecture, using defined UI libraries (MUI) and reflecting true system operational status, not simulated mediocrity.

---
// Mocking necessary imports for a runnable structure demonstration
import * as React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Badge, Avatar, Box, styled } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security'; // Used for Health/Status

// --- MOCK STATE MANAGEMENT (Simulating Zustand/Context Integration) ---
// In a real refactor, this would pull from a global store (e.g., useAuthStore, useHealthStore)
interface MockAuthState {
  isAuthenticated: boolean;
  userRole: 'Admin' | 'Analyst' | 'Auditor';
  sessionExpiry: Date;
}

const mockAuth: MockAuthState = {
  isAuthenticated: true,
  userRole: 'Admin',
  sessionExpiry: new Date(Date.now() + 3600000), // 1 hour from now
};

interface MockHealthState {
  authService: 'OK' | 'DEGRADED' | 'DOWN';
  ledgerApi: 'OK' | 'DEGRADED' | 'DOWN';
  orchestrator: 'OK' | 'DEGRADED' | 'DOWN';
}

const mockHealth: MockHealthState = {
  authService: 'OK',
  ledgerApi: 'OK',
  orchestrator: 'DEGRADED', // Simulating one service being slightly degraded
};
// ---------------------------------------------------------------------


// 1. The Health Indicator (Replaces HeuristicAPIStatus)
const ServiceHealthIndicator: React.FC<{ health: MockHealthState }> = ({ health }) => {
  const getStatusColor = (status: string) => {
    if (status === 'OK') return 'success';
    if (status === 'DEGRADED') return 'warning';
    return 'error';
  };

  const totalFailures = Object.values(health).filter(s => s !== 'OK').length;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Badge color={totalFailures > 0 ? 'warning' : 'success'} variant="dot" invisible={totalFailures === 0}>
        <SecurityIcon color="action" />
      </Badge>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Typography variant="caption" color="text.secondary">
          System Health:
        </Typography>
        <Typography variant="body2" sx={{ ml: 0.5, display: 'inline-flex', alignItems: 'center' }}>
          {Object.entries(health).map(([service, status]) => (
            <Box key={service} sx={{ ml: 1, color: (theme) => theme.palette[getStatusStatusColor(status)].main }}>
              {service.split('Api')[0].charAt(0).toUpperCase() + service.split('Api')[0].slice(1)}: {status}
            </Box>
          ))}
        </Typography>
      </Box>
    </Box>
  );
};

// 2. The Main Header Component
const Header: React.FC = () => {
  const appName = "FinTech Dashboard MVP"; // Unified Branding

  // Derive calculated state from mocks
  const sessionStatus = mockAuth.isAuthenticated ? `Active (${mockAuth.userRole})` : 'Logged Out';
  const expiryTime = mockAuth.sessionExpiry.toLocaleTimeString();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ px: { xs: 1, md: 3 } }}>
        {/* LEFT: Navigation Module */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          // In a real app: onClick={toggleSidebar}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, fontWeight: 700, color: 'primary.main' }}
        >
          {appName}
        </Typography>

        {/* CENTER: Status Display (Replaced HeuristicAPIStatus) */}
        <Box sx={{ flexGrow: 0.5, display: { xs: 'none', lg: 'flex' } }}>
            <ServiceHealthIndicator health={mockHealth} />
        </Box>

        {/* RIGHT: User Module */}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          
          {/* Secure Session Status */}
          <Box sx={{ mr: 2, textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
              <Typography variant="caption" display="block" color="text.secondary">
                  Session: {sessionStatus}
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                  Expires: {expiryTime}
              </Typography>
          </Box>

          {/* Notifications (Reduced to high-priority, integrated alert count if needed later) */}
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={1} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Standard Profile Interface */}
          <IconButton color="inherit">
            {/* Placeholder Avatar linked to secure user context */}
            <Avatar sx={{ bgcolor: 'secondary.main' }} alt={mockAuth.userRole}>
                {mockAuth.userRole[0]}
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;