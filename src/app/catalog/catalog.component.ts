import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SiteStateService } from '../site-state.service';
import { translations } from '../translations';
import { StableTextComponent } from './stable-text.component';
import { catalogGuidance } from './catalog-guidance';
import {
  catalogCategories,
  catalogCopy,
  catalogOffers,
  Category,
  CatalogSection,
} from './catalog.data';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet, StableTextComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent {
  readonly state = inject(SiteStateService);
  private readonly document = inject(DOCUMENT);
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  private readonly query = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });
  private readonly heading = viewChild<ElementRef<HTMLHeadingElement>>('viewHeading');
  readonly selected = computed(
    () => catalogOffers.find((offer) => offer.id === this.params().get('id')) ?? null,
  );
  readonly section = computed<CatalogSection | null>(() => {
    const offer = this.selected();
    if (offer) return offer.section;
    const section = this.query().get('bereich');
    return section === 'seminars' || section === 'sessions' ? section : null;
  });
  readonly basePath = computed(() => '/angebote');
  readonly copy = computed(() => catalogCopy[this.state.language()]);
  readonly guidance = computed(() => catalogGuidance[this.state.language()]);
  readonly categories = computed(() =>
    catalogCategories.filter((category) =>
      catalogOffers.some(
        (offer) => offer.section === this.section() && offer.category === category.id,
      ),
    ),
  );
  readonly filter = computed(() => {
    const offer = this.selected();
    if (offer) return offer.category;
    const category = this.query().get('kategorie');
    return this.categories().some((item) => item.id === category) ? (category as Category) : null;
  });
  readonly offers = computed(() =>
    catalogOffers.filter(
      (offer) => offer.section === this.section() && offer.category === this.filter(),
    ),
  );

  readonly languages = ['de', 'tr', 'en'] as const;

  copyTexts(key: keyof typeof catalogCopy.de) {
    return this.languages.map((language) => catalogCopy[language][key]);
  }

  guidanceTexts(key: Exclude<keyof typeof catalogGuidance.de, 'questions' | 'steps'>) {
    return this.languages.map((language) => catalogGuidance[language][key]);
  }

  headingTexts() {
    const category = catalogCategories.find((item) => item.id === this.filter());
    return this.languages.map((language) =>
      category
        ? category.title[language]
        : this.section() === 'seminars'
          ? catalogCopy[language].title
          : this.section() === 'sessions'
            ? catalogCopy[language].sessions
            : translations[language].offersLabel,
    );
  }

  siteTexts(key: 'englishSupportTitle' | 'englishSupportText' | 'offersLabel') {
    return this.languages.map((language) => translations[language][key]);
  }

  stepTexts(index: number, key: 'title' | 'text') {
    return this.languages.map((language) => catalogGuidance[language].steps[index][key]);
  }

  questionTexts(index: number, key: 'question' | 'answer') {
    return this.languages.map((language) => catalogGuidance[language].questions[index][key]);
  }

  constructor() {
    effect(() => {
      const offer = this.selected();
      const title =
        offer?.title[this.state.language()] ??
        (this.filter() ? this.categoryTitle(this.filter()!) + ' · ' : '') +
          (this.section() === 'sessions'
            ? this.copy().sessions
            : this.section() === 'seminars'
              ? this.copy().title
              : this.state.copy.offersLabel);
      this.document.title = `${title} · Medeina · Çağla Mutlu`;
      this.document
        .querySelector('meta[name="description"]')
        ?.setAttribute('content', offer?.summary[this.state.language()] ?? this.copy().intro);
    });
    afterRenderEffect(() => {
      this.params();
      this.query();
      this.heading()?.nativeElement.focus({ preventScroll: true });
    });
  }

  selectionParams(category: Category | null = this.filter()) {
    return { bereich: this.section(), kategorie: category };
  }

  categoryTitle(category: Category) {
    return catalogCategories.find((item) => item.id === category)!.title[this.state.language()];
  }

  categoryCount(category: Category) {
    return catalogOffers.filter(
      (offer) => offer.section === this.section() && offer.category === category,
    ).length;
  }

  offerTitle(id: string) {
    return (
      catalogOffers.find((offer) => offer.id === id)?.title[this.state.language()] ??
      this.copy().pending
    );
  }

  request(offerId: string) {
    this.state.book(offerId);
    this.document.defaultView?.requestAnimationFrame(() =>
      this.document.querySelector<HTMLInputElement>('.modal input[name="name"]')?.focus(),
    );
  }
}
