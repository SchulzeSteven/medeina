import { Component, inject } from '@angular/core';
import { SiteStateService } from '../site-state.service';

const contactCopy = {
  de: {
    title: 'Lass uns ins Gespräch kommen.',
    text: 'Du hast eine Frage oder möchtest herausfinden, welches Angebot zu dir passt? Schreib mir.',
    action: 'Nachricht schreiben',
  },
  tr: {
    title: 'Birlikte konuşalım.',
    text: 'Bir sorun mu var veya sana uygun hizmeti mi arıyorsun? Bana yaz.',
    action: 'Mesaj yaz',
  },
};

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  readonly state = inject(SiteStateService);
  get copy() {
    return contactCopy[this.state.language()];
  }
}
