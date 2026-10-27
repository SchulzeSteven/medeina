import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SiteStateService } from '../site-state.service';
import { storeProducts } from '../store/store.data';
import { Elements, loadStripeElements, PaymentElement, StripeClient } from './stripe-elements';
import { loadPayPalButtons, PayPalButtons } from './paypal-buttons';

const checkoutCopy = {
  de: {
    title: 'Deine Auszeit beginnt hier.',
    back: 'Zurück zum Produkt',
    summary: 'Deine Auswahl',
    quantity: '1 Stück',
    total: 'Gesamtbetrag',
    payment: 'Sicher bezahlen',
    intro: 'Wähle deine Zahlungsart und gib deine Zahlungsdaten ein.',
    test: 'Test-Checkout · keine echte Abbuchung',
    loading: 'Zahlungsformular wird geladen …',
    unavailable:
      'Der Bezahlbereich ist vorbereitet. Die Stripe-Testverbindung ist noch nicht eingerichtet.',
    secure: 'Deine Zahlungsdaten werden direkt von Stripe verarbeitet.',
    pay: 'Testzahlung ausführen',
    busy: 'Zahlung wird geprüft …',
    error: 'Die Zahlung konnte nicht abgeschlossen werden. Bitte versuche es erneut.',
    retry: 'Erneut laden',
    success: 'Testzahlung erfolgreich',
    successText:
      'Deine Testzahlung wurde vom Zahlungsanbieter bestätigt. Es wurde kein echtes Geld abgebucht und keine Bestellung ausgelöst.',
    processing:
      'Stripe verarbeitet die Testzahlung noch. Der Zahlungsstatus ist noch nicht bestätigt.',
    priceNote: 'Beispielpreis in Euro. Dieser Checkout dient ausschließlich zum Testen.',
    contact: 'Du hast eine Frage?',
    contactLink: 'Çağla schreiben',
    testCard:
      'Testkarte: 4242 4242 4242 4242 · zukünftiges Ablaufdatum · beliebige 3-stellige Prüfziffer.',
    card: 'Kredit- / Debitkarte',
    paypalInfo:
      'PayPal-Sandbox: keine echte Abbuchung. Zum Abschließen wird ein PayPal-Testkonto benötigt.',
    paypalSetup:
      'PayPal-Vorschau ist aktiv. Für eine Testzahlung muss noch ein PayPal-Sandboxkonto verbunden werden.',
    paypalCancel: 'PayPal-Testzahlung abgebrochen. Es wurde nichts abgebucht.',
    previewOnly:
      'Kartenvorschau aktiv. Zum Abschließen der Testzahlung muss die private Testkonfiguration auf dem Server hinterlegt werden.',
  },
  tr: {
    title: 'Kendine ayırdığın zaman burada başlar.',
    back: 'Ürüne dön',
    summary: 'Seçimin',
    quantity: '1 adet',
    total: 'Toplam',
    payment: 'Güvenli ödeme',
    intro: 'Ödeme yöntemini seç ve ödeme bilgilerini gir.',
    test: 'Test ödemesi · gerçek tahsilat yapılmaz',
    loading: 'Ödeme formu yükleniyor …',
    unavailable: 'Ödeme alanı hazır. Stripe test bağlantısı henüz kurulmadı.',
    secure: 'Ödeme bilgilerin doğrudan Stripe tarafından işlenir.',
    pay: 'Test ödemesini gerçekleştir',
    busy: 'Ödeme kontrol ediliyor …',
    error: 'Ödeme tamamlanamadı. Lütfen tekrar dene.',
    retry: 'Yeniden yükle',
    success: 'Test ödemesi başarılı',
    successText:
      'Test ödemen ödeme sağlayıcısı tarafından onaylandı. Gerçek para tahsil edilmedi ve sipariş oluşturulmadı.',
    processing: 'Stripe test ödemesini işliyor. Ödeme durumu henüz onaylanmadı.',
    priceNote: 'Euro cinsinden örnek fiyat. Bu ödeme alanı yalnızca test içindir.',
    contact: 'Bir sorun mu var?',
    contactLink: 'Çağla’ya yaz',
    testCard:
      'Test kartı: 4242 4242 4242 4242 · gelecekte bir son kullanma tarihi · herhangi bir 3 haneli güvenlik kodu.',
    card: 'Kredi / banka kartı',
    paypalInfo:
      'PayPal test ortamı: Gerçek tahsilat yapılmaz. Tamamlamak için bir PayPal test hesabı gerekir.',
    paypalSetup: 'PayPal önizlemesi açık. Test ödemesi için bir PayPal test hesabı bağlanmalıdır.',
    paypalCancel: 'PayPal test ödemesi iptal edildi. Tahsilat yapılmadı.',
    previewOnly:
      'Kart önizlemesi açık. Test ödemesini tamamlamak için özel test yapılandırması sunucuya eklenmelidir.',
  },
  en: {
    title: 'Your time out begins here.',
    back: 'Back to product',
    summary: 'Your selection',
    quantity: '1 item',
    total: 'Total amount',
    payment: 'Secure payment',
    intro: 'Choose your payment method and enter your payment details.',
    test: 'Test checkout · no real charge',
    loading: 'Loading payment form …',
    unavailable: 'The payment area is ready. The Stripe test connection has not been set up yet.',
    secure: 'Your payment details are processed directly by Stripe.',
    pay: 'Make a test payment',
    busy: 'Checking payment …',
    error: 'The payment could not be completed. Please try again.',
    retry: 'Reload',
    success: 'Test payment successful',
    successText:
      'Your test payment was confirmed by the payment provider. No real money was charged and no order was placed.',
    processing:
      'Stripe is still processing the test payment. The payment status has not yet been confirmed.',
    priceNote: 'Example price in euros. This checkout is for testing only.',
    contact: 'Have a question?',
    contactLink: 'Write to Çağla',
    testCard: 'Test card: 4242 4242 4242 4242 · future expiry date · any 3-digit security code.',
    card: 'Credit / debit card',
    paypalInfo:
      'PayPal sandbox: no real charge. A PayPal test account is required to complete payment.',
    paypalSetup:
      'PayPal preview is active. A PayPal sandbox account must still be connected for a test payment.',
    paypalCancel: 'PayPal test payment cancelled. Nothing was charged.',
    previewOnly:
      'Card preview active. Private test configuration must be added on the server to complete a test payment.',
  },
};
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnDestroy {
  readonly state = inject(SiteStateService);
  private readonly document = inject(DOCUMENT);
  private readonly route = inject(ActivatedRoute);
  readonly product = storeProducts.find((p) => p.id === this.route.snapshot.paramMap.get('id'))!;
  readonly copy = computed(() => checkoutCopy[this.state.language()]);
  readonly price = computed(() =>
    new Intl.NumberFormat({ de: 'de-DE', tr: 'tr-TR', en: 'en-GB' }[this.state.language()], {
      style: 'currency',
      currency: 'EUR',
    }).format(this.product.priceCents / 100),
  );
  readonly status = signal<
    'loading' | 'unavailable' | 'ready' | 'success' | 'processing' | 'error'
  >('loading');
  readonly busy = signal(false);
  readonly error = signal('');
  readonly method = signal<'card' | 'paypal'>('card');
  readonly backendReady = signal(false);
  readonly paypalReady = signal(false);
  readonly paypalConfigured = signal(false);
  readonly paypalError = signal('');
  private readonly mount = viewChild.required<ElementRef<HTMLDivElement>>('paymentMount');
  private readonly paypalMount = viewChild.required<ElementRef<HTMLDivElement>>('paypalMount');
  private paypalButtons?: PayPalButtons;
  private paypalToken = '';
  private csrfToken = '';
  private stripe?: StripeClient;
  private elements?: Elements;
  private element?: PaymentElement;
  private destroyed = false;
  private readonly attemptId = crypto.randomUUID();
  constructor() {
    effect(() => {
      this.document.title = `${this.copy().payment} · Medeina`;
      this.document
        .querySelector('meta[name="description"]')
        ?.setAttribute('content', this.copy().intro);
      this.elements?.update({ locale: this.state.language() });
    });
    // Establish the shared session before requesting the second provider's token.
    afterNextRender(() => {
      void this.initialize().finally(() => {
        if (!this.destroyed) void this.initializePayPal();
      });
    });
  }
  async initialize() {
    this.status.set('loading');
    this.error.set('');
    this.element?.destroy();
    try {
      let config: { publishableKey?: string; csrfToken?: string } = {};
      try {
        const response = await fetch(new URL('api/stripe-config.php', this.document.baseURI), {
          cache: 'no-store',
        });
        if (response.ok) config = await response.json();
      } catch {
        /* Static previews can still render test Elements. */
      }
      this.backendReady.set(Boolean(config.csrfToken));
      if (!config.publishableKey?.startsWith('pk_test_')) {
        const preview = await fetch(new URL('api/stripe-preview.json', this.document.baseURI), {
          cache: 'no-store',
        });
        if (preview.ok) config = await preview.json();
      }
      if (!config.publishableKey?.startsWith('pk_test_')) {
        this.status.set('unavailable');
        return;
      }
      this.csrfToken = config.csrfToken ?? '';
      const factory = await loadStripeElements();
      if (this.destroyed) return;
      this.stripe = factory(config.publishableKey);
      this.elements = this.stripe.elements({
        mode: 'payment',
        amount: this.product.priceCents,
        currency: 'eur',
        allowedPaymentMethodTypes: ['card'],
        locale: this.state.language(),
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#285e65',
            colorBackground: '#fffdf9',
            colorText: '#283d3e',
            colorDanger: '#a33232',
            fontFamily: 'Arial, sans-serif',
            borderRadius: '8px',
            spacingUnit: '5px',
          },
        },
      });
      this.element = this.elements.create('payment', { layout: 'tabs' });
      this.element.on('ready', () => {
        if (!this.destroyed) this.status.set('ready');
      });
      this.element.on('loaderror', () => {
        if (!this.destroyed) this.status.set('error');
      });
      this.element.mount(this.mount().nativeElement);
    } catch {
      if (!this.destroyed) this.status.set('error');
    }
  }
  async pay(event: Event) {
    event.preventDefault();
    if (
      !this.backendReady() ||
      this.busy() ||
      this.status() !== 'ready' ||
      !this.stripe ||
      !this.elements
    )
      return;
    this.busy.set(true);
    this.error.set('');
    try {
      const validation = await this.elements.submit();
      if (validation.error) {
        this.error.set(validation.error.message ?? this.copy().error);
        return;
      }
      const response = await fetch(
        new URL('api/create-payment-intent.php', this.document.baseURI),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Checkout-Token': this.csrfToken },
          body: JSON.stringify({ productId: this.product.id, attemptId: this.attemptId }),
        },
      );
      if (!response.ok) throw new Error('Payment initialization failed');
      const data: { clientSecret: string; amount: number; currency: string } =
        await response.json();
      if (data.amount !== this.product.priceCents || data.currency !== 'eur')
        throw new Error('Price mismatch');
      const result = await this.stripe.confirmPayment({
        elements: this.elements,
        clientSecret: data.clientSecret,
        redirect: 'if_required',
        confirmParams: {
          return_url: new URL(`store/${this.product.id}/checkout`, this.document.baseURI).href,
        },
      });
      if (result.error) {
        this.error.set(result.error.message ?? this.copy().error);
        return;
      }
      if (result.paymentIntent?.status === 'succeeded') this.status.set('success');
      else if (result.paymentIntent?.status === 'processing') this.status.set('processing');
      else this.error.set(this.copy().error);
    } catch {
      this.error.set(this.copy().error);
    } finally {
      this.busy.set(false);
    }
  }
  async initializePayPal() {
    try {
      let config = { clientId: 'sb', configured: false, csrfToken: '' };
      try {
        const response = await fetch(new URL('api/paypal-config.php', this.document.baseURI), {
          cache: 'no-store',
        });
        if (response.ok) config = await response.json();
      } catch {
        /* Official sb SDK renders the sandbox-only preview. */
      }
      this.paypalConfigured.set(config.configured);
      this.paypalToken = config.csrfToken;
      const sdk = await loadPayPalButtons(config.clientId);
      if (this.destroyed) return;
      this.paypalButtons = sdk.Buttons({
        fundingSource: 'paypal',
        style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'paypal', height: 50 },
        onClick: (
          _data: unknown,
          actions: { reject(): Promise<void>; resolve(): Promise<void> },
        ) => {
          if (this.busy()) return actions.reject();
          if (!this.paypalConfigured()) {
            this.paypalError.set(this.copy().paypalSetup);
            return actions.reject();
          }
          this.paypalError.set('');
          this.busy.set(true);
          return actions.resolve();
        },
        createOrder: async () => {
          const response = await this.paypalRequest('paypal-create-order.php', {
            productId: this.product.id,
            attemptId: this.attemptId,
          });
          if (!response.id) throw new Error('Missing order');
          return response.id;
        },
        onApprove: async (data: { orderID: string }) => {
          try {
            const response = await this.paypalRequest('paypal-capture-order.php', {
              orderId: data.orderID,
            });
            if (response.status !== 'COMPLETED') throw new Error('Not captured');
            this.status.set('success');
          } catch {
            this.paypalError.set(this.copy().error);
          } finally {
            this.busy.set(false);
          }
        },
        onCancel: () => {
          this.busy.set(false);
          this.paypalError.set(this.copy().paypalCancel);
        },
        onError: () => {
          this.busy.set(false);
          this.paypalError.set(this.copy().error);
        },
      });
      if (!this.paypalButtons.isEligible()) throw new Error('PayPal unavailable');
      await this.paypalButtons.render(this.paypalMount().nativeElement);
      if (!this.destroyed) this.paypalReady.set(true);
    } catch {
      if (!this.destroyed) this.paypalError.set(this.copy().error);
    }
  }
  private async paypalRequest(
    endpoint: string,
    data: object,
  ): Promise<{ id?: string; status?: string }> {
    const response = await fetch(new URL(`api/${endpoint}`, this.document.baseURI), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Checkout-Token': this.paypalToken },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('PayPal request failed');
    return response.json();
  }
  ngOnDestroy() {
    this.destroyed = true;
    this.element?.destroy();
    void this.paypalButtons?.close().catch(() => {});
  }
}
