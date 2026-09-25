import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MessageCircle, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | Get Hired KE" },
      {
        name: "description",
        content:
          "Read the Terms & Conditions governing the use of Get Hired KE, including our job listings, career resources, community and professional career services.",
      },
      { property: "og:title", content: "Terms & Conditions | Get Hired KE" },
      {
        property: "og:description",
        content:
          "Read the Terms & Conditions governing the use of Get Hired KE, including our job listings, career resources, community and professional career services.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/terms-and-conditions" }],
  }),
  component: TermsAndConditions,
});

const whatsappContactUrl = "https://wa.me/254746221954";
const phoneHref = "tel:+254746221954";
const emailHref = "mailto:support@bermudaappstudios.online";

const navItems = [
  { href: "#introduction", label: "Introduction" },
  { href: "#about-get-hired-ke", label: "About Get Hired KE" },
  { href: "#job-and-opportunity-listings", label: "Job and Opportunity Listings" },
  {
    href: "#no-guarantee-of-employment-or-selection",
    label: "No Guarantee of Employment or Selection",
  },
  { href: "#external-application-links", label: "External Application Links" },
  { href: "#career-hub-and-free-resources", label: "Career Hub and Free Resources" },
  { href: "#career-services", label: "Career Services" },
  { href: "#service-payments", label: "Service Payments" },
  { href: "#user-responsibilities", label: "User Responsibilities" },
  { href: "#prohibited-use", label: "Prohibited Use" },
  { href: "#user-submitted-content", label: "User-Submitted Content" },
  { href: "#intellectual-property", label: "Intellectual Property" },
  { href: "#accuracy-of-information", label: "Accuracy of Information" },
  { href: "#third-party-websites-and-services", label: "Third-Party Websites and Services" },
  { href: "#whatsapp-and-community-channels", label: "WhatsApp and Community Channels" },
  { href: "#privacy-and-personal-information", label: "Privacy and Personal Information" },
  { href: "#website-availability-and-security", label: "Website Availability and Security" },
  { href: "#limitation-of-liability", label: "Limitation of Liability" },
  { href: "#no-employment-relationship", label: "No Employment Relationship" },
  { href: "#changes-to-these-terms", label: "Changes to These Terms" },
  { href: "#suspension-or-termination", label: "Suspension or Termination" },
  { href: "#governing-law", label: "Governing Law" },
  { href: "#contact-us", label: "Contact Us" },
] as const;

