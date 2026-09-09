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
};

export const jobs: Job[] = [
  {
    id: "product-designer-nairobi",
    title: "Product Designer",
    company: "Savanna Digital",
    location: "Nairobi",
    category: "Technology",
    type: "Full time",
    salary: "KSh 140K–180K",
    posted: "Today",
    deadline: "18 Sep 2026",
    featured: true,
    initials: "SD",
    summary: "Shape simple, useful digital products for growing businesses across East Africa.",
    responsibilities: ["Turn customer research into clear product flows", "Create and test prototypes with product teams", "Maintain a consistent, accessible design system"],
    requirements: ["3+ years of product design experience", "A portfolio showing end-to-end product thinking", "Strong communication and collaboration skills"],
  },
  {
    id: "finance-officer-kisumu",
    title: "Finance Officer",
    company: "Lakeview Health Network",
    location: "Kisumu",
    category: "Finance",
    type: "Full time",
    salary: "KSh 85K–110K",
    posted: "1 day ago",
    deadline: "20 Sep 2026",
    featured: true,
    initials: "LH",
    summary: "Support accurate reporting and responsible financial operations across a growing health network.",
    responsibilities: ["Prepare monthly management accounts", "Coordinate budgeting and expense controls", "Support audit preparation and compliance"],
    requirements: ["Bachelor’s degree in finance or accounting", "CPA II or equivalent progress", "At least 2 years of relevant experience"],
  },
  {
    id: "graduate-trainee-mombasa",
    title: "Graduate Trainee — Operations",
    company: "Coastline Logistics",
    location: "Mombasa",
    category: "Graduate roles",
    type: "Graduate programme",
    salary: "KSh 55K–70K",
    posted: "2 days ago",
    deadline: "15 Sep 2026",
    featured: true,
    initials: "CL",
    summary: "Build hands-on experience across port, warehouse and customer operations.",
    responsibilities: ["Rotate through core operations teams", "Track service performance and prepare reports", "Support process improvement projects"],
    requirements: ["Recent graduate in business, logistics or engineering", "Strong analytical and teamwork skills", "Available for a 12-month programme"],
  },
  {
    id: "communications-intern-nairobi",
    title: "Communications Intern",
    company: "Green Kenya Initiative",
    location: "Nairobi / Hybrid",
    category: "Internships",
    type: "Internship",
    salary: "KSh 30K stipend",
    posted: "Today",
    deadline: "22 Sep 2026",
    featured: false,
    initials: "GK",
    summary: "Help tell practical stories about community-led climate action in Kenya.",
    responsibilities: ["Draft social and newsletter content", "Support field storytelling and interviews", "Organise the digital media library"],
    requirements: ["Student or recent graduate in communications", "Clear writing and editing skills", "Interest in climate and community stories"],
  },
  {
    id: "registered-nurse-nakuru",
    title: "Registered Nurse",
    company: "Rift Valley Medical Centre",
    location: "Nakuru",
    category: "Healthcare",
    type: "Full time",
    salary: "KSh 72K–96K",
    posted: "3 days ago",
    deadline: "25 Sep 2026",
    featured: false,
    initials: "RV",
    summary: "Provide compassionate, evidence-based care within a multidisciplinary clinical team.",
    responsibilities: ["Deliver and document patient care", "Coordinate with clinicians and families", "Support patient education and safety"],
    requirements: ["Diploma or degree in nursing", "Valid Nursing Council of Kenya licence", "At least 2 years of clinical experience"],
  },
  {
    id: "sales-representative-eldoret",
    title: "Sales Representative",
    company: "Jenga Supply Co.",
    location: "Eldoret",
    category: "Sales & Marketing",
    type: "Full time",
    salary: "KSh 60K + commission",
    posted: "4 days ago",
    deadline: "27 Sep 2026",
    featured: false,
    initials: "JS",
    summary: "Grow lasting customer relationships for a trusted building supplies business.",
    responsibilities: ["Develop and manage a regional sales pipeline", "Visit customers and prepare quotations", "Share market feedback with the commercial team"],
    requirements: ["2+ years of field sales experience", "Confident negotiation and presentation skills", "Valid driving licence preferred"],
  },
];

export const categories = [
  { name: "Technology", icon: "code", count: 42 },
  { name: "Finance", icon: "wallet", count: 28 },
  { name: "Healthcare", icon: "heart", count: 34 },
  { name: "Sales & Marketing", icon: "megaphone", count: 51 },
  { name: "Internships", icon: "graduation", count: 23 },
  { name: "Graduate roles", icon: "briefcase", count: 18 },
] as const;

export const WHATSAPP_URL = "https://www.whatsapp.com/channel/0029VbCy7ofFHWq30zTpFH2s";