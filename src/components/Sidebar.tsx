// REPOSITORY SOURCE: diplomat-bit/partnerportal-microsoft | PATH: diplomat-bit-partnerportal-microsoft-81d9840/src/components/Sidebar.tsx
================================================================================

import React from 'react';
import { 
  Settings, 
  Wallet, 
  Send, 
  TrendingUp, 
  ChevronDown, 
  ChevronRight,
  Landmark
} from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { NavItem } from '../types';

const iconMap: Record<string, any> = {
  Settings,
  Wallet,
  Send,
  TrendingUp,
};

interface SidebarProps {
  accounts: any[];
}

export const Sidebar: React.FC<SidebarProps> = ({ accounts }) => {
  const [expanded, setExpanded] = React.useState<string[]>(['accounts']);

  const toggleExpand = (id: string) => {
    setExpanded(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const dynamicNavItems: NavItem[] = NAV_ITEMS.map(item => {
    if (item.id === 'accounts' && accounts.length > 0) {
      return {
        ...item,
        children: accounts.map(acc => ({
          id: acc.account_id,
          label: `${acc.name} ($${acc.balances.current.toFixed(2)})`
        }))
      };
    }
    return item;
  });

  const renderNavItem = (item: NavItem, depth = 0) => {
    const Icon = item.icon ? iconMap[item.icon] : null;
    const isExpanded = expanded.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="select-none">
        <div 
          className={`
            flex items-center px-3 py-2 text-sm cursor-pointer transition-colors
            ${item.id === 'checking' ? 'bg-[#E5F1FF] text-[#0078D4] font-medium' : 'text-[#323130] hover:bg-[#F3F2F1]'}
            ${depth > 0 ? 'pl-9' : ''}
          `}
          onClick={() => hasChildren && toggleExpand(item.id)}
        >
          {depth === 0 && (
            <div className="w-5 flex justify-center mr-2">
              {hasChildren ? (
                isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
              ) : Icon ? <Icon size={16} /> : null}
            </div>
          )}
          <span>{item.label}</span>
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-0.5">
            {item.children?.map(child => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-[#EDEBE9] flex flex-col h-full overflow-y-auto">
      <div className="p-4 flex items-center gap-2 border-b border-[#EDEBE9] mb-2">
        <div className="w-6 h-6 bg-[#0078D4] rounded flex items-center justify-center">
          <Landmark size={14} className="text-white" />
        </div>
        <span className="font-semibold text-[#323130]">Sovereign Bank</span>
      </div>
      <nav className="flex-1 py-2">
        {dynamicNavItems.map(item => renderNavItem(item))}
      </nav>
    </aside>
  );
};
