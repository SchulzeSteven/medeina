import { Component, ElementRef, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SiteStateService } from '../site-state.service';
@Component({
  selector: 'app-header',
  host: { '(document:click)': 'closeOutside($event)' },
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly state = inject(SiteStateService);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  closeOutside(event: MouseEvent) {
    if (this.state.menuOpen() && !this.element.contains(event.target as Node))
      this.state.navigate();
  }
}
