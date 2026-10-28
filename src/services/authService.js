import { STORAGE_KEYS, loadStorage, saveStorage, ROLE } from './mockData';

// Võ Quốc An - CE10460
export const authService = {
  // Login with username and password
  login: (username, password) => {
    const trimmedUser = (username || '').trim();
    const trimmedPass = (password || '').trim();

    if (!trimmedUser || !trimmedPass) {
      return { success: false, message: 'Please enter both username and password.' };
    }

    // Default mock credential required by rubric: Admin / Admin
    if (trimmedUser.toLowerCase() === 'admin' && trimmedPass === 'Admin') {
      const adminSession = {
        id: 1,
        username: 'Admin',
        fullName: 'System Administrator',
        email: 'admin@fu.edu.vn',
        role: ROLE.ADMIN,
        loginAt: new Date().toISOString()
      };
      saveStorage(STORAGE_KEYS.AUTH, adminSession);
      return { success: true, user: adminSession };
    }

    // Secondary staff mock credentials
    if (trimmedUser.toLowerCase() === 'staff' && (trimmedPass === 'Staff' || trimmedPass === '123456')) {
      const staffSession = {
        id: 2,
        username: 'staff1',
        fullName: 'Nguyen Van A (Staff)',
        email: 'anv@fu.edu.vn',
        role: ROLE.STAFF,
        loginAt: new Date().toISOString()
      };
      saveStorage(STORAGE_KEYS.AUTH, staffSession);
      return { success: true, user: staffSession };
    }

    // Check against persistent user list
    const users = loadStorage(STORAGE_KEYS.USERS, []);
    const foundUser = users.find(u => u.username.toLowerCase() === trimmedUser.toLowerCase());
    
    if (foundUser) {
      if (foundUser.status === 0) {
        return { success: false, message: 'This user account is currently inactive/locked.' };
      }
      // For mock purposes, allow login with password matching username or default password
      if (trimmedPass === foundUser.username || trimmedPass === '123456' || trimmedPass === 'Admin') {
        const session = {
          id: foundUser.id,
          username: foundUser.username,
          fullName: foundUser.fullName,
          email: foundUser.email,
          role: foundUser.role,
          loginAt: new Date().toISOString()
        };
        saveStorage(STORAGE_KEYS.AUTH, session);
        return { success: true, user: session };
      }
    }

    return {
      success: false,
      message: 'Invalid credentials. Please test with username "Admin" and password "Admin".'
    };
  },

  // Logout clears current session
  logout: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch (e) {
      console.error('Logout error:', e);
    }
  },

  // Get current active session
  getCurrentUser: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  // Check if authenticated
  isAuthenticated: () => {
    return authService.getCurrentUser() !== null;
  }
};
