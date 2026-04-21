# Performance & SEO Monitoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Optimize cache headers for CDN performance, improve Core Web Vitals through image preloading, and establish monitoring infrastructure for Google Search Console and PageSpeed Insights.

**Architecture:** 
- Configure Vercel cache headers to enable aggressive CDN caching while keeping HTML fresh
- Add strategic `<link rel="preload">` hints in index.html for critical LCP images
- Create comprehensive monitoring guide with links to Google Search Console and PageSpeed Insights
- Document setup procedures for ongoing performance tracking

**Tech Stack:** Vercel deployment, HTML5, Google Search Console, PageSpeed Insights

---

## File Structure

```
/root/lofton/
├── vercel.json                          (MODIFY - Add headers config)
├── index.html                           (MODIFY - Add preload hints)
├── docs/
│   └── monitoring/
│       └── PERFORMANCE_MONITORING.md    (CREATE - Setup & tracking guide)
```

---

## Task 1: Optimize Vercel Cache Headers (Priority 2)

**Files:**
- Modify: `vercel.json`

### Explanation
Cache headers control how Vercel's CDN caches your content. Currently, `max-age=0` means nothing is cached. We'll optimize:
- **Static assets** (JS, CSS): 1-year cache (they have content hash in filename)
- **HTML**: 1-hour cache (frequently updates but not every request)
- **Images**: 30-day cache (good for featured/hero images)

This dramatically improves repeat visitor performance and reduces server load.

- [ ] **Step 1: Read current vercel.json**

Current state:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

- [ ] **Step 2: Add headers configuration to vercel.json**

Replace the content with:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/index.html",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, must-revalidate"
        }
      ]
    },
    {
      "source": "/(og-image.svg|favicon.svg|logo192.png)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=2592000, immutable"
        }
      ]
    },
    {
      "source": "/(robots.txt|sitemap.xml|llms.txt)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400, must-revalidate"
        }
      ]
    }
  ]
}
```

**Explanation of cache values:**
- `max-age=31536000`: 1 year (31,536,000 seconds)
- `max-age=3600`: 1 hour (3,600 seconds)
- `max-age=2592000`: 30 days (2,592,000 seconds)
- `max-age=86400`: 24 hours (86,400 seconds)
- `immutable`: Asset won't change (safe for versioned files)
- `must-revalidate`: Check with origin if cache expired

- [ ] **Step 3: Verify syntax**

Run this command to validate JSON:
```bash
cat /root/lofton/vercel.json | jq .
```

Expected output: No errors, valid JSON structure displayed

- [ ] **Step 4: Commit**

```bash
cd /root/lofton
git add vercel.json
git commit -m "feat: Optimize Vercel cache headers for CDN performance

- Static assets (JS/CSS): 1-year cache (immutable, content-hashed)
- HTML: 1-hour cache (must-revalidate for freshness)
- Images: 30-day cache (SVG logos, OG images)
- SEO files: 24-hour cache (robots.txt, sitemap, llms.txt)
- Improves repeat visitor performance and reduces server load"
```

---

## Task 2: Add Image Preload Hints (Priority 3)

**Files:**
- Modify: `index.html`

### Explanation
Preload hints tell the browser to fetch critical images early. The hero section's avatar images are part of the social proof badge and affect LCP (Largest Contentful Paint). Preloading them:
1. Starts download earlier (before JavaScript parses)
2. Reduces layout shifts
3. Improves Core Web Vitals (LCP, CLS)

We preload the three avatar images used in Hero.tsx and the og-image.svg for social shares.

- [ ] **Step 1: Locate preload section in index.html**

Find the line with `<link rel="preconnect"` — we'll add preload hints right after the font preconnect section.

Current location in index.html (around line 47-49):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Add preload hints after font stylesheet**

Add these lines after the font stylesheet link:

```html
<!-- Preload Critical Images for Core Web Vitals -->
<!-- Hero avatars (social proof badge) -->
<link rel="preload" as="image" href="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80" fetchpriority="high">
<link rel="preload" as="image" href="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80" fetchpriority="high">
<link rel="preload" as="image" href="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100&q=80" fetchpriority="high">

