// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-demai-jocalll3 | PATH: diplomat-bit-aibanking.dev-demai-jocalll3-f8b6983/components/Sidebar.tsx.md
================================================================================

# The Story of `Sidebar.tsx`: The Great Navigator

In the vast, multi-realm universe of Demo Bank, a user could easily get lost. They need a guide, a map, a constant and reliable navigator to show them all the possible destinations and their current location within the cosmos. The `Sidebar` is that Great Navigator.

It is a pillar of light that stands at the edge of the world, holding the pathways to every major feature of the application.

## The Genesis: A Forging from Constants

The Sidebar does not invent the map; it is given the sacred scrolls from the `constants.tsx` pantheon.

```tsx
import { NAV_ITEMS } from '../constants';
```

It summons the `NAV_ITEMS` array, the divine council of navigation gods, and uses this eternal truth to build its structure. This is a critical architectural decision: the Sidebar is not responsible for *what* the navigation items are, only for *how* they are displayed. This makes the entire system modular and easy to update. To add a new realm to the universe, one only needs to add an entry to the `NAV_ITEMS` constant, and the Sidebar will automatically forge a path to it.

## The Ritual of Navigation

For each `item` in the `NAV_ITEMS` array, the Sidebar performs a ritual of creation. It forges an `<a>` tag, a magical portal.

```tsx
<a
    key={item.id}
    onClick={(e) => {
        e.preventDefault();
        handleNavClick(item.id);
    }}
    className={`... ${activeView === item.id ? 'bg-cyan-500/20 ...' : ''}`}
>
    {item.icon}
    <span className="mx-4 font-medium">{item.label}</span>
</a>
```

-   **The Invocation**: When a user clicks the portal, `handleNavClick` is invoked. This function communicates directly with the `App` orchestrator, calling `setActiveView` to change the application's focus to the new realm.
-   **The Mark of the Traveler**: The `className` is intelligent. It constantly checks the `activeView` prop, which tells it the user's current location. If the portal's `id` matches the `activeView`, it adorns itself with a glowing cyan background and a vibrant border. This is the "You Are Here" marker on the cosmic map, providing immediate and clear feedback to the user.
-   **The Sigil and the Name**: Each portal proudly displays the realm's divine symbol (`item.icon`) and its common name (`item.label`), making navigation intuitive and visually rich.

## The Dual Form: A Master of Responsiveness

The Sidebar is a master of transformation. It understands the nature of the screen it lives on.

-   **On Large Screens (Desktop)**: It stands tall and proud, a permanent fixture on the left side of the screen, always visible. `lg:relative`, `lg:translate-x-0`.
-   **On Small Screens (Mobile)**: It becomes a creature of shadow and light. It hides itself off-screen (`-translate-x-full`) and can only be summoned by the "Key"—the menu button in the `Header`. When summoned, it glides into view, accompanied by a dark overlay that dims the rest of the world, focusing the user's attention on the act of navigation. `fixed`, `transform`.

The `Sidebar` is the user's most trusted guide. It is a beautiful, intelligent, and responsive map of the world, ensuring that the user always knows where they are and where they can go.


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/Sidebar.tsx.md
================================================================================

import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Collapse,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountBalanceWallet as WalletIcon,
  TrendingUp as TradingIcon,
  Settings as SettingsIcon,
  HelpOutline as HelpIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess,
  ExpandMore,
  BarChart as AnalyticsIcon,
  Security as SecurityIcon,
  People as TeamIcon,
  Business as VentureIcon,
  Message as ChatIcon,
  Notifications as NotificationIcon,
} from '@mui/icons-material';

// This constant defines the width of the drawer when open
const DRAWER_WIDTH = 240;

