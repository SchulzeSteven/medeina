import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  afterRenderEffect,
  Component,
  DestroyRef,
  ElementRef,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InterestSelectComponent } from '../interest-select/interest-select.component';
import { SiteStateService } from '../site-state.service';

@Component({
  selector: 'app-dialogs',
  standalone: true,
  imports: [FormsModule, InterestSelectComponent],
  templateUrl: './dialogs.component.html',
  styleUrl: './dialogs.component.scss',
})
export class DialogsComponent {
  readonly state = inject(SiteStateService);
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private opener: HTMLElement | null = null;
  private active = false;
  private overflow = '';
  private inertElements: { element: HTMLElement; inert: boolean }[] = [];

  constructor() {
    afterRenderEffect(() => {
      const open = !!(
        this.state.selectedOfferId() ||
        this.state.bookingOpen() ||
        this.state.legalDocument()
      );
      const prepared = this.state.requestPrepared();
      if (open && !this.active) {
        this.active = true;
        this.opener = this.document.activeElement as HTMLElement | null;
        this.overflow = this.document.body.style.overflow;
        this.document.body.style.overflow = 'hidden';
        this.inertElements = Array.from(
          this.document.querySelectorAll<HTMLElement>('app-header, #main-content, app-footer'),
        ).map((element) => ({ element, inert: element.inert }));
        for (const { element } of this.inertElements) element.inert = true;
        this.host.querySelector<HTMLElement>('.modal-close')?.focus({ preventScroll: true });
      } else if (!open && this.active) {
        this.restore();
      }
      if (open && prepared) {
        const heading = this.host.querySelector<HTMLElement>('.confirmation h3');
        heading?.setAttribute('tabindex', '-1');
        heading?.focus({ preventScroll: true });
      }
    });
    afterNextRender(() => {
      const onKeydown = (event: KeyboardEvent) => {
        if (!this.active || event.key !== 'Tab') return;
        const controls = Array.from(
          this.host.querySelectorAll<HTMLElement>(
            '.modal :is(a[href], button, input, textarea, select, [tabindex="0"]):not([disabled])',
          ),
        ).filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls.at(-1);
        if (!first || !last) return;
        if (
          event.shiftKey &&
          (this.document.activeElement === first ||
            !controls.includes(this.document.activeElement as HTMLElement))
        ) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && this.document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      };
      this.document.addEventListener('keydown', onKeydown);
      this.destroyRef.onDestroy(() => this.document.removeEventListener('keydown', onKeydown));
    });
    this.destroyRef.onDestroy(() => {
      if (this.active) this.restore();
    });
  }

  private readonly destroyRef = inject(DestroyRef);

  private restore() {
    this.active = false;
    this.document.body.style.overflow = this.overflow;
    for (const { element, inert } of this.inertElements) element.inert = inert;
    this.inertElements = [];
    if (this.opener?.isConnected) this.opener.focus({ preventScroll: true });
    this.opener = null;
  }
}
