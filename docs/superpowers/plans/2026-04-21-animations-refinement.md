# Animation Refinement & Optimization - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine and optimize all website animations with standardized easing, timing, performance optimizations, and correct animation logic across 9 components.

**Architecture:** Audit all animations across the website, apply standardized GSAP easing (power2.out primary), establish consistent timing (0.7s entrance, 0.12s stagger), ensure GPU acceleration with `will-change`, verify `prefers-reduced-motion` respect, and fix any animation logic issues.

**Tech Stack:** GSAP 3.14.2, React 18.3, TypeScript 5.7, Framer Motion 11.15

---

## Animation Standards Reference

### Timing Standards
- **Entrance/Reveal Duration:** 0.7s
- **Stagger Gap:** 0.12s between items
- **Interactive (hover/click):** 0.3-0.4s
- **Parallax:** Scrub-based (scrub: 1)

### Easing Standards
- **Entrance/Reveal:** `power2.out` (smooth deceleration)
- **Interactive:** `back.out` (snappy feedback with slight overshoot)
- **Parallax:** `none` (for scroll-linking precision)

### Performance & Accessibility
- All animated elements: `will-change: transform` or `will-change: opacity`
- Animations only target transform/opacity (GPU-accelerated properties)
- `prefers-reduced-motion: reduce` → All animations disabled
- Cleanup: `mm.revert()` in useGSAP hook

---

## File Structure

### Components to Audit & Refine (9 files)

1. `components/LocationsSection.tsx` - Horizontal parallax (already optimized)
2. `components/BuyerGuide.tsx` - Card reveals, parallax
3. `components/SellerGuide.tsx` - Card reveals, parallax
4. `components/AboutPage.tsx` - Card reveals, parallax
5. `components/FeaturedProperties.tsx` - Card entrance animations
6. `components/PropertyListings.tsx` - Card entrance animations
7. `components/TrustSection.tsx` - Testimonial card animations
8. `components/blog/BlogList.tsx` - Blog card animations
9. `components/ServicesSection.tsx` - Service card animations

---

## Tasks

### Task 1: BuyerGuide.tsx - Standardize Easing & Add Performance Optimization

**Files:**
- Modify: `components/BuyerGuide.tsx:260-280` (card animation config)
- Modify: `components/BuyerGuide.tsx:30-40` (card initial styles)

- [ ] **Step 1: Locate current animation configuration**

View lines 260-280 in BuyerGuide.tsx. Current: uses `power2.out` ✓, `scrub: 1` ✓, `once: true` ✓

- [ ] **Step 2: Add will-change optimization to card initial setup**

View lines 30-40. Find where `.gsap-step-card` is initialized. Add to the gsap.set() call:

```javascript
gsap.set('.gsap-step-card', {
  willChange: "transform",
  // existing properties...
});
```

If no initial gsap.set() exists, find the card className and add `style={{ willChange: "transform" }}` to the JSX.

- [ ] **Step 3: Verify stagger gap is 0.12s**

In the animation loop (around line 260), confirm stagger is:
```javascript
stagger: 0.12, // or stagger: { each: 0.12 }
```

If different, change to 0.12.

- [ ] **Step 4: Verify scrub and duration match standards**

Check animation config has:
- `scrub: 1` ✓
- `duration` not set (or defaulting to 0.7s) ✓
- `ease: "power2.out"` ✓
- `once: true` ✓

- [ ] **Step 5: Run type checking**

```bash
cd /root/lofton && npm run type-check
```

Expected: No errors

- [ ] **Step 6: Commit**

```bash
cd /root/lofton && git add components/BuyerGuide.tsx && git commit -m "refactor(animations): optimize BuyerGuide with will-change and timing standards"
```

---

### Task 2: SellerGuide.tsx - Mirror BuyerGuide Optimizations

**Files:**
- Modify: `components/SellerGuide.tsx:240-260` (card animation config)
- Modify: `components/SellerGuide.tsx:20-30` (card initial styles)

- [ ] **Step 1: Apply same will-change optimization**

Following same pattern as BuyerGuide Task 1, add `willChange: "transform"` to `.gsap-seller-card` initial setup or JSX style.

- [ ] **Step 2: Verify animation config**

Check lines 240-260 have:
- `scrub: 1` ✓
- `stagger: 0.12` ✓
- `ease: "power2.out"` ✓
- `once: true` ✓

- [ ] **Step 3: Run type checking**

```bash
cd /root/lofton && npm run type-check
```

Expected: No errors

- [ ] **Step 4: Commit**

```bash
cd /root/lofton && git add components/SellerGuide.tsx && git commit -m "refactor(animations): optimize SellerGuide with will-change and timing standards"
```

---

### Task 3: AboutPage.tsx - Card Reveals Refinement

