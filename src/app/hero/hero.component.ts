import { Component, inject } from '@angular/core';
import { SiteStateService } from '../site-state.service';
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  host: { class: 'section-component' },
})
export class HeroComponent {
  readonly state = inject(SiteStateService);
}
