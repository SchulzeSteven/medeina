import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, Scroll } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { StableLanguageLayoutDirective } from './stable-language-layout.directive';
import { DialogsComponent } from './dialogs/dialogs.component';

@Component({
  selector: 'app-root',
  hostDirectives: [StableLanguageLayoutDirective],
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, DialogsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor() {
    const document = inject(DOCUMENT);
    const scroller = inject(ViewportScroller);
    scroller.setHistoryScrollRestoration('manual');
    scroller.setOffset(() => [
      0,
      (document.querySelector('.site-header')?.getBoundingClientRect().height ?? 80) + 16,
    ]);

    // Keep page changes instant, but animate the Store collection filters.
    inject(Router)
      .events.pipe(
        filter((event): event is Scroll => event instanceof Scroll),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        if (event.position) {
          scroller.scrollToPosition(event.position, { behavior: 'instant' });
        } else if (event.anchor) {
          const reducedMotion = document.defaultView?.matchMedia(
            '(prefers-reduced-motion: reduce)',
          ).matches;
          scroller.scrollToAnchor(event.anchor, {
            behavior: event.anchor === 'kollektion' && !reducedMotion ? 'smooth' : 'instant',
          });
        } else {
          scroller.scrollToPosition([0, 0], { behavior: 'instant' });
        }
      });
  }
}
