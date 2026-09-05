// MOCK DATA - replace with API/database integration in Phase 2.
export const colleges = [
  {
    id: 'matrusri',
    name: 'Matrusri Engineering College',
    short: 'MEC',
    location: 'Saidabad, Hyderabad, Telangana',
    description: 'An autonomous engineering institution focused on accessible technical education, research, and student-led learning.',
    images: [
      'https://www.vidyavision.com/CollegeUploads/Photos/2016-16-5-06-33-49_matrusri.jpg',
      'https://www.collegebatch.com/static/clg-gallery/matrusri-engineering-college-hyderabad-258041.webp',
    ],
    source: 'Official Matrusri Engineering College website and virtual tour',
    highlights: ['Autonomous', 'Saidabad, Hyderabad', 'Engineering education', 'Matrusri Education Society'],
  },
  {
    id: 'mvsr',
    name: 'MVSR Engineering College',
    short: 'MVSR',
    location: 'Nadergul, Hyderabad, Telangana',
    description: 'An autonomous institution established in 1981 with a digitized campus, engineering programs, research facilities, and industry connections.',
    images: [
      'https://media.collegedekho.com/media/img/institute/crawled_images/MVSR-Engineering-College-Contact-Information.jpg?width=1080',
    ],
    source: 'Official MVSR Engineering College website',
    highlights: ['Established 1981', 'Nadergul, Hyderabad', 'Digitized campus', 'Research and placements'],
  },
]

export const attendance = [
  { name: 'Mathematics', value: 91 }, { name: 'DBMS', value: 88 }, { name: 'Operating Systems', value: 82 }, { name: 'Networks', value: 72 },
]

export const scholarships = [
  { name: 'MEC Merit Scholarship', category: 'Merit', eligibility: 'Top academic performers', amount: '₹25,000', deadline: '18 Sep 2026' },
  { name: 'Telangana ePASS', category: 'Government', eligibility: 'Eligible Telangana students', amount: 'Varies', deadline: '30 Sep 2026' },
  { name: 'Matrusri Support Grant', category: 'College-specific', eligibility: 'Students with demonstrated need', amount: '₹15,000', deadline: '04 Oct 2026' },
  { name: 'National Means Scholarship', category: 'Need-based', eligibility: 'Income-qualified students', amount: '₹12,000', deadline: '12 Oct 2026' },
]

export const exams = [
  { date: 'SEP 12', name: 'DBMS', room: 'Block C · 10:00 AM' }, { date: 'SEP 16', name: 'Operating Systems', room: 'Block B · 2:00 PM' }, { date: 'SEP 20', name: 'Computer Networks', room: 'Block C · 10:00 AM' },
]

export const notices = [
  { category: 'Examination', title: 'B.E. IV-Semester examination timetable updated', date: '05 Sep 2026', unread: true, body: 'The revised examination timetable is available for students. Please check the exam branch notice for subject-wise details.' },
  { category: 'Events', title: 'Innovation and Industry 4.0 workshop', date: '03 Sep 2026', unread: true, body: 'A two-day workshop will be hosted in the KVR Seminar Hall. Registration is available through the student activities desk.' },
  { category: 'Academic', title: 'Semester course registration window', date: '30 Aug 2026', unread: false, body: 'Course registration for the current semester remains open through the academic section.' },
  { category: 'Placements', title: 'Placement preparation sessions', date: '28 Aug 2026', unread: false, body: 'The training and placement cell has published the September preparation calendar.' },
]

export const courseNames = ['Data Structures', 'Database Management Systems', 'Operating Systems', 'Computer Networks']
