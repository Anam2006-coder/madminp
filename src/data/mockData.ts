import { User, Complaint, Department } from '../types'

export const departments: Department[] = [
  { id: 'water', name: 'Water', keywords: ['water', 'leak', 'pipe', 'tap', 'drainage', 'sewage', 'plumbing'], sla_hours: 48 },
  { id: 'roads', name: 'Roads', keywords: ['road', 'pothole', 'street', 'traffic', 'signal', 'sign', 'pavement'], sla_hours: 72 },
  { id: 'electricity', name: 'Electricity', keywords: ['electricity', 'power', 'light', 'streetlight', 'wire', 'pole', 'outage'], sla_hours: 48 },
  { id: 'garbage', name: 'Garbage', keywords: ['garbage', 'waste', 'trash', 'dustbin', 'cleaning', 'sanitation'], sla_hours: 24 },
  { id: 'health', name: 'Health', keywords: ['health', 'hospital', 'medical', 'doctor', 'medicine', 'clinic'], sla_hours: 24 },
  { id: 'education', name: 'Education', keywords: ['school', 'education', 'teacher', 'student', 'classroom', 'books'], sla_hours: 72 }
]

export const users: User[] = [
  { id: '1', username: 'admin', role: 'main_admin', name: 'Main Administrator' },
  { id: '2', username: 'water_admin', role: 'sub_admin', department: 'Water', name: 'Water Department Admin' },
  { id: '3', username: 'roads_admin', role: 'sub_admin', department: 'Roads', name: 'Roads Department Admin' },
  { id: '4', username: 'electricity_admin', role: 'sub_admin', department: 'Electricity', name: 'Electricity Department Admin' },
  { id: '5', username: 'garbage_admin', role: 'sub_admin', department: 'Garbage', name: 'Garbage Department Admin' },
  { id: '6', username: 'health_admin', role: 'sub_admin', department: 'Health', name: 'Health Department Admin' },
  { id: '7', username: 'education_admin', role: 'sub_admin', department: 'Education', name: 'Education Department Admin' }
]

// Generate sample complaints
export const generateMockComplaints = (): Complaint[] => {
  const complaints: Complaint[] = []
  const citizenNames = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown', 'Lisa Davis', 'Tom Miller', 'Emma Garcia', 'Chris Lee', 'Anna Martinez']
  const locations = ['MG Road', 'Gandhi Nagar', 'Civil Lines', 'Model Town', 'Sector 15', 'New Colony', 'Old City', 'Industrial Area', 'Housing Board', 'Market Square']
  const priorities: ('High' | 'Medium' | 'Low')[] = ['High', 'Medium', 'Low']
  const statuses: Complaint['status'][] = ['New', 'Seen', 'Assigned', 'In Progress', 'Completed', 'Closed']

  const complaintTemplates = [
    { dept: 'Water', desc: 'Water leakage in the main pipe causing flooding in the street', photo: 'https://tse1.mm.bing.net/th/id/OIP.4pu8VDeGjHD2kB81GPDdYAHaER?pid=Api&P=0&h=220' },
    { dept: 'Water', desc: 'No water supply for the past 3 days in our area', photo: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop' },
    { dept: 'Roads', desc: 'Large pothole on the main road causing traffic issues', photo: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop' },
    { dept: 'Roads', desc: 'Broken streetlight making the area unsafe at night', photo: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop' },
    { dept: 'Electricity', desc: 'Power outage in the residential area for over 12 hours', photo: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop' },
    { dept: 'Electricity', desc: 'Damaged electrical wire hanging dangerously low', photo: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop' },
    { dept: 'Garbage', desc: 'Garbage not collected for a week, creating unhygienic conditions', photo: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop' },
    { dept: 'Garbage', desc: 'Overflowing dustbin attracting stray animals', photo: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop' },
    { dept: 'Health', desc: 'Mosquito breeding in stagnant water near health center', photo: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop' },
    { dept: 'Health', desc: 'Lack of medical staff at the community health center', photo: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop' },
    { dept: 'Education', desc: 'Broken desks and chairs in the primary school', photo: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop' },
    { dept: 'Education', desc: 'No proper drinking water facility in the school', photo: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop' }
  ]

  for (let i = 1; i <= 50; i++) {
    const template = complaintTemplates[Math.floor(Math.random() * complaintTemplates.length)]
    const createdAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within last week
    const updatedAt = new Date(createdAt.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000) // Updated within 2 days of creation

    complaints.push({
      id: `complaint_${i}`,
      citizen_name: citizenNames[Math.floor(Math.random() * citizenNames.length)],
      department: template.dept,
      description: template.desc,
      photo: Math.random() > 0.3 ? template.photo : undefined, // 70% chance of having a photo
      location: locations[Math.floor(Math.random() * locations.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      created_at: createdAt,
      updated_at: updatedAt,
      assigned_worker: Math.random() > 0.5 ? `Worker ${Math.floor(Math.random() * 10) + 1}` : undefined,
      worker_notes: Math.random() > 0.7 ? 'Investigation in progress' : undefined
    })
  }

  return complaints.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
}

export const mockComplaints = generateMockComplaints()

// Password for all users is 'password'
export const userCredentials: Record<string, string> = {
  'admin': 'password',
  'water_admin': 'password',
  'roads_admin': 'password',
  'electricity_admin': 'password',
  'garbage_admin': 'password',
  'health_admin': 'password',
  'education_admin': 'password'
}

