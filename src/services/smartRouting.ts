import { departments } from '../data/mockData'
import { Complaint } from '../types'

function normalizeText(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9\s]/g, '')
		.replace(/\s+/g, ' ')
		.trim()
}

export function isDuplicateComplaint(
	complaints: Complaint[],
	description: string,
	location: string
): boolean {
	const normDesc = normalizeText(description)
	const normLoc = normalizeText(location)
	return complaints.some(c => {
		const cDesc = normalizeText(c.description)
		const cLoc = normalizeText(c.location)
		return cDesc === normDesc && cLoc === normLoc
	})
}

export function determineDepartment(description: string): string {
  const lowerDesc = description.toLowerCase()
  
  for (const dept of departments) {
    for (const keyword of dept.keywords) {
      if (lowerDesc.includes(keyword.toLowerCase())) {
        return dept.name
      }
    }
  }
  
  // Default to Roads if no keywords match
  return 'Roads'
}

export function determinePriority(description: string, department: string): 'High' | 'Medium' | 'Low' {
  const lowerDesc = description.toLowerCase()
  
  // High priority keywords
  const highPriorityKeywords = [
    'emergency', 'urgent', 'dangerous', 'accident', 'fire', 'flood', 'outbreak',
    'broken wire', 'gas leak', 'major', 'critical', 'immediate', 'unsafe'
  ]
  
  // Medium priority keywords  
  const mediumPriorityKeywords = [
    'outage', 'leakage', 'pothole', 'repair', 'maintenance', 'broken', 'damaged'
  ]
  
  for (const keyword of highPriorityKeywords) {
    if (lowerDesc.includes(keyword)) {
      return 'High'
    }
  }
  
  for (const keyword of mediumPriorityKeywords) {
    if (lowerDesc.includes(keyword)) {
      return 'Medium'
    }
  }
  
  // Special department-based priority rules
  if (department === 'Health' || department === 'Garbage') {
    return 'Medium' // Health and sanitation are generally medium priority
  }
  
  return 'Low'
}

export function processNewComplaint(
  citizen_name: string,
  description: string,
  location: string,
  photos?: string[]
): Omit<Complaint, 'id'> {
  const department = determineDepartment(description)
  const priority = determinePriority(description, department)
  const now = new Date()
  
  return {
    citizen_name,
    department,
    description,
    photos,
    location,
    priority,
    status: 'New',
    created_at: now,
    updated_at: now
  }
}


