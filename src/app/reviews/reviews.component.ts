import { Component, inject } from '@angular/core';
import { SiteStateService } from '../site-state.service';
import { GoogleReviewsComponent } from '../google-reviews.component';
@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [GoogleReviewsComponent],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss',
})
export class ReviewsComponent {
  readonly state = inject(SiteStateService);
}
