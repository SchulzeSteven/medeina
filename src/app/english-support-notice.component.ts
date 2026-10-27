import { Component, inject } from '@angular/core';
import { SiteStateService } from './site-state.service';

@Component({
  selector: 'app-english-support-notice',
  standalone: true,
  host: {
    '[style.display]': "state.language() === 'en' ? 'block' : 'none'",
  },
  template: `
    <aside [attr.aria-label]="state.copy.englishSupportTitle">
      <h3>{{ state.copy.englishSupportTitle }}</h3>
      <p>{{ state.copy.englishSupportText }}</p>
    </aside>
  `,
  styles: `
    :host {
      display: block;
      margin-block: 32px;
    }
    aside {
      padding: clamp(20px, 3vw, 28px);
      border-left: 3px solid var(--gold);
      border-radius: 0 12px 12px 0;
      background: var(--paper);
      color: var(--ink);
    }
    h3 {
      margin: 0 0 10px;
      font-size: 23px;
      line-height: 1.35;
      color: var(--teal-deep);
    }
    p {
      margin: 0;
      font-size: 16px;
      line-height: 1.7;
    }
  `,
})
export class EnglishSupportNoticeComponent {
  readonly state = inject(SiteStateService);
}
