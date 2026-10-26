import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SiteStateService } from '../site-state.service';
import { storeCategories, storeCopy, storeProducts, StoreProduct } from './store.data';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss',
})
export class StoreComponent {
  readonly state = inject(SiteStateService);
  private readonly document = inject(DOCUMENT);
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  private readonly query = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });
  readonly categories = storeCategories;
  readonly copy = computed(() => storeCopy[this.state.language()]);
  readonly selected = computed(
    () => storeProducts.find((p) => p.id === this.params().get('id')) ?? null,
  );
  readonly filter = computed(
    () => storeCategories.find((c) => c.id === this.query().get('kategorie'))?.id ?? 'alle',
  );
  readonly products = computed(() =>
    storeProducts.filter((p) => this.filter() === 'alle' || p.category === this.filter()),
  );
  constructor() {
    effect(() => {
      const product = this.selected();
      this.document.title = `${product?.title[this.state.language()] ?? 'Store'} · Medeina · Çağla Mutlu`;
      this.document
        .querySelector('meta[name="description"]')
        ?.setAttribute('content', product?.description[this.state.language()] ?? this.copy().intro);
    });
  }
  formatPrice(product: StoreProduct) {
    return new Intl.NumberFormat(this.state.language() === 'de' ? 'de-DE' : 'tr-TR', {
      style: 'currency',
      currency: 'EUR',
    }).format(product.priceCents / 100);
  }
  inquiryHref(product: StoreProduct) {
    const title = product.title[this.state.language()];
    return `mailto:medeinaa@hotmail.com?subject=${encodeURIComponent(this.copy().subject + title)}&body=${encodeURIComponent(this.copy().body + title + this.copy().bodyEnd)}`;
  }
}
