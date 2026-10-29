import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { SiteStateService } from '../site-state.service';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly state = inject(SiteStateService);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly showBackToTop = signal(false);

  constructor() {
    afterNextRender(() => {
      const view = this.document.defaultView;
      if (!view) return;
      let frame = 0;
      const update = () => {
        const hero = this.document.querySelector<HTMLElement>('.hero');
        const headerHeight =
          this.document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0;
        this.showBackToTop.set(
          hero
            ? hero.getBoundingClientRect().bottom <= headerHeight
            : view.scrollY >= view.innerHeight,
        );
      };
      const schedule = () => {
        view.cancelAnimationFrame(frame);
        frame = view.requestAnimationFrame(update);
      };
      view.addEventListener('scroll', schedule, { passive: true });
      view.addEventListener('resize', schedule, { passive: true });
      this.router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe(() => {
          this.showBackToTop.set(false);
          schedule();
        });
      update();
      this.destroyRef.onDestroy(() => {
        view.cancelAnimationFrame(frame);
        view.removeEventListener('scroll', schedule);
        view.removeEventListener('resize', schedule);
      });
    });
  }

  scrollToTop() {
    const view = this.document.defaultView;
    view?.scrollTo({
      top: 0,
      behavior: view.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }
}
