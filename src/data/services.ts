import {
  BriefcaseBusiness,
  FileCheck2,
  FileText,
  Linkedin,
  MessagesSquare,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";

export type CareerService = {
  id: string;
  slug: string;
  title: string;
  description: string;
  benefits: string[];
  cta: string;
  pricingLabel: string;
  pricingSubtext?: string;
  featured?: boolean;
  secondary?: boolean;
  icon: LucideIcon;
};

export type ServicePackage = {
  id: string;
  title: string;
  price: string;
  features: string[];
  cta: string;
  serviceSlug: string;
  popular?: boolean;
};

export const careerServices: CareerService[] = [
  {
    id: "cv-revamp",
    slug: "cv-revamp",
    title: "CV Revamp",
    description:
      "Turn your existing CV into a clearer, more professional and job-focused document.",
    benefits: [
      "Professional structure and formatting",
      "Stronger wording and presentation",
      "Achievement-focused content",
      "ATS-friendly organization",
      "Tailored toward your target roles",
    ],
    cta: "Revamp My CV",
    pricingLabel: "From KSh 300",
    pricingSubtext: "Packages available",
    featured: true,
    icon: FileCheck2,
  },
  {
    id: "cover-letter",
    slug: "cover-letter",
    title: "Cover Letter Writing",
    description:
      "Get a professional, targeted cover letter tailored to the opportunity you're applying for.",
    benefits: [
      "Tailored to the role",
      "Professional structure",
      "Clear value proposition",
      "Employer-focused messaging",
    ],
    cta: "Get a Cover Letter",
    pricingLabel: "Available from KSh 700 with CV + Cover Letter package",
    icon: FileText,
  },
  {
    id: "interview-preparation",
    slug: "interview-preparation",
    title: "Interview Preparation",
    description:
      "Prepare for your next interview with practical guidance, likely questions and stronger answers.",
    benefits: [
      "Common interview questions",
      "Answer preparation",
      "Role-specific preparation",
      "Interview strategy",
      "Confidence-building guidance",
    ],
    cta: "Prepare for an Interview",
    pricingLabel: "Personalized support",
    icon: MessagesSquare,
  },
  {
    id: "job-application-support",
    slug: "job-application-support",
    title: "Job Application Support",
    description:
      "Get practical guidance on presenting yourself and preparing a stronger application.",
    benefits: [
      "Application review",
      "Supporting document guidance",
      "Application strategy",
      "Role-specific guidance",
    ],
    cta: "Get Application Support",
    pricingLabel: "Personalized support",
    icon: BriefcaseBusiness,
  },
  {
    id: "linkedin-optimization",
    slug: "linkedin-optimization",
    title: "LinkedIn Profile Optimization",
    description:
      "Make your LinkedIn profile more professional and better positioned for recruiters and employers.",
    benefits: [
      "Profile presentation",
      "Professional headline",
      "About section improvement",
      "Experience presentation",
      "Job-search positioning",
    ],
    cta: "Optimize My LinkedIn",
    pricingLabel: "Included in the KSh 1,000 Complete Package",
    secondary: true,
    icon: Linkedin,
  },
  {
    id: "career-guidance",
    slug: "career-guidance",
    title: "Career Guidance",
    description: "Get practical guidance when you're unsure about your next career step.",
    benefits: [
      "Career direction",
      "Job-search strategy",
      "Entry-level guidance",
      "Graduate career guidance",
      "Career transition guidance",
    ],
    cta: "Get Career Guidance",
    pricingLabel: "Personalized support",
    icon: UserRoundCheck,
  },
];

export const servicePackages: ServicePackage[] = [
  {
    id: "basic-cv",
    title: "Basic CV",
    price: "KSh 300",
    features: ["ATS-friendly CV", "1 page"],
    cta: "Choose Basic CV",
    serviceSlug: "cv-revamp",
  },
  {
    id: "professional-cv",
    title: "Professional CV",
    price: "KSh 500",
    features: ["Well-structured CV", "Professional design", "1-2 pages"],
    cta: "Choose Professional CV",
    serviceSlug: "cv-revamp",
  },
  {
    id: "cv-cover-letter",
    title: "CV + Cover Letter",
    price: "KSh 700",
    features: ["Professional CV", "Customized cover letter"],
    cta: "Choose This Package",
    serviceSlug: "cover-letter",
    popular: true,
  },
  {
    id: "complete-package",
    title: "Complete Package",
    price: "KSh 1,000",
    features: ["CV", "Cover Letter", "LinkedIn Profile Optimization"],
    cta: "Choose Complete Package",
    serviceSlug: "linkedin-optimization",
  },
];