function TermsAndConditions() {
  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Legal</p>
          <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight sm:text-4xl">
            Terms & Conditions
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            The terms that govern your use of Get Hired KE, our website, career resources and
            services.
          </p>
          <p className="mt-5 inline-flex rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground">
            Last Updated: 16 September 2026
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="On this page" className="rounded-lg border border-border bg-card p-4">
            <p className="font-heading text-sm font-bold text-foreground">On this page</p>
            <div className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        </aside>

        <article className="max-w-3xl space-y-11">
          <PolicySection id="introduction" title="1. Introduction">
            <p>Welcome to Get Hired KE.</p>
            <p>
              These Terms & Conditions govern your use of the Get Hired KE website, career
              resources, job and opportunity listings, community-related services and professional
              career services.
            </p>
            <p>Get Hired KE is operated by Bermuda App Studios.</p>
            <p>
              By accessing or using the Get Hired KE website, you agree to comply with these Terms &
              Conditions. If you do not agree with these terms, please do not use the website or our
              services.
            </p>
            <p>
              These Terms & Conditions should be read together with our{" "}
              <Link
                to="/privacy-policy"
                className="font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Privacy Policy
              </Link>
              , which explains how we handle personal information.
            </p>
          </PolicySection>

          <PolicySection id="about-get-hired-ke" title="2. About Get Hired KE">
            <p>Get Hired KE is a career platform that helps people:</p>
            <ul>
              <li>Discover job opportunities</li>
              <li>Find internships and graduate opportunities</li>
              <li>Discover scholarships and other career opportunities</li>
              <li>Access practical career information and resources</li>
              <li>Receive professional career support</li>
              <li>Connect with the Get Hired KE community</li>
            </ul>
            <p>We aim to make opportunities easier to discover, understand and pursue.</p>
            <p>
              Get Hired KE is not an employer, recruitment agency or hiring authority for every
              opportunity published on the platform.
            </p>
          </PolicySection>

          <PolicySection id="job-and-opportunity-listings" title="3. Job and Opportunity Listings">
            <p>
              Get Hired KE may publish information about jobs, internships, scholarships and other
              opportunities obtained from sources including:
            </p>
            <ul>
              <li>Official employer websites</li>
              <li>Government portals</li>
              <li>NGO websites</li>
              <li>LinkedIn</li>
              <li>Other reputable job and opportunity platforms</li>
            </ul>
            <p>
              We review and simplify available information before sharing opportunities with our
              audience.
            </p>
            <p>
              However, job and opportunity information may change after publication. Employers or
              other organizations may modify:
            </p>
            <ul>
              <li>Job requirements</li>
              <li>Application procedures</li>
              <li>Closing dates</li>
              <li>Locations</li>
              <li>Compensation</li>
              <li>Availability</li>
              <li>Other opportunity details</li>
            </ul>
            <p>
              Users should always verify important information and, where applicable, apply through
              the official employer or organization.
            </p>
          </PolicySection>

          <PolicySection
            id="no-guarantee-of-employment-or-selection"
            title="4. No Guarantee of Employment or Selection"
          >
            <p>Get Hired KE does not guarantee:</p>
            <ul>
              <li>Employment</li>
              <li>Interviews</li>
              <li>Shortlisting</li>
              <li>Selection</li>
              <li>Scholarships</li>
              <li>Admission</li>
              <li>Internships</li>
              <li>Any other outcome from an opportunity shared on the platform</li>
            </ul>
            <p>
              The decision to recruit, shortlist, select, admit or award an opportunity belongs to
              the relevant employer, institution or organization.
            </p>
            <p>Our role is to help users discover, understand and pursue opportunities.</p>
          </PolicySection>

          <PolicySection id="external-application-links" title="5. External Application Links">
            <p>
              Some opportunities published by Get Hired KE may direct users to external websites to
              complete an application.
            </p>
            <p>
              These may include employer websites, government portals, LinkedIn, job platforms and
              other third-party websites.
            </p>
            <p>Once you leave the Get Hired KE website and interact with an external platform:</p>
            <ul>
              <li>The third party's terms and policies may apply.</li>
              <li>Information you submit is handled by that third party.</li>
              <li>Get Hired KE does not control the external platform.</li>
              <li>
                Users should verify that they are applying through the appropriate official channel.
              </li>
            </ul>
            <p>
              We encourage users to exercise caution when providing personal information or making
              payments to third parties.
            </p>
          </PolicySection>

          <PolicySection
            id="career-hub-and-free-resources"
            title="6. Career Hub and Free Resources"
          >
            <p>
              Get Hired KE provides free career content through the Career Hub, which may include:
            </p>
            <ul>
              <li>CV and resume guidance</li>
              <li>Cover letter guidance</li>
              <li>Interview preparation</li>
              <li>Job application guidance</li>
              <li>Career development information</li>
              <li>Graduate and student resources</li>
              <li>Job-seeker safety information</li>
              <li>Career tools and other resources</li>
            </ul>
            <p>
              Career Hub content is provided for general informational and educational purposes.
            </p>
            <p>
              It does not constitute legal, financial, immigration, recruitment or other
              professional advice unless expressly stated otherwise.
            </p>
            <p>
              Users should consider their individual circumstances before relying on general career
              information.
            </p>
          </PolicySection>

          <PolicySection id="career-services" title="7. Career Services">
            <p>Get Hired KE may provide professional career services including:</p>
            <ul>
              <li>CV revamping</li>
              <li>Cover letter writing</li>
              <li>Interview preparation</li>
              <li>Job application support</li>
              <li>LinkedIn profile optimization</li>
              <li>Career guidance</li>
            </ul>
            <p>
              Specific services, deliverables, pricing and other requirements may be communicated to
              the user before the service is undertaken.
            </p>
            <p>
              Users are responsible for providing accurate and complete information needed for the
              requested service.
            </p>
            <p>We may ask users to review information and drafts before final delivery.</p>
            <p>
              Career services are intended to improve the presentation and preparation of a user's
              application. They do not guarantee employment, interviews, selection or any other
              employment outcome.
            </p>
          </PolicySection>

          <PolicySection id="service-payments" title="8. Service Payments">
            <p>
              Where a Get Hired KE career service requires payment, the applicable price and payment
              instructions will be communicated before or during the service-request process.
            </p>
            <p>
              Users are responsible for providing accurate payment information and following the
              applicable payment instructions.
            </p>
            <p>
              Where a service has specific payment, deposit, revision or refund conditions, those
              conditions may be communicated as part of the service request and will apply to that
              service.
            </p>
            <p>
              We do not ask users to make payments through unofficial channels represented as Get
              Hired KE.
            </p>
          </PolicySection>

          <PolicySection id="user-responsibilities" title="9. User Responsibilities">
            <p>When using Get Hired KE, you agree to:</p>
            <ul>
              <li>Provide accurate information when requesting services</li>
              <li>Use the website lawfully</li>
              <li>Respect the rights of other users</li>
              <li>Avoid attempting to interfere with website functionality or security</li>
              <li>Avoid submitting malicious or harmful content</li>
              <li>Avoid using the platform for fraudulent or unlawful purposes</li>
              <li>Verify important information before acting on an opportunity</li>
              <li>Keep any login credentials or account information secure, where applicable</li>
            </ul>
            <p>
              You are responsible for the information and materials you voluntarily provide to Get
              Hired KE.
            </p>
          </PolicySection>

          <PolicySection id="prohibited-use" title="10. Prohibited Use">
            <p>You must not use the website or services to:</p>
            <ul>
              <li>Commit or facilitate unlawful activity</li>
              <li>Attempt to gain unauthorized access to systems or data</li>
              <li>Introduce malware, viruses or other harmful code</li>
              <li>
                Scrape, copy or reproduce substantial portions of the website without permission
              </li>
              <li>
                Impersonate Get Hired KE, Bermuda App Studios or another person or organization
              </li>
              <li>Misrepresent your qualifications or identity</li>
              <li>Abuse contact forms, communication channels or other website features</li>
              <li>Interfere with the normal operation of the website</li>
              <li>Use Get Hired KE content to facilitate fraud, scams or other harmful activity</li>
            </ul>
            <p>
              We may restrict or suspend access where we reasonably believe the website or services
              are being misused.
            </p>
          </PolicySection>

          <PolicySection id="user-submitted-content" title="11. User-Submitted Content">
            <p>Users may voluntarily submit information or materials such as:</p>
            <ul>
              <li>CVs</li>
              <li>Cover letters</li>
              <li>Career information</li>
              <li>Messages</li>
              <li>Enquiry details</li>
              <li>Other materials required for a requested service</li>
            </ul>
            <p>You remain responsible for the accuracy and legality of information you submit.</p>
            <p>
              By submitting information for a requested service, you authorize Get Hired KE to use
              that information as reasonably necessary to provide the requested service, subject to
              our Privacy Policy.
            </p>
            <p>
              We do not claim ownership of your personal career documents merely because you submit
              them to us.
            </p>
          </PolicySection>

          <PolicySection id="intellectual-property" title="12. Intellectual Property">
            <p>
              Unless otherwise stated, the Get Hired KE website and its original content, branding,
              design, graphics, logos, written materials and other materials are owned by or used by
              Get Hired KE and/or Bermuda App Studios.
            </p>
            <p>You may access and use the website for personal, lawful purposes.</p>
            <p>
              You must not reproduce, modify, distribute, sell, publicly display or commercially
              exploit substantial portions of our original website content without appropriate
              permission.
            </p>
            <p>
              This does not prevent users from sharing links to Get Hired KE pages or sharing
              opportunities through ordinary social and communication channels in a reasonable
              manner.
            </p>
            <p>
              Third-party trademarks, logos and content remain the property of their respective
              owners.
            </p>
          </PolicySection>

          <PolicySection id="accuracy-of-information" title="13. Accuracy of Information">
            <p>We make reasonable efforts to provide useful and accurate information.</p>
            <p>
              However, we do not guarantee that every piece of information on the website will
              always be:
            </p>
            <ul>
              <li>Complete</li>
              <li>Current</li>
              <li>Error-free</li>
              <li>Available</li>
              <li>Suitable for every user</li>
            </ul>
            <p>Job listings and other opportunities can change without notice.</p>
            <p>
              If you identify an inaccurate or outdated opportunity, you can contact us so that we
              can review the information.
            </p>
          </PolicySection>

          <PolicySection
            id="third-party-websites-and-services"
            title="14. Third-Party Websites and Services"
          >
            <p>
              The Get Hired KE website may contain links or references to third-party websites,
              platforms and services.
            </p>
            <p>We do not control and are not responsible for:</p>
            <ul>
              <li>Their content</li>
              <li>Their availability</li>
              <li>Their privacy practices</li>
              <li>Their security</li>
              <li>Their terms and conditions</li>
              <li>Their products or services</li>
            </ul>
            <p>
              Your interaction with third-party websites is governed by the applicable third party's
              terms and policies.
            </p>
          </PolicySection>

          <PolicySection
            id="whatsapp-and-community-channels"
            title="15. WhatsApp and Community Channels"
          >
            <p>Get Hired KE may operate or link to WhatsApp and other community channels.</p>
            <p>
              Participation in these channels may be subject to the rules and policies of the
              relevant platform.
            </p>
            <p>
              Users are expected to behave responsibly and respectfully when participating in GHK
              communities.
            </p>
            <p>
              Get Hired KE may moderate, restrict or remove participation where necessary to protect
              the community, prevent spam or address misuse.
            </p>
            <p>
              WhatsApp and other third-party platforms operate independently from Get Hired KE and
              have their own terms and privacy policies.
            </p>
          </PolicySection>

          <PolicySection
            id="privacy-and-personal-information"
            title="16. Privacy and Personal Information"
          >
            <p>
              Your use of Get Hired KE may involve the collection and processing of personal
              information.
            </p>
            <p>
              Our{" "}
              <Link
                to="/privacy-policy"
                className="font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Privacy Policy
              </Link>{" "}
              explains:
            </p>
            <ul>
              <li>What information we collect</li>
              <li>How we use it</li>
              <li>How we protect it</li>
              <li>How long we may retain it</li>
              <li>Your applicable data-protection rights</li>
              <li>How to contact us regarding privacy matters</li>
            </ul>
            <p>
              By using the website, you acknowledge that you should review the Privacy Policy before
              submitting personal information.
            </p>
          </PolicySection>

          <PolicySection
            id="website-availability-and-security"
            title="17. Website Availability and Security"
          >
            <p>We aim to keep Get Hired KE available and functioning properly.</p>
            <p>However, we do not guarantee that the website will always be:</p>
            <ul>
              <li>Available</li>
              <li>Uninterrupted</li>
              <li>Error-free</li>
              <li>Free from security vulnerabilities</li>
            </ul>
            <p>
              The website may occasionally be unavailable because of maintenance, technical
              problems, updates, hosting issues or circumstances outside our reasonable control.
            </p>
            <p>Users should maintain appropriate security on their own devices and accounts.</p>
          </PolicySection>

          <PolicySection id="limitation-of-liability" title="18. Limitation of Liability">
            <p>
              To the extent permitted by applicable law, Get Hired KE and Bermuda App Studios will
              not be responsible for losses or damages arising from:
            </p>
            <ul>
              <li>Decisions made based on job or career information published on the website</li>
              <li>Changes or inaccuracies in third-party job listings</li>
              <li>Actions or decisions of employers or other organizations</li>
              <li>External websites or platforms</li>
              <li>Third-party services</li>
              <li>Temporary website unavailability</li>
              <li>Unauthorized actions by third parties</li>
              <li>Employment, recruitment, scholarship or admission outcomes</li>
            </ul>
            <p>
              Nothing in these Terms & Conditions is intended to exclude or limit liability where
              such exclusion or limitation is prohibited by applicable law.
            </p>
          </PolicySection>

          <PolicySection id="no-employment-relationship" title="19. No Employment Relationship">
            <p>
              Using Get Hired KE, submitting a CV, requesting a career service or applying for an
              opportunity does not create an employment relationship between you and Get Hired KE or
              Bermuda App Studios.
            </p>
            <p>
              Similarly, Get Hired KE does not become the employer of a user merely because it
              publishes or facilitates access to an employment opportunity.
            </p>
            <p>
              Any employment relationship resulting from an application is between the successful
              applicant and the relevant employer.
            </p>
          </PolicySection>

          <PolicySection id="changes-to-these-terms" title="20. Changes to These Terms">
            <p>We may update these Terms & Conditions from time to time to reflect:</p>
            <ul>
              <li>Changes to our services</li>
              <li>Changes to the website</li>
              <li>New features</li>
              <li>Changes in applicable law</li>
              <li>Changes in how the platform operates</li>
            </ul>
            <p>
              When changes are made, we will update the Last Updated date at the beginning of these
              Terms.
            </p>
            <p>Users should review this page periodically.</p>
          </PolicySection>

          <PolicySection id="suspension-or-termination" title="21. Suspension or Termination">
            <p>
              We may suspend, restrict or terminate access to parts of the website or our services
              where reasonably necessary, including where a user:
            </p>
            <ul>
              <li>Violates these Terms</li>
              <li>Misuses the website</li>
              <li>Engages in unlawful activity</li>
              <li>Attempts to compromise website security</li>
              <li>Abuses our services or community channels</li>
            </ul>
            <p>Where appropriate, we may also take other lawful action available to us.</p>
          </PolicySection>

          <PolicySection id="governing-law" title="22. Governing Law">
            <p>These Terms & Conditions are governed by the laws of Kenya.</p>
            <p>
              Any disputes arising in connection with these Terms or your use of Get Hired KE will
              be handled in accordance with applicable Kenyan law.
            </p>
            <p>
              Nothing in these Terms is intended to remove or restrict any rights or protections
              that cannot lawfully be excluded under applicable Kenyan law.
            </p>
          </PolicySection>

          <PolicySection id="contact-us" title="23. Contact Us">
            <p>
              If you have questions about these Terms & Conditions, our services or your use of the
              Get Hired KE platform, you can contact us through:
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <ContactLink
                href={emailHref}
                icon={Mail}
                label="Email"
                value="support@bermudaappstudios.online"
              />
              <ContactLink
                href={whatsappContactUrl}
                icon={MessageCircle}
                label="WhatsApp"
                value="0746 221 954"
                external
              />
              <ContactLink href={phoneHref} icon={Phone} label="Call" value="0746 221 954" />
            </div>
          </PolicySection>
        </article>
      </section>
    </>
  );
}

function PolicySection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-b border-border pb-10 last:border-b-0">
      <h2 className="font-heading text-2xl font-extrabold text-foreground">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-7 text-muted-foreground [&_h3]:pt-2 [&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground [&_li]:pl-1 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2">
        {children}
      </div>
    </section>
  );
}

function ContactLink({
  href,
  icon: Icon,
  label,
  value,
  external = false,
}: {
  href: string;
  icon: typeof Mail;
  label: string;
  value: string;
  external?: boolean;
}) {
  return (
    <Button asChild variant="secondary" className="h-auto justify-start px-4 py-3">
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        <Icon className="size-4" />
        <span className="text-left">
          <span className="block text-xs font-bold uppercase text-muted-foreground">{label}</span>
          <span className="block">{value}</span>
        </span>
      </a>
    </Button>
  );
}
