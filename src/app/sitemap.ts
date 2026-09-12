import type { MetadataRoute } from 'next';
import { getAllNames } from '@/lib/nameService';
import { WORLD_COUNTRIES } from '@/data/worldNames';

const BASE_URL = 'https://babynamen.me';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/babynamen`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/maedchennamen`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/jungennamen`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/beliebte-namen-weltweit`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/spiele`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/datenschutz`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/impressum`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const nameRoutes: MetadataRoute.Sitemap = getAllNames().map((name) => ({
    url: `${BASE_URL}/name/${name.id}`,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  const countryRoutes: MetadataRoute.Sitemap = WORLD_COUNTRIES.map((country) => ({
    url: `${BASE_URL}/beliebte-namen-weltweit/${country.slug}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...nameRoutes, ...countryRoutes];
}
