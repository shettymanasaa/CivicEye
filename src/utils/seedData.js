// ============================================================
// SEED SCRIPT — Run this ONCE to add demo data to Firestore
// How to use:
// 1. Import this file temporarily in main.jsx
// 2. Call seedDemoData() once from the browser console
// 3. Remove the import after seeding
// ============================================================

import { db } from '../firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'

export async function seedDemoData() {
  const now = Date.now()

  const demoComplaints = [
    {
      citizenId: 'demo_citizen_1',
      issueType: ['garbage', 'pothole'],
      description: 'Garbage not cleared for 3 days and road also broken near the main gate. Very bad smell.',
      severity: 'high', priority: 9, status: 'reported', escalated: true,
      department: 'both',
      location: { lat: 17.4947, lng: 78.3996, address: 'Kukatpally Main Rd, Ward 12, Hyderabad' },
      photoUrl: '',
      createdAt: Timestamp.fromDate(new Date(now - 30 * 3600000)),
      escalatedAt: Timestamp.fromDate(new Date(now - 6 * 3600000)),
      assignedAt: null, resolvedAt: null
    },
    {
      citizenId: 'demo_citizen_2',
      issueType: ['garbage'],
      description: 'Dustbin near bus stop overflowing. Citizens are dumping on the road.',
      severity: 'medium', priority: 5, status: 'in_progress', escalated: false,
      department: 'sanitation',
      location: { lat: 17.4960, lng: 78.4010, address: 'KPHB Colony, Lane 4, Hyderabad' },
      photoUrl: '',
      createdAt: Timestamp.fromDate(new Date(now - 6 * 3600000)),
      assignedAt: Timestamp.fromDate(new Date(now - 2 * 3600000)),
      escalatedAt: null, resolvedAt: null
    },
    {
      citizenId: 'demo_citizen_3',
      issueType: ['pothole'],
      description: 'Large pothole on main road causing accidents. Two-wheelers are falling.',
      severity: 'high', priority: 7, status: 'resolved', escalated: false,
      department: 'roads',
      location: { lat: 17.4930, lng: 78.3980, address: 'Miyapur X-roads, Hyderabad' },
      photoUrl: '',
      createdAt: Timestamp.fromDate(new Date(now - 10 * 3600000)),
      assignedAt: Timestamp.fromDate(new Date(now - 8 * 3600000)),
      resolvedAt: Timestamp.fromDate(new Date(now - 4 * 3600000)),
      escalatedAt: null
    },
    {
      citizenId: 'demo_citizen_4',
      issueType: ['garbage'],
      description: 'Illegal garbage dumping near school compound. Children are affected.',
      severity: 'high', priority: 8, status: 'reported', escalated: false,
      department: 'sanitation',
      location: { lat: 17.4970, lng: 78.3950, address: 'Balanagar, Near Govt School' },
      photoUrl: '',
      createdAt: Timestamp.fromDate(new Date(now - 3 * 3600000)),
      assignedAt: null, escalatedAt: null, resolvedAt: null
    },
    {
      citizenId: 'demo_citizen_5',
      issueType: ['pothole'],
      description: 'Multiple potholes after rain. Road completely damaged.',
      severity: 'medium', priority: 4, status: 'resolved', escalated: false,
      department: 'roads',
      location: { lat: 17.4910, lng: 78.4020, address: 'Chandanagar Road, Hyderabad' },
      photoUrl: '',
      createdAt: Timestamp.fromDate(new Date(now - 20 * 3600000)),
      assignedAt: Timestamp.fromDate(new Date(now - 18 * 3600000)),
      resolvedAt: Timestamp.fromDate(new Date(now - 15 * 3600000)),
      escalatedAt: null
    }
  ]

  let count = 0
  for (const complaint of demoComplaints) {
    await addDoc(collection(db, 'complaints'), complaint)
    count++
  }
  console.log(`✅ Seeded ${count} demo complaints successfully!`)
  alert(`✅ Seeded ${count} demo complaints! Refresh the authority dashboard.`)
}