// This component renders the sidebar navigation for the application.
// It supports expanding and collapsing to save screen real estate.
const Sidebar: React.FC = () => {
  // State to manage the open/closed state of the sidebar.
  // Initialized to true to show the sidebar by default.
  const [open, setOpen] = useState(true);
  // State to manage the open/closed state of the settings submenu.
  // Initialized to false to keep settings collapsed by default.
  const [settingsOpen, setSettingsOpen] = useState(false);

  const theme = useTheme();

  // Toggles the open/closed state of the sidebar.
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Toggles the open/closed state of the settings submenu.
  const handleSettingsToggle = () => {
    setSettingsOpen(!settingsOpen);
  };

  // Defines the main navigation items for the sidebar.
  // Each item includes text and an associated icon.
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon /> },
    { text: 'Wallet', icon: <WalletIcon /> },
    { text: 'Trading', icon: <TradingIcon /> },
    { text: 'Analytics', icon: <AnalyticsIcon /> },
    { text: 'Venture', icon: <VentureIcon /> },
    { text: 'Team', icon: <TeamIcon /> },
    { text: 'Chat', icon: <ChatIcon /> },
    { text: 'Notifications', icon: <NotificationIcon /> },
    { text: 'Security', icon: <SecurityIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : 64,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : 64,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
        },
      }}
    >
      {/* Header section with toggle button for the sidebar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={handleDrawerToggle}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Divider />
      {/* Main navigation list */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {/* Settings and Logout section */}
      <List>
        {/* Settings item with collapsible submenu */}
        <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
                onClick={handleSettingsToggle}
                sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                    }}
                >
                    <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" sx={{ opacity: open ? 1 : 0 }} />
                {/* Expand/collapse icon for settings */}
                {open ? (settingsOpen ? <ExpandLess /> : <ExpandMore />) : null}
            </ListItemButton>
            {/* Collapsible settings submenu */}
            <Collapse in={settingsOpen && open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                            <HelpIcon />
                        </ListItemIcon>
                        <ListItemText primary="Help" />
                    </ListItemButton>
                </List>
            </Collapse>
        </ListItem>
        {/* Logout item */}
        <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
                sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                    }}
                >
                    <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/Sidebar.tsx.md
================================================================================


# The Armory
*A Guide to the Instruments of Command*

---

## The Concept

The `Sidebar.tsx` component is the application's primary instrument panel—its armory. It provides a clear, consistent, and complete inventory of all the available domains and tools of power. Its purpose is to ensure the sovereign always knows what instruments are at their command and can summon them with a single decree.

---

### A Simple Metaphor: The Armory

Think of the `Sidebar` as the well-organized armory of a sovereign.

-   **Domains (`NavLink`)**: These are the primary weapons and instruments in the armory, each forged for a specific purpose like "Command Center" (Dashboard) or "The Citadel" (Security). Selecting one instantly equips it for use.

-   **Headers (`NavHeader`)**: These are the weapon racks (e.g., "Theater of Operations: Personal Finance"). They don't do anything themselves, but they organize the instruments into logical groups, making the armory easy to navigate in the heat of battle.

-   **Dividers (`NavDivider`)**: These are simply visual breaks that keep the armory clean and organized, ensuring every instrument is easy to find when needed.

---

### How It Works

-   **The Master Inventory (`NAV_ITEMS`)**: The Armory's structure is dictated by a single, central inventory list called `NAV_ITEMS` (located in `constants.tsx`). This is our "single source of truth" for what instruments exist. If we forge a new instrument and add it to that list, it automatically appears in the Armory, ready for use.

-   **Highlighting the Wielded Instrument**: The Armory always knows which instrument you are currently wielding (`activeView`). It highlights that item in the list, so you always have a clear sense of what power is currently in your hand.

-   **Tactical Deployment**: On large screens, the Armory is always visible, displaying your full range of options. On smaller screens, it retracts for tactical advantage, ready to be summoned with a single command.

---

### The Philosophy: Power Through Order

The design of the `Sidebar` is driven by a simple philosophy: a sovereign who knows what instruments they possess is a sovereign who can command effectively. By providing a persistent, well-organized inventory of power, we eliminate confusion and empower the user to wield the full capabilities of the application with speed and confidence.


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/Sidebar.tsx.md
================================================================================

import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Collapse,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountBalanceWallet as WalletIcon,
  TrendingUp as TradingIcon,
  Settings as SettingsIcon,
  HelpOutline as HelpIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess,
  ExpandMore,
  BarChart as AnalyticsIcon,
  Security as SecurityIcon,
  People as TeamIcon,
  Business as VentureIcon,
  Message as ChatIcon,
  Notifications as NotificationIcon,
} from '@mui/icons-material';