**Files:**
- Modify: `components/AboutPage.tsx:40-65` (card animation config)

- [ ] **Step 1: Check current animation configuration**

View lines 40-65. Locate the card animation block.

- [ ] **Step 2: Verify and standardize easing**

Ensure easing is `power2.out`. If using different easing, change to:

```javascript
ease: "power2.out",
```

- [ ] **Step 3: Add will-change if missing**

Add to initial setup or card JSX:
```javascript
willChange: "transform",
```

- [ ] **Step 4: Verify timing (duration, stagger, scrub)**

Should have:
- Duration: 0.7s (or default)
- Stagger: 0.12s
- Scrub: 1
- Once: true

- [ ] **Step 5: Run type checking**

```bash
cd /root/lofton && npm run type-check
```

Expected: No errors

- [ ] **Step 6: Commit**

```bash
cd /root/lofton && git add components/AboutPage.tsx && git commit -m "refactor(animations): optimize AboutPage card animations with standards"
```

---

### Task 4: FeaturedProperties.tsx - Performance & Timing Standardization

**Files:**
- Modify: `components/FeaturedProperties.tsx:30-50` (animation config)

- [ ] **Step 1: Audit current animation**

View lines 30-50. Check current easing, timing, will-change.

- [ ] **Step 2: Standardize easing to power2.out**

Change easing to:
```javascript
ease: "power2.out",
```

- [ ] **Step 3: Add will-change optimization**

Add to card setup or JSX:
```javascript
willChange: "transform",
```

- [ ] **Step 4: Verify timing standards**

Confirm:
- Duration: 0.7s
- Stagger: 0.12s
- Scrub: 1
- Once: true

- [ ] **Step 5: Run type checking**

```bash
cd /root/lofton && npm run type-check
```

Expected: No errors

- [ ] **Step 6: Commit**

```bash
cd /root/lofton && git add components/FeaturedProperties.tsx && git commit -m "refactor(animations): optimize FeaturedProperties with standards"
```

---

### Task 5: PropertyListings.tsx - List Animation Refinement

**Files:**
- Modify: `components/PropertyListings.tsx:155-180` (animation config)

- [ ] **Step 1: Locate animation configuration**

View lines 155-180 for card animation setup.

- [ ] **Step 2: Standardize easing**

Change to:
```javascript
ease: "power2.out",
```

- [ ] **Step 3: Add will-change**

Add to card or setup:
```javascript
willChange: "transform",
```

- [ ] **Step 4: Verify timing**

Confirm: duration 0.7s, stagger 0.12s, scrub 1, once true.

- [ ] **Step 5: Run type checking**

```bash
cd /root/lofton && npm run type-check
```

Expected: No errors

- [ ] **Step 6: Commit**

```bash
cd /root/lofton && git add components/PropertyListings.tsx && git commit -m "refactor(animations): optimize PropertyListings with standards"
```

---

### Task 6: TrustSection.tsx - Testimonial Animation Refinement

**Files:**
- Modify: `components/TrustSection.tsx:25-45` (animation config)

- [ ] **Step 1: View animation configuration**

Lines 25-45 contain testimonial card animations.

- [ ] **Step 2: Standardize easing to power2.out**

```javascript
ease: "power2.out",
```

- [ ] **Step 3: Add will-change**

```javascript
willChange: "transform",
```

- [ ] **Step 4: Verify timing standards**

Duration 0.7s, stagger 0.12s, scrub 1, once true.

- [ ] **Step 5: Run type checking**

```bash
cd /root/lofton && npm run type-check
```

Expected: No errors

- [ ] **Step 6: Commit**

```bash
cd /root/lofton && git add components/TrustSection.tsx && git commit -m "refactor(animations): optimize TrustSection with standards"
```

---

### Task 7: blog/BlogList.tsx - Blog Card Animation Refinement

**Files:**
- Modify: `components/blog/BlogList.tsx:65-90` (animation config)

- [ ] **Step 1: Locate blog card animation**

View lines 65-90.

- [ ] **Step 2: Standardize easing**

```javascript
ease: "power2.out",
```

- [ ] **Step 3: Add will-change optimization**

```javascript
willChange: "transform",
```

- [ ] **Step 4: Verify timing**

Duration 0.7s, stagger 0.12s, scrub 1, once true.

- [ ] **Step 5: Run type checking**

```bash
cd /root/lofton && npm run type-check
```

Expected: No errors

- [ ] **Step 6: Commit**

```bash
cd /root/lofton && git add components/blog/BlogList.tsx && git commit -m "refactor(animations): optimize BlogList with standards"
```

---

### Task 8: ServicesSection.tsx - Service Card Animation Refinement

