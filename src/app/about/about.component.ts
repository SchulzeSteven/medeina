import { Component, inject } from '@angular/core';
import { SiteStateService } from '../site-state.service';
import { ScrollRevealDirective } from '../scroll-reveal.directive';
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './about.component.html',
  host: { class: 'section-component' },
})
export class AboutComponent {
  readonly state = inject(SiteStateService);
}
