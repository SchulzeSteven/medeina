import { afterNextRender, Component, DestroyRef, inject, input, signal } from '@angular/core';
import type { Language } from './translations';
import {
  instagramFeedEndpoint,
  instagramPosts,
  instagramProfileUrl,
  latestInstagramPosts,
} from './instagram-feed.data';

const labels = {
  de: {
    title: 'Einblicke in Medeina',
    description: 'Impulse, Begegnungen und kleine Momente – auf Instagram.',
    profile: 'Auf Instagram entdecken',
    open: 'Beitrag auf Instagram öffnen',
    empty: 'Aktuelle Beiträge findest du auf meinem Instagram-Profil.',
    loading: 'Instagram-Beiträge werden geladen …',
    error: 'Die Beiträge sind gerade nicht verfügbar. Du findest sie weiterhin auf Instagram.',
    photo: 'Instagram-Beitrag von Medeina',
    video: 'Video',
    album: 'Mehrere Bilder',
  },
  tr: {
    title: 'Medeina’dan anlar',
    description: 'İlham, buluşmalar ve küçük anlar – Instagram’da.',
    profile: 'Instagram’da keşfet',
    open: 'Gönderiyi Instagram’da aç',
    empty: 'Güncel gönderileri Instagram profilimde bulabilirsin.',
    loading: 'Instagram gönderileri yükleniyor …',
    error: 'Gönderiler şu anda görüntülenemiyor. Instagram’da görüntüleyebilirsin.',
    photo: 'Medeina’nın Instagram gönderisi',
    video: 'Video',
    album: 'Birden fazla görsel',
  },
};

@Component({
  selector: 'app-instagram-feed',
  standalone: true,
  templateUrl: './instagram-feed.component.html',
  styleUrl: './instagram-feed.component.css',
})
export class InstagramFeedComponent {
  readonly language = input.required<Language>();
  readonly profileUrl = instagramProfileUrl;
  readonly posts = signal(latestInstagramPosts(instagramPosts));
  readonly loading = signal(false);
  readonly failed = signal(false);

  constructor() {
    const controller = new AbortController();
    inject(DestroyRef).onDestroy(() => controller.abort());
    afterNextRender(() => {
      if (instagramFeedEndpoint) void this.loadFeed(instagramFeedEndpoint, controller.signal);
    });
  }

  get copy() {
    return labels[this.language()];
  }

  private async loadFeed(endpoint: string, abortSignal: AbortSignal) {
    this.loading.set(true);
    try {
      const response = await fetch(endpoint, { signal: abortSignal, credentials: 'same-origin' });
      if (!response.ok) throw new Error('Instagram feed unavailable');
      const data: unknown = await response.json();
      if (!data || typeof data !== 'object' || !('posts' in data) || !Array.isArray(data.posts)) {
        throw new Error('Invalid Instagram feed response');
      }
      this.posts.set(latestInstagramPosts(data.posts));
    } catch {
      if (!abortSignal.aborted) this.failed.set(true);
    } finally {
      if (!abortSignal.aborted) this.loading.set(false);
    }
  }
}
