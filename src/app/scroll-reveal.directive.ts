import { afterNextRender, DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { scrollRevealProgress } from './scroll-reveal-progress';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const view = this.element.ownerDocument.defaultView;
      if (!view) return;

      const motionPreference = view.matchMedia('(prefers-reduced-motion: reduce)');
      const narrowViewport = view.matchMedia('(width < 600px)');
      let frame: number | null = null;
      let previousProgress = -1;

      const update = () => {
        frame = null;
        const animationEnabled = !motionPreference.matches && !narrowViewport.matches;
        this.element.classList.toggle('scroll-reveal-ready', animationEnabled);

        if (!animationEnabled) {
          this.element.style.setProperty('--reveal-progress', '1');
          previousProgress = 1;
          return;
        }

        const remainingScroll = Math.max(
          0,
          this.element.ownerDocument.documentElement.scrollHeight - view.scrollY - view.innerHeight,
        );
        // Measure the original section position when the entire section moves vertically.
        const verticalOffset =
          this.element.dataset['reveal'] === 'bottom'
            ? Number.parseFloat(
                view.getComputedStyle(this.element).translate.split(' ')[1] ?? '0',
              ) || 0
            : 0;
        const progress = scrollRevealProgress(
          this.element.getBoundingClientRect().top - verticalOffset,
          view.innerHeight,
          remainingScroll,
        );

        if (progress !== previousProgress) {
          this.element.style.setProperty('--reveal-progress', progress.toFixed(4));
          previousProgress = progress;
        }
      };

      // Coalesce scroll events into one update per painted frame.
      const scheduleUpdate = () => {
        if (frame === null) frame = view.requestAnimationFrame(update);
      };

      view.addEventListener('scroll', scheduleUpdate, { passive: true });
      view.addEventListener('resize', scheduleUpdate);
      motionPreference.addEventListener('change', scheduleUpdate);
      narrowViewport.addEventListener('change', scheduleUpdate);
      const resizeObserver = view.ResizeObserver ? new view.ResizeObserver(scheduleUpdate) : null;
      resizeObserver?.observe(this.element.ownerDocument.body);
      update();

      this.destroyRef.onDestroy(() => {
        view.removeEventListener('scroll', scheduleUpdate);
        view.removeEventListener('resize', scheduleUpdate);
        motionPreference.removeEventListener('change', scheduleUpdate);
        narrowViewport.removeEventListener('change', scheduleUpdate);
        resizeObserver?.disconnect();
        if (frame !== null) view.cancelAnimationFrame(frame);
      });
    });
  }
}
