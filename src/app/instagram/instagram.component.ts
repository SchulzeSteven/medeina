import { Component, inject } from '@angular/core';
import { SiteStateService } from '../site-state.service';
import { InstagramFeedComponent } from '../instagram-feed.component';
@Component({
  selector: 'app-instagram',
  standalone: true,
  imports: [InstagramFeedComponent],
  templateUrl: './instagram.component.html',
  host: { class: 'section-component' },
})
export class InstagramComponent {
  readonly state = inject(SiteStateService);
}
