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
const l = (de: string, tr: string, en: string): Localized => ({ de, tr, en });
const online = l('Online über Zoom', 'Zoom üzerinden online', 'Online via Zoom');
const flexible = l('Online oder Präsenz', 'Online veya yüz yüze', 'Online or in person');
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
  { id: 'theta', title: l('ThetaHealing®', 'ThetaHealing®', 'ThetaHealing®') },
  { id: 'innerspeak', title: l('InnerSpeak™ / JAAS', 'InnerSpeak™ / JAAS', 'InnerSpeak™ / JAAS') },
  { id: 'dowsing', title: l('Spiritual Dowsing', 'Spiritual Dowsing', 'Spiritual Dowsing') },
  { id: 'reiki', title: l('Reiki', 'Reiki', 'Reiki') },
  { id: 'coaching', title: l('Coaching', 'Koçluk', 'Coaching') },
  { id: 'other', title: l('Spirituelle Praxis', 'Spiritüel uygulamalar', 'Spiritual practice') },
];

export const catalogOffers: readonly CatalogOffer[] = [
  seminar(
    'basic-dna',
    'theta',
    l('Basic DNA (Basis-DNA)', 'Basic DNA (Temel DNA)', 'Basic DNA'),
    l(
      'Einführung in die ThetaHealing®-Methode und spirituelle Glaubenssatzarbeit.',
      'ThetaHealing® yöntemine ve spiritüel inanç çalışmasına giriş.',
      'An introduction to ThetaHealing® and spiritual belief work.',
    ),
    l(
      'Du lernst die Grundlagen der ThetaHealing®-Methode kennen. Der Kurs widmet sich Glaubenssätzen, spirituellen Ebenen des Seins und den im Kurs vermittelten energetischen Techniken.',
      'ThetaHealing® yönteminin temellerini tanırsın. Kurs; inançlara, varoluşun spiritüel düzlemlerine ve kursta aktarılan enerjetik tekniklere odaklanır.',
      'Learn the foundations of the ThetaHealing® method. The course explores beliefs, spiritual planes of existence and the energy techniques taught as part of the course.',
    ),
    {
      format: online,
      contents: [
        l('Grundlagen der Methode', 'Yöntemin temelleri', 'Foundations of the method'),
        l('Glaubenssatzarbeit', 'İnanç çalışması', 'Belief work'),
        l(
          'Spirituelle Ebenen des Seins und energetische Techniken',
          'Varoluşun spiritüel düzlemleri ve enerjetik teknikler',
          'Spiritual planes of existence and energy techniques',
        ),
      ],
    },
  ),
  seminar(
    'advanced-dna',
    'theta',
    l('Advanced DNA (Aufbau-DNA)', 'Advanced DNA (İleri DNA)', 'Advanced DNA'),
    l(
      'Vertiefende Glaubenssatz- und Gefühlsarbeit.',
      'İnanç ve duygu çalışmalarında derinleşme.',
      'Deeper work with beliefs and feelings.',
    ),
    l(
      'Im Mittelpunkt stehen vertiefende Glaubenssatzarbeit, Gefühlsarbeit und weiterführende Techniken der ThetaHealing®-Methode. Die sieben Ebenen werden als spirituelles Konzept betrachtet.',
      'ThetaHealing® yönteminde derinlemesine inanç çalışması, duygu çalışması ve ileri teknikler ele alınır. Yedi düzlem spiritüel bir kavram olarak incelenir.',
      'The focus is on deeper belief work, feeling work and further ThetaHealing® techniques. The seven planes are considered as a spiritual concept.',
    ),
    {
      format: online,
      contents: [
        l('Vertiefende Glaubenssatzarbeit', 'Derinlemesine inanç çalışması', 'Deeper belief work'),
        l(
          'Spirituelle Konzepte der sieben Ebenen',
          'Yedi düzlemin spiritüel kavramları',
          'Spiritual concepts of the seven planes',
        ),
        l(
          'Gefühlsarbeit und weiterführende Techniken',
          'Duygu çalışması ve ileri teknikler',
          'Feeling work and further techniques',
        ),
      ],
    },
  ),
  seminar(
    'dig-deeper',
    'theta',
    l('Dig Deeper (Grabe Tiefer)', 'Dig Deeper (Derine İn)', 'Dig Deeper'),
    l(
      'Glaubensmuster mit der Digging-Technik erforschen.',
      'Digging tekniğiyle inanç kalıplarını keşfetme.',
      'Explore belief patterns using the digging technique.',
    ),
    l(
      'Dieses Seminar vertieft die Digging-Technik zur Erforschung persönlicher Glaubensmuster innerhalb der ThetaHealing®-Methode.',
      'Bu seminer, ThetaHealing® yöntemi kapsamında kişisel inanç kalıplarını keşfetmek için kullanılan Digging tekniğini derinleştirir.',
      'This seminar develops the digging technique for exploring personal belief patterns within the ThetaHealing® method.',
    ),
    {
      prerequisites: ['basic-dna', 'advanced-dna'],
      format: flexible,
      contents: [
        l(
          'Vertiefung der Digging-Technik',
          'Digging tekniğinde derinleşme',
          'Developing the digging technique',
        ),
        l(
          'Erforschung von Glaubensmustern',
          'İnanç kalıplarının keşfi',
          'Exploring belief patterns',
        ),
      ],
    },
  ),
  seminar(
    'you-and-the-creator',
    'theta',
    l(
      'You and the Creator (Du und der Schöpfer)',
      'You and the Creator (Sen ve Yaratıcı)',
      'You and the Creator',
    ),
    l(
      'Ego, höheres Selbst und Schöpfer als spirituelle Konzepte betrachten.',
      'Ego, yüksek benlik ve Yaratıcı kavramlarını spiritüel açıdan ele alma.',
      'Explore ego, higher self and the Creator as spiritual concepts.',
    ),
    l(
      'Eine spirituelle Auseinandersetzung mit der Unterscheidung zwischen Ego, höherem Selbst und Schöpfer innerhalb der ThetaHealing®-Methode.',
      'ThetaHealing® yöntemi kapsamında ego, yüksek benlik ve Yaratıcı arasındaki ayrımı spiritüel açıdan ele alan bir seminer.',
      'A spiritual exploration of the distinction between ego, higher self and the Creator within the ThetaHealing® method.',
    ),
    {
      prerequisites: foundation,
      format: flexible,
      contents: [
        l(
          'Unterscheidung zwischen Ego, höherem Selbst und Schöpfer',
          'Ego, yüksek benlik ve Yaratıcı arasındaki ayrım',
          'Distinguishing ego, higher self and the Creator',
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
      'RHYTHM to a Perfect Weight',
    ),
    l(
      'Spirituelle Reflexion zu Selbstbild, Körper und Gewicht.',
      'Benlik algısı, beden ve kilo üzerine spiritüel farkındalık.',
      'Spiritual reflection on self-image, the body and weight.',
    ),
    l(
      'Spirituelle Glaubenssatzarbeit in Bezug auf Selbstbild, Körper und Gewicht. Das Angebot dient der persönlichen Reflexion und verspricht keine Gewichtsveränderung oder medizinische Wirkung.',
      'Benlik algısı, beden ve kilo ile ilgili spiritüel inanç çalışması. Bu çalışma kişisel farkındalığa yöneliktir; kilo değişimi veya tıbbi etki vaat etmez.',
      'Spiritual belief work relating to self-image, the body and weight. This offer supports personal reflection and does not promise weight changes or medical effects.',
    ),
    {
      prerequisites: foundation,
      contents: [
        l(
          'Glaubenssätze zu Selbstbild, Körper und Gewicht',
          'Benlik algısı, beden ve kiloya ilişkin inançlar',
          'Beliefs about self-image, the body and weight',
        ),
      ],
    },
  ),
  seminar(
    'theta-tiere',
    'theta',
    l('ThetaHealing® Tierseminar', 'ThetaHealing® Hayvan Semineri', 'ThetaHealing® Animal Seminar'),
    l(
      'Spirituelle und intuitive Arbeit mit Tieren.',
      'Hayvanlarla spiritüel ve sezgisel çalışma.',
      'Spiritual and intuitive work with animals.',
    ),
    l(
      'Das Seminar betrachtet spirituelle und intuitive Arbeit mit Tieren aus Sicht der ThetaHealing®-Methode.',
      'Seminer, hayvanlarla spiritüel ve sezgisel çalışmayı ThetaHealing® yöntemi açısından ele alır.',
      'The seminar explores spiritual and intuitive work with animals from the perspective of the ThetaHealing® method.',
    ),
    {
      duration: l('1 Tag', '1 gün', '1 day'),
      prerequisites: foundation,
      format: flexible,
      contents: [
        l(
          'Spirituelle und intuitive Arbeit mit Tieren',
          'Hayvanlarla spiritüel ve sezgisel çalışma',
          'Spiritual and intuitive work with animals',
        ),
      ],
    },
  ),
  seminar(
    'theta-pflanzen',
    'theta',
    l(
      'ThetaHealing® Pflanzenseminar',
      'ThetaHealing® Bitki Semineri',
      'ThetaHealing® Plant Seminar',
    ),
    l(
      'Eigenes Seminar zur ThetaHealing®-Methode mit Bezug zu Pflanzen.',
      'Bitkilerle ilgili ayrı bir ThetaHealing® semineri.',
      'A separate ThetaHealing® seminar focusing on plants.',
    ),
    l(
      'Das Pflanzenseminar ist ein eigenes Angebot. Konkrete Inhalte, Voraussetzungen, Dauer und Format erfährst du auf Anfrage bei Çağla.',
      'Bitki semineri ayrı bir programdır. İçerik, katılım koşulları, süre ve format hakkında Çağla’dan bilgi alabilirsin.',
      'The plant seminar is a separate offer. Ask Çağla about the specific content, prerequisites, duration and format.',
    ),
  ),
  seminar(
    'jaas-stufe-1',
    'innerspeak',
    l(
      'JAAS / InnerSpeak™ – Stufe 1 Praktikerausbildung',
      'JAAS / InnerSpeak™ – 1. Seviye Uygulayıcı Eğitimi',
      'JAAS / InnerSpeak™ – Level 1 Practitioner Training',
    ),
    l(
      'Grundlagen und Anwendung der InnerSpeak™-Methode.',
      'InnerSpeak™ yönteminin temelleri ve uygulanması.',
      'Foundations and application of the InnerSpeak™ method.',
    ),
    l(
      'Die Ausbildung behandelt spirituelle Grundlagen, Muskeltest, Chakren, JAAS-Dateien und die Anwendung der InnerSpeak™-Methode. Angaben zu Zertifikaten erhältst du auf Anfrage.',
      'Eğitim; spiritüel temelleri, kas testini, çakraları, JAAS dosyalarını ve InnerSpeak™ yönteminin uygulanmasını kapsar. Sertifikalara ilişkin bilgileri talep edebilirsin.',
      'The training covers spiritual foundations, muscle testing, chakras, JAAS files and application of the InnerSpeak™ method. Information about certificates is available on request.',
    ),
    {
      duration: l('2–3 Tage', '2–3 gün', '2–3 days'),
      contents: [
        l('Spirituelle Grundlagen', 'Spiritüel temeller', 'Spiritual foundations'),
        l('Muskeltest und Chakren', 'Kas testi ve çakralar', 'Muscle testing and chakras'),
        l(
          'JAAS-Dateien und Anwendung der InnerSpeak™-Methode',
          'JAAS dosyaları ve InnerSpeak™ yönteminin uygulanması',
          'JAAS files and application of the InnerSpeak™ method',
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
      'Spiritual Dowsing – Practitioner Training',
    ),
    l(
      'Spirituelles Pendeln im Jean-Adrienne-Ansatz.',
      'Jean Adrienne yaklaşımında spiritüel sarkaç çalışması.',
      'Spiritual dowsing using Jean Adrienne’s approach.',
    ),
    l(
      'Ausbildung zur Anwendung des spirituellen Pendelns innerhalb des Jean-Adrienne-Ansatzes. Weitere Angaben zum Ablauf und zu Voraussetzungen erhältst du auf Anfrage.',
      'Jean Adrienne yaklaşımı kapsamında spiritüel sarkaç uygulaması eğitimi. Akış ve katılım koşulları hakkında daha fazla bilgi talep edebilirsin.',
      'Training in spiritual dowsing using Jean Adrienne’s approach. Further details about the course and prerequisites are available on request.',
    ),
    {
      duration: l('1–2 Tage', '1–2 gün', '1–2 days'),
      contents: [
        l(
          'Anwendung des spirituellen Pendelns',
          'Spiritüel sarkaç uygulaması',
          'Applying spiritual dowsing',
        ),
      ],
    },
  ),
  seminar(
    'usui-reiki',
    'reiki',
    l(
      'Usui Reiki I, II, III und Master',
      'Usui Reiki I, II, III ve Master',
      'Usui Reiki I, II, III and Master',
    ),
    l(
      'Usui Reiki als eigenständige Ausbildungsreihe.',
      'Ayrı bir eğitim serisi olarak Usui Reiki.',
      'Usui Reiki as a separate training series.',
    ),
    l(
      'Die Ausbildungsreihe umfasst Usui Reiki I, II, III und Master als spirituelle Praxis. Inhalte, Dauer, Voraussetzungen und Format der jeweiligen Stufe sind bei Çağla anzufragen.',
      'Eğitim serisi spiritüel uygulama olarak Usui Reiki I, II, III ve Master seviyelerini kapsar. Her seviyenin içeriği, süresi, katılım koşulları ve formatı için Çağla’dan bilgi alabilirsin.',
      'The training series covers Usui Reiki I, II, III and Master as spiritual practice. Ask Çağla about the content, duration, prerequisites and format for each level.',
    ),
    {
      levels: [
        l('Usui Reiki I', 'Usui Reiki I', 'Usui Reiki I'),
        l('Usui Reiki II', 'Usui Reiki II', 'Usui Reiki II'),
        l('Usui Reiki III', 'Usui Reiki III', 'Usui Reiki III'),
        l('Usui Reiki Master', 'Usui Reiki Master', 'Usui Reiki Master'),
      ],
    },
  ),
  seminar(
    'ra-sheeba',
    'reiki',
    l('Ra-Sheeba Master', 'Ra-Sheeba Master', 'Ra-Sheeba Master'),
    l(
      'Eigenständige Ausbildung in der spirituellen Ra-Sheeba-Praxis.',
      'Spiritüel Ra-Sheeba uygulamasında ayrı bir eğitim.',
      'A separate training course in spiritual Ra-Sheeba practice.',
    ),
    l(
      'Ra-Sheeba Master wird als eigene Ausbildungsreihe angeboten. Konkrete Inhalte, Dauer, Voraussetzungen und Format klärst du direkt mit Çağla.',
      'Ra-Sheeba Master ayrı bir eğitim olarak sunulur. İçerik, süre, katılım koşulları ve formatı doğrudan Çağla ile görüşebilirsin.',
      'Ra-Sheeba Master is offered as a separate training series. Discuss the specific content, duration, prerequisites and format directly with Çağla.',
    ),
  ),
  seminar(
    'silber-violette-flamme',
    'reiki',
    l('Silber-Violette-Flamme Master', 'Gümüş-Mor Alev Master', 'Silver Violet Flame Master'),
    l(
      'Eigenständige spirituelle Master-Ausbildung.',
      'Ayrı bir spiritüel Master eğitimi.',
      'A separate spiritual master training course.',
    ),
    l(
      'Die Silber-Violette-Flamme Master-Ausbildung ist ein eigenständiges Angebot. Weitere Informationen zu Inhalten, Dauer, Voraussetzungen und Format erhältst du auf Anfrage.',
      'Gümüş-Mor Alev Master eğitimi ayrı bir programdır. İçerik, süre, katılım koşulları ve format hakkında bilgi talep edebilirsin.',
      'The Silver Violet Flame Master training is a separate offer. Further information about content, duration, prerequisites and format is available on request.',
    ),
  ),
  seminar(
    'kundalini-reiki',
    'reiki',
    l(
      'Kundalini Reiki I, II, III und Master',
      'Kundalini Reiki I, II, III ve Master',
      'Kundalini Reiki I, II, III and Master',
    ),
    l(
      'Kundalini Reiki als eigenständige Ausbildungsreihe.',
      'Ayrı bir eğitim serisi olarak Kundalini Reiki.',
      'Kundalini Reiki as a separate training series.',
    ),
    l(
      'Die Ausbildungsreihe umfasst Kundalini Reiki I, II, III und Master als spirituelle Praxis. Inhalte, Dauer, Voraussetzungen und Format der jeweiligen Stufe sind bei Çağla anzufragen.',
      'Eğitim serisi spiritüel uygulama olarak Kundalini Reiki I, II, III ve Master seviyelerini kapsar. Her seviyenin içeriği, süresi, katılım koşulları ve formatı için Çağla’dan bilgi alabilirsin.',
      'The training series covers Kundalini Reiki I, II, III and Master as spiritual practice. Ask Çağla about the content, duration, prerequisites and format for each level.',
    ),
    {
      levels: [
        l('Kundalini Reiki I', 'Kundalini Reiki I', 'Kundalini Reiki I'),
        l('Kundalini Reiki II', 'Kundalini Reiki II', 'Kundalini Reiki II'),
        l('Kundalini Reiki III', 'Kundalini Reiki III', 'Kundalini Reiki III'),
        l('Kundalini Reiki Master', 'Kundalini Reiki Master', 'Kundalini Reiki Master'),
      ],
    },
  ),
  session(
    'weekly-erstgespraech',
    'coaching',
    l(
      'Weekly Coaching – Erstgespräch',
      'Weekly Coaching – İlk Görüşme',
      'Weekly Coaching – Initial Conversation',
    ),
    l('90 Minuten', '90 dakika', '90 minutes'),
    l(
      'Kennenlernen und Raum für deine persönlichen Ziele.',
      'Tanışma ve kişisel hedeflerin için bir alan.',
      'Getting to know each other, with space for your personal goals.',
    ),
    l(
      'Im Erstgespräch geht es um das Kennenlernen, deine Bedürfnisse, Prioritäten, persönlichen Fragestellungen und Ziele. Gemeinsam besprechen wir, welche Begleitung zu deinem Anliegen passt.',
      'İlk görüşmede tanışmaya, ihtiyaçlarına, önceliklerine, kişisel sorularına ve hedeflerine odaklanırız. Sana uygun rehberliği birlikte konuşuruz.',
      'The initial conversation focuses on getting to know you, your needs, priorities, personal questions and goals. Together, we discuss which support suits your needs.',
    ),
  ),
  session(
    'weekly-folgetermine',
    'coaching',
    l(
      'Weekly Coaching – Folgetermine',
      'Weekly Coaching – Takip Görüşmeleri',
      'Weekly Coaching – Follow-up Sessions',
    ),
    l('60 Minuten', '60 dakika', '60 minutes'),
    l(
      'Individuelle Begleitung mit Gesprächen und spirituellen Methoden.',
      'Görüşmeler ve spiritüel yöntemlerle kişisel rehberlik.',
      'Individual support through conversation and spiritual methods.',
    ),
    l(
      'Die Folgetermine verbinden Gespräche mit einer individuellen Auswahl aus InnerSpeak™, ThetaHealing®, spirituellem Pendeln, Reiki oder den sieben Toren des Bewusstseins. Dein Anliegen und deine persönliche Reflexion stehen im Mittelpunkt.',
      'Takip görüşmeleri, konuşmaları InnerSpeak™, ThetaHealing®, spiritüel sarkaç, Reiki veya bilincin yedi kapısı yöntemlerinden kişisel bir seçimle birleştirir. Konun ve kişisel farkındalığın ön plandadır.',
      'Follow-up sessions combine conversation with an individual selection of InnerSpeak™, ThetaHealing®, spiritual dowsing, Reiki or the Seven Gates of Consciousness. Your needs and personal reflection are at the centre.',
    ),
  ),
  session(
    'innerspeak-einzel',
    'innerspeak',
    l(
      'InnerSpeak™ / JAAS Einzelsession',
      'InnerSpeak™ / JAAS Bireysel Seans',
      'InnerSpeak™ / JAAS Individual Session',
    ),
    l('20–40 Minuten', '20–40 dakika', '20–40 minutes'),
    l(
      'Persönliche Reflexion mit der InnerSpeak™-Methode.',
      'InnerSpeak™ yöntemiyle kişisel farkındalık.',
      'Personal reflection using the InnerSpeak™ method.',
    ),
    l(
      'Du bringst eine persönliche Fragestellung mit. In der Einzelsession wird sie mithilfe der InnerSpeak™ / JAAS-Methode als spiritueller Praxis betrachtet. Ablauf und Schwerpunkt werden mit dir besprochen.',
      'Kişisel bir sorunu veya konunu getirirsin. Bireysel seansta bu konu, spiritüel bir uygulama olarak InnerSpeak™ / JAAS yöntemiyle ele alınır. Akış ve odak seninle görüşülür.',
      'Bring a personal question to the session. It is explored through InnerSpeak™ / JAAS as a spiritual practice. The process and focus will be discussed with you.',
    ),
  ),
  session(
    'innerspeak-gruppe',
    'innerspeak',
    l(
      'InnerSpeak™ / JAAS Gruppensession',
      'InnerSpeak™ / JAAS Grup Seansı',
      'InnerSpeak™ / JAAS Group Session',
    ),
    l('20–40 Minuten', '20–40 dakika', '20–40 minutes'),
    l(
      'Spirituelle Reflexion im gemeinsamen Rahmen.',
      'Birlikte spiritüel farkındalık çalışması.',
      'Spiritual reflection in a shared setting.',
    ),
    l(
      'Eine Gruppensession mit der InnerSpeak™ / JAAS-Methode bietet einen gemeinsamen Rahmen für spirituelle Reflexion. Thema, Ablauf und Teilnahme werden vorab auf Anfrage geklärt.',
      'InnerSpeak™ / JAAS yöntemiyle grup seansı, spiritüel farkındalık için ortak bir alan sunar. Konu, akış ve katılım önceden talep üzerine netleştirilir.',
      'A group session using InnerSpeak™ / JAAS provides a shared setting for spiritual reflection. The topic, process and participation are arranged in advance on request.',
    ),
  ),
  session(
    'tierkommunikation',
    'other',
    l('Tierkommunikation', 'Hayvanlarla İletişim', 'Animal communication'),
    l('20–40 Minuten', '20–40 dakika', '20–40 minutes'),
    l(
      'Intuitive, spirituelle Betrachtung deiner Verbindung zu einem Tier.',
      'Bir hayvanla bağının sezgisel ve spiritüel olarak ele alınması.',
      'An intuitive, spiritual exploration of your connection with an animal.',
    ),
    l(
      'Die Sitzung widmet sich deiner Verbindung zu einem Tier als intuitiver, spiritueller Praxis. Dein Anliegen und der Ablauf werden vorab besprochen. Die Sitzung ersetzt keine tierärztliche Abklärung oder Behandlung.',
      'Seans, bir hayvanla bağını sezgisel ve spiritüel bir uygulama olarak ele alır. Konun ve akış önceden görüşülür. Seans veteriner değerlendirmesi veya tedavisinin yerine geçmez.',
      'The session explores your connection with an animal as an intuitive, spiritual practice. Your needs and the process are discussed in advance. The session does not replace veterinary assessment or treatment.',
    ),
  ),
  session(
    'theta-einzel',
    'theta',
    l(
      'ThetaHealing® Einzelsession',
      'ThetaHealing® Bireysel Seans',
      'ThetaHealing® Individual Session',
    ),
    l('60 Minuten', '60 dakika', '60 minutes'),
    l(
      'Spirituelle Glaubenssatzarbeit zu einem persönlichen Thema.',
      'Kişisel bir konu üzerine spiritüel inanç çalışması.',
      'Spiritual belief work on a personal topic.',
    ),
    l(
      'Ausgehend von deinem Anliegen werden persönliche Glaubenssätze innerhalb der ThetaHealing®-Methode betrachtet. Die Sitzung bietet Raum für spirituelle Praxis und persönliche Reflexion.',
      'Konundan yola çıkarak kişisel inançlar ThetaHealing® yöntemi kapsamında ele alınır. Seans spiritüel uygulama ve kişisel farkındalık için bir alan sunar.',
      'Starting with your concerns, personal beliefs are explored through the ThetaHealing® method. The session provides space for spiritual practice and personal reflection.',
    ),
  ),
  session(
    'dowsing-session',
    'dowsing',
    l(
      'Spiritual Dowsing / Spirituelles Pendeln',
      'Spiritual Dowsing / Spiritüel Sarkaç',
      'Spiritual Dowsing',
    ),
    l('30–45 Minuten', '30–45 dakika', '30–45 minutes'),
    l(
      'Eine persönliche Fragestellung mit spirituellem Pendeln betrachten.',
      'Kişisel bir soruyu spiritüel sarkaçla ele alma.',
      'Explore a personal question through spiritual dowsing.',
    ),
    l(
      'Nach einem Gespräch über dein Anliegen wird spirituelles Pendeln als ergänzende Praxis der persönlichen Reflexion eingesetzt. Der Schwerpunkt der Sitzung wird mit dir abgestimmt.',
      'Konun hakkında bir görüşmenin ardından spiritüel sarkaç, kişisel farkındalığı destekleyen tamamlayıcı bir uygulama olarak kullanılır. Seansın odağı seninle belirlenir.',
      'After discussing your concerns, spiritual dowsing is used as a complementary practice for personal reflection. The focus of the session will be agreed with you.',
    ),
  ),
  session(
    'reiki-session',
    'reiki',
    l('Reiki Einzelsession', 'Reiki Bireysel Seans', 'Reiki Individual Session'),
    l('40–60 Minuten', '40–60 dakika', '40–60 minutes'),
    l(
      'Zeit für dich im Rahmen spiritueller Reiki-Praxis.',
      'Spiritüel Reiki uygulaması kapsamında kendine zaman ayırma.',
      'Time for yourself through spiritual Reiki practice.',
    ),
    l(
      'In einem kurzen Gespräch klärst du dein Anliegen und den Ablauf. Die anschließende Reiki-Praxis bietet einen ruhigen Rahmen für eine bewusste Auszeit. Individuelle Wirkungen werden nicht garantiert.',
      'Kısa bir görüşmede konunu ve akışı netleştirirsin. Ardından Reiki uygulaması bilinçli bir mola için sakin bir alan sunar. Kişisel etkiler garanti edilmez.',
      'A short conversation clarifies your concerns and the process. The subsequent Reiki practice offers a peaceful setting for a mindful break. Individual effects are not guaranteed.',
    ),
  ),
  session(
    'jaas-theta',
    'innerspeak',
    l(
      'Kombinierte JAAS + ThetaHealing® Sitzung',
      'Birleşik JAAS + ThetaHealing® Seansı',
      'Combined JAAS + ThetaHealing® Session',
    ),
    l('60–90 Minuten', '60–90 dakika', '60–90 minutes'),
    l(
      'Zwei spirituelle Methoden in einem individuellen Rahmen.',
      'Kişisel bir çerçevede iki spiritüel yöntem.',
      'Two spiritual methods in an individual setting.',
    ),
    l(
      'Die Sitzung kombiniert JAAS / InnerSpeak™ und ThetaHealing® als spirituelle Methoden der persönlichen Reflexion. Zu Beginn werden dein Thema und die Gestaltung der Sitzung gemeinsam besprochen.',
      'Seans JAAS / InnerSpeak™ ve ThetaHealing® yöntemlerini kişisel farkındalığa yönelik spiritüel uygulamalar olarak birleştirir. Başlangıçta konun ve seansın akışı birlikte görüşülür.',
      'The session combines JAAS / InnerSpeak™ and ThetaHealing® as spiritual methods for personal reflection. Your topic and the session format are discussed together at the start.',
    ),
  ),
  session(
    'sieben-tore',
    'other',
    l(
      'Die sieben Tore des Bewusstseins',
      'Bilincin Yedi Kapısı',
      'The Seven Gates of Consciousness',
    ),
    l('20–40 Minuten', '20–40 dakika', '20–40 minutes'),
    l(
      'Spirituelle Praxis und persönliche Reflexion.',
      'Spiritüel uygulama ve kişisel farkındalık.',
      'Spiritual practice and personal reflection.',
    ),
    l(
      'Dieses Angebot schafft einen Rahmen für spirituelle Praxis und persönliche Reflexion unter dem Namen „Die sieben Tore des Bewusstseins“. Konkrete Informationen zur Methode und zum Ablauf erhältst du direkt von Çağla.',
      '“Bilincin Yedi Kapısı” adıyla sunulan bu çalışma spiritüel uygulama ve kişisel farkındalık için bir alan oluşturur. Yöntem ve akış hakkında ayrıntılı bilgiyi doğrudan Çağla’dan alabilirsin.',
      'This offer creates a setting for spiritual practice and personal reflection under the name ‘The Seven Gates of Consciousness’. Ask Çağla directly for details about the method and process.',
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
const en: typeof de = {
  title: 'Seminars & Training',
  sessions: 'Sessions & Coaching',
  intro: 'Discover Çağla Mutlu’s offers – at your pace, with room for your questions.',
  all: 'Methods overview',
  filters: 'Filter offers by method',
  more: 'Learn more',
  chooseSection: 'Choose whether you would like to learn a method or receive personal support.',
  seminarsSummary: 'Learn and deepen methods through seminars and training.',
  sessionsSummary: 'Personal support through individual sessions or coaching.',
  chooseMethod: 'Choose the method you are interested in.',
  exploreMethod: 'Explore offers',
  enquire: 'Enquire now',
  appointment: 'Ask for an appointment',
  back: 'Back to overview',
  contents: 'Content',
  prerequisites: 'Prerequisites',
  duration: 'Duration',
  format: 'Format',
  levels: 'Training levels',
  dates: 'Upcoming dates',
  pending: 'Information on request',
  datesPending: 'Contact Çağla directly for current dates and availability.',
  count: 'offers',
  close: 'Close offer window',
  language: 'Choose language',
  noticeTitle: 'About these methods',
  notice:
    'These offers are spiritual or complementary methods for personal development and reflection. They do not include medical diagnoses or treatment of illness and do not replace medical or psychotherapeutic care. Specific effects or healing are not guaranteed.',
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
export const catalogCopy: Record<Language, typeof de> = { de, tr, en };
