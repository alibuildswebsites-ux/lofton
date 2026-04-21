# Animations Run Once Per Page Load - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `once: true` to all GSAP ScrollTrigger animations across 10+ components so animations play exactly once per page load.

**Architecture:** GSAP ScrollTrigger has a native `once: true` configuration that prevents animations from reversing and re-triggering on scroll. We will audit all components, add this property to each ScrollTrigger, verify with type checking and visual testing, then commit as a single changeset.

**Tech Stack:** GSAP 3.14.2, React 18.3, TypeScript 5.7

---

## File Structure

### Components to Modify (10 files)

Each component has one or more `ScrollTrigger.create()` calls or inline ScrollTrigger configs in `gsap.to()/from()` animations. All will receive `once: true` addition.

1. `components/LocationsSection.tsx` - 2 ScrollTriggers (main pin + image parallax)
2. `components/BuyerGuide.tsx` - Multiple ScrollTriggers (reveals, parallax)
3. `components/SellerGuide.tsx` - Multiple ScrollTriggers (reveals, parallax)
4. `components/AboutPage.tsx` - Multiple ScrollTriggers (parallax, reveals)
5. `components/FeaturedProperties.tsx` - ScrollTrigger(s) for card animations
6. `components/PropertyListings.tsx` - ScrollTrigger(s) for list animations
7. `components/TrustSection.tsx` - ScrollTrigger(s) for testimonial animations
8. `components/blog/BlogList.tsx` - ScrollTrigger(s) for blog cards
9. `components/agents/AgentList.tsx` - ScrollTrigger(s) for agent cards
10. `components/ServicesSection.tsx` - ScrollTrigger(s) for service cards

---

## Tasks

### Task 1: Audit All ScrollTrigger Instances

**Files:**
- Reference: All components listed above

- [ ] **Step 1: Search for all ScrollTrigger patterns in codebase**

Run:
```bash
cd /root/lofton && grep -rn "ScrollTrigger.create" components/ --include="*.tsx" | grep -v node_modules
```

Expected output: List of all ScrollTrigger.create() calls with file paths and line numbers. Document these.

- [ ] **Step 2: Search for inline ScrollTrigger configs in gsap.to/from**

Run:
```bash
cd /root/lofton && grep -rn "scrollTrigger:" components/ --include="*.tsx" | grep -v node_modules
```

Expected output: All inline ScrollTrigger configs inside gsap animations. Document these.

- [ ] **Step 3: Create audit checklist**

Create mental map:
- Total ScrollTrigger.create() calls: ___
- Total inline scrollTrigger configs: ___
- Components with multiple triggers: ___

---

### Task 2: Update LocationsSection.tsx

**Files:**
- Modify: `components/LocationsSection.tsx:70-78` (main pin ScrollTrigger)
- Modify: `components/LocationsSection.tsx:86-92` (image parallax scrollTrigger)

- [ ] **Step 1: Open LocationsSection.tsx and locate first ScrollTrigger**

View lines 70-78. This is the main horizontal pin ScrollTrigger.

- [ ] **Step 2: Add `once: true` to main pin ScrollTrigger**

Edit the ScrollTrigger.create() call to add `once: true`:

```javascript
ScrollTrigger.create({
  trigger: pinWrapper,
  start: SCROLL_PIN_START, 
  end: () => `+=${track.scrollWidth}`, 
  pin: true,
  animation: tween,
  scrub: 1,
  invalidateOnRefresh: true,
  once: true,  // ← ADD THIS LINE
});
```

- [ ] **Step 3: Add `once: true` to image parallax scrollTrigger**

View lines 86-92. Inside the gsap.to() call for each image parallax, add `once: true` to the scrollTrigger config:

```javascript
gsap.to(img, {
  xPercent: -15,
  ease: "none",
  scrollTrigger: {
    trigger: pinWrapper,
    start: SCROLL_PIN_START,
    end: () => `+=${track.scrollWidth}`,
    scrub: 1,
    invalidateOnRefresh: true,
    once: true,  // ← ADD THIS LINE
  }
});
```

- [ ] **Step 4: Run type checking**

Run:
```bash
cd /root/lofton && npm run type-check
```

Expected: No errors