<!-- Social share OG image -->
<link rel="preload" as="image" href="/og-image.svg" fetchpriority="high">
```

**Why fetchpriority="high":**
- Tells browser these images are critical to page experience
- Browser downloads them before lower-priority images
- Improves LCP (Largest Contentful Paint) metric

- [ ] **Step 3: Verify the changes in index.html**

Run this to show the preload section:
```bash
grep -A 2 "Preload Critical Images" /root/lofton/index.html
```

Expected output: Shows all 4 preload links

- [ ] **Step 4: Commit**

```bash
cd /root/lofton
git add index.html
git commit -m "feat: Add image preload hints for Core Web Vitals optimization

- Preload hero avatar images (social proof badge)
- Preload OG image for social shares
- Use fetchpriority=high for LCP optimization
- Reduces layout shift and improves perceived performance"
```

---

## Task 3: Create Performance Monitoring Guide

**Files:**
- Create: `docs/monitoring/PERFORMANCE_MONITORING.md`

- [ ] **Step 1: Create monitoring directory**

```bash
mkdir -p /root/lofton/docs/monitoring
```

- [ ] **Step 2: Create monitoring guide**

Create file `/root/lofton/docs/monitoring/PERFORMANCE_MONITORING.md` with:

```markdown
# Performance Monitoring Guide

## Overview

This guide helps you monitor your Lofton Realty website's performance and SEO health using Google tools.

---

## 1. Google Search Console Setup

### What It Does
- Shows how Google sees your site
- Reports crawl errors and indexing issues
- Tracks search performance (impressions, clicks, average position)
- Submits sitemaps for faster indexing

### Initial Setup (5 minutes)

