export interface User {
  id: string
  username: string
  role: 'main_admin' | 'sub_admin'
  department?: string
  name: string
}

export interface Complaint {
  id: string
  citizen_name: string
  department: string
  description: string
  photo?: string
  location: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'New' | 'Seen' | 'Assigned' | 'In Progress' | 'Completed' | 'Closed'
  created_at: Date
  updated_at: Date
  assigned_worker?: string
  worker_notes?: string
}

export interface Department {
  id: string
  name: string
  keywords: string[]
  sla_hours: number
}

export interface DashboardStats {
  total_complaints: number
  pending_complaints: number
  resolved_today: number
  overdue_complaints: number
  avg_resolution_time: number
  department_wise_count: Record<string, number>
  priority_wise_count: Record<string, number>
  status_wise_count: Record<string, number>
}

export interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

