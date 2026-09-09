# Get Hired KE Homepage and Job Details

## Goal
Create a polished, mobile-first job discovery experience for Get Hired KE with a spacious green-led visual system, Kenyan sample listings, prominent search, and a direct path to the WhatsApp channel.

## Pages and navigation
- Build a shared responsive header with the Get Hired KE name/brand treatment, Home, Categories dropdown, Services, Career Hub, About Us, Contact, and a “Join WhatsApp” action.
- Create the homepage at `/` and a reusable job details route at `/jobs/$jobId`.
- Make every homepage job card link to its matching details view.
- Add lightweight destination pages for the named top-level navigation items so every menu link works; these will use concise, relevant content rather than unfinished placeholders.
- On mobile, collapse navigation into an accessible menu while keeping search and the main WhatsApp action easy to reach.

## Homepage composition
1. Spacious introduction with one clear headline, short supporting copy, and the search bar front and center.
2. Search controls for keyword and location/category, plus a clear search action and useful empty/no-result feedback.
3. Featured jobs with gold/orange deadline and featured cues.
4. Latest jobs in a scannable card list.
5. Rounded category grid with consistent green icon treatment.
6. Short About Get Hired KE section focused on connecting Kenyan talent with opportunities.
7. Large final WhatsApp call to action linking to `https://www.whatsapp.com/channel/0029VbCy7ofFHWq30zTpFH2s`.
8. Compact footer with useful navigation and brand context.

## Job details page
- Show role title, employer, location, work type, deadline, and a clear featured/status label where relevant.
- Organize the description, responsibilities, requirements, and application guidance into readable sections.
- Keep a prominent “Apply now” button visible in the main content and in a mobile-friendly sticky action area.
- Include a back-to-jobs path and a small related-jobs section.
- Use safe sample destinations for demo applications and clearly identify the listings as sample content.

## Visual direction
- Use the uploaded graphics only as reference for the brand’s Kenyan opportunity focus; do not place either image directly on the site.
- Use green as the primary color, dark charcoal/navy text, white and light-gray surfaces, and restrained gold/orange highlights for deadlines and featured roles.
- Use Montserrat for headings and Inter for body text.
- Keep spacing generous, cards rounded but not oversized, icons green, borders subtle, and motion restrained with reduced-motion support.
- Preserve strong contrast, visible keyboard focus, semantic headings, useful labels, and descriptive link text.

## Content and behavior
- Seed a shared set of clearly labeled Kenyan demo jobs across several sectors, including enough detail to support search, category browsing, cards, and job details.
- Make keyword/category search and category selection work entirely in the page without requiring a data service.
- Add sensible loading-free interactions, dropdown behavior, mobile menu behavior, and accessible external-link handling for WhatsApp.

## Metadata and verification
- Add unique page titles, descriptions, Open Graph text, and social-card metadata for every content route.
- Replace the template title and placeholder homepage completely.
- Verify the homepage and job details at mobile and desktop sizes, including menu behavior, search results, route navigation, external WhatsApp links, text fit, and visible focus states.

## Technical notes
- Use TanStack Router links and a dynamic `/jobs/$jobId` route.
- Keep sample jobs in one typed source so homepage and detail pages stay consistent.
- Define all visual colors and typography as semantic tokens in the global design system; avoid hardcoded page colors.
- No database, login, or admin tools are included in this phase; listings remain curated demo content in the site code.
