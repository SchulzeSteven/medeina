export interface InstagramPost {
  id: string;
  permalink: string;
  imageUrl: string;
  caption: string;
  publishedAt: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
}

export const instagramProfileUrl = 'https://www.instagram.com/medeinaland/';

// Set this to an actual server endpoint after connecting the Instagram account.
// The endpoint returns { posts: InstagramPost[] }; account tokens stay on the server.
export const instagramFeedEndpoint: string | null = null;
export const instagramPosts: readonly InstagramPost[] = [];

function isHttpsUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

/** Validate feed data, keep unique entries, and show the six most recent posts. */
export function latestInstagramPosts(value: unknown): InstagramPost[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value
    .filter((post): post is InstagramPost => {
      if (
        !post ||
        typeof post !== 'object' ||
        typeof post.id !== 'string' ||
        !post.id ||
        seen.has(post.id) ||
        !isHttpsUrl(post.permalink) ||
        !isHttpsUrl(post.imageUrl) ||
        typeof post.caption !== 'string' ||
        typeof post.publishedAt !== 'string' ||
        !Number.isFinite(Date.parse(post.publishedAt)) ||
        !['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM'].includes(post.mediaType)
      )
        return false;
      const host = new URL(post.permalink).hostname;
      if (host !== 'www.instagram.com' && host !== 'instagram.com') return false;
      seen.add(post.id);
      return true;
    })
    .sort((first, second) => Date.parse(second.publishedAt) - Date.parse(first.publishedAt))
    .slice(0, 6);
}
