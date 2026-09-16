import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Get Hired KE" },
      {
        name: "description",
        content:
          "Learn how Get Hired KE collects, uses, protects and handles personal information across our website, career resources and services.",
      },
      { property: "og:title", content: "Privacy Policy | Get Hired KE" },
      {
        property: "og:description",
        content:
          "Learn how Get Hired KE collects, uses, protects and handles personal information across our website, career resources and services.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/privacy-policy" }],
  }),
  component: PrivacyPolicy,
});

const whatsappContactUrl = "https://wa.me/254746221954";
const phoneHref = "tel:+254746221954";
const emailHref = "mailto:support@bermudaappstudios.online";

const navItems = [
  { href: "#introduction", label: "Introduction" },
  { href: "#information-we-may-collect", label: "Information We May Collect" },
  { href: "#how-we-use-your-information", label: "How We Use Your Information" },
  { href: "#cvs-and-career-documents", label: "CVs and Career Documents" },
  { href: "#contact-forms-and-enquiries", label: "Contact Forms and Enquiries" },
  { href: "#career-services", label: "Career Services" },
  { href: "#whatsapp-and-external-platforms", label: "WhatsApp and External Platforms" },
  {
    href: "#job-listings-and-external-applications",
    label: "Job Listings and External Applications",
  },
  { href: "#cookies-and-similar-technologies", label: "Cookies and Similar Technologies" },
  { href: "#how-we-share-personal-information", label: "How We Share Personal Information" },
  { href: "#data-security", label: "Data Security" },
  {
    href: "#how-long-we-keep-personal-information",
    label: "How Long We Keep Personal Information",
  },
  { href: "#your-data-protection-rights", label: "Your Data Protection Rights" },
  { href: "#children-and-minors", label: "Children and Minors" },
  { href: "#third-party-links", label: "Third-Party Links" },
  { href: "#international-data-transfers", label: "International Data Transfers" },
  { href: "#changes-to-this-privacy-policy", label: "Changes to This Privacy Policy" },
  { href: "#contact-us", label: "Contact Us" },
] as const;

