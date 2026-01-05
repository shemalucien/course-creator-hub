export interface NewsItem {
  date: string;
  content: string;
}

export interface LearningOutcome {
  id: string;
  description: string;
}

export interface AssessmentItem {
  activity: string;
  grade: string;
  details: string[];
}

export interface ScheduleItem {
  chapter: string;
  topic: string;
  notes: string[];
  resources: { name: string; type: 'assignment' | 'activity' | 'template' | 'link' }[];
}

export interface Instructor {
  name: string;
  email: string;
  officeHours: string[];
}

export interface CourseSchedule {
  days: string;
  time: string;
}

export interface AcademicCourse {
  id: string;
  code: string;
  title: string;
  semester: string;
  description: string;
  prerequisites: string;
  instructor: Instructor;
  schedule: CourseSchedule;
  news: NewsItem[];
  learningOutcomes: LearningOutcome[];
  assessment: AssessmentItem[];
  tentativeSchedule: ScheduleItem[];
  textbooks: string[];
  resources: { title: string; description: string; links?: { name: string; url: string }[] }[];
}

export const academicCourses: AcademicCourse[] = [
  {
    id: 'se-401',
    code: 'SE 401',
    title: 'Software Quality Assurance and Testing',
    semester: 'Spring 2022',
    description: 'This course is designed to give an understanding of the key concepts and principles in creating and managing successful software testing to meet specific requirements using best practices of software quality assurance. Topics covered include software quality assurance, testing process, test design & coverage techniques and testing strategy. Best practice strategies in object-oriented software testing and web application are also discussed. An overview of test automation methods and tools is also covered.',
    prerequisites: 'SE 322',
    instructor: {
      name: 'Mamdouh Alenezi',
      email: 'malenezi@psu.edu.sa',
      officeHours: ['M T TH 10-11 am', '(Email me for an appointment)']
    },
    schedule: {
      days: 'S M T W',
      time: '9:00 - 09:50am'
    },
    news: [
      { date: '16/1/2022', content: 'The website is up!' },
      { date: '20/1/2022', content: 'Assignment 1 has been posted.' },
      { date: '1/2/2022', content: 'Office hours updated for this week.' }
    ],
    learningOutcomes: [
      { id: 'CLO 1', description: 'Recognize software quality assurance and testing as an essential element in software development life cycle' },
      { id: 'CLO 2', description: 'Describe the phases of software quality assurance and testing' },
      { id: 'CLO 3', description: 'Develop test plans, identify test conditions and design test cases' },
      { id: 'CLO 4', description: 'Apply a wide variety of testing techniques at various testing levels' },
      { id: 'CLO 5', description: 'Compute various metrics from the testing data and interpret them to identify problems in software testing' },
      { id: 'CLO 6', description: 'Adequately test a medium software project in a group setting' }
    ],
    assessment: [
      {
        activity: 'Assignments',
        grade: '5%',
        details: [
          'There will be 6 homework assignments.',
          'All assignments are individual.',
          'Homework must be submitted by the due date.'
        ]
      },
      {
        activity: 'Activities',
        grade: '20%',
        details: [
          'There will be 10 activities.',
          'All activities are individual.',
          'Activities must be submitted by the due date.',
          'Activities are practical aspects of the course that ensure applying the theoretical aspects of the course.'
        ]
      },
      {
        activity: 'Midterm',
        grade: '20%',
        details: [
          'There will be 1 Midterm.',
          'The Midterm will be on Week 8.',
          'The Midterm will cover the materials finished by Week 7.'
        ]
      },
      {
        activity: 'Course Project',
        grade: '15%',
        details: [
          'Students will work in groups to complete the course project.',
          'We will discuss group sizes and possible projects in class early in the semester.',
          'The project is going to be done in phases.',
          'Project phases reports must be submitted by the due date.',
          'The final submission should be a comprehensive report that includes all phases.',
          'Project grade will be based on the work done and on the quality of the submitted reports:',
          'Phase One – Test Plan [5%]',
          'Phase Two - Test Cases [5%]',
          'Phase Three - Test Execution [5%]'
        ]
      },
      {
        activity: 'Final Exam',
        grade: '40%',
        details: [
          'The Final Exam is a comprehensive exam covering the first 5 CLOs.'
        ]
      }
    ],
    tentativeSchedule: [
      {
        chapter: '1',
        topic: 'Introduction',
        notes: ['Why software testing?', 'Error, Fault and Failure', 'Verification and Validation', 'When is enough testing?'],
        resources: [{ name: 'Assignment 1.1', type: 'assignment' }]
      },
      {
        chapter: '2',
        topic: 'Software Quality',
        notes: ['Software Quality Fundamentals', 'Quality Models'],
        resources: [{ name: 'Assignment 2.1', type: 'assignment' }]
      },
      {
        chapter: '3',
        topic: 'Testing throughout the SDLC',
        notes: ['Testing in Waterfall', 'Testing in Agile', 'V-Model'],
        resources: [{ name: 'Assignment 3.1', type: 'assignment' }]
      },
      {
        chapter: '4',
        topic: 'Static Testing',
        notes: ['Code Reviews', 'Static Analysis Tools', 'SpotBugs'],
        resources: [
          { name: 'Activity 4.1 - SpotBugs', type: 'activity' },
          { name: 'CalendarManager Example', type: 'template' },
          { name: 'Assignment 4.1', type: 'assignment' }
        ]
      },
      {
        chapter: '5',
        topic: 'Test Management',
        notes: ['Test Planning', 'IEEE Standard 829-2008', 'Test Documentation'],
        resources: [
          { name: 'Detail Test Plan', type: 'template' },
          { name: 'TestPlanTemplate', type: 'template' },
          { name: 'Activity 5.1 - Test Plan and Specification', type: 'activity' }
        ]
      },
      {
        chapter: '6',
        topic: 'Unit Testing and JUnit',
        notes: ['Introduction to JUnit', 'Test Cases', 'JUnit and Eclipse'],
        resources: [
          { name: 'Activity 6.1 - Unit Testing', type: 'activity' },
          { name: 'Activity 6.2 - JUnit and Coverage Testing', type: 'activity' }
        ]
      },
      {
        chapter: '7',
        topic: 'Test Design Techniques',
        notes: ['Specification-Based Testing', 'The category-partition method', 'Decision Tables', 'Structural Testing', 'MC/DC coverage'],
        resources: [
          { name: 'Assignment 7.1', type: 'assignment' },
          { name: 'Assignment 7.2', type: 'assignment' },
          { name: 'Activity 7.1 - Black Box Testing', type: 'activity' },
          { name: 'Activity 7.2 - Equivalence class and boundary value', type: 'activity' },
          { name: 'Activity 7.3 - White Box Testing', type: 'activity' },
          { name: 'Activity 7.4 - Complexity analysis', type: 'activity' }
        ]
      },
      {
        chapter: '8',
        topic: 'Integration, System and Regression Testing',
        notes: ['Unit and System Tests', 'What is integration testing?', 'The Testing pyramid'],
        resources: [{ name: 'Assignment 8.1', type: 'assignment' }]
      },
      {
        chapter: '9',
        topic: 'Testing Metrics and Tools',
        notes: ['Code Coverage', 'Test Metrics', 'EclEmma'],
        resources: [{ name: 'Activity 9.1 - Code Coverage Analysis', type: 'activity' }]
      },
      {
        chapter: '10',
        topic: 'Advanced Topics',
        notes: ['Web Testing', 'Mobile Testing', 'Appium'],
        resources: [
          { name: 'Activity 10.1 - Web Testing', type: 'activity' },
          { name: 'APPIUM Tutorial for Android', type: 'link' }
        ]
      }
    ],
    textbooks: [
      'Software Testing: A Craftsman\'s Approach, Fourth Edition by Paul C. Jorgensen',
      'Software Testing: Concepts and Operations by Ali Mili and Fairouz Tchier',
      'The Art of Software Testing 3rd Edition by Glenford J. Myers, Corey Sandler, Tom Badgett',
      'Introduction to Software Testing by Paul Ammann and Jeff Offutt',
      'International Software Testing Qualifications Board (ISTQB) Foundation Exam Wiki'
    ],
    resources: [
      {
        title: 'Course Administration',
        description: 'Announcements will be posted on this web page and LMS. Check the news section regularly for updates. We are using both this website and Moodle (LMS).'
      },
      {
        title: 'Java Resources',
        description: 'There will be periodic homework assignments in Java. If you need to brush up on your Java skills and JUnit invest some time studying the following resources.',
        links: [
          { name: 'The Java Tutorial', url: '#' },
          { name: 'Introduction to Programming Using Java', url: '#' },
          { name: 'JUnit Website', url: '#' },
          { name: 'Embracing JUnit 5 with Eclipse', url: '#' }
        ]
      }
    ]
  },
  {
    id: 'cs-301',
    code: 'CS 301',
    title: 'Distributed Systems Management',
    semester: 'Fall 2024',
    description: 'This course provides a comprehensive understanding of distributed computing systems, including consensus algorithms, fault tolerance, replication strategies, and system design patterns used by leading tech companies. Students will learn both theoretical foundations and practical implementation skills.',
    prerequisites: 'CS 201, CS 250',
    instructor: {
      name: 'Dr. Sarah Chen',
      email: 'schen@university.edu',
      officeHours: ['T TH 2-4 pm', 'By appointment']
    },
    schedule: {
      days: 'T TH',
      time: '10:00 - 11:30am'
    },
    news: [
      { date: '15/8/2024', content: 'Welcome to CS 301! The course website is now live.' },
      { date: '20/8/2024', content: 'First lecture slides posted under Chapter 1.' }
    ],
    learningOutcomes: [
      { id: 'CLO 1', description: 'Understand the fundamental concepts of distributed computing' },
      { id: 'CLO 2', description: 'Analyze and implement consensus algorithms like Paxos and Raft' },
      { id: 'CLO 3', description: 'Design fault-tolerant distributed systems' },
      { id: 'CLO 4', description: 'Apply replication strategies for data consistency' },
      { id: 'CLO 5', description: 'Evaluate trade-offs in distributed system design using CAP theorem' }
    ],
    assessment: [
      { activity: 'Homework', grade: '20%', details: ['5 homework assignments', 'Individual work'] },
      { activity: 'Labs', grade: '25%', details: ['6 hands-on labs', 'Implementing distributed algorithms'] },
      { activity: 'Midterm', grade: '20%', details: ['Week 7', 'Covers Chapters 1-4'] },
      { activity: 'Final Project', grade: '20%', details: ['Group project', 'Build a distributed system'] },
      { activity: 'Final Exam', grade: '15%', details: ['Comprehensive exam'] }
    ],
    tentativeSchedule: [
      { chapter: '1', topic: 'Introduction to Distributed Systems', notes: ['What are Distributed Systems?', 'Challenges in Distributed Computing'], resources: [] },
      { chapter: '2', topic: 'Communication', notes: ['RPC', 'Message Passing', 'Sockets'], resources: [{ name: 'Lab 1', type: 'activity' }] },
      { chapter: '3', topic: 'Consensus Algorithms', notes: ['Paxos', 'Raft', 'Byzantine Fault Tolerance'], resources: [{ name: 'Assignment 1', type: 'assignment' }] },
      { chapter: '4', topic: 'Replication', notes: ['Leader-Follower', 'Multi-Leader', 'Leaderless'], resources: [{ name: 'Lab 2', type: 'activity' }] }
    ],
    textbooks: [
      'Designing Data-Intensive Applications by Martin Kleppmann',
      'Distributed Systems: Principles and Paradigms by Tanenbaum and Van Steen'
    ],
    resources: []
  },
  {
    id: 'ml-201',
    code: 'ML 201',
    title: 'Machine Learning Fundamentals',
    semester: 'Spring 2024',
    description: 'A comprehensive introduction to machine learning algorithms, from linear regression to neural networks. Learn both theory and practical implementation with Python and popular ML frameworks.',
    prerequisites: 'MATH 201, CS 101',
    instructor: {
      name: 'Prof. Michael Zhang',
      email: 'mzhang@university.edu',
      officeHours: ['M W 3-5 pm']
    },
    schedule: {
      days: 'M W F',
      time: '11:00 - 11:50am'
    },
    news: [
      { date: '10/1/2024', content: 'Course materials are now available.' }
    ],
    learningOutcomes: [
      { id: 'CLO 1', description: 'Understand supervised and unsupervised learning paradigms' },
      { id: 'CLO 2', description: 'Implement common ML algorithms from scratch' },
      { id: 'CLO 3', description: 'Evaluate model performance using appropriate metrics' },
      { id: 'CLO 4', description: 'Apply deep learning techniques to real-world problems' }
    ],
    assessment: [
      { activity: 'Assignments', grade: '30%', details: ['Weekly coding assignments'] },
      { activity: 'Midterm', grade: '25%', details: ['Week 8'] },
      { activity: 'Final Project', grade: '25%', details: ['ML application project'] },
      { activity: 'Final Exam', grade: '20%', details: ['Comprehensive'] }
    ],
    tentativeSchedule: [
      { chapter: '1', topic: 'Introduction to ML', notes: ['What is ML?', 'Types of Learning'], resources: [] },
      { chapter: '2', topic: 'Linear Regression', notes: ['OLS', 'Gradient Descent'], resources: [{ name: 'Assignment 1', type: 'assignment' }] },
      { chapter: '3', topic: 'Classification', notes: ['Logistic Regression', 'Decision Trees'], resources: [{ name: 'Assignment 2', type: 'assignment' }] }
    ],
    textbooks: [
      'Hands-On Machine Learning by Aurélien Géron',
      'Pattern Recognition and Machine Learning by Christopher Bishop'
    ],
    resources: []
  }
];

export const getCourseById = (id: string): AcademicCourse | undefined => {
  return academicCourses.find(course => course.id === id);
};
