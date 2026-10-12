import { Component, inject } from '@angular/core';
import { SiteStateService } from '../site-state.service';

@Component({
  selector: 'app-benefits',
  standalone: true,
  imports: [],
  templateUrl: './benefits.component.html',
  host: { class: 'section-component' },
})
export class BenefitsComponent {
  readonly state = inject(SiteStateService);
}
