import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Language, translations } from './translations';
import { ScrollRevealDirective } from './scroll-reveal.directive';
import { GoogleReviewsComponent } from './google-reviews.component';
import { googleReviews, googleReviewsProfileUrl } from './google-reviews.data';
import { InstagramFeedComponent } from './instagram-feed.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, ScrollRevealDirective, GoogleReviewsComponent, InstagramFeedComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private readonly document = inject(DOCUMENT);
  readonly language = signal<Language>('de');
  readonly googleReviews = googleReviews;
  readonly googleReviewsProfileUrl = googleReviewsProfileUrl;
  readonly menuOpen = signal(false);
  readonly selectedOfferId = signal<string | null>(null);
  readonly bookingOpen = signal(false);
  readonly legalDocument = signal<'imprint' | 'privacy' | null>(null);
  readonly showAllEvents = signal(false);
  readonly requestPrepared = signal(false);
  readonly selectedOffer = computed(() => {
    const id = this.selectedOfferId();
    if (id === 'about') {
      return { id, title: 'Çağla Mutlu', detail: this.copy.aboutDetail };
    }
    return this.offers.find((offer) => offer.id === id) ?? null;
  });

  name = '';
  email = '';
  interest = 'intro';
  message = '';

  constructor() {
    this.updateDocumentLanguage();
  }
  get copy() {
    return translations[this.language()];
  }
  get benefits() {
    return this.copy.benefits;
  }
  get offers() {
    return this.copy.offers;
  }
  get events() {
    return this.copy.events;
  }

  get interestLabel() {
    const labels: Record<string, string> = {
      intro: this.copy.intro,
      contact: this.copy.contactInterest,
      dates: this.copy.datesInterest,
      about: this.copy.about,
    };
    return (
      labels[this.interest] ??
      this.offers.find((offer) => offer.id === this.interest)?.title ??
      this.events.find((event) => event.id === this.interest)?.title ??
      this.copy.intro
    );
  }

  setLanguage(language: Language) {
    this.language.set(language);
    this.updateDocumentLanguage();
  }

  private updateDocumentLanguage() {
    this.document.documentElement.lang = this.language();
    this.document.title = this.copy.pageTitle;
    this.document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', this.copy.pageDescription);
  }

  navigate() {
    this.menuOpen.set(false);
  }

  navigateTo(id: string, event: MouseEvent) {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const target = this.document.getElementById(id);
    const view = this.document.defaultView;
    if (!target || !view) return;
    event.preventDefault();
    this.navigate();
    view.requestAnimationFrame(() => {
      const headerHeight =
        this.document.querySelector('.site-header')?.getBoundingClientRect().height ?? 80;
      const verticalOffset =
        Number.parseFloat(view.getComputedStyle(target).translate.split(' ')[1] ?? '0') || 0;
      const top = Math.max(
        0,
        target.getBoundingClientRect().top + view.scrollY - verticalOffset - headerHeight - 16,
      );
      view.history.replaceState(view.history.state, '', `#${id}`);
      view.scrollTo({
        top,
        behavior: view.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      });
    });
  }

  book(interest = 'intro') {
    this.legalDocument.set(null);
    this.interest = interest;
    this.selectedOfferId.set(null);
    this.requestPrepared.set(false);
    this.bookingOpen.set(true);
    this.menuOpen.set(false);
  }

  close() {
    this.legalDocument.set(null);
    this.bookingOpen.set(false);
    this.selectedOfferId.set(null);
  }

  prepareRequest() {
    this.requestPrepared.set(true);
  }

  openLegal(document: 'imprint' | 'privacy') {
    this.close();
    this.legalDocument.set(document);
  }

  get emailHref() {
    const body = `${this.copy.emailGreeting}\n\n${this.copy.emailInterest} ${this.interestLabel}.\n\n${this.message}\n\n${this.copy.emailClosing}\n${this.name}\n${this.email}`;
    return `mailto:medeinaa@hotmail.com?subject=${encodeURIComponent(this.copy.emailSubject + this.interestLabel)}&body=${encodeURIComponent(body)}`;
  }
}
