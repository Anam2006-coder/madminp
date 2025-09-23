import React, { useState, useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Complaint } from '../types'
import { ComplaintCard } from './ComplaintCard'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react'
import { departments } from '../data/mockData'

interface ComplaintsProps {
  complaints: Complaint[]
  onComplaintUpdate: (id: string, status: Complaint['status'], workerNotes?: string) => void
}

export function Complaints({ complaints, onComplaintUpdate }: ComplaintsProps) {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [photoFilter, setPhotoFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'created_at' | 'updated_at' | 'priority'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const filteredComplaints = useMemo(() => {
    let filtered = complaints

    // Role-based filtering
    if (user?.role === 'sub_admin') {
      filtered = filtered.filter(c => c.department === user.department)
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(c => 
        c.citizen_name.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term) ||
        c.location.toLowerCase().includes(term) ||
        c.id.toLowerCase().includes(term)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter)
    }

    // Department filter (for main admin)
    if (departmentFilter !== 'all' && user?.role === 'main_admin') {
      filtered = filtered.filter(c => c.department === departmentFilter)
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(c => c.priority === priorityFilter)
    }

    // Photo filter
    if (photoFilter === 'with_photo') {
      filtered = filtered.filter(c => c.photos && c.photos.length > 0)
    } else if (photoFilter === 'without_photo') {
      filtered = filtered.filter(c => !c.photos || c.photos.length === 0)
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case 'created_at':
          aValue = a.created_at.getTime()
          bValue = b.created_at.getTime()
          break
        case 'updated_at':
          aValue = a.updated_at.getTime()
          bValue = b.updated_at.getTime()
          break
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 }
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder]
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder]
          break
        default:
          return 0
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    })

    return filtered
  }, [complaints, user, searchTerm, statusFilter, departmentFilter, priorityFilter, photoFilter, sortBy, sortOrder])

  const statuses = ['New', 'Seen', 'Assigned', 'In Progress', 'Completed', 'Closed']
  const priorities = ['High', 'Medium', 'Low']

  const toggleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          {user?.role === 'main_admin' ? 'All Complaints' : `${user?.department} Complaints`}
        </h1>
        <p className="text-sm text-gray-600">
          Manage and track complaint resolution
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Department Filter (Main Admin Only) */}
          {user?.role === 'main_admin' && (
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Priority Filter */}
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {priorities.map(priority => (
                <SelectItem key={priority} value={priority}>{priority}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Photo Filter */}
          <Select value={photoFilter} onValueChange={setPhotoFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Photo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Complaints</SelectItem>
              <SelectItem value="with_photo">With Photo</SelectItem>
              <SelectItem value="without_photo">Without Photo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Created Date</SelectItem>
                <SelectItem value="updated_at">Updated Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={toggleSort}>
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Showing {filteredComplaints.length} of {complaints.length} complaints
            </span>
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchTerm('')}>
              Search: {searchTerm} ×
            </Badge>
          )}
          {statusFilter !== 'all' && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setStatusFilter('all')}>
              Status: {statusFilter} ×
            </Badge>
          )}
          {departmentFilter !== 'all' && user?.role === 'main_admin' && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setDepartmentFilter('all')}>
              Department: {departmentFilter} ×
            </Badge>
          )}
          {priorityFilter !== 'all' && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setPriorityFilter('all')}>
              Priority: {priorityFilter} ×
            </Badge>
          )}
          {photoFilter !== 'all' && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setPhotoFilter('all')}>
              Photo: {photoFilter === 'with_photo' ? 'With Photo' : 'Without Photo'} ×
            </Badge>
          )}
        </div>
      </div>

      {/* Complaints Grid */}
      {filteredComplaints.length === 0 ? (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No complaints found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              onStatusUpdate={onComplaintUpdate}
            />
          ))}
        </div>
      )}
    </div>
  )
}