// This constant defines the width of the drawer when open
const DRAWER_WIDTH = 240;

// This component renders the sidebar navigation for the application.
// It supports expanding and collapsing to save screen real estate.
const Sidebar: React.FC = () => {
  // State to manage the open/closed state of the sidebar.
  // Initialized to true to show the sidebar by default.
  const [open, setOpen] = useState(true);
  // State to manage the open/closed state of the settings submenu.
  // Initialized to false to keep settings collapsed by default.
  const [settingsOpen, setSettingsOpen] = useState(false);

  const theme = useTheme();

  // Toggles the open/closed state of the sidebar.
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Toggles the open/closed state of the settings submenu.
  const handleSettingsToggle = () => {
    setSettingsOpen(!settingsOpen);
  };

  // Defines the main navigation items for the sidebar.
  // Each item includes text and an associated icon.
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon /> },
    { text: 'Wallet', icon: <WalletIcon /> },
    { text: 'Trading', icon: <TradingIcon /> },
    { text: 'Analytics', icon: <AnalyticsIcon /> },
    { text: 'Venture', icon: <VentureIcon /> },
    { text: 'Team', icon: <TeamIcon /> },
    { text: 'Chat', icon: <ChatIcon /> },
    { text: 'Notifications', icon: <NotificationIcon /> },
    { text: 'Security', icon: <SecurityIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : 64,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : 64,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
        },
      }}
    >
      {/* Header section with toggle button for the sidebar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={handleDrawerToggle}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Divider />
      {/* Main navigation list */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {/* Settings and Logout section */}
      <List>
        {/* Settings item with collapsible submenu */}
        <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
                onClick={handleSettingsToggle}
                sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                    }}
                >
                    <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" sx={{ opacity: open ? 1 : 0 }} />
                {/* Expand/collapse icon for settings */}
                {open ? (settingsOpen ? <ExpandLess /> : <ExpandMore />) : null}
            </ListItemButton>
            {/* Collapsible settings submenu */}
            <Collapse in={settingsOpen && open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                            <HelpIcon />
                        </ListItemIcon>
                        <ListItemText primary="Help" />
                    </ListItemButton>
                </List>
            </Collapse>
        </ListItem>
        {/* Logout item */}
        <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
                sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                    }}
                >
                    <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;

================================================================================
// APPENDED FROM REPO: diplomat-bit/G20 | ORIGINAL PATH: diplomat-bit-G20-0199fa7/components/Sidebar.tsx.md
================================================================================

# The Story of `Sidebar.tsx`: The Great Navigator

In the vast, multi-realm universe of Demo Bank, a user could easily get lost. They need a guide, a map, a constant and reliable navigator to show them all the possible destinations and their current location within the cosmos. The `Sidebar` is that Great Navigator.

It is a pillar of light that stands at the edge of the world, holding the pathways to every major feature of the application.

## The Genesis: A Forging from Constants

The Sidebar does not invent the map; it is given the sacred scrolls from the `constants.tsx` pantheon.

```tsx
import { NAV_ITEMS } from '../constants';
```

It summons the `NAV_ITEMS` array, the divine council of navigation gods, and uses this eternal truth to build its structure. This is a critical architectural decision: the Sidebar is not responsible for *what* the navigation items are, only for *how* they are displayed. This makes the entire system modular and easy to update. To add a new realm to the universe, one only needs to add an entry to the `NAV_ITEMS` constant, and the Sidebar will automatically forge a path to it.

## The Ritual of Navigation

For each `item` in the `NAV_ITEMS` array, the Sidebar performs a ritual of creation. It forges an `<a>` tag, a magical portal.

```tsx
<a
    key={item.id}
    onClick={(e) => {
        e.preventDefault();
        handleNavClick(item.id);
    }}
    className={`... ${activeView === item.id ? 'bg-cyan-500/20 ...' : ''}`}
>
    {item.icon}
    <span className="mx-4 font-medium">{item.label}</span>
</a>
```

