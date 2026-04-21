# Locations Section Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the "Areas We Serve" section into a cinema-style horizontal parallax scroll experience using GSAP ScrollTrigger.

**Architecture:** Replace CSS grid in `LocationsSection.tsx` with a pinned horizontal track (`w-[300vw]`). Use `useGSAP` to pin and scrub horizontally on desktop, and fallback to CSS `overflow-x-auto snap-x` on mobile. The modal logic remains unchanged.

**Tech Stack:** React, Tailwind CSS, GSAP (`@gsap/react`, `ScrollTrigger`), Framer Motion (for existing modal).

---

### Task 1: Refactor Layout and CSS for Horizontal Track

**Files:**
- Modify: `components/LocationsSection.tsx`

- [ ] **Step 1: Replace CSS Grid with Horizontal Track wrapper**

Change the `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` container to a flex container that will act as the scrolling track. We also need to add an outer pin wrapper.

```tsx
// Inside components/LocationsSection.tsx

// Find:
// <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] mt-12" style={{ perspective: "1200px", transformStyle: "preserve-3d" }}>

// Replace with:
        {/* Outer Pin Wrapper */}
        <div className="gsap-pin-wrapper relative w-full h-[600px] md:h-[700px] mt-12 overflow-hidden">
          {/* Horizontal Track */}
          <div className="gsap-track flex flex-nowrap h-full w-max gap-[30px] md:gap-[40px] px-5 md:px-10 overflow-x-auto snap-x snap-mandatory md:overflow-visible md:snap-none pb-8 md:pb-0">
```

- [ ] **Step 2: Update Location Card Styling for Poster Aspect Ratio**

Make the cards large, tall, and give them a full-bleed background image.

```tsx
// Inside components/LocationsSection.tsx

// Find the LOCATIONS.map block and update the card:
            {LOCATIONS.map((location) => (
              <div key={location.id} className="gsap-location-card relative flex-shrink-0 w-[85vw] md:w-[400px] lg:w-[450px] h-full snap-center rounded-2xl overflow-hidden group cursor-pointer border border-gray-200/20 shadow-xl" style={{ willChange: "transform" }}>
                <button 
                  onClick={() => setSelectedLocation(location)}
                  className="w-full h-full text-left relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  aria-label={`View details for ${location.name}`}
                >
                  {/* Background Image Wrapper for Parallax */}
                  <div className="absolute inset-0 overflow-hidden bg-gray-900">
                    <img 
                      src={getOptimizedImageUrl(location.image, 800)} 
                      alt={location.name}
                      className="gsap-card-img absolute inset-0 w-[120%] h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 -left-[10%]"
                      style={{ willChange: "transform" }}
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark/95 via-charcoal-dark/40 to-transparent pointer-events-none" />

                  {/* Content (Pinned to bottom) */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight group-hover:text-brand transition-colors">{location.name}</h3>
                        <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-2">{location.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-white/20 pt-5 mt-2">
                      <div>
                        <span className="block text-xs text-brand font-bold uppercase tracking-wider mb-1">{location.stats.label}</span>
                        <span className="block text-xl font-bold text-white">{location.stats.value}</span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center group-hover:bg-brand group-hover:border-brand transition-all duration-300">
                         <ArrowRight size={24} />
                      </div>
                    </div>

                    {location.stats.trend === 'up' && (
                      <div className="absolute top-8 left-8 flex items-center gap-1.5 text-xs font-bold text-charcoal bg-brand px-3 py-1.5 rounded-full shadow-lg">
                        <TrendingUp size={14} /> Growing Market
                      </div>
                    )}
                  </div>
                </button>
              </div>
            ))}
```

- [ ] **Step 3: Close the wrapper**

Make sure to close the two new `div` tags we created in Step 1.

```tsx
// Inside components/LocationsSection.tsx

// Find:
//         </div>
//
//         <div className="mt-16 text-center">

// Replace with:
          </div>
        </div>

        <div className="mt-16 text-center">
```

- [ ] **Step 4: Verify Component Renders**

Run: `npm run dev` and navigate to `#areas`.
Expected: A horizontal scrolling row on mobile, and a horizontal track of big cards on desktop.

- [ ] **Step 5: Commit**

```bash
git add components/LocationsSection.tsx
git commit -m "refactor(locations): implement horizontal track layout and poster cards"
```

---

### Task 2: Implement GSAP Horizontal Scroll Scrub

**Files:**
- Modify: `components/LocationsSection.tsx`

- [ ] **Step 1: Replace `useGSAP` animation block**

We need to animate the `.gsap-track` to move left while pinning the `.gsap-pin-wrapper`. We'll also translate the `.gsap-card-img` in the opposite direction.

```tsx
// Inside components/LocationsSection.tsx

// Replace the existing useGSAP block with:
  useGSAP(() => {
    const track = document.querySelector('.gsap-track') as HTMLElement;
    const pinWrapper = document.querySelector('.gsap-pin-wrapper') as HTMLElement;
    if (!track || !pinWrapper) return;

    let mm = gsap.matchMedia();

    mm.add({
      // Desktop: Pin and scrub
      desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      // Mobile or reduced motion: Do nothing (relies on CSS overflow-x-auto snap)
      reduce: "(max-width: 767px), (prefers-reduced-motion: reduce)"
    }, (context) => {
      let { desktop } = context.conditions as any;

      if (desktop) {
        // Calculate the exact distance to translate the track
        // It's the total width of the track minus the viewport width
        const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 80); // 80px buffer

        // 1. Horizontal Scroll Tween
        const tween = gsap.to(track, {
          x: getScrollAmount,
          ease: "none",
        });

        // 2. ScrollTrigger for the Pin
        ScrollTrigger.create({
          trigger: pinWrapper,
          start: "top 15%", // Pin slightly below the top to show the section header
          end: () => `+=${track.scrollWidth}`, // Scroll duration equals track width
          pin: true,
          animation: tween,
          scrub: 1,
          invalidateOnRefresh: true, // Recalculate on resize
        });

        // 3. Inner Parallax for Images
        const images = gsap.utils.toArray('.gsap-card-img');
        images.forEach((img: any) => {
          gsap.to(img, {
            xPercent: 15, // Move right as container moves left
            ease: "none",
            scrollTrigger: {
              trigger: pinWrapper,
              start: "top 15%",
              end: () => `+=${track.scrollWidth}`,
              scrub: 1,
              invalidateOnRefresh: true,
            }
          });
        });
      }
    });

    return () => mm.revert();
  }, { scope: sectionRef, dependencies: [] });
```

- [ ] **Step 2: Verify Build and Typings**

Run: `npm run type-check`
Expected: No errors.

- [ ] **Step 3: Run dev server to verify**

Run: `npm run dev`
Expected: When scrolling down to the Locations section on desktop, it pins and horizontally scrubs perfectly. The background images inside the cards should slowly pan right. On mobile, it should be a standard swipeable row.

- [ ] **Step 4: Commit**

```bash
git add components/LocationsSection.tsx
git commit -m "feat(locations): implement GSAP horizontal scrolltrigger and parallax"
```