- [ ] **Step 5: Commit**

```bash
cd /root/lofton && git add components/LocationsSection.tsx && git commit -m "feat(animations): add once: true to LocationsSection scrollTriggers"
```

---

### Task 3: Update BuyerGuide.tsx

**Files:**
- Modify: `components/BuyerGuide.tsx` (all ScrollTrigger instances)

- [ ] **Step 1: Find all ScrollTrigger instances in BuyerGuide.tsx**

Run:
```bash
cd /root/lofton && grep -n "ScrollTrigger.create\|scrollTrigger:" components/BuyerGuide.tsx
```

Document each line number.

- [ ] **Step 2: Add `once: true` to each ScrollTrigger.create() call**

For each `ScrollTrigger.create()` found, add `once: true,` as the last property before closing brace.

Example:
```javascript
ScrollTrigger.create({
  trigger: element,
  start: "top 80%",
  animation: tween,
  scrub: 1,
  once: true,  // ← ADD
});
```

- [ ] **Step 3: Add `once: true` to each inline scrollTrigger config**

For each `scrollTrigger: { ... }` config inside gsap.to/from, add `once: true,` before closing brace:

```javascript
gsap.to(element, {
  opacity: 1,
  scrollTrigger: {
    trigger: element,
    start: "top 80%",
    once: true,  // ← ADD
  }
});
```

- [ ] **Step 4: Run type checking**

Run:
```bash
cd /root/lofton && npm run type-check
```

Expected: No errors

- [ ] **Step 5: Commit**

```bash
cd /root/lofton && git add components/BuyerGuide.tsx && git commit -m "feat(animations): add once: true to BuyerGuide scrollTriggers"
```

---

### Task 4: Update SellerGuide.tsx

**Files:**
- Modify: `components/SellerGuide.tsx` (all ScrollTrigger instances)

- [ ] **Step 1: Find all ScrollTrigger instances in SellerGuide.tsx**

Run:
```bash
cd /root/lofton && grep -n "ScrollTrigger.create\|scrollTrigger:" components/SellerGuide.tsx
```

Document each line number.

- [ ] **Step 2: Add `once: true` to each ScrollTrigger.create() call**

For each `ScrollTrigger.create()` found, add `once: true,` as the last property before closing brace.

- [ ] **Step 3: Add `once: true` to each inline scrollTrigger config**

For each `scrollTrigger: { ... }` config, add `once: true,` before closing brace.

- [ ] **Step 4: Run type checking**

Run:
```bash
cd /root/lofton && npm run type-check
```

Expected: No errors

- [ ] **Step 5: Commit**

```bash
cd /root/lofton && git add components/SellerGuide.tsx && git commit -m "feat(animations): add once: true to SellerGuide scrollTriggers"
```

---

### Task 5: Update AboutPage.tsx

**Files:**
- Modify: `components/AboutPage.tsx` (all ScrollTrigger instances)

- [ ] **Step 1: Find all ScrollTrigger instances in AboutPage.tsx**

Run:
```bash
cd /root/lofton && grep -n "ScrollTrigger.create\|scrollTrigger:" components/AboutPage.tsx
```

Document each line number.

- [ ] **Step 2: Add `once: true` to each ScrollTrigger.create() call**

For each `ScrollTrigger.create()` found, add `once: true,` as the last property before closing brace.

- [ ] **Step 3: Add `once: true` to each inline scrollTrigger config**

For each `scrollTrigger: { ... }` config, add `once: true,` before closing brace.

- [ ] **Step 4: Run type checking**

Run:
```bash
cd /root/lofton && npm run type-check
```

Expected: No errors

- [ ] **Step 5: Commit**

```bash
cd /root/lofton && git add components/AboutPage.tsx && git commit -m "feat(animations): add once: true to AboutPage scrollTriggers"
```

---

### Task 6: Update FeaturedProperties.tsx

**Files:**
- Modify: `components/FeaturedProperties.tsx` (all ScrollTrigger instances)

- [ ] **Step 1: Find all ScrollTrigger instances in FeaturedProperties.tsx**

Run:
```bash
cd /root/lofton && grep -n "ScrollTrigger.create\|scrollTrigger:" components/FeaturedProperties.tsx
```

