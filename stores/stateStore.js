import { create } from 'zustand';

const getBaseUrl = () => {
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
  const productionUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const developmentUrl = process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL;

  const baseUrl = environment === 'production' ? productionUrl : developmentUrl;
  const protocol = environment === 'production' ? 'https' : 'http';

  return `${protocol}://${baseUrl}`;
};

const useStateStore = create((set, get) => ({
  baseUrl: getBaseUrl(),
  getFullUrl: (endpoint) => `${get().baseUrl}${endpoint}`,
  logout: () => set({ user: null, token: null }),
}));

export default useStateStore;