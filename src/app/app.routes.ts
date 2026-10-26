import { inject } from '@angular/core';
import { CanActivateFn, RedirectFunction, Router, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { catalogOffers } from './catalog/catalog.data';
import { storeProducts } from './store/store.data';

const validOffer: CanActivateFn = (route) =>
  catalogOffers.some((offer) => offer.id === route.paramMap.get('id')) ||
  inject(Router).createUrlTree(['/angebote']);
const catalogPage = () =>
  import('./catalog/catalog.component').then((module) => module.CatalogComponent);
const legacyOverview =
  (section: 'seminars' | 'sessions'): RedirectFunction =>
  ({ queryParams }) =>
    inject(Router).createUrlTree(['/angebote'], {
      queryParams: { ...queryParams, bereich: section },
    });

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  {
    path: 'ueber-mich',
    loadComponent: () => import('./about/about.component').then((m) => m.AboutComponent),
    data: { aboutPage: true },
  },
  {
    path: 'store',
    loadComponent: () => import('./store/store.component').then((m) => m.StoreComponent),
  },
  {
    path: 'store/:id/checkout',
    loadComponent: () => import('./checkout/checkout.component').then((m) => m.CheckoutComponent),
    canActivate: [
      (route) =>
        storeProducts.some((p) => p.id === route.paramMap.get('id')) ||
        inject(Router).createUrlTree(['/store']),
    ],
  },
  {
    path: 'store/:id',
    loadComponent: () => import('./store/store.component').then((m) => m.StoreComponent),
    canActivate: [
      (route) =>
        storeProducts.some((p) => p.id === route.paramMap.get('id')) ||
        inject(Router).createUrlTree(['/store']),
    ],
  },
  { path: 'angebote', loadComponent: catalogPage },
  { path: 'angebote/:id', loadComponent: catalogPage, canActivate: [validOffer] },
  { path: 'seminare', pathMatch: 'full', redirectTo: legacyOverview('seminars') },
  { path: 'seminare/:id', redirectTo: 'angebote/:id' },
  { path: 'sessions-coaching', pathMatch: 'full', redirectTo: legacyOverview('sessions') },
  { path: 'sessions-coaching/:id', redirectTo: 'angebote/:id' },
  {
    path: 'impressum',
    loadComponent: () => import('./legal/legal.component').then((m) => m.LegalComponent),
    data: { document: 'imprint' },
  },
  {
    path: 'datenschutz',
    loadComponent: () => import('./legal/legal.component').then((m) => m.LegalComponent),
    data: { document: 'privacy' },
  },
  { path: '**', redirectTo: '' },
];
