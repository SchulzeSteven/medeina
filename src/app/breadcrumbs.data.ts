import { catalogCategories, catalogCopy, catalogOffers } from './catalog/catalog.data';
import { storeCategories, storeProducts } from './store/store.data';
import { Language, translations } from './translations';

export interface Breadcrumb {
  label: string;
  path: string;
  queryParams?: Record<string, string>;
}

export function breadcrumbsFor(url: string, language: Language): Breadcrumb[] {
  const parsed = new URL(url, 'https://medeina.invalid');
  const segments = parsed.pathname.split('/').filter(Boolean);
  const copy = translations[language];
  if (!segments.length) return [];
  const crumbs: Breadcrumb[] = [{ label: copy.home, path: '/' }];
  switch (segments[0]) {
    case 'ueber-mich':
      crumbs.push({ label: copy.about, path: '/ueber-mich' });
      break;
    case 'impressum':
      crumbs.push({ label: copy.imprint, path: '/impressum' });
      break;
    case 'datenschutz':
      crumbs.push({ label: copy.privacy, path: '/datenschutz' });
      break;
    case 'angebote': {
      crumbs.push({ label: copy.offersLabel, path: '/angebote' });
      const offer = catalogOffers.find((item) => item.id === segments[1]);
      const section = offer?.section ?? parsed.searchParams.get('bereich');
      if (section === 'seminars' || section === 'sessions') {
        const labels = catalogCopy[language];
        crumbs.push({
          label: section === 'seminars' ? labels.title : labels.sessions,
          path: '/angebote',
          queryParams: { bereich: section },
        });
        const category = catalogCategories.find(
          (item) => item.id === (offer?.category ?? parsed.searchParams.get('kategorie')),
        );
        if (
          category &&
          catalogOffers.some((item) => item.section === section && item.category === category.id)
        ) {
          crumbs.push({
            label: category.title[language],
            path: '/angebote',
            queryParams: { bereich: section, kategorie: category.id },
          });
        }
      }
      if (offer) crumbs.push({ label: offer.title[language], path: '/angebote/' + offer.id });
      break;
    }
    case 'store': {
      crumbs.push({ label: copy.storeLabel, path: '/store' });
      const product = storeProducts.find((item) => item.id === segments[1]);
      const category = storeCategories.find(
        (item) =>
          item.id !== 'alle' &&
          item.id === (product?.category ?? parsed.searchParams.get('kategorie')),
      );
      if (category)
        crumbs.push({
          label: category.title[language],
          path: '/store',
          queryParams: { kategorie: category.id },
        });
      if (product) {
        crumbs.push({ label: product.title[language], path: '/store/' + product.id });
        if (segments[2] === 'checkout') {
          crumbs.push({
            label: { de: 'Test-Checkout', tr: 'Test ödemesi', en: 'Test checkout' }[language],
            path: '/store/' + product.id + '/checkout',
          });
        }
      }
      break;
    }
    default:
      return [];
  }
  return crumbs;
}
