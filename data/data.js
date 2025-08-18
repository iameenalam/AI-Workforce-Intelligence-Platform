export const orgData = [
  {
    id: "unstoppable-inc",
    name: "Unstoppable Inc",
    ceoName: "James Elton",
    email: "james.elton@unstoppable.com",
    ceoPic: "https://randomuser.me/api/portraits/men/32.jpg",
    industry: "Information Technology (IT) and Software",
    companySize: "150-300",
    city: "San Francisco",
    country: "United States",
    yearFounded: 2018,
    organizationType: "Private",
    numberOfOffices: 3,
    hrToolsUsed: "BambooHR, Lever, 15Five",
    hiringLevel: "Moderate",
    workModel: "Hybrid",
  },
];

export const departmentsDemoData = [
  {
    id: "engineering",
    name: "Engineering",
    description:
      "Handles all technical development and infrastructure, including frontend and backend services, DevOps, and AI tooling.",
    head: "Timothy Jones",
    members: 10,
    topSkills: [
      "React",
      "Node.js",
      "AWS",
      "Docker",
      "Terraform",
      "Git",
      "DevOps",
      "Infrastructure as Code",
    ],
    goals: [
      "Deliver robust, scalable technical solutions",
      "Implement continuous integration and deployment pipelines",
      "Maintain high code quality and system reliability",
      "Drive adoption of AI tooling and automation",
    ],
  },
  {
    id: "product",
    name: "Product",
    description:
      "Owns product strategy, planning, analytics, and cross-team collaboration to deliver business value.",
    head: "Breanna Smith",
    members: 8,
    topSkills: [
      "Product Planning",
      "Jira",
      "Amplitude",
      "Product Analytics",
      "Prioritization",
    ],
    goals: [
      "Define and prioritize product roadmap",
      "Increase user engagement through analytics-driven decisions",
      "Facilitate effective cross-team collaboration",
      "Gather and incorporate customer feedback",
    ],
  },
  {
    id: "marketing",
    name: "Marketing",
    description:
      "Drives go-to-market, branding, SEO, digital advertising, content creation, and campaign execution.",
    head: "Antonio Stanton",
    members: 9,
    topSkills: [
      "SEO",
      "Contentful",
      "Google Ads",
      "CRM Management",
      "Prompt Engineering",
    ],
    goals: [
      "Enhance brand awareness and reputation",
      "Drive qualified leads through digital campaigns",
      "Optimize website and content for SEO",
      "Increase market share and customer retention",
    ],
  },
  {
    id: "design",
    name: "Design",
    description:
      "Creates and maintains user experience, interface design, prototyping, and usability testing.",
    head: "Larry Warner",
    members: 3,
    topSkills: [
      "UI/UX Design",
      "Figma",
      "Adobe XD",
      "Prototyping",
      "Maze",
      "Interface Design",
    ],
    goals: [
      "Deliver intuitive and visually appealing user interfaces",
      "Ensure consistent user experiences across platforms",
      "Conduct regular usability tests for continuous improvement",
      "Maintain and iterate on design systems",
    ],
  },
  {
    id: "customer-success",
    name: "Customer Success",
    description:
      "Ensures customer satisfaction, engagement, and support through consistent documentation and CRM best practices.",
    head: "Edward Hernandez",
    members: 3,
    topSkills: [
      "CRM Management",
      "Intercom",
      "Notion",
      "Zendesk",
      "Customer Engagement",
    ],
    goals: [
      "Maximize customer satisfaction and retention",
      "Streamline onboarding and training processes",
      "Maintain comprehensive knowledge base",
      "Proactively address customer needs and issues",
    ],
  },
  {
    id: "people-hr",
    name: "People & HR",
    description:
      "Manages talent acquisition, HR operations, employee engagement, and performance management.",
    head: "William Bonilla",
    members: 2,
    topSkills: [
      "Talent Acquisition",
      "HR Operations",
      "15Five",
      "LinkedIn Recruiter",
    ],
    goals: [
      "Attract and retain top talent",
      "Foster a positive and inclusive company culture",
      "Streamline HR operations and compliance",
      "Support employee growth and development",
    ],
  },
  {
    id: "sales",
    name: "Sales",
    description:
      "Focuses on sales operations, lead generation, account management, and revenue growth.",
    head: "Edward Simpson",
    members: 2,
    topSkills: [
      "Sales Operations",
      "ZoomInfo",
      "Outreach",
      "Slack",
      "Conversation Intelligence",
    ],
    goals: [
      "Grow revenue and expand customer base",
      "Optimize lead generation and conversion processes",
      "Strengthen relationships with key accounts",
      "Leverage technology to increase sales efficiency",
    ],
  },
  {
    id: "finance-ops",
    name: "Finance & Ops",
    description:
      "Responsible for financial management, data analysis, and operational efficiency.",
    head: "Diana Greer",
    members: 2,
    topSkills: [
      "Data Analysis",
      "Excel",
      "QuickBooks",
      "Tableau",
      "Financial Management",
    ],
    goals: [
      "Ensure sound financial planning and budgeting",
      "Improve operational processes for efficiency",
      "Provide actionable insights through data analysis",
      "Maintain compliance with regulations and standards",
    ],
  },
];

