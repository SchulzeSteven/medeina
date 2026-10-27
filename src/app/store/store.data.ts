import { Language } from '../translations';

type Localized = Record<Language, string>;
export type StoreCategory = 'begleiter' | 'meditation' | 'geschenke';
export interface StoreProduct {
  id: string;
  category: StoreCategory;
  image: string;
  priceCents: number;
  isExample: boolean;
  title: Localized;
  description: Localized;
  detail: Localized;
  format: Localized;
}
export const storeCategories: { id: StoreCategory | 'alle'; title: Localized }[] = [
  { id: 'alle', title: { de: 'Alles entdecken', tr: 'Tümünü keşfet', en: 'Discover everything' } },
  {
    id: 'begleiter',
    title: { de: 'Für deinen Alltag', tr: 'Günlük yaşam için', en: 'For everyday life' },
  },
  {
    id: 'meditation',
    title: { de: 'Meditation & Ruhe', tr: 'Meditasyon & Huzur', en: 'Meditation & Peace' },
  },
  {
    id: 'geschenke',
    title: { de: 'Freude schenken', tr: 'Mutluluk hediye et', en: 'Give a little joy' },
  },
];
export const storeProducts: StoreProduct[] = [
  {
    id: 'achtsamkeitsjournal',
    isExample: true,
    priceCents: 2490,
    category: 'begleiter',
    image: 'online.jpeg',
    title: { de: 'Zeit für dich', tr: 'Kendine zaman ayır', en: 'Time for yourself' },
    description: {
      de: 'Ein Journal für Gedanken, kleine Erkenntnisse und neue Perspektiven.',
      tr: 'Düşünceler, küçük farkındalıklar ve yeni bakış açıları için bir günlük.',
      en: 'A journal for thoughts, small insights and fresh perspectives.',
    },
    detail: {
      de: 'Ein möglicher Begleiter für dein tägliches Innehalten: Raum zum Schreiben, Fragen zur Reflexion und Platz für das, was dich gerade bewegt. Dieser Eintrag zeigt beispielhaft, wie ein Journal im Store vorgestellt werden kann.',
      tr: 'Günlük bir mola için olası bir yol arkadaşı: yazmak için alan, düşünmeye davet eden sorular ve seni meşgul eden konulara yer. Bu örnek, mağazada bir günlüğün nasıl sunulabileceğini gösterir.',
      en: 'A possible companion for a daily pause: space to write, questions for reflection and room for what is on your mind. This entry illustrates how a journal could be presented in the store.',
    },
    format: {
      de: 'Journal · Beispielprodukt',
      tr: 'Günlük · Örnek ürün',
      en: 'Journal · Example product',
    },
  },
  {
    id: 'meditation-ankommen',
    isExample: true,
    priceCents: 1490,
    category: 'meditation',
    image: 'retreats.jpeg',
    title: { de: 'Bei dir ankommen', tr: 'Kendine dön', en: 'Coming back to yourself' },
    description: {
      de: 'Eine geführte Meditation als Einladung zu einer bewussten Pause.',
      tr: 'Bilinçli bir molaya davet eden rehberli bir meditasyon.',
      en: 'A guided meditation inviting you to take a mindful break.',
    },
    detail: {
      de: 'Ein mögliches Audioangebot für einen ruhigen Moment im Alltag. Hier könnten später Inhalt, Länge und Zugang zur Meditation beschrieben werden. Aktuell ist kein Audio hinterlegt.',
      tr: 'Günlük yaşamda sakin bir an için olası bir ses kaydı. İçerik, süre ve erişim bilgileri daha sonra burada yer alabilir. Henüz bir ses kaydı bulunmuyor.',
      en: 'A possible audio offer for a peaceful moment in everyday life. Content, duration and access could be described here later. No audio is currently available.',
    },
    format: {
      de: 'Audio · Beispielprodukt',
      tr: 'Ses kaydı · Örnek ürün',
      en: 'Audio · Example product',
    },
  },
  {
    id: 'impulskarten',
    isExample: true,
    priceCents: 1990,
    category: 'begleiter',
    image: 'seminare.jpeg',
    title: { de: 'Ein neuer Gedanke', tr: 'Yeni bir düşünce', en: 'A new thought' },
    description: {
      de: 'Impulskarten mit Fragen und Anregungen für deine persönliche Auszeit.',
      tr: 'Kendine ayırdığın zaman için sorular ve öneriler içeren ilham kartları.',
      en: 'Reflection cards with questions and ideas for time to yourself.',
    },
    detail: {
      de: 'Ziehe eine Karte, nimm dir einen Moment und lass eine Frage nachklingen. Dieses beispielhafte Kartenset steht für kleine Anregungen, die sich in deinen eigenen Rhythmus einfügen lassen. Umfang und Gestaltung sind noch offen.',
      tr: 'Bir kart seç, kendine bir an ayır ve bir soru üzerine düşün. Bu örnek kart seti, kendi ritmine uyum sağlayabilecek küçük önerileri temsil eder. Kapsam ve tasarım henüz belirlenmedi.',
      en: 'Choose a card, pause for a moment and let a question stay with you. This example card set represents small ideas that can fit your own rhythm. Contents and design are still to be decided.',
    },
    format: {
      de: 'Kartenset · Beispielprodukt',
      tr: 'Kart seti · Örnek ürün',
      en: 'Card set · Example product',
    },
  },
  {
    id: 'abendritual',
    isExample: true,
    priceCents: 990,
    category: 'meditation',
    image: 'hero.png',
    title: { de: 'Den Tag loslassen', tr: 'Günü geride bırak', en: 'Letting go of the day' },
    description: {
      de: 'Sanfte Impulse für einen bewussten Übergang vom Tag in den Abend.',
      tr: 'Günden akşama bilinçli bir geçiş için yumuşak öneriler.',
      en: 'Gentle ideas for a mindful transition from day to evening.',
    },
    detail: {
      de: 'Ein mögliches digitales Ritualheft mit Schreibimpulsen und einfachen Momenten der Aufmerksamkeit. Die konkreten Inhalte und das Dateiformat werden vor einer Veröffentlichung festgelegt. Es steht noch kein Download bereit.',
      tr: 'Yazma önerileri ve basit farkındalık anları içeren olası bir dijital ritüel defteri. İçerik ve dosya biçimi yayınlanmadan önce belirlenecek. Henüz indirilebilir dosya yok.',
      en: 'A possible digital ritual booklet with writing prompts and simple moments of awareness. Specific content and file format will be defined before publication. No download is available yet.',
    },
    format: {
      de: 'Digitales Heft · Beispielprodukt',
      tr: 'Dijital defter · Örnek ürün',
      en: 'Digital booklet · Example product',
    },
  },
  {
    id: 'reflexionsheft',
    isExample: true,
    priceCents: 1790,
    category: 'begleiter',
    image: 'coaching.jpeg',
    title: { de: 'Dein nächster Schritt', tr: 'Bir sonraki adımın', en: 'Your next step' },
    description: {
      de: 'Ein Reflexionsheft, das deinen Gedanken und Wünschen Raum gibt.',
      tr: 'Düşüncelerine ve dileklerine alan açan bir çalışma defteri.',
      en: 'A reflection workbook that gives space to your thoughts and wishes.',
    },
    detail: {
      de: 'Was ist dir gerade wichtig? Was möchtest du mitnehmen? Dieses Beispiel zeigt ein mögliches Arbeitsheft zur persönlichen Reflexion. Die endgültigen Themen und der Umfang werden mit Çağla abgestimmt.',
      tr: 'Şu anda senin için önemli olan ne? Yanında ne götürmek istersin? Bu örnek, kişisel düşünme için olası bir çalışma defterini gösterir. Son konular ve kapsam Çağla ile belirlenecek.',
      en: 'What matters to you right now? What would you like to take with you? This example shows a possible workbook for personal reflection. Final topics and length will be agreed with Çağla.',
    },
    format: {
      de: 'Workbook · Beispielprodukt',
      tr: 'Çalışma defteri · Örnek ürün',
      en: 'Workbook · Example product',
    },
  },
  {
    id: 'gutschein',
    isExample: true,
    priceCents: 5000,
    category: 'geschenke',
    image: 'slogan2.png',
    title: {
      de: 'Eine Auszeit schenken',
      tr: 'Bir mola hediye et',
      en: 'Give the gift of a break',
    },
    description: {
      de: 'Eine persönliche Aufmerksamkeit für einen besonderen Menschen.',
      tr: 'Özel bir insan için kişisel bir hediye fikri.',
      en: 'A thoughtful gift for someone special.',
    },
    detail: {
      de: 'Ein Gutschein könnte Raum für ein persönliches Erlebnis schenken. Wert, Einlösbarkeit und Bedingungen sind noch nicht festgelegt. Dieser Eintrag dient ausschließlich als Vorschau für einen möglichen Geschenkgutschein.',
      tr: 'Bir hediye çeki, kişisel bir deneyime alan açabilir. Değer, kullanım alanı ve koşullar henüz belirlenmedi. Bu kayıt yalnızca olası bir hediye çeki için önizlemedir.',
      en: 'A gift voucher could create space for a personal experience. Value, redemption and conditions have not yet been defined. This entry is only a preview of a possible gift voucher.',
    },
    format: {
      de: 'Gutschein · Beispielprodukt',
      tr: 'Hediye çeki · Örnek ürün',
      en: 'Gift voucher · Example product',
    },
  },
];
export const storeCopy = {
  de: {
    title: 'Kleine Begleiter.\nZeit für dich.',
    intro:
      'Entdecke Inspiration für bewusste Momente, persönliche Reflexion und kleine Pausen im Alltag.',
    preview:
      'Eine Vorschau auf den Medeina Store: Alle Produkte sind Beispiele. Die vorhandenen Website-Bilder dienen als Platzhalter. Alle Preise sind unverbindliche Beispielpreise in Euro.',
    collection: 'Finde deinen Begleiter',
    filters: 'Produkte filtern',
    details: 'Entdecken',
    back: 'Zurück zum Store',
    price: 'Beispielpreis',
    checkout: 'Zum Test-Checkout',
    checkoutInfo: 'Bezahlen direkt bei Medeina mit Stripe Elements. Nur Testmodus.',
    format: 'Auf einen Blick',
    demo: 'Beispielprodukt · noch nicht bestellbar',
    count: 'Produkte',
    note: 'Ein Moment, der dir gehört.',
    noteText:
      'Du hast eine Frage oder wünschst dir eine persönliche Empfehlung? Schreib Çağla und erzähle ihr, was du suchst.',
    contact: 'Çağla kontaktieren',
  },
  tr: {
    title: 'Küçük eşlikçiler.\nKendine zaman.',
    intro: 'Bilinçli anlar, kişisel farkındalık ve günlük yaşamda küçük molalar için ilham keşfet.',
    preview:
      'Medeina mağazasına ön bakış: Tüm ürünler örnektir. Mevcut site görselleri yer tutucu olarak kullanılmıştır. Tüm fiyatlar Euro cinsinden bağlayıcı olmayan örnek fiyatlardır.',
    collection: 'Yol arkadaşını bul',
    filters: 'Ürünleri filtrele',
    details: 'Keşfet',
    back: 'Mağazaya dön',
    price: 'Örnek fiyat',
    checkout: 'Test ödemesine geç',
    checkoutInfo: 'Stripe Elements ile doğrudan Medeina’da ödeme. Yalnızca test modu.',
    format: 'Bir bakışta',
    demo: 'Örnek ürün · henüz sipariş verilemez',
    count: 'ürün',
    note: 'Sadece sana ait bir an.',
    noteText:
      'Bir sorun mu var ya da kişisel bir öneri mi istersin? Çağla’ya yaz ve ne aradığını anlat.',
    contact: 'Çağla ile iletişime geç',
  },
  en: {
    title: 'Little companions.\nTime for yourself.',
    intro:
      'Discover inspiration for mindful moments, personal reflection and small breaks in everyday life.',
    preview:
      'A preview of the Medeina Store: all products are examples. Existing website images serve as placeholders. All prices are non-binding example prices in euros.',
    collection: 'Find your companion',
    filters: 'Filter products',
    details: 'Discover',
    back: 'Back to store',
    price: 'Example price',
    checkout: 'Go to test checkout',
    checkoutInfo: 'Pay directly at Medeina with Stripe Elements. Test mode only.',
    format: 'At a glance',
    demo: 'Example product · not yet available to order',
    count: 'products',
    note: 'A moment that belongs to you.',
    noteText:
      'Have a question or would you like a personal recommendation? Write to Çağla and tell her what you are looking for.',
    contact: 'Contact Çağla',
  },
};
