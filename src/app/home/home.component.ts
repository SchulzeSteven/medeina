import { Component, inject } from '@angular/core';
import { SiteStateService } from '../site-state.service';
import { HeroComponent } from '../hero/hero.component';
import { BenefitsComponent } from '../benefits/benefits.component';
import { AboutComponent } from '../about/about.component';
import { SlogansComponent } from '../slogans/slogans.component';
import { OffersComponent } from '../offers/offers.component';
import { QuoteComponent } from '../quote/quote.component';
import { EventsComponent } from '../events/events.component';
import { InstagramComponent } from '../instagram/instagram.component';
import { ReviewsComponent } from '../reviews/reviews.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, BenefitsComponent, AboutComponent, SlogansComponent, OffersComponent,
    QuoteComponent, EventsComponent, InstagramComponent, ReviewsComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor() { inject(SiteStateService).restorePageMetadata(); }
}
