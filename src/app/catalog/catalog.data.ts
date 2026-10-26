import type { Language } from '../translations';

export type Localized = Record<Language, string>;
export type Category = 'theta' | 'innerspeak' | 'dowsing' | 'reiki' | 'coaching' | 'other';
export type CatalogSection = 'seminars' | 'sessions';
export interface OfferDate {
  startsAt: string;
  endsAt?: string;
  location: Localized;
  registrationUrl?: string;
}
export interface CatalogOffer {
  id: string;
  section: CatalogSection;
  category: Category;
  title: Localized;
  summary: Localized;
  description: Localized;
  contents?: Localized[];
  prerequisites?: string[];
  duration?: Localized;
  format?: Localized;
  levels?: Localized[];
  dates: OfferDate[];
}
const l = (de: string, tr: string): Localized => ({ de, tr });
const online = l('Online über Zoom', 'Zoom üzerinden online');
const flexible = l('Online oder Präsenz', 'Online veya yüz yüze');
const foundation = ['basic-dna', 'advanced-dna', 'dig-deeper'];
const seminar = (
  id: string,
  category: Category,
  title: Localized,
  summary: Localized,
  description: Localized,
  details: Partial<
    Pick<CatalogOffer, 'contents' | 'prerequisites' | 'duration' | 'format' | 'levels'>
  > = {},
): CatalogOffer => ({
  id,
  section: 'seminars',
  category,
  title,
  summary,
  description,
  dates: [],
  ...details,
});
const session = (
  id: string,
  category: Category,
  title: Localized,
  duration: Localized,
  summary: Localized,
  description: Localized,
): CatalogOffer => ({
  id,
  section: 'sessions',
  category,
  title,
  duration,
  summary,
  description,
  dates: [],
});

export const catalogCategories: ReadonlyArray<{ id: Category; title: Localized }> = [
  { id: 'theta', title: l('ThetaHealing®', 'ThetaHealing®') },
  { id: 'innerspeak', title: l('InnerSpeak™ / JAAS', 'InnerSpeak™ / JAAS') },
  { id: 'dowsing', title: l('Spiritual Dowsing', 'Spiritual Dowsing') },
  { id: 'reiki', title: l('Reiki', 'Reiki') },
  { id: 'coaching', title: l('Coaching', 'Koçluk') },
  { id: 'other', title: l('Spirituelle Praxis', 'Spiritüel uygulamalar') },
];

