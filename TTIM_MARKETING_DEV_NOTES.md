# TTIM Marketing — Developer Amendment Notes
**Site:** https://ttimmarketing.com
**Audit Date:** April 17, 2026
**SEO Health Score:** 32 / 100

These notes are based on a full SEO audit. Fixes are grouped by priority.
Complete Critical items first — they have the biggest impact on search visibility.

---

## CRITICAL — Fix Immediately

### 1. Fix robots.txt (returning 503 error)
The server returns a 503 on `/robots.txt`. Create the file at the web root:

```
User-agent: *
Allow: /

Sitemap: https://ttimmarketing.com/sitemap.xml
```

> File location: `/public/robots.txt` (or web root depending on your stack)

---

### 2. Create XML Sitemap
`/sitemap.xml` currently returns 404. Create it listing all indexable pages:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://ttimmarketing.com/</loc><lastmod>2026-04-17</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>
  <url><loc>https://ttimmarketing.com/about/</loc><lastmod>2026-04-17</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://ttimmarketing.com/social-media-marketing/</loc><lastmod>2026-04-17</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://ttimmarketing.com/google-marketing/</loc><lastmod>2026-04-17</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://ttimmarketing.com/integrated-marketing/</loc><lastmod>2026-04-17</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://ttimmarketing.com/gamification-marketing/</loc><lastmod>2026-04-17</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://ttimmarketing.com/3rs-marketing/</loc><lastmod>2026-04-17</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://ttimmarketing.com/career/</loc><lastmod>2026-04-17</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>https://ttimmarketing.com/support/</loc><lastmod>2026-04-17</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
</urlset>
```

After deploying, submit to [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters).

---

### 3. Add Title Tags to Every Page
Currently most pages have no `<title>` tag. Add unique titles to each page's `<head>`:

| Page | Title Tag (copy exactly) |
|---|---|
| Homepage | `Digital Marketing Agency Malaysia \| Social Media & Google Marketing — TTIM Marketing` |
| About | `About TTIM Marketing \| Digital Agency Kuala Lumpur` |
| Social Media Marketing | `Social Media Marketing Agency Malaysia \| Content & Ads — TTIM Marketing` |
| Google Marketing | `Google Marketing Agency Malaysia \| SEO, SEM & YouTube — TTIM Marketing` |
| Integrated Marketing | `Integrated Marketing Agency Malaysia \| Full-Service Solutions — TTIM Marketing` |
| Gamification Marketing | `Gamification Marketing Malaysia \| Engage & Convert — TTIM Marketing` |
| 3Rs Marketing | `3Rs Marketing Malaysia \| Retention, Referral, Revenue — TTIM Marketing` |
| Career | `Careers at TTIM Marketing \| Join Our Team in Kuala Lumpur` |
| Support | `Contact & Support \| TTIM Marketing Malaysia` |

> Keep all titles between 50–60 characters.

---

### 4. Add Meta Descriptions to Every Page
Zero meta descriptions exist. Add to each page's `<head>`:

```html
<!-- Homepage -->
<meta name="description" content="TTIM Marketing is Malaysia's full-service digital marketing agency offering social media, Google SEO/SEM, and gamification marketing. Based in Kuala Lumpur. Get started today.">

<!-- Social Media Marketing -->
<meta name="description" content="Grow your brand with TTIM Marketing's social media marketing services in Malaysia. Content creation, paid ads, and community management. Based in KL.">

<!-- Google Marketing -->
<meta name="description" content="Drive leads with TTIM Marketing's Google marketing services — SEO, Google Ads, and YouTube campaigns for Malaysian businesses. Get a free consultation.">

<!-- Integrated Marketing -->
<meta name="description" content="TTIM Marketing delivers integrated marketing strategies that combine digital and traditional channels for Malaysian brands. Full-service agency in Kuala Lumpur.">

<!-- Gamification Marketing -->
<meta name="description" content="Boost engagement with gamification marketing from TTIM Marketing. Loyalty programs, interactive campaigns, and game mechanics for Malaysian brands.">

<!-- 3Rs Marketing -->
<meta name="description" content="TTIM Marketing's 3Rs approach focuses on Retention, Referral, and Revenue to grow your business sustainably. Malaysia's specialist 3Rs marketing agency.">

<!-- About -->
<meta name="description" content="Learn about TTIM Marketing — a Kuala Lumpur digital marketing agency with expertise in social media, Google, gamification, and integrated marketing.">

<!-- Career -->
<meta name="description" content="Join the TTIM Marketing team in Kuala Lumpur. We're looking for passionate digital marketers to grow with us.">

