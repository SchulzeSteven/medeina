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
  { id: 'alle', title: { de: 'Alles entdecken', tr: 'Tümünü keşfet' } },
  { id: 'begleiter', title: { de: 'Für deinen Alltag', tr: 'Günlük yaşam için' } },
  { id: 'meditation', title: { de: 'Meditation & Ruhe', tr: 'Meditasyon & Huzur' } },
  { id: 'geschenke', title: { de: 'Freude schenken', tr: 'Mutluluk hediye et' } },
];
export const storeProducts: StoreProduct[] = [
  {
    id: 'achtsamkeitsjournal',
    isExample: true,
    priceCents: 2490,
    category: 'begleiter',
    image: 'programs.png',
    title: { de: 'Zeit für dich', tr: 'Kendine zaman ayır' },
    description: {
      de: 'Ein Journal für Gedanken, kleine Erkenntnisse und neue Perspektiven.',
      tr: 'Düşünceler, küçük farkındalıklar ve yeni bakış açıları için bir günlük.',
    },
    detail: {
      de: 'Ein möglicher Begleiter für dein tägliches Innehalten: Raum zum Schreiben, Fragen zur Reflexion und Platz für das, was dich gerade bewegt. Dieser Eintrag zeigt beispielhaft, wie ein Journal im Store vorgestellt werden kann.',
      tr: 'Günlük bir mola için olası bir yol arkadaşı: yazmak için alan, düşünmeye davet eden sorular ve seni meşgul eden konulara yer. Bu örnek, mağazada bir günlüğün nasıl sunulabileceğini gösterir.',
    },
    format: { de: 'Journal · Beispielprodukt', tr: 'Günlük · Örnek ürün' },
  },
  {
    id: 'meditation-ankommen',
    isExample: true,
    priceCents: 1490,
    category: 'meditation',
    image: 'retreats.png',
    title: { de: 'Bei dir ankommen', tr: 'Kendine dön' },
    description: {
      de: 'Eine geführte Meditation als Einladung zu einer bewussten Pause.',
      tr: 'Bilinçli bir molaya davet eden rehberli bir meditasyon.',
    },
    detail: {
      de: 'Ein mögliches Audioangebot für einen ruhigen Moment im Alltag. Hier könnten später Inhalt, Länge und Zugang zur Meditation beschrieben werden. Aktuell ist kein Audio hinterlegt.',
      tr: 'Günlük yaşamda sakin bir an için olası bir ses kaydı. İçerik, süre ve erişim bilgileri daha sonra burada yer alabilir. Henüz bir ses kaydı bulunmuyor.',
    },
    format: { de: 'Audio · Beispielprodukt', tr: 'Ses kaydı · Örnek ürün' },
  },
  {
    id: 'impulskarten',
    isExample: true,
    priceCents: 1990,
    category: 'begleiter',
    image: 'seminars.png',
    title: { de: 'Ein neuer Gedanke', tr: 'Yeni bir düşünce' },
    description: {
      de: 'Impulskarten mit Fragen und Anregungen für deine persönliche Auszeit.',
      tr: 'Kendine ayırdığın zaman için sorular ve öneriler içeren ilham kartları.',
    },
    detail: {
      de: 'Ziehe eine Karte, nimm dir einen Moment und lass eine Frage nachklingen. Dieses beispielhafte Kartenset steht für kleine Anregungen, die sich in deinen eigenen Rhythmus einfügen lassen. Umfang und Gestaltung sind noch offen.',
      tr: 'Bir kart seç, kendine bir an ayır ve bir soru üzerine düşün. Bu örnek kart seti, kendi ritmine uyum sağlayabilecek küçük önerileri temsil eder. Kapsam ve tasarım henüz belirlenmedi.',
    },
    format: { de: 'Kartenset · Beispielprodukt', tr: 'Kart seti · Örnek ürün' },
  },
  {
    id: 'abendritual',
    isExample: true,
    priceCents: 990,
    category: 'meditation',
    image: 'hero.png',
    title: { de: 'Den Tag loslassen', tr: 'Günü geride bırak' },
    description: {
      de: 'Sanfte Impulse für einen bewussten Übergang vom Tag in den Abend.',
      tr: 'Günden akşama bilinçli bir geçiş için yumuşak öneriler.',
    },
    detail: {
      de: 'Ein mögliches digitales Ritualheft mit Schreibimpulsen und einfachen Momenten der Aufmerksamkeit. Die konkreten Inhalte und das Dateiformat werden vor einer Veröffentlichung festgelegt. Es steht noch kein Download bereit.',
      tr: 'Yazma önerileri ve basit farkındalık anları içeren olası bir dijital ritüel defteri. İçerik ve dosya biçimi yayınlanmadan önce belirlenecek. Henüz indirilebilir dosya yok.',
    },
    format: { de: 'Digitales Heft · Beispielprodukt', tr: 'Dijital defter · Örnek ürün' },
  },
  {
    id: 'reflexionsheft',
    isExample: true,
    priceCents: 1790,
    category: 'begleiter',
    image: 'coaching.png',
    title: { de: 'Dein nächster Schritt', tr: 'Bir sonraki adımın' },
    description: {
      de: 'Ein Reflexionsheft, das deinen Gedanken und Wünschen Raum gibt.',
      tr: 'Düşüncelerine ve dileklerine alan açan bir çalışma defteri.',
    },
    detail: {
      de: 'Was ist dir gerade wichtig? Was möchtest du mitnehmen? Dieses Beispiel zeigt ein mögliches Arbeitsheft zur persönlichen Reflexion. Die endgültigen Themen und der Umfang werden mit Çağla abgestimmt.',
      tr: 'Şu anda senin için önemli olan ne? Yanında ne götürmek istersin? Bu örnek, kişisel düşünme için olası bir çalışma defterini gösterir. Son konular ve kapsam Çağla ile belirlenecek.',
    },
    format: { de: 'Workbook · Beispielprodukt', tr: 'Çalışma defteri · Örnek ürün' },
  },
  {
    id: 'gutschein',
    isExample: true,
    priceCents: 5000,
    category: 'geschenke',
    image: 'slogan2.png',
    title: { de: 'Eine Auszeit schenken', tr: 'Bir mola hediye et' },
    description: {
      de: 'Eine persönliche Aufmerksamkeit für einen besonderen Menschen.',
      tr: 'Özel bir insan için kişisel bir hediye fikri.',
    },
    detail: {
      de: 'Ein Gutschein könnte Raum für ein persönliches Erlebnis schenken. Wert, Einlösbarkeit und Bedingungen sind noch nicht festgelegt. Dieser Eintrag dient ausschließlich als Vorschau für einen möglichen Geschenkgutschein.',
      tr: 'Bir hediye çeki, kişisel bir deneyime alan açabilir. Değer, kullanım alanı ve koşullar henüz belirlenmedi. Bu kayıt yalnızca olası bir hediye çeki için önizlemedir.',
    },
    format: { de: 'Gutschein · Beispielprodukt', tr: 'Hediye çeki · Örnek ürün' },
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
    request: 'Zum Produkt anfragen',
    format: 'Auf einen Blick',
    demo: 'Beispielprodukt · noch nicht bestellbar',
    count: 'Produkte',
    note: 'Ein Moment, der dir gehört.',
    noteText:
      'Du hast eine Frage oder wünschst dir eine persönliche Empfehlung? Schreib Çağla und erzähle ihr, was du suchst.',
    contact: 'Çağla kontaktieren',
    subject: 'Anfrage zum Store-Beispiel: ',
    body: 'Hallo Çağla,\n\nich interessiere mich für das Beispielprodukt „',
    bodyEnd: '“ und möchte gerne mehr erfahren.\n\nViele Grüße',
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
    request: 'Ürün hakkında sor',
    format: 'Bir bakışta',
    demo: 'Örnek ürün · henüz sipariş verilemez',
    count: 'ürün',
    note: 'Sadece sana ait bir an.',
    noteText:
      'Bir sorun mu var ya da kişisel bir öneri mi istersin? Çağla’ya yaz ve ne aradığını anlat.',
    contact: 'Çağla ile iletişime geç',
    subject: 'Mağaza örneği hakkında: ',
    body: 'Merhaba Çağla,\n\n“',
    bodyEnd: '” örnek ürünüyle ilgileniyorum ve daha fazla bilgi almak istiyorum.\n\nSevgiler',
  },
};
