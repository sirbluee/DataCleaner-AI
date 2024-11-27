// Client-side storage utilities
export const STORAGE_KEY_PREFIX = 'datacleaner_';

export const storage = {
  getData: (id: string) => {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  setData: (id: string, data: any) => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${id}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  getLastPath: () => {
    try {
      return localStorage.getItem(`${STORAGE_KEY_PREFIX}last_path`);
    } catch (error) {
      console.error('Error reading last path:', error);
      return null;
    }
  },

  setLastPath: (path: string) => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}last_path`, path);
    } catch (error) {
      console.error('Error setting last path:', error);
    }
  },

  clearSession: (id: string) => {
    try {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${id}`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}last_path`);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }
};