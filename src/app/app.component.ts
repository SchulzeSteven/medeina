import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { StableLanguageLayoutDirective } from './stable-language-layout.directive';
import { DialogsComponent } from './dialogs/dialogs.component';

@Component({
  selector: 'app-root',
  hostDirectives: [StableLanguageLayoutDirective],
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, DialogsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor() {
    const document = inject(DOCUMENT);
    inject(ViewportScroller).setOffset(() => [
      0,
      (document.querySelector('.site-header')?.getBoundingClientRect().height ?? 80) + 16,
    ]);
  }
}
