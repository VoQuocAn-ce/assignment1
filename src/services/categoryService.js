import { STORAGE_KEYS, INITIAL_CATEGORIES, loadStorage, saveStorage } from './mockData';

export const categoryService = {
  getAll: () => {
    return loadStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  getById: (id) => {
    const list = categoryService.getAll();
    return list.find(item => item.id === Number(id)) || null;
  },

  create: (category) => {
    const list = categoryService.getAll();
    const name = (category.name || '').trim();

    if (!name) {
      throw new Error('Category name is required.');
    }

    const exists = list.some(item => item.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      throw new Error(`Category "${name}" already exists.`);
    }

    const nextId = list.length > 0 ? Math.max(...list.map(i => i.id)) + 1 : 1;
    const newItem = {
      id: nextId,
      name,
      description: (category.description || '').trim(),
      status: Number(category.status) === 0 ? 0 : 1
    };

    const updated = [...list, newItem];
    saveStorage(STORAGE_KEYS.CATEGORIES, updated);
    return newItem;
  },

  update: (id, category) => {
    const list = categoryService.getAll();
    const targetId = Number(id);
    const index = list.findIndex(item => item.id === targetId);

    if (index === -1) {
      throw new Error('Category not found.');
    }

    const name = (category.name || '').trim();
    if (!name) {
      throw new Error('Category name is required.');
    }

    const duplicate = list.some(item => item.id !== targetId && item.name.toLowerCase() === name.toLowerCase());
    if (duplicate) {
      throw new Error(`Another category named "${name}" already exists.`);
    }

    const updatedItem = {
      ...list[index],
      name,
      description: (category.description || '').trim(),
      status: Number(category.status) === 0 ? 0 : 1
    };

    const updatedList = list.map(item => (item.id === targetId ? updatedItem : item));
    saveStorage(STORAGE_KEYS.CATEGORIES, updatedList);
    return updatedItem;
  },

  delete: (id) => {
    const list = categoryService.getAll();
    const targetId = Number(id);

    // Relational check: Prevent deleting category in use by existing news
    const newsList = loadStorage(STORAGE_KEYS.NEWS, []);
    const inUse = newsList.some(n => Number(n.categoryId) === targetId);
    if (inUse) {
      throw new Error('Cannot delete this category because it is currently assigned to one or more news articles. Please reassign or delete the news first.');
    }

    const updated = list.filter(item => item.id !== targetId);
    saveStorage(STORAGE_KEYS.CATEGORIES, updated);
    return true;
  },

  search: (list, keyword) => {
    if (!keyword || !keyword.trim()) return list;
    const norm = keyword.trim().toLowerCase();
    return list.filter(item => 
      (item.name && item.name.toLowerCase().includes(norm)) ||
      (item.description && item.description.toLowerCase().includes(norm))
    );
  }
};
