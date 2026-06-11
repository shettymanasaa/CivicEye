export default function PriorityBadge({ complaint }) {
  if (complaint.escalated) {
    return <span className="badge badge-escalated">🔴 Overdue</span>
  }
  if(complaint.severity === 'very high'){
    return <span className="badge badge-very-high">🚨 Very High</span>
  }
  if (complaint.severity === 'high') {
    return <span className="badge badge-high">High</span>
  }
  if (complaint.severity === 'medium') {
    return <span className="badge badge-medium">Medium</span>
  }
  return <span className="badge badge-low">Low</span>
}
