// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/clients/web-app/src/app/dashboard/layout.tsx
================================================================================

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import {
  Bell,
  Home,
  LineChart,
  Package,
  Package2,
  Settings,
  Users,
  KeyRound,
  Webhook,
  BookText,
  CreditCard,
  LifeBuoy,
  Menu,
  Search,
  Code,
  Cloud,
  Puzzle,
  Shield,
  Database,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: string;
  disabled?: boolean;
}

const mainNavItems: NavItem[] = [
  { href: '/dashboard', icon: Home, label: 'Overview' },
  { href: '/dashboard/analytics', icon: LineChart, label: 'Analytics' },
  { href: '/dashboard/integrations', icon: Puzzle, label: 'Integrations', badge: 'New' },
  { href: '/dashboard/logs', icon: BookText, label: 'Logs' },
];

const developerNavItems: NavItem[] = [
    { href: '/dashboard/api-keys', icon: KeyRound, label: 'API Keys' },
    { href: '/dashboard/webhooks', icon: Webhook, label: 'Webhooks' },
    { href: '/dashboard/sdk', icon: Code, label: 'SDK & Libraries' },
];

const platformNavItems: NavItem[] = [
    { href: '/dashboard/cloud', icon: Cloud, label: 'Cloud Connectors' },
    { href: '/dashboard/security', icon: Shield, label: 'Security' },
    { href: '/dashboard/data', icon: Database, label: 'Data Management' },
]

const accountNavItems: NavItem[] = [
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
  { href: '/dashboard/billing', icon: CreditCard, label: 'Billing' },
  { href: '/dashboard/team', icon: Users, label: 'Team Members' },
];

function NavLink({ href, icon: Icon, label, badge, disabled }: NavItem) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={disabled ? '#' : href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
        isActive && 'bg-muted text-primary',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
      {badge && (
        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
          {badge}
        </Badge>
      )}
    </Link>
  );
}

function SidebarNav() {
    return (
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Main</h3>
            {mainNavItems.map((item) => (
                <NavLink key={item.href} {...item} />
            ))}
            <h3 className="px-3 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Developer</h3>
            {developerNavItems.map((item) => (
                <NavLink key={item.href} {...item} />
            ))}
            <h3 className="px-3 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Platform</h3>
            {platformNavItems.map((item) => (
                <NavLink key={item.href} {...item} />
            ))}
            <h3 className="px-3 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</h3>
            {accountNavItems.map((item) => (
                <NavLink key={item.href} {...item} />
            ))}
        </nav>
    );
}

function Sidebar() {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">FusionFlow</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1 overflow-auto py-2">
            <SidebarNav />
        </div>
        <div className="mt-auto p-4">
          <Card>
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>Upgrade to Pro</CardTitle>
              <CardDescription>
                Unlock all features and get unlimited access to our support
                team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <Package2 className="h-6 w-6" />
                    <span className="">FusionFlow</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <SidebarNav />
            </div>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search integrations, APIs, documentation..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <ThemeToggle />
      <UserButton afterSignOutUrl="/" />
    </header>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    // You can render a loading skeleton here
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}