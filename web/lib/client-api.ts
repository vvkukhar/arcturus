export async function apiFetch<T>(input: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);

  if (!(init?.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(input, { 
      ...init, 
      headers, 
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      let message = `Request failed: ${response.status}`;
      try {
        const data = await response.json();
        message = data?.message || data?.error || message;
      } catch {}
      throw new Error(message);
    }

    if (response.status === 204) return null as T;
    return response.json() as Promise<T>;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}