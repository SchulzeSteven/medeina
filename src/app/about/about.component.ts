import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Component, effect, inject } from '@angular/core';
import { SiteStateService } from '../site-state.service';
import { ScrollRevealDirective } from '../scroll-reveal.directive';
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ScrollRevealDirective, RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  readonly state = inject(SiteStateService);
  readonly fullPage = inject(ActivatedRoute).snapshot.data['aboutPage'] === true;
  private readonly document = inject(DOCUMENT);

  requestIntro() {
    this.state.book('intro');
    this.document.defaultView?.requestAnimationFrame(() =>
      this.document.querySelector<HTMLInputElement>('.modal input[name="name"]')?.focus(),
    );
  }

  constructor() {
    if (this.fullPage) {
      effect(() => {
        this.document.title = `${this.state.copy.about} · Medeina · Çağla Mutlu`;
        this.document
          .querySelector('meta[name="description"]')
          ?.setAttribute('content', this.state.copy.aboutText);
      });
    }
  }
}
