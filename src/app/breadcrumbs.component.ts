import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { SiteStateService } from './site-state.service';
import { breadcrumbsFor } from './breadcrumbs.data';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (crumbs().length) {
      <nav
        class="container"
        [attr.aria-label]="label()"
      >
        <ol>
          @for (crumb of crumbs(); track $index; let last = $last) {
            <li>
              @if (!$first) {
                <span
                  class="separator"
                  aria-hidden="true"
                >
                  /
                </span>
              }
              @if (last) {
                <span aria-current="page">{{ crumb.label }}</span>
              } @else {
                <a
                  [routerLink]="crumb.path"
                  [queryParams]="crumb.queryParams"
                >
                  {{ crumb.label }}
                </a>
              }
            </li>
          }
        </ol>
      </nav>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    nav {
      padding-block: 20px 0;
    }
    ol {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 4px 10px;
      margin: 0;
      padding: 0;
      list-style: none;
      font-size: 14px;
      line-height: 1.6;
    }
    li {
      display: inline-flex;
      align-items: baseline;
      gap: 10px;
      min-width: 0;
    }
    a {
      display: inline-block;
      padding-block: 10px;
      color: var(--teal);
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    .separator {
      color: var(--brown);
    }
    [aria-current] {
      color: var(--muted);
      overflow-wrap: anywhere;
    }
  `,
})
export class BreadcrumbsComponent {
  private readonly router = inject(Router);
  private readonly state = inject(SiteStateService);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
  readonly crumbs = computed(() => breadcrumbsFor(this.url(), this.state.language()));
  readonly label = computed(
    () =>
      ({ de: 'Brotkrumennavigation', tr: 'Gezinme yolu', en: 'Breadcrumbs' })[
        this.state.language()
      ],
  );
}
