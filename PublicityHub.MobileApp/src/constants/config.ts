/**
 * App-wide configuration
 * Change API_BASE_URL here for dev / staging / prod
 */
export const Config = {
  // Point to local API when running locally, otherwise production
  API_BASE_URL: 'https://publicityhub-api.onrender.com',

  // JWT storage key
  TOKEN_KEY: '@phub_token',
  USER_KEY: '@phub_user',

  // Pagination
  PAGE_SIZE: 20,

  // Timeouts (ms)
  API_TIMEOUT: 15000,
};
