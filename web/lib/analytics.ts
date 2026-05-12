export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

export const pageview = (url: string) => {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag !== 'undefined' && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
  if (typeof window.fbq !== 'undefined' && FB_PIXEL_ID) {
    window.fbq('track', 'PageView');
  }
};

export const trackEvent = (
  action: string,
  category: string,
  label: string,
  value?: number
) => {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackEcommerce = (
  eventName: 'view_item' | 'add_to_cart' | 'remove_from_cart' | 'purchase',
  payload: Record<string, unknown>
) => {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, payload);
  }
  
  if (typeof window.fbq !== 'undefined') {
    const fbEventMap = {
      view_item: 'ViewContent',
      add_to_cart: 'AddToCart',
      remove_from_cart: 'RemoveFromCart',
      purchase: 'Purchase'
    };
    window.fbq('track', fbEventMap[eventName], payload);
  }
};