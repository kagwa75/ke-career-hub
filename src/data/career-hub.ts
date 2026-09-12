import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  ClipboardCheck,
  FileCheck2,
  FileText,
  GraduationCap,
  Mail,
  Mic2,
  Scale,
  ShieldCheck,
  TrendingUp,
  WalletCards,
} from "lucide-react";

export type CareerCategory = {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: LucideIcon;
};

export type ArticleSection = {
  heading: string;
  body: string[];
  bullets?: string[];
  ordered?: string[];
  note?: string;
};

export type CareerArticle = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  intro: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  featuredImage?: string;
  status: "published" | "draft";
  views: number;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  sections: ArticleSection[];
  relatedSlugs: string[];
  jobCta?: {
    label: string;
    type: string;
  };
  serviceCta?: {
    title: string;
    text: string;
    label: string;
  };
};

export type CareerResource = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const careerCategories: CareerCategory[] = [
  { id: "career-tips", title: "Career Tips", slug: "career-tips", description: "Practical advice for navigating the job market and building your career.", icon: TrendingUp },
  { id: "cv-guides", title: "CV & Resume Guides", slug: "cv-guides", description: "Learn how to create, improve and tailor a professional CV.", icon: FileText },
  { id: "cover-letter-guides", title: "Cover Letter Guides", slug: "cover-letter-guides", description: "Learn how to write effective cover letters and application emails.", icon: Mail },
  { id: "interview-preparation", title: "Interview Preparation", slug: "interview-preparation", description: "Interview questions, sample answers, preparation tips and interview strategies.", icon: Mic2 },
  { id: "job-application-guides", title: "Job Application Guides", slug: "job-application-guides", description: "Learn how to find jobs, apply effectively and navigate different application processes.", icon: BriefcaseBusiness },
  { id: "graduate-resources", title: "Graduate & Student Resources", slug: "graduate-resources", description: "Internship, attachment, graduate programme and early-career resources.", icon: GraduationCap },
  { id: "salary-insights", title: "Salary & Career Insights", slug: "salary-insights", description: "Salary information, career comparisons and insights into different professions.", icon: WalletCards },
  { id: "job-seeker-safety", title: "Job Seeker Safety", slug: "job-seeker-safety", description: "Learn how to identify fake jobs, recruitment scams and suspicious application requests.", icon: ShieldCheck },
  { id: "career-tools-resources", title: "Career Tools & Resources", slug: "career-tools-resources", description: "Useful free tools, checklists, templates and resources for job seekers.", icon: ClipboardCheck },
];

export const careerResources: CareerResource[] = [
  { title: "CV Self-Audit Checklist", description: "Check whether your CV is ready for your next application.", icon: FileCheck2 },
  { title: "Interview Preparation Checklist", description: "Prepare before walking into your next interview.", icon: Mic2 },
  { title: "Job Application Tracker", description: "Keep track of the jobs you've applied for.", icon: ClipboardCheck },
  { title: "Salary Guide", description: "Explore salary information by career and experience level.", icon: Scale },
  { title: "Career Path Guide", description: "Explore career options based on your skills and qualifications.", icon: TrendingUp },
];

