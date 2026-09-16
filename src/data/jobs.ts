export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  type: string;
  salary: string;
  posted: string;
  deadline: string;
  featured: boolean;
  initials: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  /** Opportunity type slug, e.g. "government" — see opportunityTypes below. */
  sector: string;
  /** Employment type filter value. */
  employment: string;
  /** Location filter bucket. */
  region: string;
  /** Career field filter value. */
  field: string;
  /** Experience level filter value. */
  experience: string;
  /** ISO date used for deadline filtering and sorting. */
  deadlineISO: string;
  /** ISO date used for "newest" sorting. */
  postedISO: string;
  source: string;
  sourceUrl: string;
  applicationUrl: string;
  verifiedAt: string;
  applicationInstructions: string;
};

export const opportunityTypes = [
  { slug: "all", label: "All Opportunities", heading: "Latest Opportunities" },
  { slug: "government", label: "Government Jobs", heading: "Government Jobs in Kenya" },
  { slug: "ngo", label: "NGO & Development", heading: "NGO & Development Jobs in Kenya" },
  { slug: "county", label: "County Government", heading: "County Government Jobs in Kenya" },
  { slug: "private-sector", label: "Private Sector", heading: "Private Sector Jobs in Kenya" },
  { slug: "internships", label: "Internships", heading: "Internships & Attachments in Kenya" },
  {
    slug: "graduate",
    label: "Graduate Jobs",
    heading: "Graduate Jobs & Trainee Programmes in Kenya",
  },
  { slug: "remote", label: "Remote Jobs", heading: "Remote Jobs" },
  {
    slug: "scholarships",
    label: "Scholarships & Fellowships",
    heading: "Scholarships & Fellowships in Kenya",
  },
] as const;

export const employmentTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Graduate Programme",
  "Remote",
] as const;
export const locationOptions = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Other Counties",
  "Remote",
  "All Kenya",
] as const;
export const careerFields = [
  "Technology",
  "Finance & Accounting",
  "Healthcare",
  "Engineering",
  "Education",
  "Sales & Marketing",
  "Human Resources",
  "Administration",
  "Other",
] as const;
export const experienceLevels = [
  "No experience",
  "Entry level",
  "1–2 years",
  "3–5 years",
  "5+ years",
] as const;
export const deadlineOptions = ["Closing soon", "This week", "This month"] as const;

