export async function api<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${import.meta.env.VITE_BACK_API_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  };

  try {
    const response = await fetch(url, config);
    
    let data: any = null;
    const contentType = response.headers.get("content-type");
    
    if (contentType?.includes("application/json")) {
      try {
        data = await response.json();
      } catch (parseError) {
        console.warn("Failed to parse JSON response:", parseError);
      }
    }

    if (!response.ok) {
      if (response.status === 401) {
        const message = data?.message;
        window.dispatchEvent(new CustomEvent('auth:logout'));
        const error = new Error(message);
        (error as any).status = 401;
        throw error;
      }

      if (response.status === 403) {
        const message = data?.message;
        throw new Error(message);
      }

      const message = data?.message || data?.error || `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      // Ne pas logger les erreurs 401 (non authentifié) - c'est un cas attendu
      if ((error as any).status !== 401) {
        console.error(`API Error [${endpoint}]:`, error.message);
      }
      throw error;
    }
    throw new Error(`Network error while calling ${endpoint}`);
  }
}

