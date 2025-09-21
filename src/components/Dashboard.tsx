import React, { useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Complaint } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { calculateSLAStatus } from '../lib/utils'

interface DashboardProps {
  complaints: Complaint[]
}

export function Dashboard({ complaints }: DashboardProps) {
  const { user } = useAuth()

  const filteredComplaints = useMemo(() => {
    if (user?.role === 'main_admin') {
      return complaints
    }
    return complaints.filter(c => c.department === user?.department)
  }, [complaints, user])

  const stats = useMemo(() => {
    const total = filteredComplaints.length
    const pending = filteredComplaints.filter(c => !['Completed', 'Closed'].includes(c.status)).length
    const today = new Date().toDateString()
    const resolvedToday = filteredComplaints.filter(c => 
      c.status === 'Completed' && c.updated_at.toDateString() === today
    ).length
    
    const overdue = filteredComplaints.filter(c => {
      const sla = calculateSLAStatus(c.created_at, c.department)
      return sla.status === 'overdue' && !['Completed', 'Closed'].includes(c.status)
    }).length

    // Calculate average resolution time
    const resolvedComplaints = filteredComplaints.filter(c => c.status === 'Completed')
    const avgResolutionTime = resolvedComplaints.length > 0 
      ? resolvedComplaints.reduce((acc, c) => {
          const diffHours = (c.updated_at.getTime() - c.created_at.getTime()) / (1000 * 60 * 60)
          return acc + diffHours
        }, 0) / resolvedComplaints.length
      : 0

    return { total, pending, resolvedToday, overdue, avgResolutionTime }
  }, [filteredComplaints])

  // Department-wise data (only for main admin)
  const departmentData = useMemo(() => {
    if (user?.role !== 'main_admin') return []
    
    const deptCounts = complaints.reduce((acc, complaint) => {
      acc[complaint.department] = (acc[complaint.department] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(deptCounts).map(([dept, count]) => ({
      department: dept,
      count
    }))
  }, [complaints, user])

  // Priority distribution
  const priorityData = useMemo(() => {
    const priorityCounts = filteredComplaints.reduce((acc, complaint) => {
      acc[complaint.priority] = (acc[complaint.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(priorityCounts).map(([priority, count]) => ({
      priority,
      count,
      fill: priority === 'High' ? '#ef4444' : priority === 'Medium' ? '#f59e0b' : '#10b981'
    }))
  }, [filteredComplaints])

  // Status distribution
  const statusData = useMemo(() => {
    const statusCounts = filteredComplaints.reduce((acc, complaint) => {
      acc[complaint.status] = (acc[complaint.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count
    }))
  }, [filteredComplaints])

  // Recent activity (last 7 days)
  const weeklyData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toDateString()
    })

    return last7Days.map(dateStr => {
      const dayComplaints = filteredComplaints.filter(c => 
        c.created_at.toDateString() === dateStr
      ).length
      
      return {
        date: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
        complaints: dayComplaints
      }
    })
  }, [filteredComplaints])

  const StatCard = ({ title, value, icon: Icon, trend, color = 'text-gray-900' }: {
    title: string
    value: string | number
    icon: any
    trend?: string
    color?: string
  }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-600">{title}</p>
            <p className={`text-lg font-bold ${color}`}>{value}</p>
            {trend && <p className="text-xs text-gray-500 mt-1">{trend}</p>}
          </div>
          <div className="p-2 bg-primary/10 rounded-full">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          {user?.role === 'main_admin' ? 'Admin Dashboard' : `${user?.department} Dashboard`}
        </h1>
        <p className="text-sm text-gray-600">
          Overview of complaints and system performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Complaints"
          value={stats.total}
          icon={FileText}
          trend="All time"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          trend="Awaiting resolution"
          color={stats.pending > 0 ? 'text-yellow-600' : 'text-gray-900'}
        />
        <StatCard
          title="Resolved Today"
          value={stats.resolvedToday}
          icon={CheckCircle}
          trend="Last 24 hours"
          color="text-green-600"
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          icon={AlertTriangle}
          trend="SLA breached"
          color={stats.overdue > 0 ? 'text-red-600' : 'text-gray-900'}
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Avg Resolution Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.avgResolutionTime > 0 ? `${Math.round(stats.avgResolutionTime)}h` : 'N/A'}
            </div>
            <p className="text-sm text-gray-600">Average time to resolve complaints</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Active Departments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {user?.role === 'main_admin' ? departmentData.length : 1}
            </div>
            <p className="text-sm text-gray-600">Departments with active complaints</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Resolution Rate</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.total > 0 ? Math.round(((stats.total - stats.pending) / stats.total) * 100) : 0}%
            </div>
            <p className="text-sm text-gray-600">Complaints resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution (Main Admin Only) */}
        {user?.role === 'main_admin' && departmentData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Complaints by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="department" 
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ priority, count }) => `${priority}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="status" 
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="complaints" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Overdue Complaints Alert */}
      {stats.overdue > 0 && (
        <Card className="border-l-4 border-red-500 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span>SLA Alert</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">
              You have <strong>{stats.overdue}</strong> complaints that are overdue. 
              Please review and take immediate action to resolve them.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
