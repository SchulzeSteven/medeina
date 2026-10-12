import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DialogsComponent } from './dialogs/dialogs.component';
import { HeroComponent } from './hero/hero.component';
import { BenefitsComponent } from './benefits/benefits.component';
import { AboutComponent } from './about/about.component';
import { SlogansComponent } from './slogans/slogans.component';
import { OffersComponent } from './offers/offers.component';
import { QuoteComponent } from './quote/quote.component';
import { EventsComponent } from './events/events.component';
import { InstagramComponent } from './instagram/instagram.component';
import { ReviewsComponent } from './reviews/reviews.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, DialogsComponent, HeroComponent, BenefitsComponent, AboutComponent, SlogansComponent, OffersComponent, QuoteComponent, EventsComponent, InstagramComponent, ReviewsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
