import React, { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Login } from './components/Login'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './components/Dashboard'
import { Complaints } from './components/Complaints'
import { Analytics } from './components/Analytics'
import { mockComplaints } from './data/mockData'
import { Complaint } from './types'

function AppContent() {
  const { isAuthenticated, user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints)

  const handleComplaintUpdate = (id: string, status: Complaint['status'], workerNotes?: string) => {
    setComplaints(prevComplaints =>
      prevComplaints.map(complaint =>
        complaint.id === id
          ? {
              ...complaint,
              status,
              worker_notes: workerNotes || complaint.worker_notes,
              updated_at: new Date()
            }
          : complaint
      )
    )
  }

  if (!isAuthenticated) {
    return <Login />
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard complaints={complaints} />
      case 'complaints':
        return (
          <Complaints
            complaints={complaints}
            onComplaintUpdate={handleComplaintUpdate}
          />
        )
      case 'analytics':
        return user?.role === 'main_admin' ? (
          <Analytics complaints={complaints} />
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Access denied. Main admin only.</p>
          </div>
        )
      default:
        return <Dashboard complaints={complaints} />
    }
  }

  const bgClass = activeTab === 'dashboard' ? 'bg-dashboard' : activeTab === 'complaints' ? 'bg-complaints' : activeTab === 'analytics' ? 'bg-analytics' : 'bg-dashboard'

  return (
    <div className={`flex h-screen ${bgClass}`}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        <div className="p-6 bg-white/80 backdrop-blur-sm min-h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
