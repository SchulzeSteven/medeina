export interface PayPalButtons {
  render(node: HTMLElement): Promise<void>;
  close(): Promise<void>;
  isEligible(): boolean;
}
export interface PayPalSdk {
  Buttons(options: object): PayPalButtons;
}
let loading: Promise<PayPalSdk> | undefined;
export function loadPayPalButtons(clientId: string): Promise<PayPalSdk> {
  if (loading) return loading;
  loading = new Promise<PayPalSdk>((resolve, reject) => {
    const view = window as Window & { medeinaPayPal?: PayPalSdk };
    if (view.medeinaPayPal) {
      resolve(view.medeinaPayPal);
      return;
    }
    const script = document.createElement('script');
    const params = new URLSearchParams({
      'client-id': clientId,
      currency: 'EUR',
      intent: 'capture',
      components: 'buttons',
      'disable-funding': 'card,credit,paylater,venmo',
    });
    script.src = `https://www.paypal.com/sdk/js?${params}`;
    script.dataset['namespace'] = 'medeinaPayPal';
    script.async = true;
    const timeout = window.setTimeout(() => {
      script.remove();
      reject(new Error('PayPal timeout'));
    }, 20000);
    script.onload = () => {
      clearTimeout(timeout);
      view.medeinaPayPal ? resolve(view.medeinaPayPal) : reject(new Error('PayPal unavailable'));
    };
    script.onerror = () => {
      clearTimeout(timeout);
      script.remove();
      reject(new Error('PayPal unavailable'));
    };
    document.head.append(script);
  }).catch((error) => {
    loading = undefined;
    throw error;
  });
  return loading;
}
