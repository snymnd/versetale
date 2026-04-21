import { useQuery } from '@tanstack/react-query';

import { STALE_TIMES } from '@/lib/constants';
import journeyIndex from '../../../content/journeys/index.json';

export interface JourneySummary {
  id: string;
  title: string;
  titleArabic: string;
  description: string;
  coverGradient: [string, string];
  totalQuests: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

function fetchJourneys(): JourneySummary[] {
  // Content is bundled at build time; no network request needed
  return journeyIndex.journeys as JourneySummary[];
}

export function useJourneys() {
  return useQuery({
    queryKey: ['journeys'],
    queryFn: fetchJourneys,
    staleTime: STALE_TIMES.VERSE_CONTENT,
  });
}
