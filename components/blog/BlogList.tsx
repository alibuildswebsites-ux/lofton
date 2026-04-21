
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

  useEffect(() => {
    updateSEO({
      title: "Real Estate Blog & Market Insights | Lofton Realty",
      description: "Stay informed with the latest Houston real estate news, market updates, buying tips, and selling strategies from Lofton Realty.",
      url: "https://lofton-psi.vercel.app/blog"
    });

    const fetchBlogs = async () => {
      setLoading(true);
      const data = await getBlogs(true); // fetch published only
      setBlogs(data);
      setLoading(false);
      // Refresh ScrollTrigger after data loads
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    };

    fetchBlogs();
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
    <div className="font-sans bg-gray-50 min-h-screen">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-32 pb-12">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 text-center">
          <span className="text-brand font-bold tracking-widest uppercase text-sm mb-3 block">Lofton Realty Insights</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-charcoal mb-6 tracking-tight">
            Latest Real Estate News & Tips
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Expert advice for buyers, sellers, and investors in the Texas market.
          </p>
        </div>
      </div>

      <main ref={sectionRef} className="max-w-[1280px] mx-auto px-5 md:px-10 py-12">
        
        {/* Category Filter */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat 
                  ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <BlogSkeleton key={i} />
            ))}
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ perspective: "1200px", transformStyle: "preserve-3d" }}>
            {filteredBlogs.map(post => (
              <div key={post.id} className="gsap-blog-card h-full" style={{ willChange: "transform, opacity" }}>
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-charcoal mb-2">No articles found</h3>
            <p className="text-gray-500">There are no posts in the {activeCategory} category yet.</p>
            <button 
              onClick={() => setActiveCategory('All')}
              className="mt-6 text-brand font-bold hover:underline"
            >
              View all posts
            </button>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};
