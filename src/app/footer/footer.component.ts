import { Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
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

  scrollToTop() {
    const view = this.document.defaultView;
    view?.scrollTo({
      top: 0,
      behavior: view.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }
}
