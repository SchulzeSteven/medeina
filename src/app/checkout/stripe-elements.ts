export interface PaymentResult {
  error?: { message?: string };
  paymentIntent?: { status: string };
}
export interface PaymentElement {
  mount(node: HTMLElement): void;
  destroy(): void;
  on(event: string, callback: () => void): void;
}
export interface Elements {
  create(type: 'payment', options: object): PaymentElement;
  submit(): Promise<PaymentResult>;
  update(options: object): void;
}
export interface StripeClient {
  elements(options: object): Elements;
  confirmPayment(options: object): Promise<PaymentResult>;
}
type StripeFactory = (key: string) => StripeClient;
let loading: Promise<StripeFactory> | undefined;
export function loadStripeElements(): Promise<StripeFactory> {
  if (loading) return loading;
  loading = new Promise<StripeFactory>((resolve, reject) => {
    const view = window as Window & { Stripe?: StripeFactory };
    if (view.Stripe) {
      resolve(view.Stripe);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    const timeout = window.setTimeout(() => {
      script.remove();
      reject(new Error('Stripe timeout'));
    }, 20000);
    script.onload = () => {
      clearTimeout(timeout);
      view.Stripe ? resolve(view.Stripe) : reject(new Error('Stripe unavailable'));
    };
    script.onerror = () => {
      clearTimeout(timeout);
      script.remove();
      reject(new Error('Stripe unavailable'));
    };
    document.head.append(script);
  }).catch((error) => {
    loading = undefined;
    throw error;
  });
  return loading;
}
