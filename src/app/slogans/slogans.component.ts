import { Component, inject } from '@angular/core';
import { SiteStateService } from '../site-state.service';
import { ScrollRevealDirective } from '../scroll-reveal.directive';
@Component({
  selector: 'app-slogans',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './slogans.component.html',
  styleUrl: './slogans.component.scss',
})
export class SlogansComponent {
  readonly state = inject(SiteStateService);
}
