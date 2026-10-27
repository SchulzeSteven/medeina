import { Component, inject } from '@angular/core';
import { SiteStateService } from '../site-state.service';
import { ScrollRevealDirective } from '../scroll-reveal.directive';
import { EnglishSupportNoticeComponent } from '../english-support-notice.component';
@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [ScrollRevealDirective, EnglishSupportNoticeComponent],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.scss',
})
export class OffersComponent {
  readonly state = inject(SiteStateService);
}
