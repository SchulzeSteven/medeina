import { Component, inject } from '@angular/core';
import { SiteStateService } from '../site-state.service';
import { ScrollRevealDirective } from '../scroll-reveal.directive';
@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './offers.component.html',
  host: { class: 'section-component' },
})
export class OffersComponent {
  readonly state = inject(SiteStateService);
}
