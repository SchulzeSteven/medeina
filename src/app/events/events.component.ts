import { Component, inject } from '@angular/core';
import { SiteStateService } from '../site-state.service';
import { ScrollRevealDirective } from '../scroll-reveal.directive';
@Component({
  selector: 'app-events',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './events.component.html',
  host: { class: 'section-component' },
})
export class EventsComponent {
  readonly state = inject(SiteStateService);
}
