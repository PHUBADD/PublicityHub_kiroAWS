/**
 * App-wide configuration
 *
 * HOW TO SWITCH ENVIRONMENTS:
 * ----------------------------
 * LOCAL DEV (Expo on phone via USB/WiFi):
 *   - Find your machine's local IP: run `ipconfig` on Windows
 *   - Set API_BASE_URL to http://YOUR_IP:5072  (HTTP, not HTTPS for local)
 *   - Example: 'http://192.168.1.42:5072'
 *
 * LOCAL DEV (Expo on Android Emulator):
 *   - Use: 'http://10.0.2.2:5072'
 *
 * LOCAL DEV (Expo on iOS Simulator):
 *   - Use: 'http://localhost:5072'
 *
 * PRODUCTION (Render.com):
 *   - Use: 'https://publicityhub-api.onrender.com'
 *
 * NOTE: The API must be running and accessible from the device.
 * If using a physical phone, your PC and phone must be on the SAME WiFi network.
 */

// ─── CHANGE THIS to match your environment ───────────────────────────────────
const ENV: 'local_wifi' | 'emulator_android' | 'simulator_ios' | 'production' = 'production';

// ─── Your machine's local IP (only needed for local_wifi) ────────────────────
const LOCAL_IP = '192.168.1.100'; // <-- Run `ipconfig` and put your IPv4 here

const BASE_URLS: Record<typeof ENV, string> = {
  local_wifi:        `http://${LOCAL_IP}:5072`,
  emulator_android:  'http://10.0.2.2:5072',
  simulator_ios:     'http://localhost:5072',
  production:        'https://publicityhub-api.onrender.com',
};

export const Config = {
  API_BASE_URL: BASE_URLS[ENV],

  // JWT storage keys
  TOKEN_KEY: '@phub_token',
  USER_KEY:  '@phub_user',

  // Pagination
  PAGE_SIZE: 20,

  // Request timeout (ms)
  API_TIMEOUT: 20000,
};