export const catalogOffers: readonly CatalogOffer[] = [
  seminar(
    'basic-dna',
    'theta',
    l('Basic DNA (Basis-DNA)', 'Basic DNA (Temel DNA)'),
    l(
      'Einführung in die ThetaHealing®-Methode und spirituelle Glaubenssatzarbeit.',
      'ThetaHealing® yöntemine ve spiritüel inanç çalışmasına giriş.',
    ),
    l(
      'Du lernst die Grundlagen der ThetaHealing®-Methode kennen. Der Kurs widmet sich Glaubenssätzen, spirituellen Ebenen des Seins und den im Kurs vermittelten energetischen Techniken.',
      'ThetaHealing® yönteminin temellerini tanırsın. Kurs; inançlara, varoluşun spiritüel düzlemlerine ve kursta aktarılan enerjetik tekniklere odaklanır.',
    ),
    {
      format: online,
      contents: [
        l('Grundlagen der Methode', 'Yöntemin temelleri'),
        l('Glaubenssatzarbeit', 'İnanç çalışması'),
        l(
          'Spirituelle Ebenen des Seins und energetische Techniken',
          'Varoluşun spiritüel düzlemleri ve enerjetik teknikler',
        ),
      ],
    },
  ),
  seminar(
    'advanced-dna',
    'theta',
    l('Advanced DNA (Aufbau-DNA)', 'Advanced DNA (İleri DNA)'),
    l('Vertiefende Glaubenssatz- und Gefühlsarbeit.', 'İnanç ve duygu çalışmalarında derinleşme.'),
    l(
      'Im Mittelpunkt stehen vertiefende Glaubenssatzarbeit, Gefühlsarbeit und weiterführende Techniken der ThetaHealing®-Methode. Die sieben Ebenen werden als spirituelles Konzept betrachtet.',
      'ThetaHealing® yönteminde derinlemesine inanç çalışması, duygu çalışması ve ileri teknikler ele alınır. Yedi düzlem spiritüel bir kavram olarak incelenir.',
    ),
    {
      format: online,
      contents: [
        l('Vertiefende Glaubenssatzarbeit', 'Derinlemesine inanç çalışması'),
        l('Spirituelle Konzepte der sieben Ebenen', 'Yedi düzlemin spiritüel kavramları'),
        l('Gefühlsarbeit und weiterführende Techniken', 'Duygu çalışması ve ileri teknikler'),
      ],
    },
  ),
  seminar(
    'dig-deeper',
    'theta',
    l('Dig Deeper (Grabe Tiefer)', 'Dig Deeper (Derine İn)'),
    l(
      'Glaubensmuster mit der Digging-Technik erforschen.',
      'Digging tekniğiyle inanç kalıplarını keşfetme.',
    ),
    l(
      'Dieses Seminar vertieft die Digging-Technik zur Erforschung persönlicher Glaubensmuster innerhalb der ThetaHealing®-Methode.',
      'Bu seminer, ThetaHealing® yöntemi kapsamında kişisel inanç kalıplarını keşfetmek için kullanılan Digging tekniğini derinleştirir.',
    ),
    {
      prerequisites: ['basic-dna', 'advanced-dna'],
      format: flexible,
      contents: [
        l('Vertiefung der Digging-Technik', 'Digging tekniğinde derinleşme'),
        l('Erforschung von Glaubensmustern', 'İnanç kalıplarının keşfi'),
      ],
    },
  ),
  seminar(
    'you-and-the-creator',
    'theta',
    l('You and the Creator (Du und der Schöpfer)', 'You and the Creator (Sen ve Yaratıcı)'),
    l(
      'Ego, höheres Selbst und Schöpfer als spirituelle Konzepte betrachten.',
      'Ego, yüksek benlik ve Yaratıcı kavramlarını spiritüel açıdan ele alma.',
    ),
    l(
      'Eine spirituelle Auseinandersetzung mit der Unterscheidung zwischen Ego, höherem Selbst und Schöpfer innerhalb der ThetaHealing®-Methode.',
      'ThetaHealing® yöntemi kapsamında ego, yüksek benlik ve Yaratıcı arasındaki ayrımı spiritüel açıdan ele alan bir seminer.',
    ),
    {
      prerequisites: foundation,
      format: flexible,
      contents: [
        l(
          'Unterscheidung zwischen Ego, höherem Selbst und Schöpfer',
          'Ego, yüksek benlik ve Yaratıcı arasındaki ayrım',
        ),
      ],
    },
  ),
  seminar(
    'rhythm',
    'theta',
    l(
      'RHYTHM to a Perfect Weight (RHYTHM zum perfekten Gewicht)',
      'RHYTHM to a Perfect Weight (İdeal Kiloya RHYTHM)',
    ),
    l(
      'Spirituelle Reflexion zu Selbstbild, Körper und Gewicht.',
      'Benlik algısı, beden ve kilo üzerine spiritüel farkındalık.',
    ),
    l(
      'Spirituelle Glaubenssatzarbeit in Bezug auf Selbstbild, Körper und Gewicht. Das Angebot dient der persönlichen Reflexion und verspricht keine Gewichtsveränderung oder medizinische Wirkung.',
      'Benlik algısı, beden ve kilo ile ilgili spiritüel inanç çalışması. Bu çalışma kişisel farkındalığa yöneliktir; kilo değişimi veya tıbbi etki vaat etmez.',
    ),
    {
      prerequisites: foundation,
      contents: [
        l(
          'Glaubenssätze zu Selbstbild, Körper und Gewicht',
          'Benlik algısı, beden ve kiloya ilişkin inançlar',
        ),
      ],
    },
  ),
  seminar(
    'theta-tiere',
    'theta',
    l('ThetaHealing® Tierseminar', 'ThetaHealing® Hayvan Semineri'),
    l('Spirituelle und intuitive Arbeit mit Tieren.', 'Hayvanlarla spiritüel ve sezgisel çalışma.'),
    l(
      'Das Seminar betrachtet spirituelle und intuitive Arbeit mit Tieren aus Sicht der ThetaHealing®-Methode.',
      'Seminer, hayvanlarla spiritüel ve sezgisel çalışmayı ThetaHealing® yöntemi açısından ele alır.',
    ),
    {
      duration: l('1 Tag', '1 gün'),
      prerequisites: foundation,
      format: flexible,
      contents: [
        l(
          'Spirituelle und intuitive Arbeit mit Tieren',
          'Hayvanlarla spiritüel ve sezgisel çalışma',
        ),
      ],
    },
  ),
  seminar(
    'theta-pflanzen',
    'theta',
    l('ThetaHealing® Pflanzenseminar', 'ThetaHealing® Bitki Semineri'),
    l(
      'Eigenes Seminar zur ThetaHealing®-Methode mit Bezug zu Pflanzen.',
      'Bitkilerle ilgili ayrı bir ThetaHealing® semineri.',
    ),
    l(
      'Das Pflanzenseminar ist ein eigenes Angebot. Konkrete Inhalte, Voraussetzungen, Dauer und Format erfährst du auf Anfrage bei Çağla.',
      'Bitki semineri ayrı bir programdır. İçerik, katılım koşulları, süre ve format hakkında Çağla’dan bilgi alabilirsin.',
    ),
  ),
  seminar(
    'jaas-stufe-1',
    'innerspeak',
    l(
      'JAAS / InnerSpeak™ – Stufe 1 Praktikerausbildung',
      'JAAS / InnerSpeak™ – 1. Seviye Uygulayıcı Eğitimi',
    ),
    l(
      'Grundlagen und Anwendung der InnerSpeak™-Methode.',
      'InnerSpeak™ yönteminin temelleri ve uygulanması.',
    ),
    l(
      'Die Ausbildung behandelt spirituelle Grundlagen, Muskeltest, Chakren, JAAS-Dateien und die Anwendung der InnerSpeak™-Methode. Angaben zu Zertifikaten erhältst du auf Anfrage.',
      'Eğitim; spiritüel temelleri, kas testini, çakraları, JAAS dosyalarını ve InnerSpeak™ yönteminin uygulanmasını kapsar. Sertifikalara ilişkin bilgileri talep edebilirsin.',
    ),
    {
      duration: l('2–3 Tage', '2–3 gün'),
      contents: [
        l('Spirituelle Grundlagen', 'Spiritüel temeller'),
        l('Muskeltest und Chakren', 'Kas testi ve çakralar'),
        l(
          'JAAS-Dateien und Anwendung der InnerSpeak™-Methode',
          'JAAS dosyaları ve InnerSpeak™ yönteminin uygulanması',
        ),
      ],
    },
  ),
  seminar(
    'spiritual-dowsing-ausbildung',
    'dowsing',
    l(
      'Spiritual Dowsing – Praktikerausbildung im spirituellen Pendeln',
      'Spiritual Dowsing – Spiritüel Sarkaç Uygulayıcı Eğitimi',
    ),
    l(
      'Spirituelles Pendeln im Jean-Adrienne-Ansatz.',
      'Jean Adrienne yaklaşımında spiritüel sarkaç çalışması.',
    ),
    l(
      'Ausbildung zur Anwendung des spirituellen Pendelns innerhalb des Jean-Adrienne-Ansatzes. Weitere Angaben zum Ablauf und zu Voraussetzungen erhältst du auf Anfrage.',
      'Jean Adrienne yaklaşımı kapsamında spiritüel sarkaç uygulaması eğitimi. Akış ve katılım koşulları hakkında daha fazla bilgi talep edebilirsin.',
    ),
    {
      duration: l('1–2 Tage', '1–2 gün'),
      contents: [l('Anwendung des spirituellen Pendelns', 'Spiritüel sarkaç uygulaması')],
    },
  ),
  seminar(
    'usui-reiki',
    'reiki',
    l('Usui Reiki I, II, III und Master', 'Usui Reiki I, II, III ve Master'),
    l(
      'Usui Reiki als eigenständige Ausbildungsreihe.',
      'Ayrı bir eğitim serisi olarak Usui Reiki.',
    ),
    l(
      'Die Ausbildungsreihe umfasst Usui Reiki I, II, III und Master als spirituelle Praxis. Inhalte, Dauer, Voraussetzungen und Format der jeweiligen Stufe sind bei Çağla anzufragen.',
      'Eğitim serisi spiritüel uygulama olarak Usui Reiki I, II, III ve Master seviyelerini kapsar. Her seviyenin içeriği, süresi, katılım koşulları ve formatı için Çağla’dan bilgi alabilirsin.',
    ),
    {
      levels: [
        l('Usui Reiki I', 'Usui Reiki I'),
        l('Usui Reiki II', 'Usui Reiki II'),
        l('Usui Reiki III', 'Usui Reiki III'),
        l('Usui Reiki Master', 'Usui Reiki Master'),
      ],
    },
  ),
  seminar(
    'ra-sheeba',
    'reiki',
    l('Ra-Sheeba Master', 'Ra-Sheeba Master'),
    l(
      'Eigenständige Ausbildung in der spirituellen Ra-Sheeba-Praxis.',
      'Spiritüel Ra-Sheeba uygulamasında ayrı bir eğitim.',
    ),
    l(
      'Ra-Sheeba Master wird als eigene Ausbildungsreihe angeboten. Konkrete Inhalte, Dauer, Voraussetzungen und Format klärst du direkt mit Çağla.',
      'Ra-Sheeba Master ayrı bir eğitim olarak sunulur. İçerik, süre, katılım koşulları ve formatı doğrudan Çağla ile görüşebilirsin.',
    ),
  ),
  seminar(
    'silber-violette-flamme',
    'reiki',
    l('Silber-Violette-Flamme Master', 'Gümüş-Mor Alev Master'),
    l('Eigenständige spirituelle Master-Ausbildung.', 'Ayrı bir spiritüel Master eğitimi.'),
    l(
      'Die Silber-Violette-Flamme Master-Ausbildung ist ein eigenständiges Angebot. Weitere Informationen zu Inhalten, Dauer, Voraussetzungen und Format erhältst du auf Anfrage.',
      'Gümüş-Mor Alev Master eğitimi ayrı bir programdır. İçerik, süre, katılım koşulları ve format hakkında bilgi talep edebilirsin.',
    ),
  ),
  seminar(
    'kundalini-reiki',
    'reiki',
    l('Kundalini Reiki I, II, III und Master', 'Kundalini Reiki I, II, III ve Master'),
    l(
      'Kundalini Reiki als eigenständige Ausbildungsreihe.',
      'Ayrı bir eğitim serisi olarak Kundalini Reiki.',
    ),
    l(
      'Die Ausbildungsreihe umfasst Kundalini Reiki I, II, III und Master als spirituelle Praxis. Inhalte, Dauer, Voraussetzungen und Format der jeweiligen Stufe sind bei Çağla anzufragen.',
      'Eğitim serisi spiritüel uygulama olarak Kundalini Reiki I, II, III ve Master seviyelerini kapsar. Her seviyenin içeriği, süresi, katılım koşulları ve formatı için Çağla’dan bilgi alabilirsin.',
    ),
    {
      levels: [
        l('Kundalini Reiki I', 'Kundalini Reiki I'),
        l('Kundalini Reiki II', 'Kundalini Reiki II'),
        l('Kundalini Reiki III', 'Kundalini Reiki III'),
        l('Kundalini Reiki Master', 'Kundalini Reiki Master'),
      ],
    },
  ),
  session(
    'weekly-erstgespraech',
    'coaching',
    l('Weekly Coaching – Erstgespräch', 'Weekly Coaching – İlk Görüşme'),
    l('90 Minuten', '90 dakika'),
    l(
      'Kennenlernen und Raum für deine persönlichen Ziele.',
      'Tanışma ve kişisel hedeflerin için bir alan.',
    ),
    l(
      'Im Erstgespräch geht es um das Kennenlernen, deine Bedürfnisse, Prioritäten, persönlichen Fragestellungen und Ziele. Gemeinsam besprechen wir, welche Begleitung zu deinem Anliegen passt.',
      'İlk görüşmede tanışmaya, ihtiyaçlarına, önceliklerine, kişisel sorularına ve hedeflerine odaklanırız. Sana uygun rehberliği birlikte konuşuruz.',
    ),
  ),
  session(
    'weekly-folgetermine',
    'coaching',
    l('Weekly Coaching – Folgetermine', 'Weekly Coaching – Takip Görüşmeleri'),
    l('60 Minuten', '60 dakika'),
    l(
      'Individuelle Begleitung mit Gesprächen und spirituellen Methoden.',
      'Görüşmeler ve spiritüel yöntemlerle kişisel rehberlik.',
    ),
    l(
      'Die Folgetermine verbinden Gespräche mit einer individuellen Auswahl aus InnerSpeak™, ThetaHealing®, spirituellem Pendeln, Reiki oder den sieben Toren des Bewusstseins. Dein Anliegen und deine persönliche Reflexion stehen im Mittelpunkt.',
      'Takip görüşmeleri, konuşmaları InnerSpeak™, ThetaHealing®, spiritüel sarkaç, Reiki veya bilincin yedi kapısı yöntemlerinden kişisel bir seçimle birleştirir. Konun ve kişisel farkındalığın ön plandadır.',
    ),
  ),
  session(
    'innerspeak-einzel',
    'innerspeak',
    l('InnerSpeak™ / JAAS Einzelsession', 'InnerSpeak™ / JAAS Bireysel Seans'),
    l('20–40 Minuten', '20–40 dakika'),
    l(
      'Persönliche Reflexion mit der InnerSpeak™-Methode.',
      'InnerSpeak™ yöntemiyle kişisel farkındalık.',
    ),
    l(
      'Du bringst eine persönliche Fragestellung mit. In der Einzelsession wird sie mithilfe der InnerSpeak™ / JAAS-Methode als spiritueller Praxis betrachtet. Ablauf und Schwerpunkt werden mit dir besprochen.',
      'Kişisel bir sorunu veya konunu getirirsin. Bireysel seansta bu konu, spiritüel bir uygulama olarak InnerSpeak™ / JAAS yöntemiyle ele alınır. Akış ve odak seninle görüşülür.',
    ),
  ),
  session(
    'innerspeak-gruppe',
    'innerspeak',
    l('InnerSpeak™ / JAAS Gruppensession', 'InnerSpeak™ / JAAS Grup Seansı'),
    l('20–40 Minuten', '20–40 dakika'),
    l('Spirituelle Reflexion im gemeinsamen Rahmen.', 'Birlikte spiritüel farkındalık çalışması.'),
    l(
      'Eine Gruppensession mit der InnerSpeak™ / JAAS-Methode bietet einen gemeinsamen Rahmen für spirituelle Reflexion. Thema, Ablauf und Teilnahme werden vorab auf Anfrage geklärt.',
      'InnerSpeak™ / JAAS yöntemiyle grup seansı, spiritüel farkındalık için ortak bir alan sunar. Konu, akış ve katılım önceden talep üzerine netleştirilir.',
    ),
  ),
  session(
    'tierkommunikation',
    'other',
    l('Tierkommunikation', 'Hayvanlarla İletişim'),
    l('20–40 Minuten', '20–40 dakika'),
    l(
      'Intuitive, spirituelle Betrachtung deiner Verbindung zu einem Tier.',
      'Bir hayvanla bağının sezgisel ve spiritüel olarak ele alınması.',
    ),
    l(
      'Die Sitzung widmet sich deiner Verbindung zu einem Tier als intuitiver, spiritueller Praxis. Dein Anliegen und der Ablauf werden vorab besprochen. Die Sitzung ersetzt keine tierärztliche Abklärung oder Behandlung.',
      'Seans, bir hayvanla bağını sezgisel ve spiritüel bir uygulama olarak ele alır. Konun ve akış önceden görüşülür. Seans veteriner değerlendirmesi veya tedavisinin yerine geçmez.',
    ),
  ),
  session(
    'theta-einzel',
    'theta',
    l('ThetaHealing® Einzelsession', 'ThetaHealing® Bireysel Seans'),
    l('60 Minuten', '60 dakika'),
    l(
      'Spirituelle Glaubenssatzarbeit zu einem persönlichen Thema.',
      'Kişisel bir konu üzerine spiritüel inanç çalışması.',
    ),
    l(
      'Ausgehend von deinem Anliegen werden persönliche Glaubenssätze innerhalb der ThetaHealing®-Methode betrachtet. Die Sitzung bietet Raum für spirituelle Praxis und persönliche Reflexion.',
      'Konundan yola çıkarak kişisel inançlar ThetaHealing® yöntemi kapsamında ele alınır. Seans spiritüel uygulama ve kişisel farkındalık için bir alan sunar.',
    ),
  ),
  session(
    'dowsing-session',
    'dowsing',
    l('Spiritual Dowsing / Spirituelles Pendeln', 'Spiritual Dowsing / Spiritüel Sarkaç'),
    l('30–45 Minuten', '30–45 dakika'),
    l(
      'Eine persönliche Fragestellung mit spirituellem Pendeln betrachten.',
      'Kişisel bir soruyu spiritüel sarkaçla ele alma.',
    ),
    l(
      'Nach einem Gespräch über dein Anliegen wird spirituelles Pendeln als ergänzende Praxis der persönlichen Reflexion eingesetzt. Der Schwerpunkt der Sitzung wird mit dir abgestimmt.',
      'Konun hakkında bir görüşmenin ardından spiritüel sarkaç, kişisel farkındalığı destekleyen tamamlayıcı bir uygulama olarak kullanılır. Seansın odağı seninle belirlenir.',
    ),
  ),
  session(
    'reiki-session',
    'reiki',
    l('Reiki Einzelsession', 'Reiki Bireysel Seans'),
    l('40–60 Minuten', '40–60 dakika'),
    l(
      'Zeit für dich im Rahmen spiritueller Reiki-Praxis.',
      'Spiritüel Reiki uygulaması kapsamında kendine zaman ayırma.',
    ),
    l(
      'In einem kurzen Gespräch klärst du dein Anliegen und den Ablauf. Die anschließende Reiki-Praxis bietet einen ruhigen Rahmen für eine bewusste Auszeit. Individuelle Wirkungen werden nicht garantiert.',
      'Kısa bir görüşmede konunu ve akışı netleştirirsin. Ardından Reiki uygulaması bilinçli bir mola için sakin bir alan sunar. Kişisel etkiler garanti edilmez.',
    ),
  ),
  session(
    'jaas-theta',
    'innerspeak',
    l('Kombinierte JAAS + ThetaHealing® Sitzung', 'Birleşik JAAS + ThetaHealing® Seansı'),
    l('60–90 Minuten', '60–90 dakika'),
    l(
      'Zwei spirituelle Methoden in einem individuellen Rahmen.',
      'Kişisel bir çerçevede iki spiritüel yöntem.',
    ),
    l(
      'Die Sitzung kombiniert JAAS / InnerSpeak™ und ThetaHealing® als spirituelle Methoden der persönlichen Reflexion. Zu Beginn werden dein Thema und die Gestaltung der Sitzung gemeinsam besprochen.',
      'Seans JAAS / InnerSpeak™ ve ThetaHealing® yöntemlerini kişisel farkındalığa yönelik spiritüel uygulamalar olarak birleştirir. Başlangıçta konun ve seansın akışı birlikte görüşülür.',
    ),
  ),
  session(
    'sieben-tore',
    'other',
    l('Die sieben Tore des Bewusstseins', 'Bilincin Yedi Kapısı'),
    l('20–40 Minuten', '20–40 dakika'),
    l(
      'Spirituelle Praxis und persönliche Reflexion.',
      'Spiritüel uygulama ve kişisel farkındalık.',
    ),
    l(
      'Dieses Angebot schafft einen Rahmen für spirituelle Praxis und persönliche Reflexion unter dem Namen „Die sieben Tore des Bewusstseins“. Konkrete Informationen zur Methode und zum Ablauf erhältst du direkt von Çağla.',
      '“Bilincin Yedi Kapısı” adıyla sunulan bu çalışma spiritüel uygulama ve kişisel farkındalık için bir alan oluşturur. Yöntem ve akış hakkında ayrıntılı bilgiyi doğrudan Çağla’dan alabilirsin.',
    ),
  ),
];