export const allemployees = [
  {
    id: "ceo",
    name: "James Elton",
    position: "CEO",
    department: "Information Technology (IT) and Software",
    email: "jameselton@unstoppable.com",
    payroll: {
      baseSalary: 450000,
      bonus: 200000,
      stockOptions: 50000,
      lastRaiseDate: "2023-01-01",
      raisePercentage: 15,
    },
    performance: {
      goals: [
        {
          name: "Company growth strategy",
          targetDate: "2023-12-31",
          completion: 95,
          status: "on track",
        },
        {
          name: "Expand to new markets",
          targetDate: "2023-09-30",
          completion: 85,
          status: "on track",
        },
        {
          name: "Build executive team",
          targetDate: "2023-06-30",
          completion: 100,
          status: "completed",
        },
      ],
      overallCompletion: 93,
    },
    education: {
      degree: "MBA",
      institution: "Harvard Business School",
      location: "Boston, USA",
      startDate: "2005",
      endDate: "2007",
      gpa: "3.9",
    },
    experience: [
      {
        company: "Unstoppable Inc",
        position: "Chief Executive Officer",
        location: "Global",
        startDate: "2018",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Overall company strategy and vision",
          "Leadership of executive team",
          "Investor relations",
          "Company culture development",
        ],
      },
      {
        company: "TechVision",
        position: "President",
        location: "San Francisco, CA",
        startDate: "2012",
        endDate: "2018",
        current: false,
        responsibilities: [
          "Grew company from $10M to $100M ARR",
          "Led product and engineering teams",
          "Acquired 3 companies",
        ],
      },
      {
        company: "NextGen Solutions",
        position: "VP of Product",
        location: "New York, NY",
        startDate: "2007",
        endDate: "2012",
        current: false,
        responsibilities: [
          "Built product team from scratch",
          "Launched flagship product",
          "Established product-market fit",
        ],
      },
    ],
    skills: [
      "Strategic Leadership",
      "Business Development",
      "Financial Management",
      "Team Building",
      "Innovation",
    ],
    tools: ["Financial Modeling", "Data Analysis", "Market Research"],
    jobDescription: [
      "Set company vision and strategy",
      "Lead executive team",
      "Make high-stakes decisions",
      "Represent company to investors and public",
      "Drive company culture",
    ],
  },
  {
    id: "1",
    name: "Timothy Jones",
    position: "DevOps Engineer",
    department: "Engineering",
    email: "timothyjones@gmail.com",
    payroll: {
      baseSalary: 125000,
      bonus: 15000,
      stockOptions: 5000,
      lastRaiseDate: "2023-01-15",
      raisePercentage: 8
    },
    performance: {
      goals: [
        {
          name: "Implement CI/CD pipeline improvements",
          targetDate: "2023-12-31",
          completion: 95,
          status: "on track"
        },
        {
          name: "Reduce AWS costs by 15%",
          targetDate: "2023-10-31",
          completion: 80,
          status: "needs attention"
        },
        {
          name: "Mentor junior team members",
          targetDate: "2023-09-30",
          completion: 100,
          status: "completed"
        }
      ],
      overallCompletion: 92
    },
    education: {
      degree: "BSc Computer Science",
      institution: "Tech University",
      location: "Austin, USA",
      startDate: "2015",
      endDate: "2019",
      gpa: "3.7",
    },
    experience: [
      {
        company: "Cloud Solutions Inc",
        position: "DevOps Engineer",
        location: "Austin, TX",
        startDate: "2019",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Implemented CI/CD pipelines using Jenkins and GitHub Actions",
          "Managed AWS infrastructure with Terraform",
          "Optimized Docker container performance",
        ],
      },
      {
        company: "DevTech",
        position: "Junior DevOps Engineer",
        location: "Dallas, TX",
        startDate: "2017",
        endDate: "2019",
        current: false,
        responsibilities: [
          "Assisted in migration to cloud infrastructure",
          "Maintained version control systems",
          "Supported development teams with deployment processes",
        ],
      },
    ],
    skills: ["Version Control", "UI Development", "Infrastructure as Code"],
    tools: ["JavaScript", "AWS", "Node.js", "Docker"],
    jobDescription: [
      "Apply expertise in Git to support departmental OKRs",
      "Manage and maintain AWS",
      "Manage and maintain Node.js",
      "Apply expertise in React to support departmental OKRs",
      "Manage and maintain JavaScript",
    ],
  },
  {
    id: "3001",
    name: "Julia Wilson",
    position: "Frontend Developer",
    department: "Engineering",
    email: "juliawilson@gmail.com",
    payroll: {
      baseSalary: 115000,
      bonus: 10000,
      stockOptions: 3000,
      lastRaiseDate: "2023-03-10",
      raisePercentage: 7
    },
    performance: {
      goals: [
        {
          name: "Implement new design system components",
          targetDate: "2023-11-30",
          completion: 75,
          status: "on track"
        },
        {
          name: "Improve page load performance by 20%",
          targetDate: "2023-08-31",
          completion: 90,
          status: "on track"
        },
        {
          name: "Cross-train in backend development",
          targetDate: "2023-12-31",
          completion: 40,
          status: "needs attention"
        }
      ],
      overallCompletion: 68
    },
    education: {
      degree: "BA Design",
      institution: "Design Institute",
      location: "Chicago, USA",
      startDate: "2012",
      endDate: "2016",
      gpa: "3.8",
    },
    experience: [
      {
        company: "WebCraft Studios",
        position: "Frontend Developer",
        location: "Chicago, IL",
        startDate: "2016",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Developed responsive web applications using React",
          "Implemented design systems for consistency",
          "Optimized frontend performance",
        ],
      },
      {
        company: "Digital Creations",
        position: "UI Developer",
        location: "Chicago, IL",
        startDate: "2014",
        endDate: "2016",
        current: false,
        responsibilities: [
          "Converted designs to functional web pages",
          "Collaborated with designers on UX improvements",
          "Implemented frontend testing strategies",
        ],
      },
    ],
    skills: [
      "Frontend Development",
      "Infrastructure as Code",
      "Containerization",
      "Backend Development",
    ],
    tools: ["AWS", "React", "Git"],
    jobDescription: [
      "Manage and maintain Git",
      "Apply expertise in JavaScript to support departmental OKRs",
      "Apply expertise in Terraform to support departmental OKRs",
      "Apply expertise in Node.js to support departmental OKRs",
      "Manage and maintain React",
    ],
  },
  {
    id: "3002",
    name: "Jeffery Fischer",
    position: "Frontend Developer",
    department: "Engineering",
    email: "jefferyfischer@gmail.com",
    payroll: {
      baseSalary: 120000,
      bonus: 12000,
      stockOptions: 4000,
      lastRaiseDate: "2023-02-20",
      raisePercentage: 6
    },
    performance: {
      goals: [
        {
          name: "Lead state management refactor",
          targetDate: "2023-09-30",
          completion: 85,
          status: "on track"
        },
        {
          name: "Improve test coverage to 80%",
          targetDate: "2023-12-31",
          completion: 60,
          status: "on track"
        },
        {
          name: "Conduct 3 knowledge sharing sessions",
          targetDate: "2023-12-31",
          completion: 100,
          status: "completed"
        }
      ],
      overallCompletion: 82
    },
    education: {
      degree: "BS Software Engineering",
      institution: "State University",
      location: "Seattle, USA",
      startDate: "2014",
      endDate: "2018",
      gpa: "3.6",
    },
    experience: [
      {
        company: "Frontend Masters",
        position: "Frontend Developer",
        location: "Seattle, WA",
        startDate: "2018",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Built complex single-page applications",
          "Implemented state management solutions",
          "Mentored junior developers",
        ],
      },
      {
        company: "CodeCraft",
        position: "Full Stack Developer",
        location: "Portland, OR",
        startDate: "2016",
        endDate: "2018",
        current: false,
        responsibilities: [
          "Developed both frontend and backend components",
          "Designed RESTful APIs",
          "Implemented UI components",
        ],
      },
    ],
    skills: [
      "Backend Development",
      "UI Development",
      "Version Control",
      "Frontend Development",
      "Containerization",
    ],
    tools: ["AWS", "Terraform"],
    jobDescription: [
      "Apply expertise in JavaScript to support departmental OKRs",
      "Manage and maintain AWS",
      "Manage and maintain Terraform",
      "Apply expertise in Docker to support departmental OKRs",
      "Apply expertise in React to support departmental OKRs",
    ],
  },
  {
    id: "102",
    name: "Seth Michael",
    position: "Backend Developer",
    department: "Engineering",
    email: "sethmichael@gmail.com",
    payroll: {
      baseSalary: 118000,
      bonus: 11000,
      stockOptions: 3500,
      lastRaiseDate: "2023-01-05",
      raisePercentage: 5
    },
    performance: {
      goals: [
        {
          name: "Optimize database queries",
          targetDate: "2023-08-15",
          completion: 95,
          status: "on track"
        },
        {
          name: "Implement new authentication system",
          targetDate: "2023-11-30",
          completion: 70,
          status: "on track"
        },
        {
          name: "Reduce API response time by 30%",
          targetDate: "2023-12-31",
          completion: 50,
          status: "needs attention"
        }
      ],
      overallCompletion: 72
    },
    education: {
      degree: "BBA Marketing",
      institution: "Business College",
      location: "Boston, USA",
      startDate: "2017",
      endDate: "2021",
      gpa: "3.5",
    },
    experience: [
      {
        company: "API Solutions",
        position: "Backend Developer",
        location: "Boston, MA",
        startDate: "2021",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Developed RESTful APIs using Node.js",
          "Optimized database queries",
          "Implemented authentication systems",
        ],
      },
      {
        company: "TechStart",
        position: "Junior Developer",
        location: "Boston, MA",
        startDate: "2019",
        endDate: "2021",
        current: false,
        responsibilities: [
          "Assisted in backend development",
          "Wrote unit tests",
          "Documented API endpoints",
        ],
      },
    ],
    skills: ["Infrastructure as Code", "Version Control", "UI Development"],
    tools: ["Node.js", "JavaScript", "Docker", "AWS"],
    jobDescription: [
      "Manage and maintain Node.js",
      "Apply expertise in Git to support departmental OKRs",
      "Manage and maintain JavaScript",
      "Apply expertise in React to support departmental OKRs",
      "Manage and maintain AWS",
    ],
  },
  {
    id: "3005",
    name: "istina Phillips",
    position: "Backend Developer",
    department: "Engineering",
    email: "istinaphillips@gmail.com",
    payroll: {
      baseSalary: 130000,
      bonus: 15000,
      stockOptions: 6000,
      lastRaiseDate: "2023-04-01",
      raisePercentage: 9
    },
    performance: {
      goals: [
        {
          name: "Design microservices architecture",
          targetDate: "2023-10-31",
          completion: 90,
          status: "on track"
        },
        {
          name: "Implement caching strategy",
          targetDate: "2023-08-31",
          completion: 100,
          status: "completed"
        },
        {
          name: "Reduce database costs by 20%",
          targetDate: "2023-12-31",
          completion: 65,
          status: "on track"
        }
      ],
      overallCompletion: 85
    },
    education: {
      degree: "BSc Computer Science",
      institution: "Tech Institute",
      location: "San Francisco, USA",
      startDate: "2013",
      endDate: "2017",
      gpa: "3.9",
    },
    experience: [
      {
        company: "Backend Pros",
        position: "Backend Developer",
        location: "San Francisco, CA",
        startDate: "2017",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Designed scalable microservices architecture",
          "Implemented caching strategies",
          "Optimized database performance",
        ],
      },
      {
        company: "Data Systems",
        position: "Software Engineer",
        location: "San Jose, CA",
        startDate: "2015",
        endDate: "2017",
        current: false,
        responsibilities: [
          "Developed data processing pipelines",
          "Implemented ETL processes",
          "Maintained legacy systems",
        ],
      },
    ],
    skills: ["Frontend Development", "Cloud Infrastructure"],
    tools: ["Docker", "Terraform", "Node.js", "React", "Git"],
    jobDescription: [
      "Manage and maintain Terraform",
      "Manage and maintain Node.js",
      "Apply expertise in JavaScript to support departmental OKRs",
      "Manage and maintain Git",
      "Manage and maintain Docker",
    ],
    redFlag: "No Familiarity with AI Tools",
  },
  {
    id: "3003",
    name: "Bryan Logan",
    position: "Frontend Developer",
    department: "Engineering",
    email: "bryanlogan@gmail.com",
    payroll: {
      baseSalary: 140000,
      bonus: 18000,
      stockOptions: 8000,
      lastRaiseDate: "2023-03-15",
      raisePercentage: 7
    },
    performance: {
      goals: [
        {
          name: "Lead frontend architecture redesign",
          targetDate: "2023-12-31",
          completion: 75,
          status: "on track"
        },
        {
          name: "Mentor 3 junior developers",
          targetDate: "2023-09-30",
          completion: 100,
          status: "completed"
        },
        {
          name: "Improve accessibility compliance",
          targetDate: "2023-11-30",
          completion: 85,
          status: "on track"
        }
      ],
      overallCompletion: 87
    },
    education: {
      degree: "BA Design",
      institution: "Art & Design College",
      location: "New York, USA",
      startDate: "2010",
      endDate: "2014",
      gpa: "3.8",
    },
    experience: [
      {
        company: "UI Innovations",
        position: "Senior Frontend Developer",
        location: "New York, NY",
        startDate: "2014",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Led frontend architecture decisions",
          "Implemented design systems",
          "Mentored team members",
        ],
      },
      {
        company: "Digital Experiences",
        position: "Frontend Developer",
        location: "New York, NY",
        startDate: "2012",
        endDate: "2014",
        current: false,
        responsibilities: [
          "Developed interactive web applications",
          "Collaborated with UX designers",
          "Optimized frontend performance",
        ],
      },
    ],
    skills: ["Infrastructure as Code", "Cloud Infrastructure"],
    tools: ["Docker", "Git", "JavaScript", "React", "Node.js"],
    jobDescription: [
      "Manage and maintain Docker",
      "Apply expertise in AWS to support departmental OKRs",
      "Manage and maintain Node.js",
      "Manage and maintain JavaScript",
      "Apply expertise in Terraform to support departmental OKRs",
    ],
  },
  {
    id: "3007",
    name: "Kaylee Trevino",
    position: "Software Engineer",
    department: "Engineering",
    email: "kayleetrevino@gmail.com",
    payroll: {
      baseSalary: 110000,
      bonus: 9000,
      stockOptions: 2500,
      lastRaiseDate: "2023-02-10",
      raisePercentage: 6
    },
    performance: {
      goals: [
        {
          name: "Develop full-stack features",
          targetDate: "2023-12-31",
          completion: 80,
          status: "on track"
        },
        {
          name: "Improve CI/CD pipeline",
          targetDate: "2023-08-31",
          completion: 95,
          status: "on track"
        },
        {
          name: "Complete cloud certification",
          targetDate: "2023-10-31",
          completion: 30,
          status: "needs attention"
        }
      ],
      overallCompletion: 68
    },
    education: {
      degree: "BS Software Engineering",
      institution: "Engineering University",
      location: "Los Angeles, USA",
      startDate: "2013",
      endDate: "2017",
      gpa: "3.7",
    },
    experience: [
      {
        company: "Code Masters",
        position: "Software Engineer",
        location: "Los Angeles, CA",
        startDate: "2017",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Developed full-stack applications",
          "Implemented CI/CD pipelines",
          "Conducted code reviews",
        ],
      },
      {
        company: "Tech Solutions",
        position: "Junior Developer",
        location: "San Diego, CA",
        startDate: "2015",
        endDate: "2017",
        current: false,
        responsibilities: [
          "Assisted in software development",
          "Fixed bugs",
          "Wrote documentation",
        ],
      },
    ],
    skills: ["Containerization", "UI Development", "Cloud Infrastructure"],
    tools: ["Terraform", "Git", "Node.js", "JavaScript"],
    jobDescription: [
      "Manage and maintain Node.js",
      "Apply expertise in AWS to support departmental OKRs",
      "Manage and maintain JavaScript",
      "Apply expertise in Docker to support departmental OKRs",
      "Apply expertise in React to support departmental OKRs",
    ],
    redFlag: "JD-Experience Mismatch",
  },
  {
    id: "6009",
    name: "Connie Decker",
    position: "Product Analyst",
    department: "Product",
    email: "conniedecker@gmail.com",
    payroll: {
      baseSalary: 95000,
      bonus: 8000,
      stockOptions: 2000,
      lastRaiseDate: "2023-01-20",
      raisePercentage: 5
    },
    performance: {
      goals: [
        {
          name: "Create product dashboards",
          targetDate: "2023-09-30",
          completion: 90,
          status: "on track"
        },
        {
          name: "Analyze user behavior patterns",
          targetDate: "2023-12-31",
          completion: 70,
          status: "on track"
        },
        {
          name: "Support 5 A/B tests",
          targetDate: "2023-11-30",
          completion: 60,
          status: "on track"
        }
      ],
      overallCompletion: 73
    },
    education: {
      degree: "BA Psychology",
      institution: "Liberal Arts College",
      location: "Denver, USA",
      startDate: "2018",
      endDate: "2022",
      gpa: "3.6",
    },
    experience: [
      {
        company: "Product Insights",
        position: "Product Analyst",
        location: "Denver, CO",
        startDate: "2022",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Analyzed user behavior data",
          "Created product dashboards",
          "Supported A/B testing",
        ],
      },
      {
        company: "Market Research Co",
        position: "Research Assistant",
        location: "Boulder, CO",
        startDate: "2020",
        endDate: "2022",
        current: false,
        responsibilities: [
          "Conducted user interviews",
          "Analyzed survey data",
          "Prepared research reports",
        ],
      },
    ],
    skills: ["Project Management", "Documentation Management", "Product Planning"],
    tools: ["Amplitude", "SQL"],
    jobDescription: [
      "Apply expertise in Notion to support departmental OKRs",
      "Manage and maintain SQL",
      "Manage and maintain Amplitude",
      "Apply expertise in Jira to support departmental OKRs",
      "Apply expertise in Productboard to support departmental OKRs",
    ],
    redFlag: "No Recent Learning Activity",
  },
  {
    id: "6005",
    name: "Breanna Smith",
    position: "Product Manager",
    department: "Product",
    email: "breannasmith@gmail.com",
    payroll: {
      baseSalary: 135000,
      bonus: 20000,
      stockOptions: 10000,
      lastRaiseDate: "2023-04-05",
      raisePercentage: 10
    },
    performance: {
      goals: [
        {
          name: "Define product strategy",
          targetDate: "2023-12-31",
          completion: 85,
          status: "on track"
        },
        {
          name: "Launch 3 major features",
          targetDate: "2023-11-30",
          completion: 75,
          status: "on track"
        },
        {
          name: "Improve team velocity by 15%",
          targetDate: "2023-09-30",
          completion: 95,
          status: "on track"
        }
      ],
      overallCompletion: 85
    },
    education: {
      degree: "BS Software Engineering",
      institution: "Tech University",
      location: "Atlanta, USA",
      startDate: "2013",
      endDate: "2017",
      gpa: "3.8",
    },
    experience: [
      {
        company: "Product Vision",
        position: "Product Manager",
        location: "Atlanta, GA",
        startDate: "2017",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Defined product strategy",
          "Led cross-functional teams",
          "Prioritized feature roadmap",
        ],
      },
      {
        company: "TechStart",
        position: "Associate Product Manager",
        location: "Charlotte, NC",
        startDate: "2015",
        endDate: "2017",
        current: false,
        responsibilities: [
          "Gathered product requirements",
          "Created user stories",
          "Analyzed market trends",
        ],
      },
    ],
    skills: ["Product Planning", "Data Analysis", "Product Analytics"],
    tools: ["Notion", "Jira"],
    jobDescription: [
      "Apply expertise in SQL to support departmental OKRs",
      "Apply expertise in Productboard to support departmental OKRs",
      "Manage and maintain Notion",
      "Manage and maintain Jira",
      "Apply expertise in Amplitude to support departmental OKRs",
    ],
  },
  {
    id: "6006",
    name: "Christopher Esparza",
    position: "Associate Product Manager",
    department: "Product",
    email: "christopheresparza@gmail.com",
    payroll: {
      baseSalary: 90000,
      bonus: 7000,
      stockOptions: 1500,
      lastRaiseDate: "2023-03-01",
      raisePercentage: 5
    },
    performance: {
      goals: [
        {
          name: "Manage product backlog",
          targetDate: "2023-12-31",
          completion: 90,
          status: "on track"
        },
        {
          name: "Complete competitive analysis",
          targetDate: "2023-08-31",
          completion: 100,
          status: "completed"
        },
        {
          name: "Coordinate 2 product launches",
          targetDate: "2023-11-30",
          completion: 50,
          status: "on track"
        }
      ],
      overallCompletion: 80
    },
    education: {
      degree: "BBA Marketing",
      institution: "Business School",
      location: "Miami, USA",
      startDate: "2009",
      endDate: "2013",
      gpa: "3.5",
    },
    experience: [
      {
        company: "Product Leaders",
        position: "Associate Product Manager",
        location: "Miami, FL",
        startDate: "2013",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Conducted competitive analysis",
          "Managed product backlog",
          "Coordinated product launches",
        ],
      },
      {
        company: "Digital Marketing Co",
        position: "Marketing Specialist",
        location: "Orlando, FL",
        startDate: "2011",
        endDate: "2013",
        current: false,
        responsibilities: [
          "Developed marketing strategies",
          "Analyzed campaign performance",
          "Created content",
        ],
      },
    ],
    skills: ["Product Planning", "Product Analytics"],
    tools: ["Jira", "Notion", "SQL"],
    jobDescription: [
      "Manage and maintain SQL",
      "Manage and maintain Jira",
      "Apply expertise in Productboard to support departmental OKRs",
      "Apply expertise in Amplitude to support departmental OKRs",
      "Manage and maintain Notion",
    ],
    redFlag: "No Familiarity with AI Tools",
  },
  {
    id: "6007",
    name: "Olivia Gomez",
    position: "Product Manager",
    department: "Product",
    email: "oliviagomez@gmail.com",
    payroll: {
      baseSalary: 130000,
      bonus: 18000,
      stockOptions: 9000,
      lastRaiseDate: "2023-02-15",
      raisePercentage: 8
    },
    performance: {
      goals: [
        {
          name: "Define product vision",
          targetDate: "2023-12-31",
          completion: 80,
          status: "on track"
        },
        {
          name: "Conduct user research study",
          targetDate: "2023-09-30",
          completion: 100,
          status: "completed"
        },
        {
          name: "Improve key metrics by 10%",
          targetDate: "2023-11-30",
          completion: 65,
          status: "on track"
        }
      ],
      overallCompletion: 82
    },
    education: {
      degree: "BS Economics",
      institution: "State University",
      location: "Phoenix, USA",
      startDate: "2011",
      endDate: "2015",
      gpa: "3.7",
    },
    experience: [
      {
        company: "Product Innovators",
        position: "Product Manager",
        location: "Phoenix, AZ",
        startDate: "2015",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Defined product vision",
          "Conducted user research",
          "Analyzed business metrics",
        ],
      },
      {
        company: "Data Insights",
        position: "Business Analyst",
        location: "Tucson, AZ",
        startDate: "2013",
        endDate: "2015",
        current: false,
        responsibilities: [
          "Analyzed business data",
          "Created reports",
          "Identified improvement opportunities",
        ],
      },
    ],
    skills: ["Documentation Management", "Product Planning", "Data Analysis"],
    tools: ["Amplitude", "Jira"],
    jobDescription: [
      "Apply expertise in Productboard to support departmental OKRs",
      "Manage and maintain Jira",
      "Apply expertise in Notion to support departmental OKRs",
      "Manage and maintain Amplitude",
      "Apply expertise in SQL to support departmental OKRs",
    ],
  },
  {
    id: "6008",
    name: "Tyler Peters",
    position: "Associate Product Manager",
    department: "Product",
    email: "tylerpeters@gmail.com",
    payroll: {
      baseSalary: 85000,
      bonus: 6000,
      stockOptions: 1000,
      lastRaiseDate: "2023-01-10",
      raisePercentage: 4
    },
    performance: {
      goals: [
        {
          name: "Gather user feedback",
          targetDate: "2023-12-31",
          completion: 85,
          status: "on track"
        },
        {
          name: "Create product documentation",
          targetDate: "2023-08-31",
          completion: 95,
          status: "on track"
        },
        {
          name: "Track feature adoption metrics",
          targetDate: "2023-10-31",
          completion: 70,
          status: "on track"
        }
      ],
      overallCompletion: 83
    },
    education: {
      degree: "BSc Computer Science",
      institution: "Tech College",
      location: "Portland, USA",
      startDate: "2015",
      endDate: "2019",
      gpa: "3.6",
    },
    experience: [
      {
        company: "Product Builders",
        position: "Associate Product Manager",
        location: "Portland, OR",
        startDate: "2019",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Gathered user feedback",
          "Created product documentation",
          "Tracked feature adoption",
        ],
      },
      {
        company: "Tech Solutions",
        position: "Technical Analyst",
        location: "Seattle, WA",
        startDate: "2017",
        endDate: "2019",
        current: false,
        responsibilities: [
          "Analyzed technical requirements",
          "Created specifications",
          "Supported development teams",
        ],
      },
    ],
    skills: ["Product Analytics", "Documentation Management"],
    tools: ["SQL", "Productboard", "Jira"],
    jobDescription: [
      "Manage and maintain SQL",
      "Apply expertise in Amplitude to support departmental OKRs",
      "Apply expertise in Notion to support departmental OKRs",
      "Manage and maintain Productboard",
      "Manage and maintain Jira",
    ],
  },
  {
    id: "7002",
    name: "Larry Warner",
    position: "UI Designer",
    department: "Design",
    email: "larrywarner@gmail.com",
    payroll: {
      baseSalary: 105000,
      bonus: 9000,
      stockOptions: 3000,
      lastRaiseDate: "2023-03-05",
      raisePercentage: 6
    },
    performance: {
      goals: [
        {
          name: "Create new UI components",
          targetDate: "2023-12-31",
          completion: 80,
          status: "on track"
        },
        {
          name: "Develop design system",
          targetDate: "2023-10-31",
          completion: 90,
          status: "on track"
        },
        {
          name: "Conduct usability tests",
          targetDate: "2023-09-30",
          completion: 70,
          status: "on track"
        }
      ],
      overallCompletion: 80
    },
    education: {
      degree: "BS Economics",
      institution: "City University",
      location: "Chicago, USA",
      startDate: "2012",
      endDate: "2016",
      gpa: "3.5",
    },
    experience: [
      {
        company: "Design Studio",
        position: "UI Designer",
        location: "Chicago, IL",
        startDate: "2016",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Created user interfaces",
          "Developed design systems",
          "Conducted usability testing",
        ],
      },
      {
        company: "Creative Agency",
        position: "Junior Designer",
        location: "Milwaukee, WI",
        startDate: "2014",
        endDate: "2016",
        current: false,
        responsibilities: [
          "Assisted in design projects",
          "Created mockups",
          "Participated in client meetings",
        ],
      },
    ],
    skills: ["UI/UX Design", "Interface Design", "UX Testing"],
    tools: ["InVision", "Adobe XD"],
    jobDescription: [
      "Manage and maintain Adobe XD",
      "Manage and maintain InVision",
      "Apply expertise in Maze to support departmental OKRs",
      "Apply expertise in Sketch to support departmental OKRs",
      "Apply expertise in Figma to support departmental OKRs",
    ],
    redFlag: "No Familiarity with AI Tools",
  },
  {
    id: "7003",
    name: "Paul Wright",
    position: "UI Designer",
    department: "Design",
    email: "paulwright@gmail.com",
    payroll: {
      baseSalary: 98000,
      bonus: 8000,
      stockOptions: 2500,
      lastRaiseDate: "2023-02-01",
      raisePercentage: 5
    },
    performance: {
      goals: [
        {
          name: "Design new interfaces",
          targetDate: "2023-12-31",
          completion: 75,
          status: "on track"
        },
        {
          name: "Create interactive prototypes",
          targetDate: "2023-09-30",
          completion: 85,
          status: "on track"
        },
        {
          name: "Improve design-dev handoff",
          targetDate: "2023-11-30",
          completion: 60,
          status: "needs attention"
        }
      ],
      overallCompletion: 73
    },
    education: {
      degree: "BSc Computer Science",
      institution: "Tech Institute",
      location: "San Diego, USA",
      startDate: "2011",
      endDate: "2015",
      gpa: "3.7",
    },
    experience: [
      {
        company: "Digital Design Co",
        position: "UI Designer",
        location: "San Diego, CA",
        startDate: "2015",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Designed user interfaces",
          "Created prototypes",
          "Collaborated with developers",
        ],
      },
      {
        company: "Web Design Agency",
        position: "Graphic Designer",
        location: "Los Angeles, CA",
        startDate: "2013",
        endDate: "2015",
        current: false,
        responsibilities: [
          "Created visual designs",
          "Developed branding materials",
          "Designed marketing collateral",
        ],
      },
    ],
    skills: ["Interface Design", "Prototyping"],
    tools: ["Figma", "InVision", "Maze"],
    jobDescription: [
      "Apply expertise in Sketch to support departmental OKRs",
      "Manage and maintain Maze",
      "Apply expertise in Adobe XD to support departmental OKRs",
      "Manage and maintain InVision",
      "Manage and maintain Figma",
    ],
    redFlag: "Underleveled",
  },
  {
    id: "7004",
    name: "Kenneth Brown",
    position: "UX Designer",
    department: "Design",
    email: "kennethbrown@gmail.com",
    payroll: {
      baseSalary: 110000,
      bonus: 10000,
      stockOptions: 3500,
      lastRaiseDate: "2023-03-20",
      raisePercentage: 7
    },
    performance: {
      goals: [
        {
          name: "Conduct user research",
          targetDate: "2023-12-31",
          completion: 85,
          status: "on track"
        },
        {
          name: "Create user flows",
          targetDate: "2023-08-31",
          completion: 95,
          status: "on track"
        },
        {
          name: "Design wireframes",
          targetDate: "2023-10-31",
          completion: 75,
          status: "on track"
        }
      ],
      overallCompletion: 85
    },
    education: {
      degree: "BS Economics",
      institution: "State College",
      location: "Austin, USA",
      startDate: "2018",
      endDate: "2022",
      gpa: "3.6",
    },
    experience: [
      {
        company: "UX Studio",
        position: "UX Designer",
        location: "Austin, TX",
        startDate: "2022",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Conducted user research",
          "Created user flows",
          "Designed wireframes",
        ],
      },
      {
        company: "Research Labs",
        position: "Research Intern",
        location: "Dallas, TX",
        startDate: "2020",
        endDate: "2022",
        current: false,
        responsibilities: [
          "Assisted in user studies",
          "Analyzed research data",
          "Prepared reports",
        ],
      },
    ],
    skills: ["Prototyping", "Interface Design", "UI/UX Design"],
    tools: ["Maze", "Adobe XD"],
    jobDescription: [
      "Apply expertise in Sketch to support departmental OKRs",
      "Manage and maintain Maze",
      "Apply expertise in Figma to support departmental OKRs",
      "Apply expertise in InVision to support departmental OKRs",
      "Manage and maintain Adobe XD",
    ],
  },
  {
    id: "4006",
    name: "Antonio Stanton",
    position: "Product Marketing Manager",
    department: "Marketing",
    email: "antoniostanton@gmail.com",
    payroll: {
      baseSalary: 120000,
      bonus: 15000,
      stockOptions: 7000,
      lastRaiseDate: "2023-04-10",
      raisePercentage: 8
    },
    performance: {
      goals: [
        {
          name: "Develop marketing strategy",
          targetDate: "2023-12-31",
          completion: 80,
          status: "on track"
        },
        {
          name: "Create product messaging",
          targetDate: "2023-09-30",
          completion: 90,
          status: "on track"
        },
        {
          name: "Launch 2 campaigns",
          targetDate: "2023-11-30",
          completion: 65,
          status: "on track"
        }
      ],
      overallCompletion: 78
    },
    education: {
      degree: "MBA",
      institution: "Business School",
      location: "New York, USA",
      startDate: "2017",
      endDate: "2019",
      gpa: "3.8",
    },
    experience: [
      {
        company: "Marketing Pros",
        position: "Product Marketing Manager",
        location: "New York, NY",
        startDate: "2019",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Developed marketing strategies",
          "Created product messaging",
          "Launched marketing campaigns",
        ],
      },
      {
        company: "Digital Marketing Co",
        position: "Marketing Specialist",
        location: "Boston, MA",
        startDate: "2017",
        endDate: "2019",
        current: false,
        responsibilities: [
          "Executed digital campaigns",
          "Analyzed marketing data",
          "Optimized content",
        ],
      },
    ],
    skills: ["SEO Analysis", "Email Marketing", "Content Management"],
    tools: ["Google Ads", "ChatGPT", "HubSpot"],
    jobDescription: [
      "Apply expertise in Mailchimp to support departmental OKRs",
      "Apply expertise in Contentful to support departmental OKRs",
      "Manage and maintain HubSpot",
      "Manage and maintain Google Ads",
      "Manage and maintain ChatGPT",
    ],
  },
  {
    id: "4007",
    name: "Eric Banks",
    position: "SEO Specialist",
    department: "Marketing",
    email: "ericbanks@gmail.com",
    payroll: {
      baseSalary: 95000,
      bonus: 8000,
      stockOptions: 2000,
      lastRaiseDate: "2023-03-15",
      raisePercentage: 6
    },
    performance: {
      goals: [
        {
          name: "Optimize website content",
          targetDate: "2023-12-31",
          completion: 85,
          status: "on track"
        },
        {
          name: "Conduct keyword research",
          targetDate: "2023-08-31",
          completion: 95,
          status: "on track"
        },
        {
          name: "Improve organic rankings",
          targetDate: "2023-11-30",
          completion: 70,
          status: "on track"
        }
      ],
      overallCompletion: 83
    },
    education: {
      degree: "BSc Computer Science",
      institution: "Tech University",
      location: "San Francisco, USA",
      startDate: "2012",
      endDate: "2016",
      gpa: "3.6",
    },
    experience: [
      {
        company: "SEO Experts",
        position: "SEO Specialist",
        location: "San Francisco, CA",
        startDate: "2016",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Optimized website content",
          "Conducted keyword research",
          "Analyzed SEO performance",
        ],
      },
      {
        company: "Digital Agency",
        position: "Content Strategist",
        location: "Oakland, CA",
        startDate: "2014",
        endDate: "2016",
        current: false,
        responsibilities: [
          "Developed content strategies",
          "Optimized blog posts",
          "Managed editorial calendar",
        ],
      },
    ],
    skills: ["CRM Management", "Prompt Engineering"],
    tools: ["Google Ads", "Mailchimp", "Contentful", "Ahrefs"],
    jobDescription: [
      "Apply expertise in ChatGPT to support departmental OKRs",
      "Manage and maintain Mailchimp",
      "Manage and maintain Contentful",
      "Manage and maintain Google Ads",
      "Apply expertise in HubSpot to support departmental OKRs",
    ],
  },
  {
    id: "4004",
    name: "Nancy Parks",
    position: "Content Strategist",
    department: "Marketing",
    email: "nancyparks@gmail.com",
    payroll: {
      baseSalary: 100000,
      bonus: 9000,
      stockOptions: 2500,
      lastRaiseDate: "2023-02-05",
      raisePercentage: 5
    },
    performance: {
      goals: [
        {
          name: "Develop content strategy",
          targetDate: "2023-12-31",
          completion: 90,
          status: "on track"
        },
        {
          name: "Manage content calendar",
          targetDate: "2023-09-30",
          completion: 95,
          status: "on track"
        },
        {
          name: "Optimize content for SEO",
          targetDate: "2023-11-30",
          completion: 80,
          status: "on track"
        }
      ],
      overallCompletion: 88
    },
    education: {
      degree: "BBA Marketing",
      institution: "Business College",
      location: "Dallas, USA",
      startDate: "2012",
      endDate: "2016",
      gpa: "3.7",
    },
    experience: [
      {
        company: "Content Creators",
        position: "Content Strategist",
        location: "Dallas, TX",
        startDate: "2016",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Developed content strategy",
          "Managed content calendar",
          "Optimized content for SEO",
        ],
      },
      {
        company: "Marketing Agency",
        position: "Content Writer",
        location: "Houston, TX",
        startDate: "2014",
        endDate: "2016",
        current: false,
        responsibilities: [
          "Created blog content",
          "Researched topics",
          "Edited content",
        ],
      },
    ],
    skills: [
      "Prompt Engineering",
      "Content Management",
      "Digital Advertising",
      "SEO Analysis",
    ],
    tools: ["HubSpot", "Mailchimp"],
    jobDescription: [
      "Manage and maintain Mailchimp",
      "Apply expertise in Ahrefs to support departmental OKRs",
      "Apply expertise in Contentful to support departmental OKRs",
      "Apply expertise in Google Ads to support departmental OKRs",
      "Apply expertise in ChatGPT to support departmental OKRs",
    ],
  },
  {
    id: "4009",
    name: "Jonathan Howell",
    position: "Performance Marketer",
    department: "Marketing",
    email: "jonathanhowell@gmail.com",
    payroll: {
      baseSalary: 110000,
      bonus: 12000,
      stockOptions: 4000,
      lastRaiseDate: "2023-03-01",
      raisePercentage: 7
    },
    performance: {
      goals: [
        {
          name: "Manage paid campaigns",
          targetDate: "2023-12-31",
          completion: 85,
          status: "on track"
        },
        {
          name: "Optimize ad performance",
          targetDate: "2023-09-30",
          completion: 90,
          status: "on track"
        },
        {
          name: "Analyze marketing data",
          targetDate: "2023-11-30",
          completion: 75,
          status: "on track"
        }
      ],
      overallCompletion: 83
    },
    education: {
      degree: "BA Design",
      institution: "Art Institute",
      location: "Miami, USA",
      startDate: "2010",
      endDate: "2014",
      gpa: "3.5",
    },
    experience: [
      {
        company: "Performance Marketing Co",
        position: "Performance Marketer",
        location: "Miami, FL",
        startDate: "2014",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Managed paid campaigns",
          "Optimized ad performance",
          "Analyzed marketing data",
        ],
      },
      {
        company: "Digital Ads Agency",
        position: "Media Buyer",
        location: "Tampa, FL",
        startDate: "2012",
        endDate: "2014",
        current: false,
        responsibilities: [
          "Placed digital ads",
          "Monitored campaign performance",
          "Prepared reports",
        ],
      },
    ],
    skills: ["SEO Analysis", "Content Management", "Email Marketing"],
    tools: ["Google Ads", "HubSpot", "ChatGPT"],
    jobDescription: [
      "Apply expertise in Mailchimp to support departmental OKRs",
      "Manage and maintain HubSpot",
      "Manage and maintain ChatGPT",
      "Manage and maintain Google Ads",
      "Apply expertise in Ahrefs to support departmental OKRs",
    ],
  },
  {
    id: "4005",
    name: "Sara Hoffman",
    position: "Content Strategist",
    department: "Marketing",
    email: "sarahoffman@gmail.com",
    payroll: {
      baseSalary: 125000,
      bonus: 15000,
      stockOptions: 8000,
      lastRaiseDate: "2023-04-15",
      raisePercentage: 9
    },
    performance: {
      goals: [
        {
          name: "Develop content strategy",
          targetDate: "2023-12-31",
          completion: 90,
          status: "on track"
        },
        {
          name: "Manage content team",
          targetDate: "2023-09-30",
          completion: 95,
          status: "on track"
        },
        {
          name: "Align content with business goals",
          targetDate: "2023-11-30",
          completion: 85,
          status: "on track"
        }
      ],
      overallCompletion: 90
    },
    education: {
      degree: "MBA",
      institution: "Business School",
      location: "Chicago, USA",
      startDate: "2011",
      endDate: "2013",
      gpa: "3.9",
    },
    experience: [
      {
        company: "Strategic Content",
        position: "Content Strategist",
        location: "Chicago, IL",
        startDate: "2013",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Developed content strategy",
          "Managed content team",
          "Aligned content with business goals",
        ],
      },
      {
        company: "Corporate Marketing",
        position: "Marketing Manager",
        location: "Detroit, MI",
        startDate: "2011",
        endDate: "2013",
        current: false,
        responsibilities: [
          "Managed marketing campaigns",
          "Developed brand messaging",
          "Coordinated events",
        ],
      },
    ],
    skills: [
      "Digital Advertising",
      "Content Management",
      "SEO Analysis",
      "CRM Management",
    ],
    tools: ["Mailchimp", "ChatGPT"],
    jobDescription: [
      "Apply expertise in Ahrefs to support departmental OKRs",
      "Manage and maintain ChatGPT",
      "Apply expertise in Contentful to support departmental OKRs",
      "Apply expertise in HubSpot to support departmental OKRs",
      "Manage and maintain Mailchimp",
    ],
  },
  {
    id: "4008",
    name: "Amanda Peterson",
    position: "SEO Specialist",
    department: "Marketing",
    email: "amandapeterson@gmail.com",
    payroll: {
      baseSalary: 98000,
      bonus: 8500,
      stockOptions: 2200,
      lastRaiseDate: "2023-02-28",
      raisePercentage: 6
    },
    performance: {
      goals: [
        {
          name: "Develop SEO strategy",
          targetDate: "2023-12-31",
          completion: 85,
          status: "on track"
        },
        {
          name: "Conduct technical audits",
          targetDate: "2023-09-30",
          completion: 90,
          status: "on track"
        },
        {
          name: "Improve organic rankings",
          targetDate: "2023-11-30",
          completion: 75,
          status: "on track"
        }
      ],
      overallCompletion: 83
    },
    education: {
      degree: "BS Economics",
      institution: "State University",
      location: "Denver, USA",
      startDate: "2009",
      endDate: "2013",
      gpa: "3.6",
    },
    experience: [
      {
        company: "SEO Masters",
        position: "SEO Specialist",
        location: "Denver, CO",
        startDate: "2013",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Developed SEO strategy",
          "Conducted technical audits",
          "Improved organic rankings",
        ],
      },
      {
        company: "Digital Marketing",
        position: "SEO Analyst",
        location: "Boulder, CO",
        startDate: "2011",
        endDate: "2013",
        current: false,
        responsibilities: [
          "Analyzed SEO performance",
          "Researched keywords",
          "Prepared reports",
        ],
      },
    ],
    skills: [
      "SEO Analysis",
      "Content Management",
      "Prompt Engineering",
      "Digital Advertising",
    ],
    tools: ["HubSpot", "Mailchimp"],
    jobDescription: [
      "Apply expertise in Google Ads to support departmental OKRs",
      "Apply expertise in Contentful to support departmental OKRs",
      "Manage and maintain HubSpot",
      "Apply expertise in Ahrefs to support departmental OKRs",
      "Apply expertise in ChatGPT to support departmental OKRs",
    ],
  },
  {
    id: "8002",
    name: "Edward Hernandez",
    position: "Customer Success Manager",
    department: "Customer Success",
    email: "edwardhernandez@gmail.com",
    payroll: {
      baseSalary: 105000,
      bonus: 12000,
      stockOptions: 4000,
      lastRaiseDate: "2023-03-10",
      raisePercentage: 7
    },
    performance: {
      goals: [
        {
          name: "Manage customer relationships",
          targetDate: "2023-12-31",
          completion: 90,
          status: "on track"
        },
        {
          name: "Onboard new clients",
          targetDate: "2023-09-30",
          completion: 95,
          status: "on track"
        },
        {
          name: "Identify upsell opportunities",
          targetDate: "2023-11-30",
          completion: 80,
          status: "on track"
        }
      ],
      overallCompletion: 88
    },
    education: {
      degree: "BS Software Engineering",
      institution: "Tech College",
      location: "Seattle, USA",
      startDate: "2018",
      endDate: "2022",
      gpa: "3.5",
    },
    experience: [
      {
        company: "Customer Success Co",
        position: "Customer Success Manager",
        location: "Seattle, WA",
        startDate: "2022",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Managed customer relationships",
          "Onboarded new clients",
          "Identified upsell opportunities",
        ],
      },
      {
        company: "Tech Support",
        position: "Support Specialist",
        location: "Portland, OR",
        startDate: "2020",
        endDate: "2022",
        current: false,
        responsibilities: [
          "Resolved customer issues",
          "Documented support cases",
          "Trained customers",
        ],
      },
    ],
    skills: ["CRM Management", "Slack"],
    tools: ["Intercom", "Notion", "Zendesk"],
    jobDescription: [
      "Manage and maintain Intercom",
      "Manage and maintain Notion",
      "Manage and maintain Zendesk",
      "Apply expertise in Slack to support departmental OKRs",
      "Apply expertise in HubSpot to support departmental OKRs",
    ],
  },
  {
    id: "8003",
    name: "Steven Pierce",
    position: "Customer Success Manager",
    department: "Customer Success",
    email: "stevenpierce@gmail.com",
    payroll: {
      baseSalary: 110000,
      bonus: 13000,
      stockOptions: 4500,
      lastRaiseDate: "2023-04-05",
      raisePercentage: 8
    },
    performance: {
      goals: [
        {
          name: "Manage key accounts",
          targetDate: "2023-12-31",
          completion: 85,
          status: "on track"
        },
        {
          name: "Improve customer retention",
          targetDate: "2023-09-30",
          completion: 90,
          status: "on track"
        },
        {
          name: "Gather customer feedback",
          targetDate: "2023-11-30",
          completion: 75,
          status: "on track"
        }
      ],
      overallCompletion: 83
    },
    education: {
      degree: "BS Economics",
      institution: "State College",
      location: "Boston, USA",
      startDate: "2015",
      endDate: "2019",
      gpa: "3.6",
    },
    experience: [
      {
        company: "Success Partners",
        position: "Customer Success Manager",
        location: "Boston, MA",
        startDate: "2019",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Managed key accounts",
          "Improved customer retention",
          "Gathered customer feedback",
        ],
      },
      {
        company: "Account Management",
        position: "Account Coordinator",
        location: "Providence, RI",
        startDate: "2017",
        endDate: "2019",
        current: false,
        responsibilities: [
          "Supported account managers",
          "Prepared reports",
          "Coordinated meetings",
        ],
      },
    ],
    skills: ["Documentation Management", "Customer Engagement"],
    tools: ["HubSpot", "Zendesk", "Slack"],
    jobDescription: [
      "Apply expertise in Intercom to support departmental OKRs",
      "Apply expertise in Notion to support departmental OKRs",
      "Manage and maintain HubSpot",
      "Manage and maintain Zendesk",
      "Manage and maintain Slack",
    ],
    redFlag: "No Familiarity with AI Tools",
  },
  {
    id: "8004",
    name: "Don Forbes",
    position: "Customer Success Manager",
    department: "Customer Success",
    email: "donforbes@gmail.com",
    payroll: {
      baseSalary: 115000,
      bonus: 14000,
      stockOptions: 5000,
      lastRaiseDate: "2023-03-20",
      raisePercentage: 9
    },
    performance: {
      goals: [
        {
          name: "Improve customer satisfaction",
          targetDate: "2023-12-31",
          completion: 90,
          status: "on track"
        },
        {
          name: "Develop success plans",
          targetDate: "2023-09-30",
          completion: 95,
          status: "on track"
        },
        {
          name: "Advocate for customer needs",
          targetDate: "2023-11-30",
          completion: 85,
          status: "on track"
        }
      ],
      overallCompletion: 90
    },
    education: {
      degree: "BSc Computer Science",
      institution: "Tech University",
      location: "Austin, USA",
      startDate: "2015",
      endDate: "2019",
      gpa: "3.7",
    },
    experience: [
      {
        company: "Customer Experience",
        position: "Customer Success Manager",
        location: "Austin, TX",
        startDate: "2019",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Improved customer satisfaction",
          "Developed success plans",
          "Advocated for customer needs",
        ],
      },
      {
        company: "Tech Support",
        position: "Technical Account Manager",
        location: "Dallas, TX",
        startDate: "2017",
        endDate: "2019",
        current: false,
        responsibilities: [
          "Provided technical support",
          "Trained customers",
          "Documented solutions",
        ],
      },
    ],
    skills: ["Slack", "Documentation Management"],
    tools: ["Intercom", "HubSpot", "Zendesk"],
    jobDescription: [
      "Apply expertise in Slack to support departmental OKRs",
      "Apply expertise in Notion to support departmental OKRs",
      "Manage and maintain HubSpot",
      "Manage and maintain Intercom",
      "Manage and maintain Zendesk",
    ],
  },
  {
    id: "6",
    name: "William Bonilla",
    position: "Talent Acquisition Specialist",
    department: "People & HR",
    email: "williambonilla@gmail.com",
    payroll: {
      baseSalary: 95000,
      bonus: 8000,
      stockOptions: 2000,
      lastRaiseDate: "2023-02-15",
      raisePercentage: 6
    },
    performance: {
      goals: [
        {
          name: "Source candidates",
          targetDate: "2023-12-31",
          completion: 85,
          status: "on track"
        },
        {
          name: "Conduct interviews",
          targetDate: "2023-09-30",
          completion: 90,
          status: "on track"
        },
        {
          name: "Manage hiring process",
          targetDate: "2023-11-30",
          completion: 75,
          status: "on track"
        }
      ],
      overallCompletion: 83
    },
    education: {
      degree: "BBA Marketing",
      institution: "Business School",
      location: "Orlando, USA",
      startDate: "2014",
      endDate: "2018",
      gpa: "3.5",
    },
    experience: [
      {
        company: "Talent Solutions",
        position: "Talent Acquisition Specialist",
        location: "Orlando, FL",
        startDate: "2018",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Sourced candidates",
          "Conducted interviews",
          "Managed hiring process",
        ],
      },
      {
        company: "HR Services",
        position: "Recruiter",
        location: "Tampa, FL",
        startDate: "2016",
        endDate: "2018",
        current: false,
        responsibilities: [
          "Screened resumes",
          "Coordinated interviews",
          "Built talent pipelines",
        ],
      },
    ],
    skills: ["Talent Acquisition", "HR Operations"],
    tools: ["15Five", "LinkedIn Recruiter"],
    jobDescription: [
      "Apply expertise in BambooHR to support departmental OKRs",
      "Manage and maintain 15Five",
      "Manage and maintain LinkedIn Recruiter",
      "Apply expertise in Lever to support departmental OKRs",
    ],
  },
  {
    id: "1002",
    name: "Heather Hendricks",
    position: "Talent Acquisition Specialist",
    department: "People & HR",
    email: "heatherhendricks@gmail.com",
    payroll: {
      baseSalary: 100000,
      bonus: 9000,
      stockOptions: 2500,
      lastRaiseDate: "2023-03-05",
      raisePercentage: 7
    },
    performance: {
      goals: [
        {
          name: "Develop hiring strategies",
          targetDate: "2023-12-31",
          completion: 80,
          status: "on track"
        },
        {
          name: "Build employer brand",
          targetDate: "2023-09-30",
          completion: 90,
          status: "on track"
        },
        {
          name: "Improve candidate experience",
          targetDate: "2023-11-30",
          completion: 70,
          status: "on track"
        }
      ],
      overallCompletion: 80
    },
    education: {
      degree: "BA Psychology",
      institution: "Liberal Arts College",
      location: "Philadelphia, USA",
      startDate: "2008",
      endDate: "2012",
      gpa: "3.6",
    },
    experience: [
      {
        company: "HR Partners",
        position: "Talent Acquisition Specialist",
        location: "Philadelphia, PA",
        startDate: "2012",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Developed hiring strategies",
          "Built employer brand",
          "Improved candidate experience",
        ],
      },
      {
        company: "Staffing Agency",
        position: "Recruiting Coordinator",
        location: "Pittsburgh, PA",
        startDate: "2010",
        endDate: "2012",
        current: false,
        responsibilities: [
          "Scheduled interviews",
          "Maintained applicant tracking",
          "Assisted recruiters",
        ],
      },
    ],
    skills: ["HR Operations", "Talent Acquisition"],
    tools: ["15Five", "LinkedIn Recruiter"],
    jobDescription: [
      "Manage and maintain 15Five",
      "Manage and maintain LinkedIn Recruiter",
      "Apply expertise in Lever to support departmental OKRs",
      "Apply expertise in BambooHR to support departmental OKRs",
    ],
    redFlag: "No Recent Learning Activity",
  },
  {
    id: "9002",
    name: "Edward Simpson",
    position: "Sales Development Rep",
    department: "Sales",
    email: "edwardsimpson@gmail.com",
    payroll: {
      baseSalary: 75000,
      bonus: 25000,
      stockOptions: 1000,
      lastRaiseDate: "2023-02-20",
      raisePercentage: 5
    },
    performance: {
      goals: [
        {
          name: "Prospect new leads",
          targetDate: "2023-12-31",
          completion: 85,
          status: "on track"
        },
        {
          name: "Qualify opportunities",
          targetDate: "2023-09-30",
          completion: 90,
          status: "on track"
        },
        {
          name: "Schedule meetings",
          targetDate: "2023-11-30",
          completion: 75,
          status: "on track"
        }
      ],
      overallCompletion: 83
    },
    education: {
      degree: "BBA Marketing",
      institution: "Business College",
      location: "Atlanta, USA",
      startDate: "2015",
      endDate: "2019",
      gpa: "3.5",
    },
    experience: [
      {
        company: "Sales Pros",
        position: "Sales Development Rep",
        location: "Atlanta, GA",
        startDate: "2019",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Prospected new leads",
          "Qualified opportunities",
          "Scheduled meetings",
        ],
      },
      {
        company: "Inside Sales",
        position: "Sales Associate",
        location: "Charlotte, NC",
        startDate: "2017",
        endDate: "2019",
        current: false,
        responsibilities: [
          "Made outbound calls",
          "Managed CRM data",
          "Supported sales team",
        ],
      },
    ],
    skills: ["Sales Operations", "Slack", "Conversation Intelligence"],
    tools: ["ZoomInfo", "Outreach"],
    jobDescription: [
      "Apply expertise in Salesforce to support departmental OKRs",
      "Manage and maintain ZoomInfo",
      "Apply expertise in Slack to support departmental OKRs",
      "Apply expertise in Gong to support departmental OKRs",
      "Manage and maintain Outreach",
    ],
  },
  {
    id: "9003",
    name: "Jessica Peterson",
    position: "Account Executive",
    department: "Sales",
    email: "jessicapeterson@gmail.com",
    payroll: {
      baseSalary: 85000,
      bonus: 40000,
      stockOptions: 5000,
      lastRaiseDate: "2023-03-15",
      raisePercentage: 8
    },
    performance: {
      goals: [
        {
          name: "Close new business",
          targetDate: "2023-12-31",
          completion: 80,
          status: "on track"
        },
        {
          name: "Manage accounts",
          targetDate: "2023-09-30",
          completion: 90,
          status: "on track"
        },
        {
          name: "Achieve sales targets",
          targetDate: "2023-11-30",
          completion: 70,
          status: "on track"
        }
      ],
      overallCompletion: 80
    },
    education: {
      degree: "BBA Marketing",
      institution: "Business University",
      location: "Dallas, USA",
      startDate: "2013",
      endDate: "2017",
      gpa: "3.6",
    },
    experience: [
      {
        company: "Enterprise Sales",
        position: "Account Executive",
        location: "Dallas, TX",
        startDate: "2017",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Closed new business",
          "Managed accounts",
          "Achieved sales targets",
        ],
      },
      {
        company: "Sales Development",
        position: "Business Development Rep",
        location: "Houston, TX",
        startDate: "2015",
        endDate: "2017",
        current: false,
        responsibilities: [
          "Generated leads",
          "Qualified prospects",
          "Set appointments",
        ],
      },
    ],
    skills: ["Lead Generation", "Conversation Intelligence", "Sales Operations"],
    tools: ["Slack", "Outreach"],
    jobDescription: [
      "Apply expertise in ZoomInfo to support departmental OKRs",
      "Apply expertise in Salesforce to support departmental OKRs",
      "Manage and maintain Outreach",
      "Manage and maintain Slack",
      "Apply expertise in Gong to support departmental OKRs",
    ],
  },
  {
    id: "5001",
    name: "Diana Greer",
    position: "Revenue Operations Manager",
    department: "Finance & Ops",
    email: "dianagreer@gmail.com",
    payroll: {
      baseSalary: 120000,
      bonus: 15000,
      stockOptions: 7000,
      lastRaiseDate: "2023-04-01",
      raisePercentage: 9
    },
    performance: {
      goals: [
        {
          name: "Optimize sales processes",
          targetDate: "2023-12-31",
          completion: 85,
          status: "on track"
        },
        {
          name: "Manage sales tools",
          targetDate: "2023-09-30",
          completion: 90,
          status: "on track"
        },
        {
          name: "Analyze revenue data",
          targetDate: "2023-11-30",
          completion: 75,
          status: "on track"
        }
      ],
      overallCompletion: 83
    },
    education: {
      degree: "MBA",
      institution: "Business School",
      location: "New York, USA",
      startDate: "2010",
      endDate: "2012",
      gpa: "3.8",
    },
    experience: [
      {
        company: "Revenue Growth",
        position: "Revenue Operations Manager",
        location: "New York, NY",
        startDate: "2012",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Optimized sales processes",
          "Managed sales tools",
          "Analyzed revenue data",
        ],
      },
      {
        company: "Sales Operations",
        position: "Sales Operations Analyst",
        location: "Newark, NJ",
        startDate: "2010",
        endDate: "2012",
        current: false,
        responsibilities: [
          "Created sales reports",
          "Maintained CRM data",
          "Supported sales team",
        ],
      },
    ],
    skills: ["Data Analysis", "Sales Operations"],
    tools: ["Excel", "QuickBooks", "Tableau"],
    jobDescription: [
      "Apply expertise in SQL to support departmental OKRs",
      "Apply expertise in Salesforce to support departmental OKRs",
      "Manage and maintain QuickBooks",
      "Manage and maintain Excel",
      "Manage and maintain Tableau",
    ],
  },
  {
    id: "5002",
    name: "Nicole Baker",
    position: "FP&A Analyst",
    department: "Finance & Ops",
    email: "nicolebaker@gmail.com",
    payroll: {
      baseSalary: 105000,
      bonus: 10000,
      stockOptions: 3500,
      lastRaiseDate: "2023-03-25",
      raisePercentage: 7
    },
    performance: {
      goals: [
        {
          name: "Prepare financial models",
          targetDate: "2023-12-31",
          completion: 85,
          status: "on track"
        },
        {
          name: "Analyze business performance",
          targetDate: "2023-09-30",
          completion: 90,
          status: "on track"
        },
        {
          name: "Create budgets",
          targetDate: "2023-11-30",
          completion: 75,
          status: "on track"
        }
      ],
      overallCompletion: 83
    },
    education: {
      degree: "BSc Computer Science",
      institution: "Tech University",
      location: "San Jose, USA",
      startDate: "2016",
      endDate: "2020",
      gpa: "3.7",
    },
    experience: [
      {
        company: "Financial Planning",
        position: "FP&A Analyst",
        location: "San Jose, CA",
        startDate: "2020",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Prepared financial models",
          "Analyzed business performance",
          "Created budgets",
        ],
      },
      {
        company: "Finance Department",
        position: "Financial Analyst",
        location: "Oakland, CA",
        startDate: "2018",
        endDate: "2020",
        current: false,
        responsibilities: [
          "Assisted in financial planning",
          "Created reports",
          "Analyzed data",
        ],
      },
    ],
    skills: ["Data Visualization", "Financial Management", "Sales Operations"],
    tools: ["Excel", "SQL"],
    jobDescription: [
      "Apply expertise in Tableau to support departmental OKRs",
      "Manage and maintain SQL",
      "Manage and maintain Excel",
      "Apply expertise in QuickBooks to support departmental OKRs",
      "Apply expertise in Salesforce to support departmental OKRs",
    ],
  },
  // Bots and AI tools
  {
    id: "2001",
    name: "Codex Engineer Bot",
    department: "Engineering",
    email: "codexengineerbot@gmail.com",
    payroll: {
      baseSalary: 0,
      bonus: 0,
      stockOptions: 0,
      lastRaiseDate: "N/A",
      raisePercentage: 0
    },
    performance: {
      goals: [
        {
          name: "Code Generation",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        },
        {
          name: "Unit Testing",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        },
        {
          name: "Refactoring",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        }
      ],
      overallCompletion: 100
    },
    skills: ["GitHub Copilot", "ESLint", "Prettier", "VSCode", "Git"],
    jobDescription: [
      "Code Generation",
      "Unit Testing",
      "Refactoring",
      "Version Control",
      "Linting",
    ],
  },
  {
    id: "101",
    name: "AutoInfra Manager",
    department: "Engineering",
    email: "autoinframanager@gmail.com",
    payroll: {
      baseSalary: 0,
      bonus: 0,
      stockOptions: 0,
      lastRaiseDate: "N/A",
      raisePercentage: 0
    },
    performance: {
      goals: [
        {
          name: "Infrastructure as Code",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        },
        {
          name: "Cloud Provisioning",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        },
        {
          name: "Resource Optimization",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        }
      ],
      overallCompletion: 100
    },
    skills: ["Terraform", "AWS CloudFormation", "Datadog", "AWS CLI", "Prometheus"],
    jobDescription: [
      "Infrastructure as Code",
      "Cloud Provisioning",
      "Resource Optimization",
      "Monitoring",
    ],
  },
  {
    id: "2003",
    name: "Debug AI Assistant",
    department: "Engineering",
    email: "debugaiassistant@gmail.com",
    payroll: {
      baseSalary: 0,
      bonus: 0,
      stockOptions: 0,
      lastRaiseDate: "N/A",
      raisePercentage: 0
    },
    performance: {
      goals: [
        {
          name: "Error Detection",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        },
        {
          name: "Log Analysis",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        },
        {
          name: "Performance Debugging",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        }
      ],
      overallCompletion: 100
    },
    skills: ["Sentry", "ELK Stack", "Datadog", "StackDriver"],
    jobDescription: [
      "Error Detection",
      "Log Analysis",
      "Performance Debugging",
      "Pattern Recognition",
    ],
  },
  {
    id: "4001",
    name: "ContentGPT",
    department: "Marketing",
    email: "contentgpt@gmail.com",
    payroll: {
      baseSalary: 0,
      bonus: 0,
      stockOptions: 0,
      lastRaiseDate: "N/A",
      raisePercentage: 0
    },
    performance: {
      goals: [
        {
          name: "Content Ideation",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        },
        {
          name: "SEO Optimization",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        },
        {
          name: "Copywriting",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        }
      ],
      overallCompletion: 100
    },
    skills: ["ChatGPT", "Jasper", "SurferSEO", "Grammarly"],
    jobDescription: [
      "Content Ideation",
      "SEO Optimization",
      "Copywriting",
      "Tone Matching",
      "Repurposing Content",
    ],
  },
  {
    id: "4002",
    name: "AdOptimizer AI",
    department: "Marketing",
    email: "adoptimizerai@gmail.com",
    payroll: {
      baseSalary: 0,
      bonus: 0,
      stockOptions: 0,
      lastRaiseDate: "N/A",
      raisePercentage: 0
    },
    performance: {
      goals: [
        {
          name: "Audience Segmentation",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        },
        {
          name: "Budget Allocation",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        },
        {
          name: "A/B Testing",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        }
      ],
      overallCompletion: 100
    },
    skills: ["Meta Ads", "Google Ads", "AdEspresso", "HubSpot"],
    jobDescription: [
      "Audience Segmentation",
      "Budget Allocation",
      "A/B Testing",
      "Performance Monitoring",
    ],
  },
  {
    id: "4003",
    name: "Social Pulse Bot",
    department: "Marketing",
    email: "socialpulsebot@gmail.com",
    payroll: {
      baseSalary: 0,
      bonus: 0,
      stockOptions: 0,
      lastRaiseDate: "N/A",
      raisePercentage: 0
    },
    performance: {
      goals: [
        {
          name: "Sentiment Analysis",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        },
        {
          name: "Trend Detection",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        },
        {
          name: "Engagement Timing",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        }
      ],
      overallCompletion: 100
    },
    skills: ["Brandwatch", "Hootsuite", "Buffer", "Sprout Social"],
    jobDescription: [
      "Sentiment Analysis",
      "Trend Detection",
      "Engagement Timing",
      "Hashtag Optimization",
    ],
  },
  {
    id: "6002",
    name: "Voice of Customer AI",
    department: "Product",
    email: "voiceofcustomerai@gmail.com",
    payroll: {
      baseSalary: 0,
      bonus: 0,
      stockOptions: 0,
      lastRaiseDate: "N/A",
      raisePercentage: 0
    },
    performance: {
      goals: [
        {
          name: "Feedback Aggregation",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        },
        {
          name: "Sentiment Analysis",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        },
        {
          name: "Feature Request Clustering",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        }
      ],
      overallCompletion: 100
    },
    skills: ["Dovetail", "Productboard", "Nolt", "Typeform"],
    jobDescription: [
      "Feedback Aggregation",
      "Sentiment Analysis",
      "Feature Request Clustering",
    ],
  },
  {
    id: "6003",
    name: "Roadmap Companion",
    department: "Product",
    email: "roadmapcompanion@gmail.com",
    payroll: {
      baseSalary: 0,
      bonus: 0,
      stockOptions: 0,
      lastRaiseDate: "N/A",
      raisePercentage: 0
    },
    performance: {
      goals: [
        {
          name: "Prioritization Frameworks",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        },
        {
          name: "Value-Risk Scoring",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        },
        {
          name: "Timeline Estimation",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        }
      ],
      overallCompletion: 100
    },
    skills: ["Jira", "Aha!", "ProductPlan", "Notion"],
    jobDescription: [
      "Prioritization Frameworks",
      "Value-Risk Scoring",
      "Timeline Estimation",
    ],
  },
  {
    id: "6004",
    name: "Usage Analytics Bot",
    department: "Product",
    email: "usageanalyticsbot@gmail.com",
    payroll: {
      baseSalary: 0,
      bonus: 0,
      stockOptions: 0,
      lastRaiseDate: "N/A",
      raisePercentage: 0
    },
    performance: {
      goals: [
        {
          name: "User Behavior Analysis",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        },
        {
          name: "Funnel Analysis",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        },
        {
          name: "Feature Adoption Tracking",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed"
        }
      ],
      overallCompletion: 100
    },
    skills: ["Amplitude", "Mixpanel", "Heap"],
    jobDescription: [
      "User Behavior Analysis",
      "Funnel Analysis",
      "Feature Adoption Tracking",
    ],
  }
];

