import { afterEveryRender, DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SiteStateService } from './site-state.service';
import { translations } from './translations';
import { catalogCategories, catalogCopy, catalogOffers } from './catalog/catalog.data';
import { storeCategories, storeCopy, storeProducts } from './store/store.data';

// Measure all three languages in the real layout, including mobile line breaks.
// Reserve the larger text box rather than imposing fixed heights or clipping text.
@Directive({ selector: '[appStableLanguageLayout]', standalone: true })
export class StableLanguageLayoutDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly state = inject(SiteStateService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly variants = new Map<string, readonly string[]>();
  private signature = '';
  private frame = 0;
  private readonly managed = new Map<HTMLElement, { height: string; width: string }>();
  private readonly selector =
    'h1, h2, h3, p, blockquote, figcaption, dt, dd, a, button, .benefit > span, .event-description > span, .event-description > strong';

  constructor() {
    this.collect(translations);
    this.collect(catalogCopy);
    this.collect(storeCopy);
    for (const data of [catalogCategories, catalogOffers, storeCategories, storeProducts])
      this.collect(data);
    afterEveryRender(() => {
      const signature = `${this.state.language()}:${this.router.url}:${this.host.clientWidth}`;
      if (signature !== this.signature) {
        this.signature = signature;
        this.schedule();
      }
    });
    const view = this.host.ownerDocument.defaultView;
    const onResize = () => this.schedule();
    view?.addEventListener('resize', onResize, { passive: true });
    let destroyed = false;
    void this.host.ownerDocument.fonts.ready.then(() => {
      if (!destroyed) this.schedule();
    });
    this.destroyRef.onDestroy(() => {
      destroyed = true;
      view?.removeEventListener('resize', onResize);
      view?.cancelAnimationFrame(this.frame);
    });
  }

  private collect(value: unknown): void {
    if (!value || typeof value !== 'object') return;
    const localized = value as Record<string, unknown>;
    if (typeof localized['de'] === 'string' && typeof localized['tr'] === 'string') {
      this.zip([localized['de'], localized['tr'], localized['en']]);
    } else if (localized['de'] && localized['tr']) {
      this.zip([localized['de'], localized['tr'], localized['en']]);
    } else {
      Object.values(localized).forEach((item) => this.collect(item));
    }
  }

  private zip(values: unknown[]): void {
    if (values.every((value): value is string => typeof value === 'string')) {
      for (const value of values) this.variants.set(value, values);
    } else if (values.every((value) => value && typeof value === 'object')) {
      for (const key of Object.keys(values[0] as object)) {
        this.zip(values.map((value) => (value as Record<string, unknown>)[key]));
      }
    }
  }

  private schedule(): void {
    const view = this.host.ownerDocument.defaultView;
    if (!view) return;
    view.cancelAnimationFrame(this.frame);
    this.frame = view.requestAnimationFrame(() => this.measure());
  }

  private measure(): void {
    const document = this.host.ownerDocument;
    for (const [element, original] of this.managed) {
      element.style.minHeight = original.height;
      element.style.minWidth = original.width;
    }
    this.managed.clear();
    const elements = Array.from(this.host.querySelectorAll<HTMLElement>(this.selector)).filter(
      (element) => !element.closest('app-store'),
    );
    const clones = [0, 1, 2].map((languageIndex) => {
      const clone = this.host.cloneNode(true) as HTMLElement;
      clone.setAttribute('aria-hidden', 'true');
      clone.inert = true;
      clone.style.cssText = `position:fixed;left:0;top:0;width:${this.host.clientWidth}px;visibility:hidden;pointer-events:none;z-index:-1;`;
      clone.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
      clone.querySelectorAll<HTMLElement>('*').forEach((node) => {
        node.style.setProperty('animation', 'none', 'important');
        node.style.setProperty('transition', 'none', 'important');
      });
      {
        const walker = document.createTreeWalker(clone, 4);
        while (walker.nextNode()) {
          const node = walker.currentNode;
          const text = node.textContent ?? '';
          const alternate = this.variants.get(text.trim())?.[languageIndex];
          if (alternate) node.textContent = text.replace(text.trim(), alternate);
        }
      }
      document.body.appendChild(clone);
      return clone;
    });
    try {
      const copies = clones.map((clone) =>
        Array.from(clone.querySelectorAll<HTMLElement>(this.selector)).filter(
          (element) => !element.closest('app-store'),
        ),
      );
      // Give translated controls the same width before measuring text wrapping.
      elements.forEach((element, index) => {
        this.managed.set(element, {
          height: element.style.minHeight,
          width: element.style.minWidth,
        });
        if (
          !element.matches('a, button') ||
          element.querySelector('img') ||
          !element.getClientRects().length
        )
          return;
        const variants = copies.map((copy) => copy[index]);
        variants.forEach((copy) => {
          copy.style.width = 'max-content';
          copy.style.maxWidth = '100%';
        });
        const width = Math.ceil(
          Math.max(...variants.map((copy) => copy.getBoundingClientRect().width)),
        );
        const available = element.parentElement?.clientWidth ?? width;
        if (width > 0 && width <= available) {
          element.style.minWidth = `${width}px`;
          variants.forEach((copy) => {
            copy.style.width = '';
            copy.style.minWidth = `${width}px`;
          });
        } else {
          variants.forEach((copy) => {
            copy.style.width = '';
          });
        }
      });
      elements.forEach((element, index) => {
        const height = Math.ceil(
          Math.max(...copies.map((copy) => copy[index].getBoundingClientRect().height)),
        );
        if (height > 0) element.style.minHeight = `${height}px`;
      });
    } finally {
      clones.forEach((clone) => clone.remove());
    }
  }
}
