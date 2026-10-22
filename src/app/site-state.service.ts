import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Language, translations } from './translations';
import { googleReviews, googleReviewsProfileUrl } from './google-reviews.data';
import { catalogOffers, CatalogSection } from './catalog/catalog.data';

@Injectable({ providedIn: 'root' })
export class SiteStateService {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  readonly language = signal<Language>('de');
  readonly googleReviews = googleReviews;
  readonly googleReviewsProfileUrl = googleReviewsProfileUrl;
  readonly menuOpen = signal(false);
  readonly catalogOffers = catalogOffers;
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

  get inquiryOffers() {
    const offers = [
      { id: 'intro', title: this.copy.intro },
      ...this.offers,
      ...catalogOffers.map(offer => ({ id: offer.id, title: offer.title[this.language()] })),
    ];
    // Keep context-specific inquiries without narrowing the complete catalogue.
    return offers.some(offer => offer.id === this.interest)
      ? offers
      : [{ id: this.interest, title: this.interestLabel }, ...offers];
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
      catalogOffers.find((offer) => offer.id === this.interest)?.title[this.language()] ??
      this.offers.find((offer) => offer.id === this.interest)?.title ??
      this.events.find((event) => event.id === this.interest)?.title ??
      this.copy.intro
    );
  }

  setLanguage(language: Language) {
    this.language.set(language);
    this.updateDocumentLanguage();
  }

  restorePageMetadata() {
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
    event.preventDefault();
    this.navigate();
    const view = this.document.defaultView;
    if (!view) return;

    const scrollToSection = () => view.requestAnimationFrame(() => {
      const target = this.document.getElementById(id);
      if (!target) return;
      const headerHeight =
        this.document.querySelector('.site-header')?.getBoundingClientRect().height ?? 80;
      const verticalOffset =
        Number.parseFloat(view.getComputedStyle(target).translate.split(' ')[1] ?? '0') || 0;
      const top = id === 'start' ? 0 : Math.max(
        0,
        target.getBoundingClientRect().top + view.scrollY - verticalOffset - headerHeight - 16,
      );
      view.scrollTo({
        top,
        behavior: view.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      });
    });

    if (this.router.url !== '/') {
      void this.router.navigate(['/']).then(navigated => {
        if (navigated) scrollToSection();
      });
    } else {
      scrollToSection();
    }
  }

  book(interest = 'intro') {
    this.legalDocument.set(null);
    this.interest = interest === 'about' ? 'intro' : interest;
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

  navigateCatalog(section: CatalogSection = 'seminars') {
    this.close();
    this.menuOpen.set(false);
    void this.router.navigate(['/angebote'], { queryParams: { bereich: section } });
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
