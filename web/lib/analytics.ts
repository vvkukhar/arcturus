declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const FB_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const eventQueue: Array<() => void> = [];
let isInitialized = false;

function processQueue() {
  if (!isInitialized) return;
  while (eventQueue.length > 0) {
    const task = eventQueue.shift();
    if (task) task();
  }
}

export const initAnalytics = () => {
  isInitialized = true;
  if (typeof window !== 'undefined') {
    requestIdleCallback(() => processQueue());
  }
};

const pushEvent = (task: () => void) => {
  if (isInitialized) {
    if (typeof window !== 'undefined') requestIdleCallback(task);
  } else {
    eventQueue.push(task);
  }
};

export const pageview = (url: string) => {
  pushEvent(() => {
    if (window.gtag && GA_ID) window.gtag('config', GA_ID, { page_path: url });
    if (window.fbq && FB_ID) window.fbq('track', 'PageView');
  });
};

export const trackEvent = (action: string, category: string, label: string, value?: number) => {
  pushEvent(() => {
    if (window.gtag) window.gtag('event', action, { event_category: category, event_label: label, value });
  });
};

export const trackEcommerce = (eventName: 'view_item' | 'add_to_cart' | 'remove_from_cart' | 'purchase', payload: Record<string, unknown>) => {
  pushEvent(() => {
    if (window.gtag) window.gtag('event', eventName, payload);
    if (window.fbq) {
      const fbMap: Record<string, string> = { 
        view_item: 'ViewContent', 
        add_to_cart: 'AddToCart', 
        remove_from_cart: 'RemoveFromCart', 
        purchase: 'Purchase' 
      };
      window.fbq('track', fbMap[eventName], payload);
    }
  });
};