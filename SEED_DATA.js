// SEED DEMO DATA
// -----------------------------------------------
// How to use:
// 1. Open your app in the browser (npm run dev)
// 2. Login as authority
// 3. Open browser DevTools (F12) → Console tab
// 4. Paste this ENTIRE file into the console
// 5. Press Enter
// 6. Refresh the page — you will see demo complaints
// -----------------------------------------------

import('/src/firebase.js').then(({ db }) => {
  const { collection, addDoc, Timestamp } = window.__firebase_firestore || {};
  console.log('Use the SeedData button in the app instead, or run via a component');
});

// ALTERNATIVELY — add a temporary seed button to AuthorityHome.jsx
// Add this function inside the AuthorityHome component:

/*
async function seedDemoData() {
  const demoComplaints = [
    {
      citizenId: 'demo_citizen_1',
      citizenPhone: '+919876543210',
      issueType: ['garbage', 'pothole'],
      description: 'Garbage not cleared for 3 days and there is a big pothole near the bus stop. Very dangerous at night.',
      severity: 'high',
      priority: 9,
      department: 'both',
      photoUrl: '',
      location: { lat: 17.4947, lng: 78.3996, address: 'Kukatpally Main Road, Ward 12' },
      status: 'reported',
      escalated: true,
      createdAt: Timestamp.fromDate(new Date(Date.now() - 27 * 3600000)),
      assignedAt: null,
      resolvedAt: null,
      escalatedAt: Timestamp.fromDate(new Date(Date.now() - 3 * 3600000))
    },
    {
      citizenId: 'demo_citizen_2',
      citizenPhone: '+919876543211',
      issueType: ['garbage'],
      description: 'Overflowing dustbin near school entrance. Children walking through garbage every morning.',
      severity: 'high',
      priority: 7,
      department: 'sanitation',
      photoUrl: '',
      location: { lat: 17.4960, lng: 78.4010, address: 'KPHB Colony, Lane 4, Near Govt School' },
      status: 'reported',
      escalated: false,
      createdAt: Timestamp.fromDate(new Date(Date.now() - 6 * 3600000)),
      assignedAt: null,
      resolvedAt: null,
      escalatedAt: null
    },
    {
      citizenId: 'demo_citizen_3',
      citizenPhone: '+919876543212',
      issueType: ['pothole'],
      description: 'Large pothole caused 2 bike accidents this week. Needs urgent repair.',
      severity: 'medium',
      priority: 5,
      department: 'roads',
      photoUrl: '',
      location: { lat: 17.4930, lng: 78.3980, address: 'Miyapur X-Roads, Near Petrol Bunk' },
      status: 'in_progress',
      escalated: false,
      createdAt: Timestamp.fromDate(new Date(Date.now() - 10 * 3600000)),
      assignedAt: Timestamp.fromDate(new Date(Date.now() - 5 * 3600000)),
      resolvedAt: null,
      escalatedAt: null
    },
    {
      citizenId: 'demo_citizen_4',
      citizenPhone: '+919876543213',
      issueType: ['pothole'],
      description: 'Pothole near main gate fixed. Good response from roads department.',
      severity: 'high',
      priority: 7,
      department: 'roads',
      photoUrl: '',
      location: { lat: 17.4980, lng: 78.4020, address: 'Balanagar Industrial Area, Gate 3' },
      status: 'resolved',
      escalated: false,
      createdAt: Timestamp.fromDate(new Date(Date.now() - 12 * 3600000)),
      assignedAt: Timestamp.fromDate(new Date(Date.now() - 8 * 3600000)),
      resolvedAt: Timestamp.fromDate(new Date(Date.now() - 4 * 3600000)),
      escalatedAt: null
    },
    {
      citizenId: 'demo_citizen_5',
      citizenPhone: '+919876543214',
      issueType: ['garbage'],
      description: 'Garbage cleared after complaint. Thank you.',
      severity: 'medium',
      priority: 4,
      department: 'sanitation',
      photoUrl: '',
      location: { lat: 17.4910, lng: 78.3960, address: 'Chandanagar, Beside Park' },
      status: 'resolved',
      escalated: false,
      createdAt: Timestamp.fromDate(new Date(Date.now() - 20 * 3600000)),
      assignedAt: Timestamp.fromDate(new Date(Date.now() - 15 * 3600000)),
      resolvedAt: Timestamp.fromDate(new Date(Date.now() - 8 * 3600000)),
      escalatedAt: null
    }
  ];

  for (const complaint of demoComplaints) {
    await addDoc(collection(db, 'complaints'), complaint);
  }
  alert('Demo data seeded! Refresh the page.');
}
*/

// Then add this button inside the authority dashboard JSX temporarily:
// <button onClick={seedDemoData} style={{...}}>Seed Demo Data</button>
// Remove this button before your final demo!
