import React, { useState } from 'react'
import { Complaint } from '../types'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { 
  MapPin, 
  Clock, 
  User, 
  AlertTriangle,
  Eye,
  UserCheck,
  PlayCircle,
  CheckCircle,
  XCircle,
  FileText,
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { formatDate, formatTimeAgo, calculateSLAStatus } from '../lib/utils'

interface ComplaintCardProps {
  complaint: Complaint
  onStatusUpdate: (id: string, status: Complaint['status'], workerNotes?: string) => void
}

export function ComplaintCard({ complaint, onStatusUpdate }: ComplaintCardProps) {
  const { user } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState<Complaint['status']>(complaint.status)
  const [workerNotes, setWorkerNotes] = useState(complaint.worker_notes || '')
  const [showImagePreview, setShowImagePreview] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  
  const slaStatus = calculateSLAStatus(complaint.created_at, complaint.department)
  
  const getStatusColor = (status: Complaint['status']) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800'
      case 'Seen': return 'bg-yellow-100 text-yellow-800'
      case 'Assigned': return 'bg-purple-100 text-purple-800'
      case 'In Progress': return 'bg-orange-100 text-orange-800'
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSLAColor = () => {
    switch (slaStatus.status) {
      case 'overdue': return 'border-l-4 border-red-500 bg-red-50'
      case 'approaching': return 'border-l-4 border-yellow-500 bg-yellow-50'
      default: return ''
    }
  }

  const getStatusIcon = (status: Complaint['status']) => {
    switch (status) {
      case 'New': return <FileText className="h-4 w-4" />
      case 'Seen': return <Eye className="h-4 w-4" />
      case 'Assigned': return <UserCheck className="h-4 w-4" />
      case 'In Progress': return <PlayCircle className="h-4 w-4" />
      case 'Completed': return <CheckCircle className="h-4 w-4" />
      case 'Closed': return <XCircle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getNextStatuses = (currentStatus: Complaint['status']): Complaint['status'][] => {
    switch (currentStatus) {
      case 'New': return ['Seen']
      case 'Seen': return ['Assigned']
      case 'Assigned': return ['In Progress']
      case 'In Progress': return ['Completed']
      case 'Completed': return ['Closed']
      case 'Closed': return []
      default: return []
    }
  }

  const handleStatusUpdate = async () => {
    setIsUpdating(true)
    try {
      await onStatusUpdate(complaint.id, newStatus, workerNotes)
    } finally {
      setIsUpdating(false)
    }
  }

  const canUpdateStatus = user?.role === 'sub_admin' && user.department === complaint.department

  return (
    <Card className={`hover:shadow-md transition-shadow ${getSLAColor()}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-sm">#{complaint.id}</CardTitle>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <User className="h-3 w-3" />
              <span>{complaint.citizen_name}</span>
              <Clock className="h-3 w-3 ml-2" />
              <span>{formatTimeAgo(complaint.created_at)}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Badge className={getPriorityColor(complaint.priority)}>
              {complaint.priority}
            </Badge>
            <Badge className={getStatusColor(complaint.status)}>
              <div className="flex items-center space-x-1">
                {getStatusIcon(complaint.status)}
                <span>{complaint.status}</span>
              </div>
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Department & Location */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-medium text-gray-700">Department</p>
            <p className="text-xs text-gray-900">{complaint.department}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-700">Location</p>
            <div className="flex items-center space-x-1 text-xs text-gray-900">
              <MapPin className="h-3 w-3" />
              <span>{complaint.location}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-xs font-medium text-gray-700 mb-1">Description</p>
          <p className="text-xs text-gray-900">{complaint.description}</p>
        </div>

        {/* Photos Section */}
        {(complaint.photos && complaint.photos.length > 0) && (
          <div>
            <p className="text-xs font-medium text-gray-700 mb-2">Attached Photos</p>
            <div className="grid grid-cols-3 gap-2">
              {(complaint.photos ?? []).slice(0, 6).map((src, idx) => (
                <button
                  key={idx}
                  className="relative w-full aspect-square overflow-hidden rounded-md border bg-gray-100"
                  onClick={() => { setActiveImageIndex(idx); setShowImagePreview(true) }}
                >
                  {/* 1:1 square thumbnail */}
                  <img
                    src={src}
                    alt={`Complaint photo ${idx + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U1ZTVlNSIvPjwvc3ZnPg=='
                    }}
                  />
                  {idx === 5 && (complaint.photos?.length ?? 0) > 6 && (
                    <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-xs font-medium">+{(complaint.photos?.length ?? 0) - 5}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SLA Warning */}
        {slaStatus.status === 'overdue' && (
          <div className="flex items-center space-x-2 p-2 bg-red-50 border border-red-200 rounded-md">
            <AlertTriangle className="h-3 w-3 text-red-600" />
            <span className="text-xs text-red-800 font-medium">
              SLA Overdue by {Math.abs(Math.floor(slaStatus.hoursRemaining))} hours
            </span>
          </div>
        )}

        {slaStatus.status === 'approaching' && (
          <div className="flex items-center space-x-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
            <AlertTriangle className="h-3 w-3 text-yellow-600" />
            <span className="text-xs text-yellow-800 font-medium">
              SLA deadline in {Math.floor(slaStatus.hoursRemaining)} hours
            </span>
          </div>
        )}

        {/* Worker Assignment */}
        {complaint.assigned_worker && (
          <div>
            <p className="text-xs font-medium text-gray-700">Assigned Worker</p>
            <p className="text-xs text-gray-900">{complaint.assigned_worker}</p>
          </div>
        )}

        {/* Worker Notes */}
        {complaint.worker_notes && (
          <div>
            <p className="text-xs font-medium text-gray-700">Notes</p>
            <p className="text-xs text-gray-900">{complaint.worker_notes}</p>
          </div>
        )}

        {/* Status Update Section for Sub Admins */}
        {canUpdateStatus && getNextStatuses(complaint.status).length > 0 && (
          <div className="border-t pt-3 space-y-2">
            <p className="text-xs font-medium text-gray-700">Update Status</p>
            
            <div className="grid grid-cols-2 gap-2">
              <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Complaint['status'])}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {getNextStatuses(complaint.status).map((status) => (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(status)}
                        <span>{status}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleStatusUpdate}
                disabled={isUpdating || newStatus === complaint.status}
                size="sm"
                className="h-8 text-xs"
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </Button>
            </div>

            <Input
              placeholder="Add notes about the progress..."
              value={workerNotes}
              onChange={(e) => setWorkerNotes(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
        )}

        {/* Timestamps */}
        <div className="text-xs text-gray-500 border-t pt-2">
          <p>Created: {formatDate(complaint.created_at)}</p>
          <p>Updated: {formatDate(complaint.updated_at)}</p>
        </div>
      </CardContent>

      {/* Image Preview Modal */}
      {showImagePreview && complaint.photos && complaint.photos.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Complaint Photos - #{complaint.id}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImagePreview(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <div className="relative">
                <img
                  src={(complaint.photos ?? [])[activeImageIndex]}
                  alt={`Complaint photo ${activeImageIndex + 1} for ${complaint.citizen_name}`}
                  className="max-w-full max-h-[70vh] object-contain mx-auto rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2YjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+'
                  }}
                />
                {complaint.photos.length > 1 && (
                  <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
                    <button
                      className="h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center"
                      onClick={() => setActiveImageIndex((activeImageIndex - 1 + complaint.photos!.length) % complaint.photos!.length)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      className="h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center"
                      onClick={() => setActiveImageIndex((activeImageIndex + 1) % complaint.photos!.length)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {complaint.photos.length > 1 && (
                  <div className="mt-3 flex gap-2 justify-center">
                    {complaint.photos.map((src, i) => (
                      <button
                        key={i}
                        className={`h-10 w-10 rounded border overflow-hidden ${i === activeImageIndex ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => setActiveImageIndex(i)}
                      >
                        <img src={src} alt={`thumb ${i+1}`} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Complaint ID:</strong> #{complaint.id}</p>
                <p><strong>Citizen:</strong> {complaint.citizen_name}</p>
                <p><strong>Location:</strong> {complaint.location}</p>
                <p><strong>Department:</strong> {complaint.department}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

