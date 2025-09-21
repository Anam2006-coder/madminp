import React, { useMemo } from 'react'
import { Complaint } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts'
import { 
  Clock,
  AlertTriangle,
  Target,
  Award,
  MapPin
} from 'lucide-react'
import { calculateSLAStatus } from '../lib/utils'

interface AnalyticsProps {
  complaints: Complaint[]
}

export function Analytics({ complaints }: AnalyticsProps) {
  // Department performance metrics
  const departmentMetrics = useMemo(() => {
    const deptGroups = complaints.reduce((acc, complaint) => {
      if (!acc[complaint.department]) {
        acc[complaint.department] = []
      }
      acc[complaint.department].push(complaint)
      return acc
    }, {} as Record<string, Complaint[]>)

    return Object.entries(deptGroups).map(([dept, deptComplaints]) => {
      const total = deptComplaints.length
      const resolved = deptComplaints.filter(c => c.status === 'Completed').length
      const pending = deptComplaints.filter(c => !['Completed', 'Closed'].includes(c.status)).length
      const overdue = deptComplaints.filter(c => {
        const sla = calculateSLAStatus(c.created_at, c.department)
        return sla.status === 'overdue' && !['Completed', 'Closed'].includes(c.status)
      }).length

      // Calculate average resolution time
      const resolvedComplaints = deptComplaints.filter(c => c.status === 'Completed')
      const avgResolutionTime = resolvedComplaints.length > 0
        ? resolvedComplaints.reduce((acc, c) => {
            const diffHours = (c.updated_at.getTime() - c.created_at.getTime()) / (1000 * 60 * 60)
            return acc + diffHours
          }, 0) / resolvedComplaints.length
        : 0

      const resolutionRate = total > 0 ? (resolved / total) * 100 : 0

      return {
        department: dept,
        total,
        resolved,
        pending,
        overdue,
        avgResolutionTime: Math.round(avgResolutionTime),
        resolutionRate: Math.round(resolutionRate)
      }
    })
  }, [complaints])

  // Monthly trends
  const monthlyTrends = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (5 - i))
      return {
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        year: date.getFullYear(),
        monthIndex: date.getMonth()
      }
    })

    return last6Months.map(({ month, year, monthIndex }) => {
      const monthComplaints = complaints.filter(c => 
        c.created_at.getFullYear() === year && c.created_at.getMonth() === monthIndex
      )
      
      const resolved = monthComplaints.filter(c => c.status === 'Completed').length

      return {
        month,
        created: monthComplaints.length,
        resolved
      }
    })
  }, [complaints])

  // Priority analysis
  const priorityAnalysis = useMemo(() => {
    const priorityCounts = complaints.reduce((acc, complaint) => {
      const priority = complaint.priority
      if (!acc[priority]) {
        acc[priority] = { total: 0, resolved: 0, pending: 0, overdue: 0 }
      }
      
      acc[priority].total++
      
      if (complaint.status === 'Completed') {
        acc[priority].resolved++
      } else if (!['Completed', 'Closed'].includes(complaint.status)) {
        acc[priority].pending++
        
        const sla = calculateSLAStatus(complaint.created_at, complaint.department)
        if (sla.status === 'overdue') {
          acc[priority].overdue++
        }
      }

      return acc
    }, {} as Record<string, { total: number, resolved: number, pending: number, overdue: number }>)

    return Object.entries(priorityCounts).map(([priority, data]) => ({
      priority,
      ...data,
      resolutionRate: data.total > 0 ? Math.round((data.resolved / data.total) * 100) : 0
    }))
  }, [complaints])

  // SLA performance
  const slaPerformance = useMemo(() => {
    const totalComplaints = complaints.length
    const withinSLA = complaints.filter(c => {
      const sla = calculateSLAStatus(c.created_at, c.department)
      return sla.status === 'within' || c.status === 'Completed'
    }).length
    
    const approachingSLA = complaints.filter(c => {
      const sla = calculateSLAStatus(c.created_at, c.department)
      return sla.status === 'approaching' && !['Completed', 'Closed'].includes(c.status)
    }).length
    
    const breachedSLA = complaints.filter(c => {
      const sla = calculateSLAStatus(c.created_at, c.department)
      return sla.status === 'overdue' && !['Completed', 'Closed'].includes(c.status)
    }).length

    return {
      withinSLA: totalComplaints > 0 ? Math.round((withinSLA / totalComplaints) * 100) : 0,
      approaching: approachingSLA,
      breached: breachedSLA,
      total: totalComplaints
    }
  }, [complaints])

  // Top locations by complaint count
  const locationAnalysis = useMemo(() => {
    const locationCounts = complaints.reduce((acc, complaint) => {
      acc[complaint.location] = (acc[complaint.location] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(locationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([location, count]) => ({ location, count }))
  }, [complaints])

  const colors = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#f97316']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-sm text-gray-600">Comprehensive insights and performance metrics</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">SLA Compliance</p>
                <p className="text-lg font-bold text-green-600">{slaPerformance.withinSLA}%</p>
                <p className="text-xs text-gray-500">Within SLA targets</p>
              </div>
              <Target className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">SLA Breaches</p>
                <p className="text-lg font-bold text-red-600">{slaPerformance.breached}</p>
                <p className="text-xs text-gray-500">Active overdue complaints</p>
              </div>
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Best Department</p>
                <p className="text-sm font-bold text-blue-600">
                  {departmentMetrics.length > 0 
                    ? departmentMetrics.reduce((best, dept) => 
                        dept.resolutionRate > best.resolutionRate ? dept : best
                      ).department 
                    : 'N/A'
                  }
                </p>
                <p className="text-xs text-gray-500">Highest resolution rate</p>
              </div>
              <Award className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Avg Resolution</p>
                <p className="text-lg font-bold text-gray-900">
                  {departmentMetrics.length > 0 
                    ? Math.round(departmentMetrics.reduce((acc, dept) => acc + dept.avgResolutionTime, 0) / departmentMetrics.length)
                    : 0
                  }h
                </p>
                <p className="text-xs text-gray-500">Hours to resolve</p>
              </div>
              <Clock className="h-5 w-5 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="departments" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="priority">Priority</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        {/* Department Performance */}
        <TabsContent value="departments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Resolution Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="department" 
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Resolution Rate']} />
                    <Bar dataKey="resolutionRate" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Resolution Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="department" 
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}h`, 'Avg Resolution Time']} />
                    <Bar dataKey="avgResolutionTime" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Department Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Department Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Department</th>
                      <th className="text-right p-2">Total</th>
                      <th className="text-right p-2">Resolved</th>
                      <th className="text-right p-2">Pending</th>
                      <th className="text-right p-2">Overdue</th>
                      <th className="text-right p-2">Resolution Rate</th>
                      <th className="text-right p-2">Avg Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentMetrics.map((dept, index) => (
                      <tr key={dept.department} className="border-b">
                        <td className="p-2 font-medium">{dept.department}</td>
                        <td className="text-right p-2">{dept.total}</td>
                        <td className="text-right p-2 text-green-600">{dept.resolved}</td>
                        <td className="text-right p-2 text-yellow-600">{dept.pending}</td>
                        <td className="text-right p-2 text-red-600">{dept.overdue}</td>
                        <td className="text-right p-2">
                          <Badge variant={dept.resolutionRate >= 80 ? 'default' : 'secondary'}>
                            {dept.resolutionRate}%
                          </Badge>
                        </td>
                        <td className="text-right p-2">{dept.avgResolutionTime}h</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly Trends */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Complaint Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="created" 
                    stackId="1"
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.6}
                    name="Created"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="resolved" 
                    stackId="2"
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.6}
                    name="Resolved"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Priority Analysis */}
        <TabsContent value="priority" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Priority Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={priorityAnalysis}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ priority, total }) => `${priority}: ${total}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="total"
                    >
                      {priorityAnalysis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Priority Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {priorityAnalysis.map((priority, index) => (
                    <div key={priority.priority} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{priority.priority} Priority</span>
                        <Badge 
                          style={{ backgroundColor: colors[index % colors.length] }}
                          className="text-white"
                        >
                          {priority.resolutionRate}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{priority.total}</div>
                          <div className="text-gray-500">Total</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-green-600">{priority.resolved}</div>
                          <div className="text-gray-500">Resolved</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-yellow-600">{priority.pending}</div>
                          <div className="text-gray-500">Pending</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-red-600">{priority.overdue}</div>
                          <div className="text-gray-500">Overdue</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Location Analysis */}
        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Top Complaint Locations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={locationAnalysis} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="location" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