function PrivacyPolicy() {
  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Legal</p>
          <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            How Get Hired KE collects, uses, protects and handles your personal information.
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
              Get Hired KE is a career platform designed to help people discover job opportunities,
              internships, scholarships and other career opportunities, while also providing
              practical career resources, career guidance and professional career services.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, store, protect and otherwise process
              personal information when you use the Get Hired KE website, access our career
              resources, contact us, join our community or request our career services.
            </p>
            <p>Get Hired KE is operated by Bermuda App Studios.</p>
            <p>
              By using our website or voluntarily providing personal information to us, you
              acknowledge the practices described in this Privacy Policy.
            </p>
          </PolicySection>

          <PolicySection id="information-we-may-collect" title="2. Information We May Collect">
            <p>
              Depending on how you interact with Get Hired KE, we may collect information such as:
            </p>
            <h3>Information you provide directly</h3>
            <p>This may include:</p>
            <ul>
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Information provided through our contact forms</li>
              <li>Information provided when requesting career services</li>
              <li>CVs, resumes, cover letters and other career documents you voluntarily submit</li>
              <li>
                Information about your education, qualifications, skills and work experience where
                you provide it for a career service
              </li>
              <li>Messages and other information you voluntarily send to us</li>
            </ul>
            <p>
              We only request information that is relevant to the particular interaction or service.
            </p>
            <h3>Information collected when you use the website</h3>
            <p>
              Depending on the website features and technologies in use, we may collect technical
              information such as:
            </p>
            <ul>
              <li>IP address</li>
              <li>Browser type</li>
              <li>Device type</li>
              <li>Operating system</li>
              <li>Pages visited</li>
              <li>Referring pages</li>
              <li>General usage information</li>
              <li>Date and time of visits</li>
            </ul>
            <p>
              This information may help us maintain website security, understand how the website is
              used and improve the user experience.
            </p>
          </PolicySection>

          <PolicySection id="how-we-use-your-information" title="3. How We Use Your Information">
            <p>We may use personal information for purposes including:</p>
            <ul>
              <li>Responding to enquiries and messages</li>
              <li>Providing requested career services</li>
              <li>Preparing or improving CVs, cover letters and other career documents</li>
              <li>Providing interview or career guidance</li>
              <li>Communicating with you about a service you have requested</li>
              <li>Maintaining and improving the Get Hired KE website</li>
              <li>Providing access to career resources</li>
              <li>Protecting the website against misuse, fraud or security threats</li>
              <li>Meeting applicable legal or regulatory obligations</li>
              <li>Communicating important information relating to our services</li>
            </ul>
            <p>
              We do not use personal information for purposes that are incompatible with the purpose
              for which it was collected without an appropriate legal basis or other authorization
              required by applicable law.
            </p>
          </PolicySection>

          <PolicySection id="cvs-and-career-documents" title="4. CVs and Career Documents">
            <p>
              Get Hired KE may receive CVs, resumes, cover letters and other career-related
              documents when users voluntarily submit them for our professional services.
            </p>
            <p>
              These documents may contain personal information such as employment history,
              education, contact details, qualifications and other information included by the user.
            </p>
            <p>We use such information primarily to provide the requested career service.</p>
            <p>
              We do not publish a user's CV or personal career documents publicly without
              appropriate authorization.
            </p>
            <p>
              Users should avoid submitting unnecessary sensitive personal information in their CVs
              or other documents.
            </p>
          </PolicySection>

          <PolicySection id="contact-forms-and-enquiries" title="5. Contact Forms and Enquiries">
            <p>
              When you submit information through a Get Hired KE contact form, we use the
              information provided to respond to your enquiry or provide the service or assistance
              requested.
            </p>
            <p>
              Please do not submit passwords, financial account credentials, identity documents or
              other highly sensitive information through a general contact form unless we
              specifically request it through an appropriate and secure process.
            </p>
          </PolicySection>

          <PolicySection id="career-services" title="6. Career Services">
            <p>
              If you request a paid career service from Get Hired KE, we may collect additional
              information necessary to provide that service.
            </p>
            <p>Depending on the service, this may include:</p>
            <ul>
              <li>Career history</li>
              <li>Education and qualifications</li>
              <li>Skills</li>
              <li>Target roles</li>
              <li>Employment preferences</li>
              <li>Existing CVs</li>
              <li>Cover-letter information</li>
              <li>LinkedIn profile information</li>
              <li>Interview or career-preparation information</li>
            </ul>
            <p>We use this information to deliver and improve the specific service requested.</p>
          </PolicySection>

          <PolicySection
            id="whatsapp-and-external-platforms"
            title="7. WhatsApp and External Platforms"
          >
            <p>
              Get Hired KE uses platforms such as WhatsApp and may link to LinkedIn, employer
              websites, government portals, job platforms and other third-party websites.
            </p>
            <p>
              When you interact directly with those platforms, your information may be processed
              according to their own privacy policies and terms.
            </p>
            <p>Get Hired KE does not control the privacy practices of third-party platforms.</p>
            <p>
              You should review the relevant third party's privacy policy before providing personal
              information through an external platform.
            </p>
          </PolicySection>

          <PolicySection
            id="job-listings-and-external-applications"
            title="8. Job Listings and External Applications"
          >
            <p>
              Get Hired KE shares job and opportunity information obtained from sources such as
              employer websites, LinkedIn, government portals, NGO websites and other reputable job
              platforms.
            </p>
            <p>
              Where an opportunity directs you to an external website to apply, any information you
              provide through that external application is handled by the relevant organization or
              platform according to its own policies.
            </p>
            <p>
              Get Hired KE does not control how an external employer or application platform
              processes information submitted directly to them.
            </p>
          </PolicySection>

          <PolicySection
            id="cookies-and-similar-technologies"
            title="9. Cookies and Similar Technologies"
          >
            <p>
              The Get Hired KE website may use cookies or similar technologies where necessary for
              website functionality, security, analytics or improving the user experience.
            </p>
            <p>
              Cookies may allow the website to remember certain information or understand how
              visitors interact with different parts of the website.
            </p>
            <p>
              Where required by applicable law, appropriate information or choices regarding
              non-essential cookies will be provided.
            </p>
          </PolicySection>

          <PolicySection
            id="how-we-share-personal-information"
            title="10. How We Share Personal Information"
          >
            <p>We do not sell users' personal information.</p>
            <p>
              We may disclose or provide access to personal information where reasonably necessary
              for purposes such as:
            </p>
            <ul>
              <li>Providing a service requested by the user</li>
              <li>Using service providers that help us operate the website or deliver services</li>
              <li>Maintaining website security and functionality</li>
              <li>Complying with legal obligations</li>
              <li>Responding to lawful requests from competent authorities</li>
              <li>Protecting our rights, users or the security of our services</li>
            </ul>
            <p>
              Where third-party service providers process personal information on our behalf, we
              seek to use appropriate safeguards consistent with applicable data-protection
              requirements.
            </p>
          </PolicySection>

          <PolicySection id="data-security" title="11. Data Security">
            <p>
              We take reasonable technical and organizational measures to protect personal
              information against unauthorized access, loss, misuse, alteration or disclosure.
            </p>
            <p>
              However, no online system or method of electronic transmission can be guaranteed to be
              completely secure.
            </p>
            <p>
              Users should also take reasonable steps to protect their own accounts, devices,
              passwords and personal information.
            </p>
          </PolicySection>

          <PolicySection
            id="how-long-we-keep-personal-information"
            title="12. How Long We Keep Personal Information"
          >
            <p>
              We retain personal information only for as long as reasonably necessary for the
              purpose for which it was collected, to provide requested services, to meet legal or
              regulatory obligations, to resolve disputes, or for other legitimate purposes.
            </p>
            <p>
              Retention periods may vary depending on the type of information and the reason it was
              collected.
            </p>
            <p>
              Where personal information is no longer required, we may securely delete, anonymize or
              otherwise dispose of it in accordance with applicable requirements.
            </p>
          </PolicySection>

          <PolicySection id="your-data-protection-rights" title="13. Your Data Protection Rights">
            <p>
              Subject to applicable law, you may have rights relating to your personal information,
              including the right to:
            </p>
            <ul>
              <li>Be informed about how your personal information is being used</li>
              <li>Request access to personal information we hold about you</li>
              <li>Request correction of inaccurate or misleading information</li>
              <li>Request deletion of personal information in appropriate circumstances</li>
              <li>Object to certain processing of your personal information</li>
              <li>Request restriction of processing in appropriate circumstances</li>
              <li>Request portability of your personal information where applicable</li>
            </ul>
            <p>
              To exercise a privacy-related right, contact us using the details in the Contact Us
              section below.
            </p>
          </PolicySection>

          <PolicySection id="children-and-minors" title="14. Children and Minors">
            <p>
              Get Hired KE is primarily intended for people seeking employment, career opportunities
              and career development.
            </p>
            <p>
              We do not knowingly collect personal information from children for purposes unrelated
              to the services we provide.
            </p>
            <p>
              If you believe that a child has provided personal information to us without
              appropriate authorization, please contact us so that we can review the matter and take
              appropriate action.
            </p>
          </PolicySection>

          <PolicySection id="third-party-links" title="15. Third-Party Links">
            <p>The Get Hired KE website may contain links to third-party websites, including:</p>
            <ul>
              <li>Employer websites</li>
              <li>Government websites</li>
              <li>Job platforms</li>
              <li>LinkedIn</li>
              <li>WhatsApp</li>
              <li>NGO websites</li>
              <li>Other career-related resources</li>
            </ul>
            <p>These links are provided to help users access opportunities and resources.</p>
            <p>
              We are not responsible for the privacy practices, security, content or policies of
              third-party websites.
            </p>
            <p>
              We encourage users to review the privacy policy and terms of any external website
              before submitting personal information.
            </p>
          </PolicySection>

          <PolicySection id="international-data-transfers" title="16. International Data Transfers">
            <p>
              Some technology providers or service providers used to operate online services may
              process information outside Kenya.
            </p>
            <p>
              Where personal information is transferred outside Kenya, we will take steps required
              by applicable Kenyan data-protection law, including ensuring appropriate safeguards or
              relying on another lawful basis where applicable.
            </p>
          </PolicySection>

          <PolicySection
            id="changes-to-this-privacy-policy"
            title="17. Changes to This Privacy Policy"
          >
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our
              services, website features, technology or applicable legal requirements.
            </p>
            <p>
              When we make changes, we will update the Last Updated date at the beginning of this
              policy.
            </p>
            <p>We encourage users to review this page periodically.</p>
          </PolicySection>

          <PolicySection id="contact-us" title="18. Contact Us">
            <p>
              If you have questions about this Privacy Policy, want to exercise a data-protection
              right, or have a concern about how your personal information is handled, you can
              contact Get Hired KE through:
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
            <p>
              You may also have the right to lodge a complaint with the Office of the Data
              Protection Commissioner (ODPC) where you believe your data-protection rights have been
              infringed.
            </p>
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