export const careerArticles: CareerArticle[] = [
  {
    id: "cv-kenya",
    title: "How to Write a CV That Gets Noticed in Kenya",
    slug: "how-to-write-a-cv",
    category: "cv-guides",
    excerpt: "A practical CV structure Kenyan job seekers can use to make experience, skills and fit easier to scan.",
    intro: "Your CV should make it easy for a recruiter to understand what you can do, where you have done it, and why you fit the role.",
    author: "Get Hired KE Editorial Team",
    publishedAt: "2026-09-02",
    updatedAt: "2026-09-08",
    readingTime: "7 min read",
    status: "published",
    views: 1840,
    tags: ["CV", "Resume", "Applications"],
    seoTitle: "How to Write a CV in Kenya | Get Hired KE",
    seoDescription: "Learn how to write a clear, professional CV for jobs in Kenya, including structure, tailoring tips and common mistakes to avoid.",
    sections: [
      {
        heading: "Start with the role in mind",
        body: ["Before editing your CV, read the job post carefully. Highlight the responsibilities, required skills and keywords that appear more than once."],
        bullets: ["Match your summary to the role", "Move the most relevant experience higher", "Use the same plain language the employer uses where it is truthful"],
      },
      {
        heading: "Use a simple structure",
        body: ["A strong CV is easy to scan. Keep headings clear and avoid heavy decoration that distracts from your experience."],
        ordered: ["Contact details", "Professional summary", "Work experience", "Education and certifications", "Skills", "Referees or note that they are available on request"],
      },
      {
        heading: "Show evidence",
        body: ["Where possible, describe achievements, tools used, responsibilities handled and outcomes. Avoid unsupported claims like hardworking or dynamic unless the CV also shows evidence."],
        note: "For early-career applicants, school projects, attachments, volunteering and leadership roles can still show useful experience.",
      },
    ],
    relatedSlugs: ["professional-job-application-email", "cover-letter-for-job-application", "find-job-with-no-experience"],
    jobCta: { label: "Browse Latest Jobs", type: "all" },
    serviceCta: { title: "Want professional help with your CV?", text: "Explore Get Hired KE support when you need hands-on help improving your application documents.", label: "Explore CV Services" },
  },
  {
    id: "interview-questions",
    title: "10 Common Interview Questions and How to Answer Them",
    slug: "common-interview-questions",
    category: "interview-preparation",
    excerpt: "Prepare clearer answers for common interview questions without sounding memorised.",
    intro: "Good interview preparation helps you tell specific stories about your experience, judgment and motivation.",
    author: "Get Hired KE Editorial Team",
    publishedAt: "2026-09-03",
    readingTime: "8 min read",
    status: "published",
    views: 1650,
    tags: ["Interview", "Preparation", "Answers"],
    seoTitle: "Common Interview Questions and Answers | Get Hired KE",
    seoDescription: "Practice common interview questions with simple frameworks and examples for Kenyan job seekers.",
    sections: [
      { heading: "Prepare stories, not scripts", body: ["A memorised answer can sound flat. A real example shows how you think, communicate and solve problems."], bullets: ["What was the situation?", "What action did you take?", "What changed because of your action?"] },
      { heading: "Questions to practise", body: ["Start with the questions that appear in many interviews, then adapt your answers to the role."], ordered: ["Tell me about yourself", "Why are you interested in this role?", "What are your strengths?", "Describe a challenge you handled", "Why should we hire you?"] },
      { heading: "Close with interest", body: ["At the end, ask one or two thoughtful questions about the team, expectations or next steps."], note: "You do not need perfect English to interview well. You need clarity, honesty and preparation." },
    ],
    relatedSlugs: ["tell-me-about-yourself", "prepare-for-an-interview", "find-job-with-no-experience"],
    jobCta: { label: "Browse Jobs Closing Soon", type: "all" },
    serviceCta: { title: "Need help preparing for your interview?", text: "Get structured support before an important interview or assessment.", label: "Explore Career Services" },
  },
  {
    id: "no-experience",
    title: "How to Find a Job With No Work Experience",
    slug: "find-job-with-no-experience",
    category: "graduate-resources",
    excerpt: "How students, graduates and first-time job seekers can present potential and build a stronger application.",
    intro: "No formal work experience does not mean you have nothing to offer. The goal is to show learning ability, reliability and relevant exposure.",
    author: "Get Hired KE Editorial Team",
    publishedAt: "2026-09-04",
    readingTime: "6 min read",
    status: "published",
    views: 1510,
    tags: ["Graduate Jobs", "Internships", "No Experience"],
    seoTitle: "How to Get a Job With No Experience in Kenya | Get Hired KE",
    seoDescription: "A practical guide for graduates and first-time job seekers applying for jobs, internships and attachments in Kenya.",
    sections: [
      { heading: "Target the right openings", body: ["Prioritise internships, attachments, trainee programmes and entry-level roles. These are more likely to assess your potential instead of only years of experience."], bullets: ["Graduate trainee programmes", "Internships and attachments", "Assistant roles", "Volunteer and project-based opportunities"] },
      { heading: "Translate your experience", body: ["Class projects, clubs, volunteering and family business responsibilities can demonstrate organisation, communication and problem solving."], note: "Keep examples honest and specific. Do not inflate titles or responsibilities." },
      { heading: "Build proof quickly", body: ["Create small pieces of evidence: a portfolio, short writing samples, Excel practice files, GitHub projects, event photos, certificates or recommendation letters."], bullets: ["Pick proof that matches the role", "Keep it easy to access", "Mention it briefly in your CV or application email"] },
    ],
    relatedSlugs: ["how-to-get-first-graduate-job", "professional-job-application-email", "how-to-find-internships"],
    jobCta: { label: "Browse Graduate Jobs", type: "graduate" },
    serviceCta: { title: "Need help positioning your experience?", text: "Explore support for improving your CV, applications and interview readiness.", label: "Explore Career Services" },
  },
  {
    id: "application-email",
    title: "How to Write a Professional Job Application Email",
    slug: "professional-job-application-email",
    category: "cover-letter-guides",
    excerpt: "A clear, polite application email format you can adapt when applying directly to employers.",
    intro: "A good application email is brief, respectful and easy for the employer to process.",
    author: "Get Hired KE Editorial Team",
    publishedAt: "2026-09-05",
    readingTime: "5 min read",
    status: "published",
    views: 1320,
    tags: ["Cover Letter", "Email", "Applications"],
    seoTitle: "How to Write a Job Application Email | Get Hired KE",
    seoDescription: "Learn a simple structure for writing professional job application emails in Kenya.",
    sections: [
      { heading: "Use a clear subject line", body: ["Make the role and your name visible. This helps the recruiter file your email quickly."], bullets: ["Application for Finance Assistant - Jane Wanjiku", "Graduate Trainee Application - Brian Otieno"] },
      { heading: "Keep the message focused", body: ["Introduce yourself, mention the role, highlight one or two relevant strengths and attach the requested documents."], ordered: ["Greeting", "Role you are applying for", "Short fit statement", "Attached documents", "Polite closing"] },
      { heading: "Check before sending", body: ["Confirm the attachments open, the company name is correct and the email address matches the job advert."], note: "Never send original documents unless the employer has a clear and trustworthy reason." },
    ],
    relatedSlugs: ["how-to-write-a-cv", "cover-letter-for-job-application", "identify-fake-job-vacancies"],
    jobCta: { label: "Browse Job Categories", type: "all" },
    serviceCta: { title: "Want help polishing your application?", text: "Explore professional support for CVs, cover letters and application review.", label: "Explore CV Services" },
  },
  {
    id: "fake-jobs",
    title: "How to Identify Fake Job Vacancies",
    slug: "identify-fake-job-vacancies",
    category: "job-seeker-safety",
    excerpt: "Warning signs to check before sharing personal documents, paying fees or attending suspicious interviews.",
    intro: "A careful check can protect your time, money and personal information during the job search.",
    author: "Get Hired KE Editorial Team",
    publishedAt: "2026-09-06",
    readingTime: "6 min read",
    status: "published",
    views: 2010,
    tags: ["Safety", "Scams", "Applications"],
    seoTitle: "How to Identify Fake Jobs in Kenya | Get Hired KE",
    seoDescription: "Learn practical warning signs that can help Kenyan job seekers avoid fake job adverts and recruitment scams.",
    sections: [
      { heading: "Watch for payment requests", body: ["Be cautious when a recruiter asks you to pay registration, interview, medical, training or placement fees before employment."], note: "Legitimate processes can vary, but pressure to pay quickly is a serious warning sign." },
      { heading: "Verify the source", body: ["Check the employer website, official social media pages and known email domains. Be careful with adverts that only use personal phone numbers or unrelated email accounts."], bullets: ["Search the company name separately", "Compare the advert with official channels", "Ask trusted people before sending documents"] },
      { heading: "Protect sensitive information", body: ["Do not share ID copies, bank details or certificates until you understand who is requesting them and why."], bullets: ["Blur unnecessary personal numbers where appropriate", "Use official application portals where available", "Keep copies of communication"] },
    ],
    relatedSlugs: ["professional-job-application-email", "find-jobs-online", "how-to-write-a-cv"],
    jobCta: { label: "Browse Verified Opportunities", type: "all" },
  },
  {
    id: "salary-kenya",
    title: "How Much Should You Earn? Understanding Salaries in Kenya",
    slug: "understanding-salaries-in-kenya",
    category: "salary-insights",
    excerpt: "A practical way to think about salary ranges, benefits and negotiation without relying on unsupported figures.",
    intro: "Salary expectations should consider the role, industry, location, experience, responsibilities and benefits package.",
    author: "Get Hired KE Editorial Team",
    publishedAt: "2026-09-07",
    readingTime: "7 min read",
    status: "published",
    views: 1210,
    tags: ["Salary", "Negotiation", "Career Insights"],
    seoTitle: "Understanding Salaries in Kenya | Get Hired KE",
    seoDescription: "Learn how to evaluate salary expectations, compare offers and prepare for salary conversations in Kenya.",
    sections: [
      { heading: "Look beyond the headline number", body: ["Compare basic pay, allowances, bonuses, medical cover, pension, leave days, commute costs and contract stability."], bullets: ["Monthly gross pay", "Net pay after deductions", "Benefits", "Growth path", "Work location and transport"] },
      { heading: "Use a range", body: ["When asked for expectations, a range gives room for discussion. Anchor it in your experience, the responsibilities and what you know about similar roles."], note: "Avoid presenting salary figures as facts unless you can point to a reliable source." },
      { heading: "Negotiate professionally", body: ["Show appreciation for the offer, ask clarifying questions and explain your request calmly."], ordered: ["Thank the employer", "Clarify the package", "State your preferred range", "Give a brief reason", "Stay open to the full package"] },
    ],
    relatedSlugs: ["salary-negotiation", "career-path-guide", "common-interview-questions"],
    jobCta: { label: "Browse Current Jobs", type: "all" },
  },
  {
    id: "ngo-jobs",
    title: "How to Find NGO Jobs in Kenya",
    slug: "find-ngo-jobs-in-kenya",
    category: "job-application-guides",
    excerpt: "Where to look, what to prepare and how to position your experience for NGO and development roles.",
    intro: "NGO roles often value programme understanding, documentation, community work, reporting and strong communication.",
    author: "Get Hired KE Editorial Team",
    publishedAt: "2026-09-08",
    readingTime: "6 min read",
    status: "published",
    views: 980,
    tags: ["NGO Jobs", "Development", "Applications"],
    seoTitle: "How to Find NGO Jobs in Kenya | Get Hired KE",
    seoDescription: "A practical guide for finding and applying for NGO and development jobs in Kenya.",
    sections: [
      { heading: "Understand the language of NGO roles", body: ["Read terms like programme, livelihoods, MEAL, grants, field officer and community mobilisation carefully. Each points to different responsibilities."], bullets: ["Programme delivery", "Monitoring and evaluation", "Donor reporting", "Community engagement"] },
      { heading: "Tailor your CV to impact", body: ["Show projects, communities served, reports prepared, budgets handled and partners coordinated where relevant."], note: "Avoid claiming impact numbers unless you can explain where they came from." },
      { heading: "Follow application instructions exactly", body: ["NGO applications can be strict about subject lines, document names and required forms. Small errors can make your application harder to process."] },
    ],
    relatedSlugs: ["professional-job-application-email", "how-to-write-a-cv", "identify-fake-job-vacancies"],
    jobCta: { label: "Browse NGO Jobs", type: "ngo" },
  },
  {
    id: "graduate-first-job",
    title: "How to Get Your First Graduate Job",
    slug: "how-to-get-first-graduate-job",
    category: "graduate-resources",
    excerpt: "A focused guide for moving from campus, attachment or internship into your first professional role.",
    intro: "Your first job search needs focus, consistency and a clear way to explain what you can contribute.",
    author: "Get Hired KE Editorial Team",
    publishedAt: "2026-09-09",
    readingTime: "6 min read",
    status: "published",
    views: 1110,
    tags: ["Graduate Jobs", "Entry Level", "Students"],
    seoTitle: "How to Get Your First Graduate Job | Get Hired KE",
    seoDescription: "Learn how to prepare for graduate trainee, entry-level and internship opportunities in Kenya.",
    sections: [
      { heading: "Build a weekly application rhythm", body: ["Set aside time to find openings, tailor your CV, submit applications and follow up where appropriate."], bullets: ["Track every role", "Save deadlines", "Review your CV every few applications"] },
      { heading: "Use your networks well", body: ["Let lecturers, former supervisors, relatives and peers know the kind of roles you are targeting. Be specific and respectful."], note: "A simple message with your field, location preference and CV is easier to help with than a vague request for any job." },
      { heading: "Prepare for assessments", body: ["Many graduate programmes include aptitude tests, written tasks or group interviews. Practise early instead of waiting for an invite."] },
    ],
    relatedSlugs: ["find-job-with-no-experience", "how-to-find-internships", "common-interview-questions"],
    jobCta: { label: "Browse Graduate Jobs", type: "graduate" },
  },
  {
    id: "remote-jobs",
    title: "How to Find Remote Jobs",
    slug: "find-remote-jobs",
    category: "job-application-guides",
    excerpt: "How to assess remote roles, show readiness and avoid vague work-from-home adverts.",
    intro: "Remote work requires trust, communication, reliable tools and clear expectations.",
    author: "Get Hired KE Editorial Team",
    publishedAt: "2026-09-10",
    readingTime: "5 min read",
    status: "published",
    views: 910,
    tags: ["Remote Jobs", "Applications", "Safety"],
    seoTitle: "How to Find Remote Jobs | Get Hired KE",
    seoDescription: "Learn how to find, assess and apply for remote jobs while avoiding suspicious work-from-home adverts.",
    sections: [
      { heading: "Check what remote means", body: ["Some roles are fully remote, while others require occasional office days, Kenyan working hours or specific equipment."], bullets: ["Location restrictions", "Work hours", "Equipment provided", "Communication tools"] },
      { heading: "Show remote readiness", body: ["Mention tools you have used, how you manage tasks and how you communicate progress."], bullets: ["Email and chat clarity", "Task tracking", "Reliable internet", "Self-management"] },
      { heading: "Be careful with vague offers", body: ["Avoid roles that promise quick money without clear responsibilities, company details or application steps."] },
    ],
    relatedSlugs: ["identify-fake-job-vacancies", "professional-job-application-email", "how-to-write-a-cv"],
    jobCta: { label: "Browse Remote Jobs", type: "remote" },
  },
  {
    id: "tell-me-about-yourself",
    title: "How to Answer Tell Me About Yourself",
    slug: "tell-me-about-yourself",
    category: "interview-preparation",
    excerpt: "A simple structure for opening an interview with confidence and relevance.",
    intro: "This question is your chance to connect your background to the role in a short, useful way.",
    author: "Get Hired KE Editorial Team",
    publishedAt: "2026-08-30",
    readingTime: "4 min read",
    status: "published",
    views: 1460,
    tags: ["Interview", "Answers"],
    seoTitle: "How to Answer Tell Me About Yourself | Get Hired KE",
    seoDescription: "Use a simple interview answer structure for tell me about yourself.",
    sections: [
      { heading: "Use present, past, future", body: ["Start with what you do now, add relevant experience, then connect to why this role makes sense."], ordered: ["Current focus", "Relevant background", "Why this opportunity"] },
      { heading: "Keep it short", body: ["Aim for clarity. You can expand later when the interviewer asks follow-up questions."] },
    ],
    relatedSlugs: ["common-interview-questions", "prepare-for-an-interview", "find-job-with-no-experience"],
    jobCta: { label: "Browse Jobs", type: "all" },
    serviceCta: { title: "Need interview practice?", text: "Explore career support before your next interview.", label: "Explore Career Services" },
  },
  {
    id: "cover-letter",
    title: "How to Write a Cover Letter",
    slug: "cover-letter-for-job-application",
    category: "cover-letter-guides",
    excerpt: "Write a concise cover letter that connects your experience to the job without repeating your CV.",
    intro: "A cover letter should explain fit, motivation and relevance in a way your CV cannot fully show.",
    author: "Get Hired KE Editorial Team",
    publishedAt: "2026-08-28",
    readingTime: "5 min read",
    status: "published",
    views: 1240,
    tags: ["Cover Letter", "Applications"],
    seoTitle: "How to Write a Cover Letter | Get Hired KE",
    seoDescription: "Learn how to write a clear cover letter for job applications.",
    sections: [
      { heading: "Make every paragraph work", body: ["Open with the role, show two or three relevant strengths, then close politely with availability and thanks."], ordered: ["Opening", "Relevant experience", "Why the role fits", "Closing"] },
      { heading: "Do not copy your CV", body: ["Use the letter to connect the dots. The recruiter can already see your work history in the CV."] },
    ],
    relatedSlugs: ["professional-job-application-email", "how-to-write-a-cv", "find-job-with-no-experience"],
    jobCta: { label: "Browse Latest Jobs", type: "all" },
    serviceCta: { title: "Want help with your cover letter?", text: "Explore application document support from Get Hired KE.", label: "Explore CV Services" },
  },
  {
    id: "find-jobs-online",
    title: "How to Find Jobs Online",
    slug: "find-jobs-online",
    category: "job-application-guides",
    excerpt: "Build a simple job search routine across platforms, alerts and direct employer websites.",
    intro: "An effective online search combines trusted listings, employer websites and consistent tracking.",
    author: "Get Hired KE Editorial Team",
    publishedAt: "2026-08-26",
    readingTime: "5 min read",
    status: "published",
    views: 1190,
    tags: ["Job Search", "Applications"],
    seoTitle: "How to Find Jobs Online | Get Hired KE",
    seoDescription: "Create a practical online job search routine.",
    sections: [
      { heading: "Use focused searches", body: ["Search by role title, field, location and opportunity type. Save searches that produce useful results."], bullets: ["Graduate jobs", "NGO jobs", "Remote jobs", "Internships"] },
      { heading: "Track your applications", body: ["A simple tracker helps you avoid duplicate applications and missed deadlines."] },
    ],
    relatedSlugs: ["find-ngo-jobs-in-kenya", "find-remote-jobs", "identify-fake-job-vacancies"],
    jobCta: { label: "Browse Job Categories", type: "all" },
  },
  {
    id: "prepare-interview",
    title: "How to Prepare for an Interview",
    slug: "prepare-for-an-interview",
    category: "interview-preparation",
    excerpt: "A practical checklist for researching the role, preparing stories and planning interview day.",
    intro: "Preparation reduces pressure and helps you answer with clearer examples.",
    author: "Get Hired KE Editorial Team",
    publishedAt: "2026-08-24",
    readingTime: "5 min read",
    status: "published",
    views: 1175,
    tags: ["Interview", "Checklist"],
    seoTitle: "How to Prepare for an Interview | Get Hired KE",
    seoDescription: "Use this interview preparation checklist before your next interview.",
    sections: [
      { heading: "Research the basics", body: ["Understand the employer, the role, the location, the work arrangement and the skills they care about."], bullets: ["Company work", "Role requirements", "Recent updates", "Interview format"] },
      { heading: "Prepare your examples", body: ["Choose stories that show teamwork, problem solving, learning and responsibility."] },
    ],
    relatedSlugs: ["common-interview-questions", "tell-me-about-yourself", "find-job-with-no-experience"],
    jobCta: { label: "Browse Current Jobs", type: "all" },
    serviceCta: { title: "Need help preparing for your interview?", text: "Get practical support before an important interview.", label: "Explore Career Services" },
  },
  {
    id: "internships",
    title: "How to Find Internships and Attachments",
    slug: "how-to-find-internships",
    category: "graduate-resources",
    excerpt: "A student-friendly approach to finding attachments, internships and early work exposure.",
    intro: "Internships and attachments are often your first proof of workplace readiness.",
    author: "Get Hired KE Editorial Team",
    publishedAt: "2026-08-22",
    readingTime: "5 min read",
    status: "published",
    views: 1020,
    tags: ["Internships", "Attachments", "Students"],
    seoTitle: "How to Find Internships in Kenya | Get Hired KE",
    seoDescription: "Learn where to look for internships and attachments and how to apply well.",
    sections: [
      { heading: "Start early", body: ["Many organisations plan intake before students urgently need placements. Begin searching before the deadline pressure starts."], bullets: ["Career offices", "Employer websites", "Trusted job platforms", "Professional contacts"] },
      { heading: "Prepare your documents", body: ["Keep your CV, school introduction letter and certificates ready where required."] },
    ],
    relatedSlugs: ["find-job-with-no-experience", "how-to-get-first-graduate-job", "professional-job-application-email"],
    jobCta: { label: "Browse Internships", type: "internships" },
  },
  {
    id: "salary-negotiation",
    title: "How to Negotiate Salary Professionally",
    slug: "salary-negotiation",
    category: "salary-insights",
    excerpt: "A simple, respectful approach to salary conversations during interviews and offers.",
    intro: "Salary negotiation works best when you are prepared, calm and clear about the full package.",
    author: "Get Hired KE Editorial Team",
    publishedAt: "2026-08-20",
    readingTime: "5 min read",
    status: "published",
    views: 880,
    tags: ["Salary", "Negotiation"],
    seoTitle: "How to Negotiate Salary | Get Hired KE",
    seoDescription: "Learn how to handle salary discussions professionally.",
    sections: [
      { heading: "Know your priorities", body: ["Decide what matters most before the conversation: pay, benefits, flexibility, learning or stability."], bullets: ["Minimum acceptable offer", "Preferred range", "Benefits that matter", "Growth expectations"] },
      { heading: "Use respectful language", body: ["Thank the employer, ask questions and explain your request briefly."] },
    ],
    relatedSlugs: ["understanding-salaries-in-kenya", "common-interview-questions", "career-path-guide"],
    jobCta: { label: "Browse Current Jobs", type: "all" },
  },
  {
    id: "career-path",
    title: "How to Choose a Career Path",
    slug: "career-path-guide",
    category: "career-tips",
    excerpt: "A reflective guide for comparing career options based on skills, interests and opportunities.",
    intro: "A career path is easier to choose when you compare real work, not only job titles.",
    author: "Get Hired KE Editorial Team",
    publishedAt: "2026-08-18",
    readingTime: "6 min read",
    status: "published",
    views: 810,
    tags: ["Career Path", "Career Tips"],
    seoTitle: "How to Choose a Career Path | Get Hired KE",
    seoDescription: "Explore career options based on your skills, interests and qualifications.",
    sections: [
      { heading: "Compare daily work", body: ["Look at what people actually do in the role: tasks, tools, work environment, deadlines and communication."], bullets: ["Tasks you enjoy", "Skills you can build", "Industries hiring", "Work style"] },
      { heading: "Test before committing", body: ["Short courses, volunteering, informational interviews and small projects can help you learn before making a big move."] },
    ],
    relatedSlugs: ["understanding-salaries-in-kenya", "find-job-with-no-experience", "find-jobs-online"],
    jobCta: { label: "Browse Job Categories", type: "all" },
  },
];

export const getCareerCategory = (slug: string) => careerCategories.find((category) => category.slug === slug);
export const getCareerArticle = (slug: string) => careerArticles.find((article) => article.slug === slug && article.status === "published");
export const getArticlesByCategory = (categorySlug: string) => careerArticles.filter((article) => article.category === categorySlug && article.status === "published");
export const getRelatedArticles = (article: CareerArticle, limit = 4) => {
  const related = article.relatedSlugs.map(getCareerArticle).filter((item): item is CareerArticle => Boolean(item));
  const fallback = careerArticles.filter((item) => item.category === article.category && item.slug !== article.slug);
  return [...related, ...fallback].filter((item, index, list) => list.findIndex((entry) => entry.slug === item.slug) === index).slice(0, limit);
};
export const formatArticleDate = (date: string) => new Intl.DateTimeFormat("en-KE", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${date}T00:00:00`));
