import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  LogOut, 
  Shield,
  User
} from 'lucide-react'
import { cn } from '../lib/utils'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user, logout } = useAuth()

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'complaints', label: 'Complaints', icon: FileText },
    ...(user?.role === 'main_admin' ? [{ id: 'analytics', label: 'Analytics', icon: BarChart3 }] : [])
  ]

  return (
    <div className="bg-white border-r border-gray-200 w-64 min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-sm font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-xs text-gray-500">Complaint Management</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="bg-primary/10 p-1.5 rounded-full">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role === 'main_admin' ? 'Main Admin' : `${user?.department} Admin`}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-2 px-2 py-1.5 rounded-lg text-left transition-colors text-sm",
                    activeTab === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-200">
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start text-gray-700 hover:text-gray-900 text-sm h-8"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}

