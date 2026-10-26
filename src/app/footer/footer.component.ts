import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteStateService } from '../site-state.service';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly state = inject(SiteStateService);
}
