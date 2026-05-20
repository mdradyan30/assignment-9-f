'use client';

import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import IdeaCard from '@/components/IdeaCard';

export default function TrendingIdeasSection() {
  // Demo trending ideas data
  const demoTrendingIdeas = [
    {
      _id: 'trending-1',
      title: 'AI-Powered Personal Financial Assistant',
      shortDescription: 'An intelligent chatbot that analyzes spending patterns and provides personalized financial advice in real-time.',
      category: 'AI & ML',
      imageURL: 'https://images.unsplash.com/photo-1639762681033-6461ffad8d80?w=800&q=80',
      authorName: 'Sarah Chen',
      likesCount: 245,
      commentsCount: 18,
    },
    {
      _id: 'trending-2',
      title: 'Sustainable Urban Farming System',
      shortDescription: 'A vertical farming solution designed for small urban spaces, reducing water usage by 95% compared to traditional farming.',
      category: 'Sustainability',
      imageURL: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=800&q=80',
      authorName: 'Marcus Johnson',
      likesCount: 312,
      commentsCount: 42,
    },
    {
      _id: 'trending-3',
      title: 'Mental Health Support Mobile App',
      shortDescription: 'A peer-to-peer community platform connecting users with trained counselors and support groups for mental wellness.',
      category: 'Health & Wellness',
      imageURL: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
      authorName: 'Elena Rodriguez',
      likesCount: 428,
      commentsCount: 67,
    },
    {
      _id: 'trending-4',
      title: 'Decentralized Social Commerce Network',
      shortDescription: 'A blockchain-based marketplace where creators control their content, data, and earn directly from their community.',
      category: 'Web3',
      imageURL: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
      authorName: 'David Liu',
      likesCount: 567,
      commentsCount: 89,
    },
    {
      _id: 'trending-5',
      title: 'Smart Water Management System',
      shortDescription: 'IoT sensors and AI algorithms to optimize water usage in agricultural and urban settings, saving millions of gallons annually.',
      category: 'IoT',
      imageURL: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
      authorName: 'Priya Sharma',
      likesCount: 189,
      commentsCount: 34,
    },
    {
      _id: 'trending-6',
      title: 'Open-Source Learning Platform',
      shortDescription: 'A collaborative education platform where educators create free, customizable courses with built-in community feedback loops.',
      category: 'Education',
      imageURL: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80',
      authorName: 'James Wilson',
      likesCount: 334,
      commentsCount: 56,
    },
  ];

  return (
    <section className="border-t border-base-300">
      <div className="vault-container py-20 lg:py-24">
        <div className="flex items-end justify-between border-b border-base-content pb-4 mb-12">
          <div>
            <p className="eyebrow text-secondary mb-2">§ This week's reading</p>
            <h2 className="display text-4xl md:text-5xl">
              Trending in the vault.
            </h2>
          </div>
          <Link href="/ideas" className="link-editorial text-sm hidden sm:inline-flex">
            All ideas <FiArrowRight size={14} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 stagger">
          {demoTrendingIdeas.map((idea, i) => (
            <IdeaCard key={idea._id} idea={idea} index={i} />
          ))}
        </div>

        <div className="mt-12 text-center sm:hidden">
          <Link href="/ideas" className="link-editorial text-sm">
            Read all ideas <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
