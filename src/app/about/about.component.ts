import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Component, DestroyRef, effect, inject } from '@angular/core';
import { translations } from '../translations';
import { SiteStateService } from '../site-state.service';
import { ScrollRevealDirective } from '../scroll-reveal.directive';
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ScrollRevealDirective, RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  readonly state = inject(SiteStateService);
  readonly certificationCopies = Object.entries(translations).map(([language, copy]) => ({
    language,
    copy,
  }));
  readonly fullPage = inject(ActivatedRoute).snapshot.data['aboutPage'] === true;
  private readonly document = inject(DOCUMENT);

  readonly certificates = {
    rasheeba: {
      title: 'Ra-Sheeba · Çağla Mutlu',
      url: 'certificates/rasheeba.jpeg',
    },
    violetFlame: {
      title: 'Gümüş Mor Alev Reiki · Çağla Mutlu',
      url: 'certificates/reiki1.jpeg',
    },
    kundaliniReiki: {
      title: 'Kundalini Reiki · Çağla Mutlu',
      url: 'certificates/reiki2.jpeg',
    },
    innerspeak: {
      title: 'InnerSpeak™ · Çağla Mutlu',
      url: 'certificates/innerspeak.jpg?v=2',
    },
    regression: {
      title: 'Regression · Çağla Mutlu',
      url: 'certificates/regression.jpg',
    },
    reikiMaster: {
      title: 'Reiki Master · Çağla Mutlu',
      url: 'certificates/reiki-master.jpg',
    },
    dowsing: {
      title: 'Spiritual Dowsing · Çağla Mutlu',
      url: 'certificates/spiritual-dowsing.jpg',
    },
  };
  activeCertificate: keyof typeof this.certificates | null = null;
  private restoreCertificateScroll: (() => void) | null = null;

  openCertificate(dialog: HTMLDialogElement, certificate: keyof typeof this.certificates) {
    this.activeCertificate = certificate;
    const body = this.document.body;
    const root = this.document.documentElement;
    const view = this.document.defaultView;
    const scrollX = view?.scrollX ?? 0;
    const scrollY = view?.scrollY ?? 0;
    dialog.showModal();
    if (!this.restoreCertificateScroll) {
      const previousBody = {
        position: body.style.position,
        top: body.style.top,
        left: body.style.left,
        width: body.style.width,
        overflow: body.style.overflow,
      };
      const previousRootOverflow = root.style.overflow;
      Object.assign(body.style, {
        position: 'fixed',
        top: `-${scrollY}px`,
        left: `-${scrollX}px`,
        width: '100%',
        overflow: 'hidden',
      });
      root.style.overflow = 'hidden';
      this.restoreCertificateScroll = () => {
        Object.assign(body.style, previousBody);
        root.style.overflow = previousRootOverflow;
        view?.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' });
      };
    }
  }

  certificateClosed() {
    this.activeCertificate = null;
    this.restoreCertificateScroll?.();
    this.restoreCertificateScroll = null;
  }

  closeCertificateBackdrop(event: MouseEvent, dialog: HTMLDialogElement) {
    const bounds = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom)
    ) {
      dialog.close();
    }
  }

  requestIntro() {
    this.state.book('intro');
    this.document.defaultView?.requestAnimationFrame(() =>
      this.document.querySelector<HTMLInputElement>('.modal input[name="name"]')?.focus(),
    );
  }

  constructor() {
    inject(DestroyRef).onDestroy(() => this.certificateClosed());
    if (this.fullPage) {
      effect(() => {
        this.document.title = `${this.state.copy.about} · Medeina · Çağla Mutlu`;
        this.document
          .querySelector('meta[name="description"]')
          ?.setAttribute('content', this.state.copy.aboutText);
      });
    }
  }
}