Document each line number.

- [ ] **Step 2: Add `once: true` to each ScrollTrigger.create() call**

For each `ScrollTrigger.create()` found, add `once: true,` as the last property before closing brace.

- [ ] **Step 3: Add `once: true` to each inline scrollTrigger config**

For each `scrollTrigger: { ... }` config, add `once: true,` before closing brace.

- [ ] **Step 4: Run type checking**

Run:
```bash
cd /root/lofton && npm run type-check
```

Expected: No errors

- [ ] **Step 5: Commit**

```bash
cd /root/lofton && git add components/FeaturedProperties.tsx && git commit -m "feat(animations): add once: true to FeaturedProperties scrollTriggers"
```

---

### Task 7: Update PropertyListings.tsx

**Files:**
- Modify: `components/PropertyListings.tsx` (all ScrollTrigger instances)

- [ ] **Step 1: Find all ScrollTrigger instances in PropertyListings.tsx**

Run:
```bash
cd /root/lofton && grep -n "ScrollTrigger.create\|scrollTrigger:" components/PropertyListings.tsx
```

Document each line number.

- [ ] **Step 2: Add `once: true` to each ScrollTrigger.create() call**

For each `ScrollTrigger.create()` found, add `once: true,` as the last property before closing brace.

- [ ] **Step 3: Add `once: true` to each inline scrollTrigger config**

For each `scrollTrigger: { ... }` config, add `once: true,` before closing brace.

- [ ] **Step 4: Run type checking**

Run:
```bash
cd /root/lofton && npm run type-check
```

Expected: No errors

- [ ] **Step 5: Commit**

```bash
cd /root/lofton && git add components/PropertyListings.tsx && git commit -m "feat(animations): add once: true to PropertyListings scrollTriggers"
```

---

### Task 8: Update TrustSection.tsx

**Files:**
- Modify: `components/TrustSection.tsx` (all ScrollTrigger instances)

- [ ] **Step 1: Find all ScrollTrigger instances in TrustSection.tsx**

Run:
```bash
cd /root/lofton && grep -n "ScrollTrigger.create\|scrollTrigger:" components/TrustSection.tsx
```

Document each line number.

- [ ] **Step 2: Add `once: true` to each ScrollTrigger.create() call**

For each `ScrollTrigger.create()` found, add `once: true,` as the last property before closing brace.

- [ ] **Step 3: Add `once: true` to each inline scrollTrigger config**

For each `scrollTrigger: { ... }` config, add `once: true,` before closing brace.

- [ ] **Step 4: Run type checking**

Run:
```bash
cd /root/lofton && npm run type-check
```

Expected: No errors

- [ ] **Step 5: Commit**

```bash
cd /root/lofton && git add components/TrustSection.tsx && git commit -m "feat(animations): add once: true to TrustSection scrollTriggers"
```

---

### Task 9: Update blog/BlogList.tsx

**Files:**
- Modify: `components/blog/BlogList.tsx` (all ScrollTrigger instances)

- [ ] **Step 1: Find all ScrollTrigger instances in blog/BlogList.tsx**

Run:
```bash
cd /root/lofton && grep -n "ScrollTrigger.create\|scrollTrigger:" components/blog/BlogList.tsx
```

Document each line number.

- [ ] **Step 2: Add `once: true` to each ScrollTrigger.create() call**

For each `ScrollTrigger.create()` found, add `once: true,` as the last property before closing brace.

- [ ] **Step 3: Add `once: true` to each inline scrollTrigger config**

For each `scrollTrigger: { ... }` config, add `once: true,` before closing brace.

- [ ] **Step 4: Run type checking**

Run:
```bash
cd /root/lofton && npm run type-check
```

Expected: No errors

- [ ] **Step 5: Commit**

```bash
cd /root/lofton && git add components/blog/BlogList.tsx && git commit -m "feat(animations): add once: true to BlogList scrollTriggers"
```

---

### Task 10: Update agents/AgentList.tsx

**Files:**
- Modify: `components/agents/AgentList.tsx` (all ScrollTrigger instances)

- [ ] **Step 1: Find all ScrollTrigger instances in agents/AgentList.tsx**

