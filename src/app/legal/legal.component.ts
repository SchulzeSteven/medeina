import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { SiteStateService } from '../site-state.service';
import { privacyCopy, privacySources } from './privacy.data';
import { imprintCopy } from './imprint.data';

@Component({
  selector: 'app-legal',
  standalone: true,
  template: `
    <article
      class="legal-page container"
      aria-labelledby="legal-title"
    >
      <h1 id="legal-title">{{ title() }}</h1>
      @if (isPrivacy()) {
        <p>{{ privacy().updated }}</p>
        <p class="draft">{{ privacy().draft }}</p>
        <p>{{ privacy().summary }}</p>
        <nav
          class="legal-contents"
          [attr.aria-label]="title()"
        >
          @for (section of privacy().sections; track $index) {
            <a [href]="'datenschutz#privacy-' + $index">{{ section.title }}</a>
          }
        </nav>
        @for (section of privacy().sections; track $index) {
          <section
            [id]="'privacy-' + $index"
            [attr.aria-labelledby]="'privacy-heading-' + $index"
          >
            <h2 [id]="'privacy-heading-' + $index">{{ section.title }}</h2>
            @for (paragraph of section.paragraphs; track $index) {
              <p>{{ paragraph }}</p>
            }
          </section>
        }
        <section aria-labelledby="privacy-sources">
          <h2 id="privacy-sources">{{ privacy().sources }}</h2>
          <ul>
            @for (source of sources; track source.url) {
              <li>
                <a
                  [href]="source.url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ source.title }} ↗
                </a>
              </li>
            }
          </ul>
        </section>
        <p>{{ privacy().contact }}</p>
      } @else {
        <p class="draft">{{ imprint().draft }}</p>
        @for (section of imprint().sections; track $index) {
          <section [attr.aria-labelledby]="'imprint-heading-' + $index">
            <h2 [id]="'imprint-heading-' + $index">{{ section.title }}</h2>
            @for (paragraph of section.paragraphs; track $index) {
              <p>{{ paragraph }}</p>
            }
          </section>
        }
      }
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
    .legal-page > section {
      margin-top: 40px;
      scroll-margin-top: calc(var(--header-height) + 24px);
    }
    h2 {
      font-size: clamp(25px, 3vw, 32px);
      line-height: 1.3;
      margin-bottom: 20px;
    }
    .legal-contents {
      display: grid;
      gap: 8px;
      margin-block: 32px;
    }
    .legal-contents a,
    li a {
      display: inline-block;
      padding-block: 10px;
      color: var(--teal);
      text-decoration: underline;
      text-underline-offset: 4px;
    }
    li {
      margin-left: 20px;
    }
    h1 {
      font-size: clamp(40px, 5vw, 64px);
      margin-bottom: 32px;
    }
    p {
      color: var(--ink);
      line-height: 1.8;
      margin-bottom: 24px;
    }
    .draft {
      color: var(--brown);
      padding: 24px;
      background: var(--sand);
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
  readonly isPrivacy = computed(() => this.data()['document'] === 'privacy');
  readonly privacy = computed(() => privacyCopy[this.state.language()]);
  readonly imprint = computed(() => imprintCopy[this.state.language()]);
  readonly sources = privacySources;
  readonly title = computed(() =>
    this.data()['document'] === 'imprint' ? this.state.copy.imprint : this.state.copy.privacy,
  );
  readonly description = computed(() =>
    this.data()['document'] === 'imprint' ? this.imprint().summary : this.privacy().summary,
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
