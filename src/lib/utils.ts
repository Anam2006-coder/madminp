import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

export function calculateSLAStatus(createdAt: Date, department: string): { 
  status: 'within' | 'approaching' | 'overdue', 
  hoursRemaining: number 
} {
  const slaHours: Record<string, number> = {
    'Garbage': 24,
    'Electricity': 48,
    'Roads': 72,
    'Water': 48,
    'Health': 24,
    'Education': 72
  }
  
  const deadline = slaHours[department] || 48
  const now = new Date()
  const diffInHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
  const hoursRemaining = deadline - diffInHours
  
  if (hoursRemaining <= 0) return { status: 'overdue', hoursRemaining }
  if (hoursRemaining <= deadline * 0.25) return { status: 'approaching', hoursRemaining }
  return { status: 'within', hoursRemaining }
}

