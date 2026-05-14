const API_BASE = window.location.hostname === "localhost"
    ? "https://localhost:7166"
    : "";

function apiFetch(url, options = {}) {
    const token = localStorage.getItem("token");

    return fetch(API_BASE + url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            "Authorization": "Bearer " + token
        }
    });
}