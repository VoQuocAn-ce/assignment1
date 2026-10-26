import { STORAGE_KEYS, INITIAL_USERS, loadStorage, saveStorage, ROLE } from './mockData';

export const userService = {
  getAll: () => {
    return loadStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  getById: (id) => {
    const list = userService.getAll();
    return list.find(item => item.id === Number(id)) || null;
  },

  create: (userData) => {
    const list = userService.getAll();
    const username = (userData.username || '').trim();
    const fullName = (userData.fullName || '').trim();
    const email = (userData.email || '').trim();

    if (!username) throw new Error('Username is required.');
    if (!fullName) throw new Error('Full Name is required.');
    if (!email) throw new Error('Email is required.');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address.');
    }

    const usernameExists = list.some(item => item.username.toLowerCase() === username.toLowerCase());
    if (usernameExists) {
      throw new Error(`Username "${username}" is already taken.`);
    }

    const emailExists = list.some(item => item.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      throw new Error(`Email "${email}" is already registered.`);
    }

    const nextId = list.length > 0 ? Math.max(...list.map(i => i.id)) + 1 : 1;
    const newItem = {
      id: nextId,
      username,
      fullName,
      email,
      role: Number(userData.role) === ROLE.STAFF ? ROLE.STAFF : ROLE.ADMIN,
      status: Number(userData.status) === 0 ? 0 : 1
    };

    const updated = [...list, newItem];
    saveStorage(STORAGE_KEYS.USERS, updated);
    return newItem;
  },

  update: (id, userData) => {
    const list = userService.getAll();
    const targetId = Number(id);
    const index = list.findIndex(item => item.id === targetId);

    if (index === -1) {
      throw new Error('User not found.');
    }

    const fullName = (userData.fullName || '').trim();
    const email = (userData.email || '').trim();

    if (!fullName) throw new Error('Full Name is required.');
    if (!email) throw new Error('Email is required.');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address.');
    }

    const emailDuplicate = list.some(item => item.id !== targetId && item.email.toLowerCase() === email.toLowerCase());
    if (emailDuplicate) {
      throw new Error(`Email "${email}" is already used by another account.`);
    }

    const updatedItem = {
      ...list[index],
      fullName,
      email,
      role: Number(userData.role) === ROLE.STAFF ? ROLE.STAFF : ROLE.ADMIN,
      status: Number(userData.status) === 0 ? 0 : 1
    };

    const updatedList = list.map(item => (item.id === targetId ? updatedItem : item));
    saveStorage(STORAGE_KEYS.USERS, updatedList);
    return updatedItem;
  },

  delete: (id, currentUserId) => {
    const list = userService.getAll();
    const targetId = Number(id);

    if (targetId === Number(currentUserId)) {
      throw new Error('You cannot delete your own currently logged-in account.');
    }

    const updated = list.filter(item => item.id !== targetId);
    saveStorage(STORAGE_KEYS.USERS, updated);
    return true;
  },

  search: (list, keyword = '', roleFilter = 'ALL', statusFilter = 'ALL') => {
    let result = [...list];

    if (keyword && keyword.trim()) {
      const norm = keyword.trim().toLowerCase();
      result = result.filter(item =>
        (item.username && item.username.toLowerCase().includes(norm)) ||
        (item.fullName && item.fullName.toLowerCase().includes(norm)) ||
        (item.email && item.email.toLowerCase().includes(norm))
      );
    }

    if (roleFilter !== 'ALL') {
      const r = Number(roleFilter);
      result = result.filter(item => Number(item.role) === r);
    }

    if (statusFilter !== 'ALL') {
      const s = Number(statusFilter);
      result = result.filter(item => Number(item.status) === s);
    }

    return result;
  }
};
