export interface GoogleReview {
  id: string;
  author: string;
  authorUrl?: string;
  authorPhotoUrl?: string;
  rating: number;
  text: string;
  publishedAt: string;
  sourceUrl: string;
}

/** Only verified Google reviews belong here; no example customer testimonials. */
export const googleReviews: readonly GoogleReview[] = [];
export const googleReviewsProfileUrl: string | null = null;

export function newestReviews(reviews: readonly GoogleReview[]): GoogleReview[] {
  return [...reviews].sort(
    (first, second) => Date.parse(second.publishedAt) - Date.parse(first.publishedAt),
  );
}
