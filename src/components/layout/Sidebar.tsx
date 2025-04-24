
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Folder, 
  List, 
  CheckSquare, 
  BarChart, 
  Settings, 
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { hasPermission, isAuthenticated } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Define navigation items with role-based permissions
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/', 
      icon: BarChart,
      allowedRoles: ['admin', 'test_manager', 'test_engineer'] as UserRole[]
    },
    { 
      name: 'Projects', 
      path: '/projects', 
      icon: Folder,
      allowedRoles: ['admin', 'test_manager', 'test_engineer'] as UserRole[]
    },
    { 
      name: 'Test Cases', 
      path: '/test-cases', 
      icon: List,
      allowedRoles: ['admin', 'test_manager', 'test_engineer'] as UserRole[]
    },
    { 
      name: 'Test Execution', 
      path: '/test-execution', 
      icon: CheckSquare,
      allowedRoles: ['admin', 'test_manager', 'test_engineer'] as UserRole[]
    },
    { 
      name: 'User Management', 
      path: '/user-management', 
      icon: Users,
      allowedRoles: ['admin'] as UserRole[]
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: Settings,
      allowedRoles: ['admin', 'test_manager'] as UserRole[]
    },
  ];

  // Filter navigation items based on user permissions
  const filteredNavItems = navItems.filter(item => {
    return isAuthenticated && hasPermission(item.allowedRoles);
  });

  return (
    <div 
      className={cn(
        "h-full bg-white border-r border-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <Link to="/" className="flex items-center">
            <span className="font-bold text-xl text-primary">TestPro</span>
          </Link>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto" 
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {filteredNavItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center py-2 px-3 rounded-md transition-colors",
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center">
          {!collapsed && (
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">TestPro v1.0</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
