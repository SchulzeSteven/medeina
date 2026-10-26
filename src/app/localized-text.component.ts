import { Component, inject, input } from '@angular/core';
import { SiteStateService } from './site-state.service';
import { Language } from './translations';

export type LocalizedText = Readonly<Record<Language, string>>;

@Component({
  selector: 'app-localized-text',
  standalone: true,
  template: `
    @for (language of languages; track language) {
      <span
        [lang]="language"
        [class.active]="state.language() === language"
        [attr.aria-hidden]="state.language() === language ? null : 'true'"
      >
        {{ text()[language] }}
      </span>
    }
  `,
  styles: `
    :host {
      display: inline-grid;
      max-width: 100%;
      min-width: 0;
      vertical-align: top;
    }

    span {
      grid-area: 1 / 1;
      min-width: 0;
      visibility: hidden;
      overflow-wrap: inherit;
    }

    .active {
      visibility: inherit;
    }
  `,
})
export class LocalizedTextComponent {
  readonly text = input.required<LocalizedText>();
  readonly state = inject(SiteStateService);
  readonly languages: readonly Language[] = ['de', 'tr'];
}
