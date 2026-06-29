let API_BASE_URL;

if (typeof window !== 'undefined' && window.location) {
    // Browser environment
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        API_BASE_URL = 'http://localhost:5000';
    } else {
        API_BASE_URL = 'http://13.203.86.53:5000';
    }
} else {
    // Node.js (Backend) environment
    const isProduction = process.env.NODE_ENV === 'production' || process.platform !== 'win32';
    if (isProduction) {
        API_BASE_URL = 'http://13.203.86.53:5000';
    } else {
        API_BASE_URL = 'http://localhost:5000';
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_BASE_URL };
} else {
    window.API_BASE_URL = API_BASE_URL;
}
