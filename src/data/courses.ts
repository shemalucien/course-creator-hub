export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'reading' | 'quiz' | 'assignment';
  completed?: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  chapters: Chapter[];
  enrolledStudents: number;
  rating: number;
  tags: string[];
}

export const courses: Course[] = [
  {
    id: 'distributed-systems',
    title: 'Distributed Systems Management',
    description: 'Master the fundamentals of distributed computing, including consensus algorithms, fault tolerance, replication strategies, and system design patterns used by leading tech companies.',
    instructor: 'Dr. Sarah Chen',
    thumbnail: '/course-distributed.jpg',
    duration: '24 hours',
    level: 'Advanced',
    category: 'Computer Science',
    enrolledStudents: 2847,
    rating: 4.9,
    tags: ['Distributed Systems', 'Scalability', 'CAP Theorem', 'Consensus'],
    chapters: [
      {
        id: 'intro-distributed',
        title: 'Introduction to Distributed Systems',
        description: 'Understanding the fundamentals and challenges of distributed computing',
        lessons: [
          { id: 'l1', title: 'What are Distributed Systems?', duration: '18 min', type: 'video' },
          { id: 'l2', title: 'Challenges in Distributed Computing', duration: '22 min', type: 'video' },
          { id: 'l3', title: 'The Eight Fallacies of Distributed Computing', duration: '15 min', type: 'reading' },
          { id: 'l4', title: 'Chapter Quiz', duration: '10 min', type: 'quiz' },
        ]
      },
      {
        id: 'consensus',
        title: 'Consensus Algorithms',
        description: 'Deep dive into Paxos, Raft, and Byzantine fault tolerance',
        lessons: [
          { id: 'l5', title: 'The Consensus Problem', duration: '25 min', type: 'video' },
          { id: 'l6', title: 'Understanding Paxos', duration: '35 min', type: 'video' },
          { id: 'l7', title: 'Raft: A More Understandable Consensus', duration: '30 min', type: 'video' },
          { id: 'l8', title: 'Byzantine Fault Tolerance', duration: '28 min', type: 'video' },
          { id: 'l9', title: 'Implementing Raft', duration: '45 min', type: 'assignment' },
        ]
      },
      {
        id: 'replication',
        title: 'Data Replication Strategies',
        description: 'Master synchronous and asynchronous replication patterns',
        lessons: [
          { id: 'l10', title: 'Why Replicate Data?', duration: '15 min', type: 'video' },
          { id: 'l11', title: 'Leader-Follower Replication', duration: '25 min', type: 'video' },
          { id: 'l12', title: 'Multi-Leader Replication', duration: '28 min', type: 'video' },
          { id: 'l13', title: 'Leaderless Replication', duration: '22 min', type: 'video' },
        ]
      },
      {
        id: 'cap-theorem',
        title: 'CAP Theorem & Consistency Models',
        description: 'Understanding trade-offs in distributed system design',
        lessons: [
          { id: 'l14', title: 'The CAP Theorem Explained', duration: '30 min', type: 'video' },
          { id: 'l15', title: 'Consistency Models Deep Dive', duration: '35 min', type: 'video' },
          { id: 'l16', title: 'Eventual Consistency in Practice', duration: '25 min', type: 'video' },
          { id: 'l17', title: 'Final Project: Design a Distributed Database', duration: '3 hours', type: 'assignment' },
        ]
      }
    ]
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning Fundamentals',
    description: 'A comprehensive introduction to machine learning algorithms, from linear regression to neural networks. Learn both theory and practical implementation with Python.',
    instructor: 'Prof. Michael Zhang',
    thumbnail: '/course-ml.jpg',
    duration: '32 hours',
    level: 'Intermediate',
    category: 'Artificial Intelligence',
    enrolledStudents: 5234,
    rating: 4.8,
    tags: ['Machine Learning', 'Python', 'Neural Networks', 'Deep Learning'],
    chapters: [
      {
        id: 'ml-intro',
        title: 'Introduction to Machine Learning',
        description: 'Understanding the ML landscape and fundamental concepts',
        lessons: [
          { id: 'ml1', title: 'What is Machine Learning?', duration: '20 min', type: 'video' },
          { id: 'ml2', title: 'Supervised vs Unsupervised Learning', duration: '25 min', type: 'video' },
          { id: 'ml3', title: 'Setting Up Your Environment', duration: '15 min', type: 'reading' },
        ]
      },
      {
        id: 'regression',
        title: 'Regression Algorithms',
        description: 'Linear and polynomial regression with practical examples',
        lessons: [
          { id: 'ml4', title: 'Linear Regression Theory', duration: '30 min', type: 'video' },
          { id: 'ml5', title: 'Implementing Linear Regression', duration: '45 min', type: 'video' },
          { id: 'ml6', title: 'Polynomial Regression', duration: '25 min', type: 'video' },
          { id: 'ml7', title: 'Regression Assignment', duration: '2 hours', type: 'assignment' },
        ]
      },
      {
        id: 'neural-networks',
        title: 'Neural Networks',
        description: 'Building blocks of deep learning',
        lessons: [
          { id: 'ml8', title: 'Perceptrons and Activation Functions', duration: '35 min', type: 'video' },
          { id: 'ml9', title: 'Backpropagation Explained', duration: '40 min', type: 'video' },
          { id: 'ml10', title: 'Building Your First Neural Network', duration: '1 hour', type: 'assignment' },
        ]
      }
    ]
  },
  {
    id: 'cloud-architecture',
    title: 'Cloud Architecture & DevOps',
    description: 'Learn to design, deploy, and manage scalable cloud infrastructure. Covers AWS, containerization with Docker, Kubernetes orchestration, and CI/CD pipelines.',
    instructor: 'James Wilson',
    thumbnail: '/course-cloud.jpg',
    duration: '28 hours',
    level: 'Intermediate',
    category: 'Cloud Computing',
    enrolledStudents: 3891,
    rating: 4.7,
    tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'DevOps'],
    chapters: [
      {
        id: 'cloud-fundamentals',
        title: 'Cloud Computing Fundamentals',
        description: 'Core concepts of cloud infrastructure',
        lessons: [
          { id: 'c1', title: 'Introduction to Cloud Computing', duration: '22 min', type: 'video' },
          { id: 'c2', title: 'AWS Core Services Overview', duration: '35 min', type: 'video' },
          { id: 'c3', title: 'Cloud Security Basics', duration: '28 min', type: 'video' },
        ]
      },
      {
        id: 'containers',
        title: 'Containerization with Docker',
        description: 'Master Docker for application deployment',
        lessons: [
          { id: 'c4', title: 'Docker Fundamentals', duration: '30 min', type: 'video' },
          { id: 'c5', title: 'Building Docker Images', duration: '25 min', type: 'video' },
          { id: 'c6', title: 'Docker Compose', duration: '35 min', type: 'video' },
          { id: 'c7', title: 'Containerize an Application', duration: '1 hour', type: 'assignment' },
        ]
      }
    ]
  },
  {
    id: 'data-structures',
    title: 'Data Structures & Algorithms',
    description: 'Essential data structures and algorithms for software engineering interviews and real-world problem solving. Includes hands-on coding exercises and complexity analysis.',
    instructor: 'Dr. Emily Park',
    thumbnail: '/course-dsa.jpg',
    duration: '36 hours',
    level: 'Beginner',
    category: 'Computer Science',
    enrolledStudents: 8123,
    rating: 4.9,
    tags: ['Algorithms', 'Data Structures', 'Problem Solving', 'Interviews'],
    chapters: [
      {
        id: 'arrays-strings',
        title: 'Arrays and Strings',
        description: 'Fundamental data structures and operations',
        lessons: [
          { id: 'd1', title: 'Array Operations and Complexity', duration: '25 min', type: 'video' },
          { id: 'd2', title: 'String Manipulation Techniques', duration: '30 min', type: 'video' },
          { id: 'd3', title: 'Two Pointer Technique', duration: '28 min', type: 'video' },
          { id: 'd4', title: 'Sliding Window Pattern', duration: '32 min', type: 'video' },
        ]
      },
      {
        id: 'linked-lists',
        title: 'Linked Lists',
        description: 'Singly and doubly linked list implementations',
        lessons: [
          { id: 'd5', title: 'Linked List Basics', duration: '20 min', type: 'video' },
          { id: 'd6', title: 'Linked List Operations', duration: '35 min', type: 'video' },
          { id: 'd7', title: 'Fast and Slow Pointers', duration: '25 min', type: 'video' },
        ]
      },
      {
        id: 'trees-graphs',
        title: 'Trees and Graphs',
        description: 'Hierarchical and network data structures',
        lessons: [
          { id: 'd8', title: 'Binary Trees', duration: '30 min', type: 'video' },
          { id: 'd9', title: 'Binary Search Trees', duration: '35 min', type: 'video' },
          { id: 'd10', title: 'Graph Representations', duration: '28 min', type: 'video' },
          { id: 'd11', title: 'BFS and DFS', duration: '40 min', type: 'video' },
        ]
      }
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Essentials',
    description: 'Comprehensive cybersecurity training covering threat analysis, penetration testing, secure coding practices, and incident response strategies.',
    instructor: 'Alex Rivera',
    thumbnail: '/course-security.jpg',
    duration: '30 hours',
    level: 'Intermediate',
    category: 'Security',
    enrolledStudents: 2156,
    rating: 4.8,
    tags: ['Security', 'Penetration Testing', 'Ethical Hacking', 'Cryptography'],
    chapters: [
      {
        id: 'security-fundamentals',
        title: 'Security Fundamentals',
        description: 'Core concepts in cybersecurity',
        lessons: [
          { id: 's1', title: 'Introduction to Cybersecurity', duration: '25 min', type: 'video' },
          { id: 's2', title: 'Common Threat Vectors', duration: '30 min', type: 'video' },
          { id: 's3', title: 'Security Frameworks', duration: '28 min', type: 'video' },
        ]
      },
      {
        id: 'cryptography',
        title: 'Cryptography',
        description: 'Encryption and secure communication',
        lessons: [
          { id: 's4', title: 'Symmetric Encryption', duration: '35 min', type: 'video' },
          { id: 's5', title: 'Asymmetric Encryption', duration: '40 min', type: 'video' },
          { id: 's6', title: 'Hash Functions and Digital Signatures', duration: '30 min', type: 'video' },
        ]
      }
    ]
  },
  {
    id: 'database-design',
    title: 'Database Design & SQL Mastery',
    description: 'From ER diagrams to complex queries. Learn relational database design, normalization, indexing strategies, and advanced SQL techniques.',
    instructor: 'Dr. Robert Kim',
    thumbnail: '/course-database.jpg',
    duration: '26 hours',
    level: 'Beginner',
    category: 'Databases',
    enrolledStudents: 4567,
    rating: 4.7,
    tags: ['SQL', 'Database Design', 'PostgreSQL', 'Optimization'],
    chapters: [
      {
        id: 'db-fundamentals',
        title: 'Database Fundamentals',
        description: 'Introduction to relational databases',
        lessons: [
          { id: 'db1', title: 'What is a Database?', duration: '18 min', type: 'video' },
          { id: 'db2', title: 'Relational Model Explained', duration: '25 min', type: 'video' },
          { id: 'db3', title: 'SQL Basics', duration: '35 min', type: 'video' },
        ]
      },
      {
        id: 'normalization',
        title: 'Database Normalization',
        description: 'Design efficient database schemas',
        lessons: [
          { id: 'db4', title: 'First Normal Form', duration: '20 min', type: 'video' },
          { id: 'db5', title: 'Second and Third Normal Forms', duration: '30 min', type: 'video' },
          { id: 'db6', title: 'When to Denormalize', duration: '25 min', type: 'video' },
        ]
      }
    ]
  }
];

export const getCourseById = (id: string): Course | undefined => {
  return courses.find(course => course.id === id);
};

export const getCoursesByCategory = (category: string): Course[] => {
  return courses.filter(course => course.category === category);
};

export const categories = [...new Set(courses.map(c => c.category))];
