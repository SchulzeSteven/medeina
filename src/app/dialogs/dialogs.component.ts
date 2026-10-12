import { Component, inject } from '@angular/core';
import { SiteStateService } from '../site-state.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-dialogs',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './dialogs.component.html',
  styleUrl: './dialogs.component.scss',
})
export class DialogsComponent {
  readonly state = inject(SiteStateService);
}