<!-- Support -->
<meta name="description" content="Get in touch with TTIM Marketing. Contact our team in Kuala Lumpur for support, enquiries, or to start a project.">
```

> Keep all descriptions between 140–160 characters.

---

### 5. Fix Conflicting Business Addresses (NAP Inconsistency)
Two different addresses appear on the site — this breaks local SEO:

- **Support page:** Level 23, Menara Exchange 106, Lingkaran TRX, 55188 KL
- **Privacy policy:** Level 7, Residensi Tribeca No 215, Jalan Imbi, 55100 KL

**Action:** Decide on ONE correct address and update ALL pages + Google Business Profile to match.

---

## HIGH — Fix Within 1 Week

### 6. Add JSON-LD Schema to Homepage
Add this inside a `<script type="application/ld+json">` tag in the homepage `<head>`:

```json
{
  "@context": "https://schema.org",
  "@type": "MarketingAgency",
  "name": "TTIM Marketing Sdn Bhd",
  "url": "https://ttimmarketing.com",
  "logo": "https://ttimmarketing.com/assets/images/logo.png",
  "email": "admin@ttimmarketing.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Level 23, Menara Exchange 106, Lingkaran TRX",
    "addressLocality": "Kuala Lumpur",
    "postalCode": "55188",
    "addressCountry": "MY"
  },
  "areaServed": "Malaysia",
  "sameAs": [
    "https://www.facebook.com/ttimmarketing",
    "https://www.instagram.com/ttimmarketing",
    "https://www.linkedin.com/company/ttimmarketing"
  ]
}
```

> Use the ONE address you decided on in fix #5.

---

### 7. Add Service Schema to Each Service Page
Add to each service page's `<head>` (example for Social Media Marketing):

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Social Media Marketing",
  "provider": {
    "@type": "MarketingAgency",
    "name": "TTIM Marketing",
    "url": "https://ttimmarketing.com"
  },
  "areaServed": "Malaysia",
  "url": "https://ttimmarketing.com/social-media-marketing/"
}
```

Repeat for all 5 service pages with the correct `name` and `url`.

---

### 8. Rewrite H1 Tags — Replace Slogans with Keywords
Current H1s are brand slogans. Replace with keyword-targeted headings:

| Page | Current H1 | Replace With |
|---|---|---|
| Homepage | `SIMPLIFY MARKETING & ACCELERATE GROWTH` | `Digital Marketing Agency in Kuala Lumpur, Malaysia` |
| Social Media | `EVERYTHING IS DIGITALIZED NOW.` | `Social Media Marketing Agency in Malaysia` |
| Google Marketing | `RANK HIGHER. REACH FURTHER.` | `Google Marketing Services in Malaysia — SEO, SEM & YouTube` |
| Integrated | `ONE STRATEGY. MULTIPLE CHANNELS.` | `Integrated Marketing Agency Malaysia` |
| Gamification | `WHO DOENS'T LOVE GAMES?` | `Gamification Marketing Malaysia` |
| 3Rs | `RETAIN. REFER. REVENUE.` | `3Rs Marketing Strategy for Malaysian Businesses` |

> You can keep the slogans as H2 subheadings below the new H1.

---

### 9. Fix Typo on Gamification Page
In the current H1: **"WHO DOENS'T LOVE GAMES?"** — correct to **"WHO DOESN'T LOVE GAMES?"**

---

### 10. Fix Logo Alt Text
The logo image has no alt text:

```html
<!-- Change from -->
<img src="/assets/images/logo.png">

<!-- Change to -->
<img src="/assets/images/logo.png" alt="TTIM Marketing - Digital Marketing Agency Malaysia">
```

---

### 11. Add Canonical Tags to All Pages
Add to every page's `<head>` to prevent duplicate content issues:

```html
<!-- Homepage -->
<link rel="canonical" href="https://ttimmarketing.com/">

<!-- Service pages — use the correct URL for each -->
<link rel="canonical" href="https://ttimmarketing.com/social-media-marketing/">
<link rel="canonical" href="https://ttimmarketing.com/google-marketing/">
<!-- etc. -->
```

---

### 12. Add Open Graph + Twitter Card Tags
Add to every page's `<head>` for social sharing previews:

```html
<!-- Open Graph (Facebook, LinkedIn, WhatsApp) -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://ttimmarketing.com/">
<meta property="og:title" content="Digital Marketing Agency Malaysia | TTIM Marketing">
<meta property="og:description" content="Malaysia's full-service digital marketing agency. Social media, Google SEO/SEM, and gamification marketing. Based in Kuala Lumpur.">
<meta property="og:image" content="https://ttimmarketing.com/assets/images/og-image.jpg">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Digital Marketing Agency Malaysia | TTIM Marketing">
<meta name="twitter:description" content="Malaysia's full-service digital marketing agency. Based in Kuala Lumpur.">
<meta name="twitter:image" content="https://ttimmarketing.com/assets/images/og-image.jpg">
```

> Create a dedicated OG image (1200×630px) at `/assets/images/og-image.jpg`.

---

## MEDIUM — Fix Within 1 Month

### 13. Add `lang` Attribute to HTML Tag

```html
<!-- Change from -->
<html>

<!-- Change to -->
<html lang="en-MY">
```

---

