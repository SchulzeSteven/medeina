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
export const googleReviewsProfileUrl: string | null =
  'https://www.google.com/maps/place/MEDEINA%C2%AE+by+%C3%87a%C4%9Fla+Mutlu/@51.175807,10.4541194,6z/data=!3m1!4b1!4m6!3m5!1s0x47a851e01970dbaf:0xf8471b2d67a9ada9!8m2!3d51.175807!4d10.4541194!16s%2Fg%2F11p2cwr04x?entry=ttu';

export function newestReviews(reviews: readonly GoogleReview[]): GoogleReview[] {
  return [...reviews].sort(
    (first, second) => Date.parse(second.publishedAt) - Date.parse(first.publishedAt),
  );
}