const de = {
  title: 'Seminare & Ausbildungen',
  sessions: 'Sessions & Coaching',
  intro: 'Entdecke die Angebote von Çağla Mutlu – in deinem Tempo, mit Raum für deine Fragen.',
  all: 'Methodenübersicht',
  filters: 'Angebote nach Methode filtern',
  more: 'Mehr erfahren',
  chooseSection:
    'Wähle, ob du eine Methode erlernen oder persönliche Begleitung erhalten möchtest.',
  seminarsSummary: 'Methoden erlernen und vertiefen – in Seminaren und Ausbildungen.',
  sessionsSummary: 'Persönliche Begleitung – in einzelnen Sitzungen oder im Coaching.',
  chooseMethod: 'Wähle die Methode, die dich interessiert.',
  exploreMethod: 'Angebote entdecken',
  enquire: 'Jetzt anfragen',
  appointment: 'Termin anfragen',
  back: 'Zur Übersicht',
  contents: 'Inhalte',
  prerequisites: 'Voraussetzungen',
  duration: 'Dauer',
  format: 'Format',
  levels: 'Ausbildungsstufen',
  dates: 'Aktuelle Termine',
  pending: 'Informationen auf Anfrage',
  datesPending: 'Aktuelle Termine und Verfügbarkeit erfährst du direkt bei Çağla.',
  count: 'Angebote',
  close: 'Angebotsfenster schließen',
  language: 'Sprache wählen',
  noticeTitle: 'Hinweis zu den Methoden',
  notice:
    'Diese Angebote sind spirituelle beziehungsweise ergänzende Methoden der persönlichen Entwicklung und Reflexion. Sie beinhalten keine medizinischen Diagnosen oder Behandlung von Erkrankungen und ersetzen keine ärztliche oder psychotherapeutische Versorgung. Bestimmte Wirkungen oder Heilungen werden nicht garantiert.',
};
const tr: typeof de = {
  title: 'Seminerler & Eğitimler',
  sessions: 'Seanslar & Koçluk',
  intro: 'Çağla Mutlu’nun sunduğu programları keşfet – kendi hızında, sorularına yer açarak.',
  all: 'Yöntemlere genel bakış',
  filters: 'Programları yönteme göre filtrele',
  more: 'Daha fazla bilgi',
  chooseSection: 'Bir yöntem öğrenmek mi, kişisel rehberlik almak mı istediğini seç.',
  seminarsSummary: 'Seminerler ve eğitimlerle yöntemleri öğren ve bilgini derinleştir.',
  sessionsSummary: 'Bireysel seanslar veya koçlukla kişisel rehberlik al.',
  chooseMethod: 'İlgilendiğin yöntemi seç.',
  exploreMethod: 'Programları keşfet',
  enquire: 'Bilgi al',
  appointment: 'Randevu talep et',
  back: 'Listeye dön',
  contents: 'İçerik',
  prerequisites: 'Katılım koşulları',
  duration: 'Süre',
  format: 'Format',
  levels: 'Eğitim seviyeleri',
  dates: 'Güncel tarihler',
  pending: 'Bilgi talep edebilirsin',
  datesPending: 'Güncel tarihler ve uygunluk hakkında doğrudan Çağla’dan bilgi alabilirsin.',
  count: 'program',
  close: 'Program penceresini kapat',
  language: 'Dil seçimi',
  noticeTitle: 'Yöntemler hakkında',
  notice:
    'Bu programlar kişisel gelişim ve farkındalık için spiritüel veya tamamlayıcı yöntemlerdir. Tıbbi teşhis veya hastalık tedavisi içermez; tıbbi ya da psikoterapötik bakımın yerine geçmez. Belirli etkiler veya iyileşme garanti edilmez.',
};
export const catalogCopy: Record<Language, typeof de> = { de, tr };