export const jobs: Job[] = [
  {
    id: "psck-digital-literacy-internship-2026",
    title: "Public Service Internship - Digital Literacy Programme",
    company: "Public Service Commission Kenya",
    location: "Kenya",
    category: "Internships",
    type: "Internship",
    salary: "Stipend provided",
    posted: "15 Sep 2026",
    deadline: "5 Oct 2026",
    featured: true,
    initials: "PS",
    summary:
      "A national internship supporting the Digital Literacy Programme through e-learning, ICT support and teacher support in sub-county education offices.",
    responsibilities: [
      "Support e-learning content and classroom technology use",
      "Help teachers use digital literacy devices",
      "Provide first-line ICT support for school-based services",
    ],
    requirements: [
      "Diploma or degree in ICT, ICT integration or education with ICT",
      "Graduated not earlier than 2022",
      "Ready for full-time deployment to any sub-county education office",
    ],
    sector: "internships",
    employment: "Internship",
    region: "All Kenya",
    field: "Technology",
    experience: "No experience",
    deadlineISO: "2026-10-05",
    postedISO: "2026-09-15",
    source: "Public Service Commission / Job in Kenya",
    sourceUrl: "https://www.jobinkenya.com/employer/public-service-commission-kenya-psck",
    applicationUrl: "https://www.psckjobs.go.ke/",
    verifiedAt: "16 Sep 2026",
    applicationInstructions:
      "Apply through the Public Service Commission jobs portal and confirm the advert details before submitting.",
  },
  {
    id: "wiocc-frontend-developer-2026",
    title: "IT & Systems Engineer (Frontend Developer)",
    company: "West Indian Ocean Cable Company (WIOCC)",
    location: "Nairobi",
    category: "Technology",
    type: "Full time",
    salary: "Not disclosed",
    posted: "15 Sep 2026",
    deadline: "30 Sep 2026",
    featured: true,
    initials: "WI",
    summary:
      "Frontend engineering role focused on scalable React applications and intuitive user interfaces for WIOCC systems.",
    responsibilities: [
      "Build and maintain React-based web applications",
      "Work with design and backend teams on usable interfaces",
      "Improve front-end quality, performance and maintainability",
    ],
    requirements: [
      "Mid-career frontend engineering experience",
      "Strong React and web application development skills",
      "Able to collaborate across product and technical teams",
    ],
    sector: "private-sector",
    employment: "Full-time",
    region: "Nairobi",
    field: "Technology",
    experience: "3–5 years",
    deadlineISO: "2026-09-30",
    postedISO: "2026-09-15",
    source: "Job in Kenya",
    sourceUrl: "https://www.jobinkenya.com/",
    applicationUrl: "https://www.jobinkenya.com/",
    verifiedAt: "16 Sep 2026",
    applicationInstructions:
      "Open the source listing and follow WIOCC's application instructions for this role.",
  },
  {
    id: "path-cloud-solutions-developer-2026",
    title: "Cloud Solutions Developer - Integrations & Platforms",
    company: "PATH",
    location: "Nairobi / multi-country",
    category: "Technology",
    type: "Full time",
    salary: "Not disclosed",
    posted: "14 Sep 2026",
    deadline: "Not specified",
    featured: true,
    initials: "PA",
    summary:
      "PATH is hiring a developer to strengthen enterprise integrations, cloud-hosted services, deployment automation and shared technical platforms.",
    responsibilities: [
      "Develop and support cloud-based enterprise integrations",
      "Modernise legacy solutions toward secure cloud-first patterns",
      "Work with technical teams and business system owners",
    ],
    requirements: [
      "3-5 years of cloud solutions development experience",
      "Experience with enterprise integrations or application interoperability",
      "Comfortable supporting production platforms",
    ],
    sector: "ngo",
    employment: "Full-time",
    region: "Nairobi",
    field: "Technology",
    experience: "3–5 years",
    deadlineISO: "2026-10-16",
    postedISO: "2026-09-14",
    source: "PATH careers",
    sourceUrl:
      "https://path.wd1.myworkdayjobs.com/en-US/External/job/Cloud-Solutions-Developer---Integrations---Platforms_JR2706",
    applicationUrl:
      "https://path.wd1.myworkdayjobs.com/en-US/External/job/Cloud-Solutions-Developer---Integrations---Platforms_JR2706",
    verifiedAt: "16 Sep 2026",
    applicationInstructions:
      "Apply through the official PATH Workday listing. Deadline was not published, so confirm availability on the application page.",
  },
  {
    id: "ncba-credit-origination-manager-2026",
    title: "Manager - Credit Origination",
    company: "NCBA Group",
    location: "Nairobi",
    category: "Finance",
    type: "Full time",
    salary: "Not disclosed",
    posted: "15 Sep 2026",
    deadline: "20 Sep 2026",
    featured: true,
    initials: "NC",
    summary: "Mid-career banking role in credit origination with NCBA Group in Nairobi.",
    responsibilities: [
      "Support credit origination workflows",
      "Review and coordinate lending documentation",
      "Work with business teams on timely credit decisions",
    ],
    requirements: [
      "3-5 years of relevant finance or banking experience",
      "Strong credit analysis and documentation skills",
      "Able to work within bank policy and risk controls",
    ],
    sector: "private-sector",
    employment: "Full-time",
    region: "Nairobi",
    field: "Finance & Accounting",
    experience: "3–5 years",
    deadlineISO: "2026-09-20",
    postedISO: "2026-09-15",
    source: "Job in Kenya",
    sourceUrl: "https://www.jobinkenya.com/",
    applicationUrl: "https://www.jobinkenya.com/",
    verifiedAt: "16 Sep 2026",
    applicationInstructions:
      "Open the source listing and follow NCBA Group's application instructions before the deadline.",
  },
  {
    id: "old-mutual-customer-service-officer-kisii-2026",
    title: "Customer Service Officer - Life Business",
    company: "Old Mutual Kenya",
    location: "Kisii",
    category: "Sales & Marketing",
    type: "Full time",
    salary: "Not disclosed",
    posted: "15 Sep 2026",
    deadline: "22 Sep 2026",
    featured: false,
    initials: "OM",
    summary:
      "Entry-level customer service role supporting Old Mutual's life business in the Kisii branch.",
    responsibilities: [
      "Serve customers and policyholders at branch level",
      "Support life business service requests and follow-ups",
      "Escalate customer issues through the right channels",
    ],
    requirements: [
      "1-3 years of customer service or financial services experience",
      "Strong communication and relationship management skills",
      "Comfortable handling customer records and service processes",
    ],
    sector: "private-sector",
    employment: "Full-time",
    region: "Other Counties",
    field: "Sales & Marketing",
    experience: "1–2 years",
    deadlineISO: "2026-09-22",
    postedISO: "2026-09-15",
    source: "Job in Kenya",
    sourceUrl: "https://www.jobinkenya.com/",
    applicationUrl: "https://www.jobinkenya.com/",
    verifiedAt: "16 Sep 2026",
    applicationInstructions:
      "Open the source listing and follow Old Mutual Kenya's application instructions.",
  },
  {
    id: "equity-afia-optometrist-nakuru-2026",
    title: "Optometrist",
    company: "Equity Afia",
    location: "Nakuru",
    category: "Healthcare",
    type: "Full time",
    salary: "Not disclosed",
    posted: "15 Sep 2026",
    deadline: "30 Sep 2026",
    featured: false,
    initials: "EA",
    summary: "Entry-level optometrist opportunity with Equity Afia in Nakuru.",
    responsibilities: [
      "Provide eye-care assessments and patient support",
      "Maintain accurate clinical records",
      "Coordinate care with the wider clinic team",
    ],
    requirements: [
      "Relevant optometry qualification and professional registration",
      "1-3 years of clinical experience preferred",
      "Strong patient communication and attention to detail",
    ],
    sector: "private-sector",
    employment: "Full-time",
    region: "Nakuru",
    field: "Healthcare",
    experience: "Entry level",
    deadlineISO: "2026-09-30",
    postedISO: "2026-09-15",
    source: "Job in Kenya",
    sourceUrl: "https://www.jobinkenya.com/",
    applicationUrl: "https://www.jobinkenya.com/",
    verifiedAt: "16 Sep 2026",
    applicationInstructions:
      "Open the source listing and follow Equity Afia's application instructions.",
  },
  {
    id: "aga-khan-pharmaceutical-technologist-2026",
    title: "Fixed Term Pharmaceutical Technologist",
    company: "Aga Khan University Hospital",
    location: "Nairobi",
    category: "Healthcare",
    type: "Contract",
    salary: "Not disclosed",
    posted: "15 Sep 2026",
    deadline: "29 Sep 2026",
    featured: false,
    initials: "AK",
    summary:
      "Fixed-term pharmaceutical technologist role with Aga Khan University Hospital in Nairobi.",
    responsibilities: [
      "Dispense medicines and support pharmacy operations",
      "Maintain safe handling and documentation standards",
      "Work with clinical teams to support patient care",
    ],
    requirements: [
      "Pharmaceutical technologist qualification",
      "Relevant professional registration",
      "1-3 years of pharmacy or hospital experience preferred",
    ],
    sector: "private-sector",
    employment: "Contract",
    region: "Nairobi",
    field: "Healthcare",
    experience: "Entry level",
    deadlineISO: "2026-09-29",
    postedISO: "2026-09-15",
    source: "Job in Kenya",
    sourceUrl: "https://www.jobinkenya.com/",
    applicationUrl: "https://www.jobinkenya.com/",
    verifiedAt: "16 Sep 2026",
    applicationInstructions:
      "Open the source listing and follow Aga Khan University Hospital's application instructions.",
  },
  {
    id: "seku-senior-lecturer-sociology-2026",
    title: "Senior Lecturer Grade 5A - Criminology and Social Justice",
    company: "South Eastern Kenya University",
    location: "Kitui",
    category: "Education",
    type: "Full time",
    salary: "Not disclosed",
    posted: "15 Sep 2026",
    deadline: "29 Sep 2026",
    featured: false,
    initials: "SE",
    summary:
      "Senior lecturer opening in the Department of Sociology, Anthropology and Community Development at South Eastern Kenya University.",
    responsibilities: [
      "Teach and supervise students in criminology and social justice",
      "Contribute to research and academic programmes",
      "Support departmental service and curriculum development",
    ],
    requirements: [
      "Relevant postgraduate qualifications for senior lecturer appointment",
      "Academic teaching and research experience",
      "Evidence of scholarship in the discipline",
    ],
    sector: "government",
    employment: "Full-time",
    region: "Other Counties",
    field: "Education",
    experience: "5+ years",
    deadlineISO: "2026-09-29",
    postedISO: "2026-09-15",
    source: "work.ke / official source",
    sourceUrl: "https://work.ke/jobs",
    applicationUrl: "https://work.ke/jobs",
    verifiedAt: "16 Sep 2026",
    applicationInstructions:
      "Open the verified work.ke role and continue to the official source for SEKU application details.",
  },
  {
    id: "labour-migration-officer-2026",
    title: "Principal Labour Migration Officer",
    company: "State Department for Labour and Skills Development",
    location: "Kenya",
    category: "Education",
    type: "Full time",
    salary: "Not disclosed",
    posted: "15 Sep 2026",
    deadline: "5 Oct 2026",
    featured: false,
    initials: "SD",
    summary:
      "Government role advertised under the State Department for Labour and Skills Development, advert reference D111/2026.",
    responsibilities: [
      "Support labour migration policy and programme delivery",
      "Coordinate reporting and stakeholder follow-up",
      "Contribute to public service delivery in the labour sector",
    ],
    requirements: [
      "Relevant public policy, labour or administration experience",
      "Strong documentation and coordination skills",
      "Meet the official advert requirements before applying",
    ],
    sector: "government",
    employment: "Full-time",
    region: "All Kenya",
    field: "Administration",
    experience: "5+ years",
    deadlineISO: "2026-10-05",
    postedISO: "2026-09-15",
    source: "work.ke / official source",
    sourceUrl: "https://work.ke/jobs",
    applicationUrl: "https://work.ke/jobs",
    verifiedAt: "16 Sep 2026",
    applicationInstructions:
      "Open the verified work.ke role and continue to the official source for the full government advert.",
  },
  {
    id: "m-kopa-senior-product-manager-mobility-2026",
    title: "Senior Product Manager - Mobility",
    company: "M-KOPA",
    location: "Nairobi / Mombasa",
    category: "Technology",
    type: "Hybrid",
    salary: "Not disclosed",
    posted: "15 Sep 2026",
    deadline: "Not specified",
    featured: false,
    initials: "MK",
    summary:
      "Hybrid product management role for M-KOPA's mobility work, based around Nairobi and Mombasa.",
    responsibilities: [
      "Own mobility product discovery and delivery",
      "Coordinate product priorities with business and engineering teams",
      "Use customer and operational insight to improve product outcomes",
    ],
    requirements: [
      "Senior product management experience",
      "Strong stakeholder and delivery skills",
      "Comfortable working with hybrid teams and operational products",
    ],
    sector: "private-sector",
    employment: "Full-time",
    region: "Mombasa",
    field: "Technology",
    experience: "5+ years",
    deadlineISO: "2026-10-16",
    postedISO: "2026-09-15",
    source: "work.ke / official source",
    sourceUrl: "https://work.ke/jobs",
    applicationUrl: "https://work.ke/jobs",
    verifiedAt: "16 Sep 2026",
    applicationInstructions:
      "Open the verified work.ke role and continue to M-KOPA's official application page.",
  },
  {
    id: "one-acre-fund-procurement-senior-coordinator-2026",
    title: "Procurement Senior Coordinator",
    company: "One Acre Fund Kenya",
    location: "Nairobi",
    category: "Finance",
    type: "Full time",
    salary: "Not disclosed",
    posted: "15 Sep 2026",
    deadline: "Not specified",
    featured: false,
    initials: "OA",
    summary:
      "Procurement coordination role with One Acre Fund Kenya, listed under verified official-source openings.",
    responsibilities: [
      "Coordinate procurement processes and supplier follow-up",
      "Track purchasing documentation and timelines",
      "Support value, compliance and operational delivery",
    ],
    requirements: [
      "Procurement, supply chain or operations experience",
      "Strong coordination and documentation skills",
      "Comfortable working with internal teams and suppliers",
    ],
    sector: "ngo",
    employment: "Full-time",
    region: "Nairobi",
    field: "Finance & Accounting",
    experience: "3–5 years",
    deadlineISO: "2026-10-16",
    postedISO: "2026-09-15",
    source: "work.ke / official source",
    sourceUrl: "https://work.ke/jobs",
    applicationUrl: "https://work.ke/jobs",
    verifiedAt: "16 Sep 2026",
    applicationInstructions:
      "Open the verified work.ke role and continue to One Acre Fund's official application page.",
  },
  {
    id: "jumia-key-account-manager-phone-2026",
    title: "Key Account Manager - Phone",
    company: "Jumia",
    location: "Kenya",
    category: "Sales & Marketing",
    type: "Full time",
    salary: "Not disclosed",
    posted: "15 Sep 2026",
    deadline: "Not specified",
    featured: false,
    initials: "JU",
    summary: "Full-time key account management role for Jumia's phone category in Kenya.",
    responsibilities: [
      "Manage key phone-category seller accounts",
      "Grow commercial performance through account planning",
      "Coordinate with internal teams on availability, campaigns and performance",
    ],
    requirements: [
      "Sales, account management or ecommerce experience",
      "Strong commercial analysis and partner management skills",
      "Comfortable owning targets and follow-up",
    ],
    sector: "private-sector",
    employment: "Full-time",
    region: "All Kenya",
    field: "Sales & Marketing",
    experience: "3–5 years",
    deadlineISO: "2026-10-16",
    postedISO: "2026-09-15",
    source: "work.ke / official source",
    sourceUrl: "https://work.ke/jobs",
    applicationUrl: "https://work.ke/jobs",
    verifiedAt: "16 Sep 2026",
    applicationInstructions:
      "Open the verified work.ke role and continue to Jumia's official application page.",
  },
];

export const categories = [
  { name: "Technology", icon: "code", count: 4 },
  { name: "Finance", icon: "wallet", count: 2 },
  { name: "Healthcare", icon: "heart", count: 2 },
  { name: "Sales & Marketing", icon: "megaphone", count: 2 },
  { name: "Internships", icon: "graduation", count: 1 },
  { name: "Education", icon: "briefcase", count: 2 },
] as const;

export const WHATSAPP_URL = "https://www.whatsapp.com/channel/0029VbCy7ofFHWq30zTpFH2s";