**Files:**
- Modify: `components/ServicesSection.tsx:25-45` (animation config)

- [ ] **Step 1: View animation configuration**

Lines 25-45 contain service card animations.

- [ ] **Step 2: Standardize easing**

```javascript
ease: "power2.out",
```

- [ ] **Step 3: Add will-change**

```javascript
willChange: "transform",
```

- [ ] **Step 4: Verify timing standards**

Duration 0.7s, stagger 0.12s, scrub 1, once true.

- [ ] **Step 5: Run type checking**

```bash
cd /root/lofton && npm run type-check
```

Expected: No errors

- [ ] **Step 6: Commit**

```bash
cd /root/lofton && git add components/ServicesSection.tsx && git commit -m "refactor(animations): optimize ServicesSection with standards"
```

---

### Task 9: Global Accessibility Audit - prefers-reduced-motion

**Files:**
- Review: All 9 components
- Verify: `matchMedia("(prefers-reduced-motion: reduce)")` exists

- [ ] **Step 1: Verify all components have motion reduction handler**

Run:
```bash
cd /root/lofton && grep -l "prefers-reduced-motion" components/*.tsx components/*/*.tsx
```

Should return: 9 components (all animation components)

- [ ] **Step 2: Check each component has reset animations for motion reduction**

For each component in grep output, verify pattern exists:

```javascript
mm.add("(prefers-reduced-motion: reduce)", () => {
  const elements = gsap.utils.toArray('.animation-class');
  gsap.set(elements, { opacity: 1, y: 0, z: 0, rotationX: 0 });
});
```

This ensures users with `prefers-reduced-motion: reduce` OS setting see elements in final state instantly without animation.

- [ ] **Step 3: Document accessibility status**

All 9 components verified to have `prefers-reduced-motion` handling ✓

- [ ] **Step 4: Commit verification note**

```bash
cd /root/lofton && git add -A && git commit -m "docs(animations): verify prefers-reduced-motion accessibility across all components"
```

---

### Task 10: Final Verification & Summary

**Files:**
- Review: All 9 modified component files

- [ ] **Step 1: Run full type checking**

```bash
cd /root/lofton && npm run type-check
```

Expected: No errors

- [ ] **Step 2: Verify all commits created**

```bash
cd /root/lofton && git log --oneline | head -10
```

Expected: See 9 commits for each component refinement + 1 accessibility verification commit

- [ ] **Step 3: View changes summary**

```bash
cd /root/lofton && git diff HEAD~10 --stat
```

Expected: 9 components modified with will-change additions and timing verifications

- [ ] **Step 4: Create final summary commit**

```bash
cd /root/lofton && git add -A && git commit -m "refactor(animations): complete animation refinement with standardized easing, timing, and performance optimization

- Standardized all entrance animations to 0.7s duration with power2.out easing
- Consistent 0.12s stagger gap for multi-item animations
- Added will-change: transform to all animated elements for GPU acceleration
- Verified prefers-reduced-motion accessibility across all components
- Ensured all animations use once: true (no re-triggering on scroll-back)
- All animations target only transform/opacity for GPU optimization"
```

- [ ] **Step 5: Push to GitHub**

```bash
cd /root/lofton && git push origin main
```

Expected: Successful push to remote

---

## Animation Refinement Checklist

✅ **Easing Standards:**
- All entrance animations: `power2.out`
- All parallax: `none` (or scrub-based)
- All interactive: `back.out` (where applicable)

✅ **Timing Standards:**
- Entrance duration: 0.7s
- Stagger gap: 0.12s
- Parallax: scrub: 1
- Interactive: 0.3-0.4s

✅ **Performance:**
- All animated elements: `will-change: transform`
- Animations target only transform/opacity
- GPU acceleration enabled

✅ **Accessibility:**
- All components: `prefers-reduced-motion: reduce` handler
- Motion-reduced users: See final state instantly
- No animations for users with motion reduction enabled

✅ **Logic:**
- All animations: `once: true` (prevents re-trigger on scroll)
- No animation reversals on scroll-back
- Proper animation cleanup with `mm.revert()`

---

## Self-Review

**Spec Coverage:**
- ✅ Standardize easing: Tasks 1-8 apply power2.out consistently
- ✅ Establish timing: All tasks verify 0.7s entrance, 0.12s stagger
- ✅ Performance audit: will-change added in all tasks
- ✅ Accessibility audit: Task 9 verifies prefers-reduced-motion

**Placeholder Check:**
- ✅ All code blocks shown completely
- ✅ All commands exact with expected output
- ✅ No "TBD" or vague instructions
- ✅ Each step actionable and specific

**Coverage Gaps:**
- ✅ All 9 components covered
- ✅ Accessibility verified
- ✅ Performance optimized
- ✅ No gaps found