-   **The Invocation**: When a user clicks the portal, `handleNavClick` is invoked. This function communicates directly with the `App` orchestrator, calling `setActiveView` to change the application's focus to the new realm.
-   **The Mark of the Traveler**: The `className` is intelligent. It constantly checks the `activeView` prop, which tells it the user's current location. If the portal's `id` matches the `activeView`, it adorns itself with a glowing cyan background and a vibrant border. This is the "You Are Here" marker on the cosmic map, providing immediate and clear feedback to the user.
-   **The Sigil and the Name**: Each portal proudly displays the realm's divine symbol (`item.icon`) and its common name (`item.label`), making navigation intuitive and visually rich.

## The Dual Form: A Master of Responsiveness

The Sidebar is a master of transformation. It understands the nature of the screen it lives on.

-   **On Large Screens (Desktop)**: It stands tall and proud, a permanent fixture on the left side of the screen, always visible. `lg:relative`, `lg:translate-x-0`.
-   **On Small Screens (Mobile)**: It becomes a creature of shadow and light. It hides itself off-screen (`-translate-x-full`) and can only be summoned by the "Key"—the menu button in the `Header`. When summoned, it glides into view, accompanied by a dark overlay that dims the rest of the world, focusing the user's attention on the act of navigation. `fixed`, `transform`.

The `Sidebar` is the user's most trusted guide. It is a beautiful, intelligent, and responsive map of the world, ensuring that the user always knows where they are and where they can go.


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/Sidebar.tsx.md
================================================================================

import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Collapse,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountBalanceWallet as WalletIcon,
  TrendingUp as TradingIcon,
  Settings as SettingsIcon,
  HelpOutline as HelpIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess,
  ExpandMore,
  BarChart as AnalyticsIcon,
  Security as SecurityIcon,
  People as TeamIcon,
  Business as VentureIcon,
  Message as ChatIcon,
  Notifications as NotificationIcon,
} from '@mui/icons-material';

// This constant defines the width of the drawer when open
const DRAWER_WIDTH = 240;

// This component renders the sidebar navigation for the application.
// It supports expanding and collapsing to save screen real estate.
const Sidebar: React.FC = () => {
  // State to manage the open/closed state of the sidebar.
  // Initialized to true to show the sidebar by default.
  const [open, setOpen] = useState(true);
  // State to manage the open/closed state of the settings submenu.
  // Initialized to false to keep settings collapsed by default.
  const [settingsOpen, setSettingsOpen] = useState(false);

  const theme = useTheme();

  // Toggles the open/closed state of the sidebar.
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Toggles the open/closed state of the settings submenu.
  const handleSettingsToggle = () => {
    setSettingsOpen(!settingsOpen);
  };

  // Defines the main navigation items for the sidebar.
  // Each item includes text and an associated icon.
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon /> },
    { text: 'Wallet', icon: <WalletIcon /> },
    { text: 'Trading', icon: <TradingIcon /> },
    { text: 'Analytics', icon: <AnalyticsIcon /> },
    { text: 'Venture', icon: <VentureIcon /> },
    { text: 'Team', icon: <TeamIcon /> },
    { text: 'Chat', icon: <ChatIcon /> },
    { text: 'Notifications', icon: <NotificationIcon /> },
    { text: 'Security', icon: <SecurityIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : 64,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : 64,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
        },
      }}
    >
      {/* Header section with toggle button for the sidebar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={handleDrawerToggle}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Divider />
      {/* Main navigation list */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {/* Settings and Logout section */}
      <List>
        {/* Settings item with collapsible submenu */}
        <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
                onClick={handleSettingsToggle}
                sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                    }}
                >
                    <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" sx={{ opacity: open ? 1 : 0 }} />
                {/* Expand/collapse icon for settings */}
                {open ? (settingsOpen ? <ExpandLess /> : <ExpandMore />) : null}
            </ListItemButton>
            {/* Collapsible settings submenu */}
            <Collapse in={settingsOpen && open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                            <HelpIcon />
                        </ListItemIcon>
                        <ListItemText primary="Help" />
                    </ListItemButton>
                </List>
            </Collapse>
        </ListItem>
        {/* Logout item */}
        <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
                sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                    }}
                >
                    <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;