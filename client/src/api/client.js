const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(endpoint, options = {}) {
    const { headers, ...requestOptions } = options;

    const response = await fetch(`${API_URL}${endpoint}`, { // use fetch because avoid extra dependency
        ...requestOptions,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    });

    if (response.status === 204) return null; // use null because {} = truthy, null = no body

    let data;

    try {
        data = await response.json();
    } catch {
        // handle responses that are not valid JSON.
        const error = new Error("Invalid server response");
        error.status = response.status;
        throw error;
    }

    if (!response.ok) {
        const error = new Error(data.message);

        // native fetch manual set response
        error.status = response.status;
        error.errors = data.errors;

        throw error;
    }

    return data.data;
}