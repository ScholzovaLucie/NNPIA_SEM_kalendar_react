class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.basicAuth = btoa(`user:heslo`);
  }

  async fetchWithTimeout(resource, options = {}, timeout = 8000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    }).catch((error) => {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    });
    clearTimeout(id);
    return response;
  }

  async get(path, params = {}, headers = {}) {
    const url = new URL(`${this.baseUrl}/${path}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await this.fetchWithTimeout(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${this.basicAuth}`,
        ...headers
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  }

  async post(path, params = {}, headers = {}) {
    const url = new URL(`${this.baseUrl}/${path}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await this.fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${this.basicAuth}`,
        ...headers
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  }

  async put(path, params = {}, headers = {}) {
    const url = new URL(`${this.baseUrl}/${path}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await this.fetchWithTimeout(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${this.basicAuth}`,
        ...headers
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  }

  async delete(path, params = {}, headers = {}) {
    const url = new URL(`${this.baseUrl}/${path}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await this.fetchWithTimeout(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${this.basicAuth}`,
        ...headers
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  }
}

export default ApiService;