Run:
```bash
cd /root/lofton && grep -n "ScrollTrigger.create\|scrollTrigger:" components/agents/AgentList.tsx
```

Document each line number.

- [ ] **Step 2: Add `once: true` to each ScrollTrigger.create() call**

For each `ScrollTrigger.create()` found, add `once: true,` as the last property before closing brace.

- [ ] **Step 3: Add `once: true` to each inline scrollTrigger config**

For each `scrollTrigger: { ... }` config, add `once: true,` before closing brace.

- [ ] **Step 4: Run type checking**

Run:
```bash
cd /root/lofton && npm run type-check
```

Expected: No errors

- [ ] **Step 5: Commit**

```bash
cd /root/lofton && git add components/agents/AgentList.tsx && git commit -m "feat(animations): add once: true to AgentList scrollTriggers"
```

---

### Task 11: Update ServicesSection.tsx

**Files:**
- Modify: `components/ServicesSection.tsx` (all ScrollTrigger instances)

- [ ] **Step 1: Find all ScrollTrigger instances in ServicesSection.tsx**

Run:
```bash
cd /root/lofton && grep -n "ScrollTrigger.create\|scrollTrigger:" components/ServicesSection.tsx
```

Document each line number.

- [ ] **Step 2: Add `once: true` to each ScrollTrigger.create() call**

For each `ScrollTrigger.create()` found, add `once: true,` as the last property before closing brace.

- [ ] **Step 3: Add `once: true` to each inline scrollTrigger config**

For each `scrollTrigger: { ... }` config, add `once: true,` before closing brace.

- [ ] **Step 4: Run type checking**

Run:
```bash
cd /root/lofton && npm run type-check
```

Expected: No errors

- [ ] **Step 5: Commit**

```bash
cd /root/lofton && git add components/ServicesSection.tsx && git commit -m "feat(animations): add once: true to ServicesSection scrollTriggers"
```

---

### Task 12: Final Verification and Summary

**Files:**
- Review: All 10 modified component files

- [ ] **Step 1: Run final type checking across entire project**

Run:
```bash
cd /root/lofton && npm run type-check
```

Expected: No errors

- [ ] **Step 2: Verify all commits were created**

Run:
```bash
cd /root/lofton && git log --oneline | head -12
```

Expected: See 10 commits, each with "feat(animations): add once: true to [Component]"

- [ ] **Step 3: View all changes summary**

Run:
```bash
cd /root/lofton && git diff HEAD~10 --stat
```

Expected: 10 modified files, ~30+ lines added (one `once: true` per ScrollTrigger)

- [ ] **Step 4: Visual Testing Checklist (Manual)**

Open the dev server and test on the live site:
- Scroll down slowly → See all animations play once
- Scroll back up → Animations stay in final state (don't reverse)
- Scroll down again → No re-animation
- Fast scroll past sections → Animations still play (catch up)

Success criteria:
- ✅ Animations never repeat
- ✅ Animations don't reverse on scroll-back
- ✅ Fast scrolls still trigger animations

---

## Self-Review

**Spec Coverage:**
- ✅ Single Run Per Load: Tasks 1-11 add `once: true` to all ScrollTriggers
- ✅ Position-Aware: GSAP handles this natively with `once: true`
- ✅ No Reverse: GSAP behavior when `once: true` is set
- ✅ Global Scope: All 10 components covered in Tasks 2-11
- ✅ Testing: Task 12 includes type checking and visual testing

**Placeholder Check:**
- ✅ All code blocks shown in full
- ✅ All commands include exact syntax and expected output
- ✅ No "TBD" or "handle edge cases" vague instructions
- ✅ Each step is actionable and specific

**Type Consistency:**
- ✅ All ScrollTrigger configs use same pattern: `once: true,` before closing brace
- ✅ Both ScrollTrigger.create() and inline scrollTrigger configs covered
- ✅ Property name is consistent: `once` (lowercase boolean)

**Coverage Gap Check:**
- ✅ No gaps found
- ✅ All components from design spec are covered
- ✅ Audit task (Task 1) documents total count

---

## Execution Options

Plan complete and saved to `docs/superpowers/plans/2026-04-21-animations-run-once.md`.

Two execution options:

**1. Subagent-Driven (Recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach would you prefer?