### 14. Convert Images to WebP Format
All images are currently PNG. Convert to WebP for 25–40% smaller file sizes:

- Use [Squoosh](https://squoosh.app) or `cwebp` CLI to convert
- Replace `.png` extensions with `.webp` in all HTML references
- Add `width` and `height` attributes to every `<img>` tag to prevent layout shift

```html
<!-- Example -->
<img src="/assets/images/social-media-marketing.webp" 
     alt="Social Media Marketing" 
     width="800" height="600">
```

---

### 15. Add Lazy Loading to Below-Fold Images

```html
<!-- Add loading="lazy" to any image not visible on first load -->
<img src="/assets/images/3r-marketing.webp" alt="3Rs Marketing" loading="lazy" width="800" height="600">
```

> Do NOT add `loading="lazy"` to the logo or hero image — those need to load immediately.

---

### 16. Update Copyright Year in Footer

```html
<!-- Change from -->
<p>© 2022 TTIM Marketing</p>

<!-- Change to -->
<p>© 2026 TTIM Marketing</p>
```

Or use dynamic year with JavaScript:
```html
<p>© <span id="year"></span> TTIM Marketing</p>
<script>document.getElementById('year').textContent = new Date().getFullYear();</script>
```

---

### 17. Fix CTA Image Alt Text

```html
<!-- Change from -->
<img src="/assets/images/cta.png" alt="CTA">

<!-- Change to -->
<img src="/assets/images/cta.webp" alt="Start your digital marketing journey with TTIM Marketing">
```

---

### 18. Add hreflang Tag for Malaysian Market

```html
<link rel="alternate" hreflang="en-MY" href="https://ttimmarketing.com/">
<link rel="alternate" hreflang="x-default" href="https://ttimmarketing.com/">
```

---

## LOW — Backlog

### 19. Create `/llms.txt` for AI Search Visibility
Create a plain text file at `https://ttimmarketing.com/llms.txt`:

```
# TTIM Marketing

TTIM Marketing Sdn Bhd is a full-service digital marketing agency based in Kuala Lumpur, Malaysia.

## Services
- Social Media Marketing
- Google Marketing (SEO, SEM, YouTube)
- Integrated Marketing
- Gamification Marketing
- 3Rs Marketing (Retention, Referral, Revenue)

## Contact
Email: admin@ttimmarketing.com
Location: Kuala Lumpur, Malaysia
Website: https://ttimmarketing.com
```

---

### 20. Add Breadcrumb Navigation + Schema
Add visible breadcrumbs on all inner pages:

```html
<!-- Example on Social Media Marketing page -->
<nav aria-label="breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li>Social Media Marketing</li>
  </ol>
</nav>
```

With JSON-LD:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ttimmarketing.com/" },
    { "@type": "ListItem", "position": 2, "name": "Social Media Marketing", "item": "https://ttimmarketing.com/social-media-marketing/" }
  ]
}
```

---

## Content Expansion Checklist (Per Service Page)

Each service page should reach a minimum of **1,000 words**. Use this structure:

- [ ] Keyword-targeted H1 (see fix #8)
- [ ] 2–3 paragraph introduction explaining the service
- [ ] "How It Works" section with 3–5 steps
- [ ] "Who It's For" section (target industries/business sizes)
- [ ] Benefits section (3–6 bullet points with measurable outcomes)
- [ ] 1 case study or client result with real numbers
- [ ] 4–6 FAQ questions and answers
- [ ] Call-to-action with contact link

---

## Quick Summary Checklist

| # | Fix | Priority | Done? |
|---|---|---|---|
| 1 | Fix robots.txt (503 error) | Critical | [ ] |
| 2 | Create XML sitemap | Critical | [ ] |
| 3 | Add title tags to all pages | Critical | [ ] |
| 4 | Add meta descriptions to all pages | Critical | [ ] |
| 5 | Fix conflicting business addresses | Critical | [ ] |
| 6 | Add Organization JSON-LD schema | High | [ ] |
| 7 | Add Service schema to service pages | High | [ ] |
| 8 | Rewrite H1 tags with keywords | High | [ ] |
| 9 | Fix gamification page H1 typo | High | [ ] |
| 10 | Fix logo alt text | High | [ ] |
| 11 | Add canonical tags | High | [ ] |
| 12 | Add Open Graph + Twitter Card tags | High | [ ] |
| 13 | Add `lang="en-MY"` to HTML tag | Medium | [ ] |
| 14 | Convert PNG images to WebP | Medium | [ ] |
| 15 | Add lazy loading to images | Medium | [ ] |
| 16 | Update copyright year to 2026 | Medium | [ ] |
| 17 | Fix CTA image alt text | Medium | [ ] |
| 18 | Add hreflang tags | Medium | [ ] |
| 19 | Create /llms.txt | Low | [ ] |
| 20 | Add breadcrumb nav + schema | Low | [ ] |

---

*Generated from SEO audit conducted April 17, 2026. Questions? Share this file with your developer.*
