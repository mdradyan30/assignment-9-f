'use client';

import { useEffect } from 'react';
import Banner from '@/components/home/Banner';
import HowItWorks from '@/components/home/HowItWorks';
import CategoryStrip from '@/components/home/CategoryStrip';
import CtaBand from '@/components/home/CtaBand';
import TrendingIdeasSection from '@/components/home/TrendingIdeasSection';
import RecentIdeasSection from '@/components/home/RecentIdeasSection';
import TopContributorsSection from '@/components/home/TopContributorsSection';

export default function HomePage() {
  useEffect(() => {
    document.title = 'IdeaVault — A Quiet Place for Loud Ideas';
  }, []);

  return (
    <>
      <Banner />

      {/* Trending ideas — featured stories layout with demo ideas */}
      <TrendingIdeasSection />

      {/* Extra Section 1: Recent Ideas */}
      <RecentIdeasSection />

      <CategoryStrip />

      {/* Extra Section 2: Top Contributors */}
      <TopContributorsSection />

      <HowItWorks />
      <CtaBand />
    </>
  );
}
