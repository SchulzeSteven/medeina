import { Component, inject } from '@angular/core';
import { SiteStateService } from '../site-state.service';

@Component({
  selector: 'app-quote',
  standalone: true,
  imports: [],
  templateUrl: './quote.component.html',
  styleUrl: './quote.component.scss',
})
export class QuoteComponent {
  readonly state = inject(SiteStateService);
}
