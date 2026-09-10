import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Skill Sync — Maharashtra Longitudinal Skilling Tracker',
    short_name: 'Skill Sync',
    description: 'Government of Maharashtra MSIS Longitudinal Skilling Outcomes, Multi-channel Follow-ups & Triangulation Platform. SIH 2026.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#ea580c',
    lang: 'en',
    categories: ['education', 'government', 'productivity'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}