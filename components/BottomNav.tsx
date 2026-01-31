import React from 'react';
import { AppTab } from '../types';
import Icon from './Icon';

interface BottomNavProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const navItems = [
    { id: AppTab.HOME, label: '首页', icon: 'home' },
    { id: AppTab.APPS, label: '应用', icon: 'grid_view' },
    { id: AppTab.FEED, label: '动态', icon: 'explore' },
    { id: AppTab.PROFILE, label: '我的', icon: 'person' },
  ];

  return (
    <nav className="absolute bottom-0 left-0 w-full z-50 bg-white/95 dark:bg-[#101622]/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-[calc(env(safe-area-inset-bottom,0px)+8px)] pt-2">
      <div className="grid grid-cols-4 items-center">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex flex-col items-center gap-1 cursor-pointer transition-colors outline-none"
            >
              <Icon 
                name={item.icon} 
                filled={isActive} 
                className={isActive ? 'text-primary scale-105 transition-transform' : 'text-slate-400 dark:text-slate-500'}
                size={26}
              />
              <span className={`text-[10px] font-medium ${isActive ? 'text-primary font-bold' : 'text-slate-400 dark:text-slate-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;