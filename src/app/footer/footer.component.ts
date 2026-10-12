import { Component, inject } from '@angular/core';
import { SiteStateService } from '../site-state.service';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  host: { class: 'section-component' },
})
export class FooterComponent {
  readonly state = inject(SiteStateService);
}
