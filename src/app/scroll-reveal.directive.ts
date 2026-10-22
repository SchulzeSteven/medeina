import { afterNextRender, DestroyRef, Directive, ElementRef, inject } from '@angular/core';

@Directive({ selector: '[appScrollReveal]', standalone: true })
export class ScrollRevealDirective {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const view = this.element.ownerDocument.defaultView;
      if (!view?.IntersectionObserver) return;
      const preference = view.matchMedia('(prefers-reduced-motion: reduce)');
      // Reveal meaningful groups instead of moving entire page sections.
      const groups = this.element.querySelectorAll<HTMLElement>(
        '.about-image-group, .about-content, .slogan-card, .offer-card, .events-heading, .event-card',
      );
      const targets = groups.length ? Array.from(groups) : [this.element];
      const observer = new view.IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.remove('reveal-pending');
          observer.unobserve(entry.target);
        }
      }, { rootMargin: '0px 0px 32px 0px', threshold: 0 });
      for (const target of targets) {
        target.classList.add('reveal-target');
        if (!preference.matches && target.getBoundingClientRect().top > view.innerHeight) {
          target.classList.add('reveal-pending');
          observer.observe(target);
        }
      }
      const showAll = () => {
        for (const target of targets) target.classList.remove('reveal-pending');
        observer.disconnect();
      };
      const onPreferenceChange = () => { if (preference.matches) showAll(); };
      const onFocus = () => showAll();
      preference.addEventListener('change', onPreferenceChange);
      this.element.addEventListener('focusin', onFocus);
      this.destroyRef.onDestroy(() => {
        observer.disconnect();
        preference.removeEventListener('change', onPreferenceChange);
        this.element.removeEventListener('focusin', onFocus);
      });
    });
  }
}
