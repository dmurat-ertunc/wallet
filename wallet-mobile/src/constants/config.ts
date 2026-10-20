// Set EXPO_PUBLIC_API_URL in a .env file to override.
// On a physical phone "localhost" is the phone itself, so use the computer's LAN IP (e.g. http://192.168.1.20:8080/api).
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/api';

export const REQUEST_TIMEOUT_MS = 15000;
