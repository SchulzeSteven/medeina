import {
  afterRenderEffect,
  Component,
  computed,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import type { Language } from './translations';
import { GoogleReview, newestReviews } from './google-reviews.data';

const labels = {
  de: {
    title: 'Google-Bewertungen',
    description: 'Eure Erfahrungen mit Medeina.',
    newest: 'Neueste Bewertungen zuerst',
    previous: 'Vorherige Bewertungen',
    next: 'Weitere Bewertungen',
    all: 'Alle Bewertungen auf Google',
    original: 'Auf Google ansehen',
    emptyTitle: 'Raum für eure Erfahrungen',
    empty: 'Hier werden Google-Bewertungen angezeigt, sobald sie verfügbar sind.',
    stars: 'von 5 Sternen',
    swipe: 'Mit den Pfeilen wechseln oder seitlich wischen.',
  },
  tr: {
    title: 'Google yorumları',
    description: 'Medeina ile deneyimleriniz.',
    newest: 'En yeni yorumlar önce',
    previous: 'Önceki yorumlar',
    next: 'Diğer yorumlar',
    all: 'Google’da tüm yorumlar',
    original: 'Google’da görüntüle',
    emptyTitle: 'Deneyimlerinize bir alan',
    empty: 'Google yorumları kullanılabilir olduğunda burada gösterilecek.',
    stars: '/ 5 yıldız',
    swipe: 'Oklarla ilerle veya yana kaydır.',
  },
};

@Component({
  selector: 'app-google-reviews',
  standalone: true,
  templateUrl: './google-reviews.component.html',
  styleUrl: './google-reviews.component.scss',
})
export class GoogleReviewsComponent {
  readonly language = input.required<Language>();
  readonly reviews = input<readonly GoogleReview[]>([]);
  readonly profileUrl = input<string | null>(null);
  readonly orderedReviews = computed(() => newestReviews(this.reviews()));
  readonly copy = computed(() => labels[this.language()]);
  readonly canGoBack = signal(false);
  readonly canGoForward = signal(false);
  private readonly track = viewChild<ElementRef<HTMLElement>>('reviewTrack');

  constructor() {
    afterRenderEffect((onCleanup) => {
      const track = this.track()?.nativeElement;
      this.orderedReviews();
      if (!track) return;

      const update = () => this.updateControls(track);
      const observer = new ResizeObserver(update);
      observer.observe(track);
      update();
      onCleanup(() => observer.disconnect());
    });
  }

  updateControls(track: HTMLElement) {
    this.canGoBack.set(track.scrollLeft > 2);
    this.canGoForward.set(track.scrollLeft + track.clientWidth < track.scrollWidth - 2);
  }

  move(direction: -1 | 1) {
    const track = this.track()?.nativeElement;
    const view = track?.ownerDocument.defaultView;
    const card = track?.querySelector<HTMLElement>('.review-card');
    if (!track || !view || !card) return;

    const style = view.getComputedStyle(track);
    const columns = Number(style.getPropertyValue('--review-columns')) || 1;
    const gap = Number.parseFloat(style.columnGap) || 0;
    const distance = (card.getBoundingClientRect().width + gap) * columns;
    track.scrollBy({
      left: direction * distance,
      behavior: view.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }

  dateLabel(date: string) {
    return new Intl.DateTimeFormat(this.language() === 'de' ? 'de-DE' : 'tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date));
  }
}
