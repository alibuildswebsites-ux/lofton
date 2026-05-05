
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { getBlogBySlug, getBlogs } from '../../lib/firebase/firestore';
import { BlogPost as BlogPostType } from '../../types';
import { Calendar, Clock, User, ArrowLeft, Tag } from 'lucide-react';
import { updateSEO, injectJSONLD, getOptimizedImageUrl } from '../../utils';
import { BlogCard } from './BlogCard';
import { sanitizeHtml } from '../../lib/sanitizeHtml';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      try {
        if (slug) {
          const data = await getBlogBySlug(slug);
          if (data) {
            setPost(data);
            
            // SEO
            updateSEO({
              title: `${data.metaTitle || data.title} | Lofton Realty Blog`,
              description: data.metaDescription || data.content.replace(/<[^>]+>/g, '').substring(0, 150),
              image: data.featuredImage,
              url: `https://lofton-psi.vercel.app/blog/${data.slug}`,
              type: 'article'
            });

            // Schema
            injectJSONLD({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": data.title,
              "image": data.featuredImage,
              "datePublished": data.createdAt,
              "dateModified": data.updatedAt,
              "author": {
                "@type": "Person",
                "name": data.author
              }
            });

            // Load related
            const allBlogs = await getBlogs(true);
            const related = allBlogs
              .filter(b => b.category === data.category && b.id !== data.id)
              .slice(0, 3);
            setRelatedPosts(related);
          }
        }
      } catch (err) {
        console.error('Failed to load blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-accent flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-brand font-bold hover:underline">Return to Blog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const wordCount = post.content.replace(/<[^>]+>/g, '').split(' ').length;
  const readTime = Math.ceil(wordCount / 200);
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="font-sans bg-background min-h-screen">
      <Navbar />

      <article 
        className="pt-28 md:pt-36 pb-20"
        itemScope
        itemType="https://schema.org/BlogPosting"
      >
        
        {/* Header */}
        <div className="max-w-4xl mx-auto px-5 md:px-10 mb-10">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-brand font-bold mb-8 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-md"
          >
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground mb-6">
            <span className="bg-brand-light text-brand-dark px-3 py-1 rounded-full uppercase tracking-wide text-xs font-bold">
              {post.category}
            </span>
            <time dateTime={new Date(post.createdAt).toISOString()} className="flex items-center gap-1">
              <Calendar size={14} /> {date}
            </time>
            <span className="flex items-center gap-1"><Clock size={14} /> {readTime} min read</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-tight mb-8">
            {post.title}
          </h1>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground/60 font-bold border border-border">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{post.author}</p>
              <p className="text-xs text-muted-foreground">Lofton Realty Team</p>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="max-w-6xl mx-auto px-5 md:px-10 mb-16">
          <div className="aspect-video rounded-2xl overflow-hidden shadow-lg bg-muted">
            <img 
              src={post.featuredImage || getOptimizedImageUrl('https://images.unsplash.com/photo-1560518883-ce09059eeffa', 1200)}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-5 md:px-10">
          <div 
            className="prose prose-lg prose-gray max-w-none prose-headings:font-extrabold prose-headings:text-foreground prose-a:text-brand prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-border">
              <h4 className="text-sm font-bold text-muted-foreground/60 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Tag size={16} /> Related Tags
              </h4>
              <ul className="flex flex-wrap gap-2" aria-label="Article tags">
                {post.tags.map((tag, idx) => (
                  <li key={idx}>
                    <span className="bg-accent hover:bg-muted text-muted-foreground px-4 py-2 rounded-full text-sm font-bold transition-colors cursor-default">
                      #{tag}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-accent py-20 border-t border-border" aria-label="Related articles">
          <div className="max-w-7xl mx-auto px-5 md:px-10">
            <h3 className="text-2xl font-bold text-foreground mb-8">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map(p => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};
