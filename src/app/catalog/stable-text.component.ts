import { Component, inject, input } from '@angular/core';
import { SiteStateService } from '../site-state.service';

/** Reserve the space of the longest translation at the current viewport width. */
@Component({
  selector: 'app-stable-text',
  standalone: true,
  template: `
    @for (text of texts(); track $index) {
      <span
        [class.active]="languages[$index] === state.language()"
        [attr.aria-hidden]="languages[$index] === state.language() ? null : 'true'"
        [attr.lang]="languages[$index]"
      >
        {{ text }}
      </span>
    }
  `,
  styles: `
    :host {
      display: inline-grid;
      max-width: 100%;
      vertical-align: top;
      min-width: 0;
    }
    span {
      grid-area: 1 / 1;
      visibility: hidden;
      pointer-events: none;
    }
    span.active {
      visibility: visible;
      pointer-events: auto;
    }
  `,
})
export class StableTextComponent {
  readonly state = inject(SiteStateService);
  readonly texts = input.required<readonly string[]>();
  readonly languages = ['de', 'tr', 'en'] as const;
}
