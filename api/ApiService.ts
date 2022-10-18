const wrapResponse = <R>(response: Response) => {
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json() as Promise<R>;
};

const resolveUrl = (url: string) => url;

export default class ApiService {
  get = <R>(url: string, query?: Record<string, any>, options: RequestInit = {}) => {
    return fetch(
      resolveUrl(url) + (query ? '?' + new URLSearchParams(query) : ''),
      {
        ...options,
        method: 'GET',
      })
      .then((response) => wrapResponse<R>(response));
  };

  post = <R>(url: string, params?: Record<string, any>, options: RequestInit = {}) => {
    return fetch(
      resolveUrl(url),
      {
        ...options,
        body: JSON.stringify(params),
        method: 'GET',
      })
      .then((response) => wrapResponse<R>(response));
  };
}