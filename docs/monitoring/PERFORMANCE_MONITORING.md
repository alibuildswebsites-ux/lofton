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

## 4. Performance Targets & Success Criteria

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

## 5. Troubleshooting

### Low Search Console Traffic
- **Check:** Is content ranking? (Search Console > Performance tab)
- **Fix:** Improve page titles/descriptions, add more internal links, expand content depth

### High LCP Score
- **Check:** Is hero image slow? (Use Chrome DevTools > Performance tab)
- **Fix:** Optimize image size, use WebP format, consider SVG/CSS alternative

### High CLS Score
- **Check:** Are images/fonts/ads causing layout shift? (Run Lighthouse audit)
- **Fix:** Add explicit width/height to images, avoid dynamic ad injection

### llms.txt Not Accessible
- **Check:** Is file accessible? `curl https://lofton-psi.vercel.app/llms.txt`
- **Fix:** Verify cache headers, ensure file is in public/ directory

---

## 6. Resources

- [Google Search Console Documentation](https://support.google.com/webmasters/answer/9128669)
- [PageSpeed Insights Guide](https://developers.google.com/speed/docs/insights/v5/about)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- [Web.dev Performance Learning Path](https://web.dev/performance/)

---

## 7. Quick Links

| Tool | URL |
|------|-----|
| Google Search Console | https://search.google.com/search-console/about |
| PageSpeed Insights | https://pagespeedonline.com |
| Google Mobile-Friendly Test | https://search.google.com/test/mobile-friendly |
| Rich Results Test | https://search.google.com/test/rich-results |
| Your Website | https://lofton-psi.vercel.app |
| Sitemap | https://lofton-psi.vercel.app/sitemap.xml |
| llms.txt | https://lofton-psi.vercel.app/llms.txt |

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
