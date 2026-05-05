
import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { getBlogs } from '../../lib/firebase/firestore';
import { BlogPost } from '../../types';
import { BlogCard } from './BlogCard';
import { Search } from 'lucide-react';
import { updateSEO } from '../../utils';
import { BlogSkeleton } from '../common/Skeleton';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const BlogList = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const sectionRef = useRef<HTMLDivElement>(null);

  const categories = [
    'All',
    'Market Updates',
    'Buyer Tips',
    'Seller Tips',
    'Investment Advice',
    'Neighborhood Guides',
    'Home Improvement',
    'Real Estate News'
  ];

  const fetchBlogsFn = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBlogs(true);
      setBlogs(data);
      setTimeout(() => ScrollTrigger.refresh(), 100);
    } catch (err) {
      setError('Failed to load blog posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateSEO({
      title: "Real Estate Blog & Market Insights | Lofton Realty",
      description: "Stay informed with the latest Houston real estate news, market updates, buying tips, and selling strategies from Lofton Realty.",
      url: "https://lofton-psi.vercel.app/blog"
    });

    fetchBlogsFn();
  }, []);

  useGSAP(() => {
    if (loading || filteredBlogs.length === 0) return;

    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray('.gsap-blog-card');
      
      cards.forEach((card: any) => {
        gsap.fromTo(card, 
          {
            opacity: 0, 
            rotationX: -25, 
            y: 60, 
            z: -150 
          },
          {
            opacity: 1,
            rotationX: 0,
            y: 0,
            z: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 95%",
              end: "top 70%",
              scrub: 1,
              immediateRender: false,
              once: true,
            }
          }
        );
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      const cards = gsap.utils.toArray('.gsap-blog-card');
      gsap.set(cards, { opacity: 1, rotationX: 0, y: 0, z: 0 });
    });

    return () => mm.revert();
  }, { scope: sectionRef, dependencies: [loading, blogs, activeCategory] });

  const filteredBlogs = useMemo(() => {
    if (activeCategory === 'All') return blogs;
    return blogs.filter(b => b.category === activeCategory);
  }, [blogs, activeCategory]);

  return (
    <div className="font-sans bg-accent min-h-screen">
      <Navbar />

      {/* Header */}
      <div className="bg-background border-b border-border pt-32 pb-12">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 text-center">
          <span className="text-brand font-bold tracking-widest uppercase text-sm mb-3 block">Lofton Realty Insights</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6 tracking-tight">
            Latest Real Estate News & Tips
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Expert advice for buyers, sellers, and investors in the Texas market.
          </p>
        </div>
      </div>

      <main ref={sectionRef} id="main-content" className="max-w-[1280px] mx-auto px-5 md:px-10 py-12">
        
        {/* Category Filter */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar" role="tablist" aria-label="Filter by category">
          {categories.map(cat => (
            <button
              key={cat}
              role="tab"
              onClick={() => setActiveCategory(cat)}
              aria-selected={activeCategory === cat}
              aria-controls="blog-grid"
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-brand/20' 
                  : 'bg-background border border-border text-muted-foreground hover:bg-accent hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-16 bg-red-50 border border-red-200 rounded-2xl" role="alert">
            <p className="text-red-700 font-medium">{error}</p>
            <button onClick={fetchBlogsFn} className="mt-3 text-brand font-bold hover:underline">Try Again</button>
          </div>
        )}

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <BlogSkeleton key={i} />
            ))}
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div id="blog-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ perspective: "1200px", transformStyle: "preserve-3d" }}>
            {filteredBlogs.map(post => (
              <div key={post.id} className="gsap-blog-card h-full" style={{ willChange: "transform, opacity" }}>
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        ) : !error ? (
          <div className="text-center py-32 bg-background rounded-2xl border border-border">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-muted-foreground/60" size={24} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No articles found</h3>
            <p className="text-muted-foreground">There are no posts in the {activeCategory} category yet.</p>
            <button 
              onClick={() => setActiveCategory('All')}
              aria-label="View all blog posts"
              className="mt-6 text-brand font-bold hover:underline"
            >
              View all posts
            </button>
          </div>
        ) : null}

      </main>

      <Footer />
    </div>
  );
};
