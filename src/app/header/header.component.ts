import { Component, inject } from '@angular/core';
import { SiteStateService } from '../site-state.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly state = inject(SiteStateService);
}
