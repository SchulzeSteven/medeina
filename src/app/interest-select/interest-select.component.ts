import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-interest-select',
  standalone: true,
  templateUrl: './interest-select.component.html',
  styleUrl: './interest-select.component.scss',
  host: {
    '(document:pointerdown)': 'closeOutside($event)',
    '(focusout)': 'onFocusOut($event)',
    '(window:resize)': 'updateListHeight()',
  },
})
export class InterestSelectComponent {
  readonly label = input.required<string>();
  readonly options = input.required<readonly { id: string; title: string }[]>();
  readonly value = model.required<string>();
  readonly open = signal(false);
  readonly activeIndex = signal(0);
  readonly listHeight = signal(320);
  readonly title = computed(
    () => this.options().find((option) => option.id === this.value())?.title ?? '',
  );
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private search = '';
  private lastKeyTime = 0;
  private frame: number | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      if (this.frame !== null)
        this.host.ownerDocument.defaultView?.cancelAnimationFrame(this.frame);
    });
  }

  toggle() {
    if (this.open()) {
      this.open.set(false);
      return;
    }
    this.activeIndex.set(
      Math.max(
        0,
        this.options().findIndex((option) => option.id === this.value()),
      ),
    );
    this.updateListHeight();
    this.open.set(true);
    this.search = '';
  }

  updateListHeight() {
    const trigger = this.host.querySelector<HTMLElement>('[role="combobox"]');
    const dialog = this.host.closest<HTMLElement>('.modal');
    const view = this.host.ownerDocument.defaultView;
    if (!trigger || !view) return;
    const bottom = Math.min(
      view.innerHeight,
      dialog?.getBoundingClientRect().bottom ?? view.innerHeight,
    );
    this.listHeight.set(
      Math.max(48, Math.min(320, bottom - trigger.getBoundingClientRect().bottom - 16)),
    );
  }

  choose(index: number, focus = true) {
    const option = this.options()[index];
    if (!option) return;
    this.value.set(option.id);
    this.open.set(false);
    if (focus)
      this.host.querySelector<HTMLElement>('[role="combobox"]')?.focus({ preventScroll: true });
  }

  onKeydown(event: KeyboardEvent) {
    const wasOpen = this.open();
    if (event.key === 'Escape') {
      if (wasOpen) {
        event.stopPropagation();
        this.open.set(false);
      }
      return;
    }
    if (event.key === 'Tab') {
      if (wasOpen) this.choose(this.activeIndex(), false);
      return;
    }
    if (event.ctrlKey || event.metaKey) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (wasOpen) this.choose(this.activeIndex());
      else this.toggle();
      return;
    }
    const movement: Record<string, number> = {
      ArrowDown: 1,
      ArrowUp: -1,
      PageDown: 10,
      PageUp: -10,
    };
    if (event.key in movement || event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      if (!wasOpen) this.toggle();
      if (event.altKey && event.key === 'ArrowUp' && wasOpen) {
        this.choose(this.activeIndex());
        return;
      }
      const last = this.options().length - 1;
      const next =
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? last
            : this.activeIndex() + (wasOpen ? movement[event.key] : 0);
      this.setActive(Math.max(0, Math.min(last, next)));
    } else if (event.key.length === 1 && !event.altKey) {
      event.preventDefault();
      if (!wasOpen) this.toggle();
      const now = Date.now();
      this.search = now - this.lastKeyTime > 700 ? event.key : this.search + event.key;
      this.lastKeyTime = now;
      const normalize = (text: string) =>
        text
          .toLocaleLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
      const query = normalize(this.search);
      const repeating = [...query].every((char) => char === query[0]);
      const prefix = repeating ? query[0] : query;
      const options = this.options();
      for (let offset = 1; offset <= options.length; offset++) {
        const index = (this.activeIndex() + offset) % options.length;
        if (normalize(options[index].title).startsWith(prefix)) {
          this.setActive(index);
          break;
        }
      }
    }
  }

  closeOutside(event: Event) {
    if (!this.host.contains(event.target as Node)) this.open.set(false);
  }

  onFocusOut(event: FocusEvent) {
    if (event.relatedTarget && !this.host.contains(event.relatedTarget as Node) && this.open()) {
      this.choose(this.activeIndex(), false);
    }
  }

  private setActive(index: number) {
    this.activeIndex.set(index);
    this.afterRender(() =>
      this.host
        .querySelector<HTMLElement>(`[id="interest-option-${index}"]`)
        ?.scrollIntoView({ block: 'nearest', behavior: 'instant' }),
    );
  }

  private afterRender(callback: () => void) {
    const view = this.host.ownerDocument.defaultView;
    if (!view) return;
    if (this.frame !== null) view.cancelAnimationFrame(this.frame);
    this.frame = view.requestAnimationFrame(() => {
      this.frame = null;
      callback();
    });
  }
}