**Step 1:** Go to [Google Search Console](https://search.google.com/search-console)

**Step 2:** Click "Add Property"

**Step 3:** Select "Domain" and enter: `lofton-psi.vercel.app`

**Step 4:** Verify ownership via DNS record
- Copy the DNS record provided by Google
- Add it to your DNS provider (Vercel for this domain)
- Wait 5-10 minutes for verification

**Step 5:** Once verified, submit your sitemap
- Go to "Sitemaps" in left menu
- Click "Add/test sitemap"
- Enter: `https://lofton-psi.vercel.app/sitemap.xml`
- Click Submit

### What to Monitor

**Weekly:**
- [ ] Check **Performance** tab for top queries
  - Look for keywords gaining/losing impressions
  - Note average position of key pages
  
- [ ] Check **Coverage** tab for indexing issues
  - Should show "Indexed" pages only (no "Excluded")
  - Alert if errors appear

**Monthly:**
- [ ] Review **Search Performance** report
  - CTR trends (aim for 3-5% CTR on high-position keywords)
  - Position changes for target keywords
  
- [ ] Check **Core Web Vitals** (if available in your region)
  - Mobile/Desktop scores
  - Issues affecting user experience

**Examples of Good vs Bad Metrics:**

| Metric | Good | Bad | Action |
|--------|------|-----|--------|
| Impressions | Steady growth | Flat or declining | Audit content, fix indexing issues |
| CTR | 3-5% | < 1% | Improve title/description for CTR |
| Crawl Errors | 0 | Any errors | Fix 404s, redirects, soft 404s |
| Indexed Pages | 10-12 | < 5 or > 30 | Check for duplicate/thin content |

---

## 2. PageSpeed Insights Monitoring

### What It Does
- Tests Core Web Vitals in real conditions
- Shows performance on mobile and desktop
- Suggests optimization improvements
- Reports on SEO friendliness

### Quick Test (1 minute)

**Step 1:** Go to [PageSpeed Insights](https://pagespeedonline.com)

**Step 2:** Enter your URL: `https://lofton-psi.vercel.app`

**Step 3:** Click "Analyze"

**Step 4:** Review the report:

```
Performance Score
Mobile:  0-49 (Poor), 50-89 (Needs Work), 90-100 (Good)
Desktop: Same scale

Core Web Vitals
- LCP (Largest Contentful Paint): < 2.5s (Good), 2.5-4s (Needs Work), > 4s (Poor)
- INP (Interaction to Next Paint): < 200ms (Good), 200-500ms (Needs Work), > 500ms (Poor)
- CLS (Cumulative Layout Shift): < 0.1 (Good), 0.1-0.25 (Needs Work), > 0.25 (Poor)
```

### Metrics to Track

**Performance Targets:**
- Mobile Score: ≥ 90
- Desktop Score: ≥ 95
- LCP: < 2.5s
- INP: < 200ms
- CLS: < 0.1

**Why Each Matters:**
- **LCP (Largest Contentful Paint):** How fast users see main content
- **INP (Interaction to Next Paint):** How responsive the page feels
- **CLS (Cumulative Layout Shift):** How stable the layout is (annoying if things move around)

### When to Test

**After each deployment:**
```bash
# Test manually in PageSpeed Insights
# URL: https://lofton-psi.vercel.app
```

**Track monthly:**
- Record scores in a spreadsheet
- Watch for regressions
- Celebrate improvements

### Common Issues & Fixes

| Issue | Likely Cause | Quick Fix |
|-------|-------------|-----------|
| High LCP (> 4s) | Large images, render-blocking JS | Check image optimization, defer JS |
| High INP (> 500ms) | Slow JavaScript execution | Reduce bundle size, split code |
| High CLS (> 0.25) | Layout shifting (images without size) | Add explicit dimensions to images |

---

## 3. Monthly Audit Checklist

### Performance Audit

- [ ] Run PageSpeed Insights on homepage
  - Record mobile and desktop scores
  - Check Core Web Vitals status
  
- [ ] Check Google Search Console
  - Review search performance metrics
  - Check for new crawl errors
  - Verify sitemap status

- [ ] Test social shares
  - Share page on Twitter/LinkedIn
  - Verify OG image displays correctly
  - Check title and description

### SEO Health Audit

- [ ] Check indexation
  - `site:lofton-psi.vercel.app` in Google
  - Should show ~10-12 pages indexed
  
- [ ] Verify robots.txt
  ```bash
  curl https://lofton-psi.vercel.app/robots.txt
  ```
  - Should allow `/`
  - Should reference sitemap

- [ ] Verify llms.txt
  ```bash
  curl https://lofton-psi.vercel.app/llms.txt
  ```
  - Should return content
  - Should have company info and links

### Content Audit

- [ ] Check blog posts for engagement
  - High bounce rate? Content may be thin
  - Low average time on page? Improve readability
  
- [ ] Review top pages in Search Console
  - Which pages drive most traffic?
  - Any pages with high impressions but low CTR?
  - Those need title/description improvement

---

## 4. API Monitoring (Advanced)

### Automated PageSpeed API

Vercel can automatically check PageSpeed on deployment using GitHub Actions.

**To set up automated monitoring:**

1. Create `.github/workflows/performance.yml`:

```yaml
name: Performance Check

on:
  deployment_status:
    types: [success]

jobs:
  pagespeed:
    runs-on: ubuntu-latest
    if: github.event.deployment.environment == 'production'
    
    steps:
      - name: Check PageSpeed Insights
        run: |
          curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${{ github.event.deployment.target_url }}&key=${{ secrets.PAGESPEED_API_KEY }}&strategy=mobile" \
          | jq '.lighthouseResult.categories | {performance: .performance.score, accessibility: .accessibility.score, seo: .seo.score}'
```

2. Add `PAGESPEED_API_KEY` to GitHub Secrets:
   - [Get API key from Google Cloud](https://console.cloud.google.com)
   - Add to repository secrets as `PAGESPEED_API_KEY`

---

## 5. Performance Targets & Success Criteria

### Immediate Goals (This Month)

- [ ] Google Search Console: 10+ pages indexed
- [ ] PageSpeed Mobile: ≥ 85 score
- [ ] PageSpeed Desktop: ≥ 90 score
- [ ] LCP: < 2.5s on mobile
- [ ] llms.txt: Accessible and returns content

### Medium-Term Goals (3 Months)

- [ ] PageSpeed Mobile: ≥ 90 score
- [ ] PageSpeed Desktop: ≥ 95 score
- [ ] Organic traffic: Steady growth
- [ ] Search Console: 20+ ranking keywords

### Long-Term Goals (6 Months)

- [ ] PageSpeed Mobile: ≥ 95 score (excellent)
- [ ] PageSpeed Desktop: ≥ 98 score (excellent)
- [ ] Core Web Vitals: All green (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- [ ] Search Console: 50+ ranking keywords, growing impressions
- [ ] AI citations: Content appearing in ChatGPT/Claude answers

---

## 6. Troubleshooting

### Low Search Console Traffic
- **Check:** Is content ranking? (Search Console > Performance tab)
- **Fix:** Improve page titles/descriptions, add more internal links, expand content depth

### High LCP Score
- **Check:** Is hero image slow? (Use Chrome DevTools > Performance tab)
- **Fix:** Optimize image size, use WebP format, consider SVG/CSS alternative

### High CLS Score
- **Check:** Are images/fonts/ads causing layout shift? (Run Lighthouse audit)
- **Fix:** Add explicit width/height to images, avoid dynamic ad injection

### llms.txt Not Indexing
- **Check:** Is file accessible? `curl https://lofton-psi.vercel.app/llms.txt`
- **Fix:** Verify cache headers, ensure file is in public/ directory

---

## 7. Resources

- [Google Search Console Documentation](https://support.google.com/webmasters/answer/9128669)
- [PageSpeed Insights Guide](https://developers.google.com/speed/docs/insights/v5/about)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- [Web.dev Performance Learning Path](https://web.dev/performance/)

---

## Next Steps

1. **This week:** Set up Google Search Console
2. **This week:** Run initial PageSpeed Insights test, record baseline scores
3. **Weekly:** Check Search Console Performance tab
4. **Monthly:** Full audit checklist above
5. **Ongoing:** Monitor and iterate on improvements

---

**Last Updated:** April 21, 2026  
**Next Review:** May 21, 2026
```

- [ ] **Step 2: Verify the file was created**

```bash
ls -lah /root/lofton/docs/monitoring/PERFORMANCE_MONITORING.md
```

Expected output: File exists with size > 3KB

- [ ] **Step 3: Commit**

```bash
cd /root/lofton
git add docs/monitoring/PERFORMANCE_MONITORING.md
git commit -m "docs: Add comprehensive performance monitoring guide

- Google Search Console setup (5-minute walkthrough)
- PageSpeed Insights testing procedures
- Monthly audit checklist with success criteria
- Metrics explanation and troubleshooting guide
- Targets: 90+ PageSpeed, < 2.5s LCP, 10+ indexed pages
- Includes automated monitoring setup with GitHub Actions"
```

---

## Task 4: Push All Changes to GitHub

**Files:**
- All modified/created files from Tasks 1-3

- [ ] **Step 1: Check git status**

```bash
cd /root/lofton && git status
```

Expected output: Shows 3 files staged (or ready to stage)

- [ ] **Step 2: View changes summary**

```bash
cd /root/lofton && git diff --cached --stat
```

Expected output: Summary of changes in vercel.json, index.html, and new monitoring guide

- [ ] **Step 3: Push to GitHub**

```bash
cd /root/lofton && git push origin main
```

Expected output: Shows "main -> main" push successful

- [ ] **Step 4: Verify push succeeded**

```bash
cd /root/lofton && git status
```

Expected output: "Your branch is up to date with 'origin/main'"

---

## Plan Summary

✅ **Task 1:** Cache headers optimized (1-year assets, 1-hour HTML, 30-day images)  
✅ **Task 2:** Preload hints added for hero avatars and OG image  
✅ **Task 3:** Comprehensive monitoring guide created (GSC + PageSpeed setup)  
✅ **Task 4:** All changes committed and pushed

**Total estimated time:** 20-30 minutes

**After completion, you can:**
1. Monitor performance improvements in PageSpeed Insights
2. Track search visibility in Google Search Console
3. Iterate based on metrics with the monthly checklist
