/**
 * Central API base URL — sourced from VITE_API_BASE_URL environment variable.
 *
 * Development  (.env):            http://localhost:5000
 * Production   (.env.production): https://podikart-backend.vercel.app
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export default API_BASE_URL;
