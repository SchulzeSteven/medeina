import { Component, inject } from '@angular/core';
import { ScrollRevealDirective } from '../scroll-reveal.directive';
import { SiteStateService } from '../site-state.service';

@Component({
  selector: 'app-benefits',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './benefits.component.html',
  styleUrl: './benefits.component.scss',
})
export class BenefitsComponent {
  readonly state = inject(SiteStateService);
}