export const botsAndAITools = [
  {
    id: "bots",
    name: "Bots & AI Tools",
    description:
      "AI-powered bots and tools that augment engineering, marketing, product, and support workflows.",
    head: "Codex Engineer Bot",
    members: 9,
    topSkills: [
      "GitHub Copilot",
      "Sentry",
      "ChatGPT",
      "Jasper",
      "Productboard",
      "Brandwatch",
    ],
    goals: [
      "Automate repetitive workflows across departments",
      "Enhance productivity through AI-driven solutions",
      "Monitor and report on system health and performance",
      "Continuously expand AI tool capabilities",
    ],
  },

  {
    id: "30",
    name: "Codex Engineer Bot",
    department: "Bots & AI Tools",
    email: "codexengineerbot@gmail.com",
    payroll: {
      baseSalary: 0,
      bonus: 0,
      stockOptions: 0,
      lastRaiseDate: "N/A",
      raisePercentage: 0,
    },
    performance: {
      goals: [
        {
          name: "Code Generation",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
        {
          name: "Unit Testing",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
        {
          name: "Refactoring",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
      ],
      overallCompletion: 100,
    },
    skills: ["GitHub Copilot", "ESLint", "Prettier", "VSCode", "Git"],
    jobDescription: [
      "Code Generation",
      "Unit Testing",
      "Refactoring",
      "Version Control",
      "Linting",
    ],
  },
  {
    id: "31",
    name: "AutoInfra Manager",
    department: "Bots & AI Tools",
    email: "autoinframanager@gmail.com",
    payroll: {
      baseSalary: 0,
      bonus: 0,
      stockOptions: 0,
      lastRaiseDate: "N/A",
      raisePercentage: 0,
    },
    performance: {
      goals: [
        {
          name: "Infrastructure as Code",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
        {
          name: "Cloud Provisioning",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
        {
          name: "Resource Optimization",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
      ],
      overallCompletion: 100,
    },
    skills: [
      "Terraform",
      "AWS CloudFormation",
      "Datadog",
      "AWS CLI",
      "Prometheus",
    ],
    jobDescription: [
      "Infrastructure as Code",
      "Cloud Provisioning",
      "Resource Optimization",
      "Monitoring",
    ],
  },
  {
    id: "32",
    name: "Debug AI Assistant",
    department: "Bots & AI Tools",
    email: "debugaiassistant@gmail.com",
    payroll: {
      baseSalary: 0,
      bonus: 0,
      stockOptions: 0,
      lastRaiseDate: "N/A",
      raisePercentage: 0,
    },
    performance: {
      goals: [
        {
          name: "Error Detection",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
        {
          name: "Log Analysis",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
        {
          name: "Performance Debugging",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
      ],
      overallCompletion: 100,
    },
    skills: ["Sentry", "ELK Stack", "Datadog", "StackDriver"],
    jobDescription: [
      "Error Detection",
      "Log Analysis",
      "Performance Debugging",
      "Pattern Recognition",
    ],
  },
  {
    id: "33",
    name: "ContentGPT",
    department: "Bots & AI Tools",
    email: "contentgpt@gmail.com",
    payroll: {
      baseSalary: 0,
      bonus: 0,
      stockOptions: 0,
      lastRaiseDate: "N/A",
      raisePercentage: 0,
    },
    performance: {
      goals: [
        {
          name: "Content Ideation",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
        {
          name: "SEO Optimization",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
        {
          name: "Copywriting",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
      ],
      overallCompletion: 100,
    },
    skills: ["ChatGPT", "Jasper", "SurferSEO", "Grammarly"],
    jobDescription: [
      "Content Ideation",
      "SEO Optimization",
      "Copywriting",
      "Tone Matching",
      "Repurposing Content",
    ],
  },
  {
    id: "34",
    name: "AdOptimizer AI",
    department: "Bots & AI Tools",
    email: "adoptimizerai@gmail.com",
    payroll: {
      baseSalary: 0,
      bonus: 0,
      stockOptions: 0,
      lastRaiseDate: "N/A",
      raisePercentage: 0,
    },
    performance: {
      goals: [
        {
          name: "Audience Segmentation",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
        {
          name: "Budget Allocation",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
        {
          name: "A/B Testing",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
      ],
      overallCompletion: 100,
    },
    skills: ["Meta Ads", "Google Ads", "AdEspresso", "HubSpot"],
    jobDescription: [
      "Audience Segmentation",
      "Budget Allocation",
      "A/B Testing",
      "Performance Monitoring",
    ],
  },
  {
    id: "35",
    name: "Social Pulse Bot",
    department: "Bots & AI Tools",
    email: "socialpulsebot@gmail.com",
    payroll: {
      baseSalary: 0,
      bonus: 0,
      stockOptions: 0,
      lastRaiseDate: "N/A",
      raisePercentage: 0,
    },
    performance: {
      goals: [
        {
          name: "Sentiment Analysis",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
        {
          name: "Trend Detection",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
        {
          name: "Engagement Timing",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
      ],
      overallCompletion: 100,
    },
    skills: ["Brandwatch", "Hootsuite", "Buffer", "Sprout Social"],
    jobDescription: [
      "Sentiment Analysis",
      "Trend Detection",
      "Engagement Timing",
      "Hashtag Optimization",
    ],
  },
  {
    id: "36",
    name: "Voice of Customer AI",
    department: "Bots & AI Tools",
    email: "voiceofcustomerai@gmail.com",
    payroll: {
      baseSalary: 0,
      bonus: 0,
      stockOptions: 0,
      lastRaiseDate: "N/A",
      raisePercentage: 0,
    },
    performance: {
      goals: [
        {
          name: "Feedback Aggregation",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
        {
          name: "Sentiment Analysis",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
        {
          name: "Feature Request Clustering",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
      ],
      overallCompletion: 100,
    },
    skills: ["Dovetail", "Productboard", "Nolt", "Typeform"],
    jobDescription: [
      "Feedback Aggregation",
      "Sentiment Analysis",
      "Feature Request Clustering",
    ],
  },
  {
    id: "37",
    name: "Roadmap Companion",
    department: "Bots & AI Tools",
    email: "roadmapcompanion@gmail.com",
    payroll: {
      baseSalary: 0,
      bonus: 0,
      stockOptions: 0,
      lastRaiseDate: "N/A",
      raisePercentage: 0,
    },
    performance: {
      goals: [
        {
          name: "Prioritization Frameworks",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
        {
          name: "Value-Risk Scoring",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
        {
          name: "Timeline Estimation",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
      ],
      overallCompletion: 100,
    },
    skills: ["Jira", "Aha!", "ProductPlan", "Notion"],
    jobDescription: [
      "Prioritization Frameworks",
      "Value-Risk Scoring",
      "Timeline Estimation",
    ],
  },
  {
    id: "38",
    name: "Usage Analytics Bot",
    department: "Bots & AI Tools",
    email: "usageanalyticsbot@gmail.com",
    payroll: {
      baseSalary: 0,
      bonus: 0,
      stockOptions: 0,
      lastRaiseDate: "N/A",
      raisePercentage: 0,
    },
    performance: {
      goals: [
        {
          name: "User Behavior Analysis",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
        {
          name: "Funnel Analysis",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
        {
          name: "Feature Adoption Tracking",
          targetDate: "Ongoing",
          completion: 100,
          status: "completed",
        },
      ],
      overallCompletion: 100,
    },
    skills: ["Amplitude", "Mixpanel", "Heap"],
    jobDescription: [
      "User Behavior Analysis",
      "Funnel Analysis",
      "Feature Adoption Tracking",
    ],
  },
];
