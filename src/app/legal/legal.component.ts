import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { SiteStateService } from '../site-state.service';

@Component({
  selector: 'app-legal',
  standalone: true,
  template: `
    <article
      class="legal-page container"
      aria-labelledby="legal-title"
    >
      <h1 id="legal-title">{{ title() }}</h1>
      <p class="draft">{{ state.copy.legalDraft }}</p>
      <p>{{ description() }}</p>
      <a
        class="button button-outline"
        href="mailto:medeinaa@hotmail.com"
      >
        {{ state.copy.emailLink }}
      </a>
    </article>
  `,
  styles: `
    :host {
      display: block;
    }
    .legal-page {
      padding-block: clamp(40px, 7vw, 88px) var(--section-space);
      min-height: 55vh;
    }
    h1 {
      font-size: clamp(40px, 5vw, 64px);
      margin-bottom: 32px;
    }
    p {
      max-width: 70ch;
      color: var(--muted);
      margin-bottom: 24px;
    }
    .draft {
      color: var(--brown);
    }
    .button {
      margin-top: 8px;
    }
  `,
})
export class LegalComponent {
  readonly state = inject(SiteStateService);
  private readonly document = inject(DOCUMENT);
  private readonly route = inject(ActivatedRoute);
  private readonly data = toSignal(this.route.data, { initialValue: this.route.snapshot.data });
  readonly title = computed(() =>
    this.data()['document'] === 'imprint' ? this.state.copy.imprint : this.state.copy.privacy,
  );
  readonly description = computed(() =>
    this.data()['document'] === 'imprint'
      ? this.state.copy.imprintPending
      : this.state.copy.privacyPending,
  );

  constructor() {
    effect(() => {
      this.document.title = `${this.title()} · Medeina · Çağla Mutlu`;
      this.document
        .querySelector('meta[name="description"]')
        ?.setAttribute('content', this.description());
    });
  }
}
