import { STORAGE_KEYS, INITIAL_NEWS, loadStorage, saveStorage } from './mockData';

// Võ Quốc An - CE10460
export const newsService = {
  getAll: () => {
    return loadStorage(STORAGE_KEYS.NEWS, INITIAL_NEWS);
  },

  getById: (id) => {
    const list = newsService.getAll();
    return list.find(item => item.id === Number(id)) || null;
  },

  create: (newsData) => {
    const list = newsService.getAll();
    const title = (newsData.title || '').trim();
    const content = (newsData.content || '').trim();
    const categoryId = Number(newsData.categoryId);

    if (!title) throw new Error('News title is required.');
    if (!content) throw new Error('News content is required.');
    if (!categoryId) throw new Error('Please select a valid category.');

    const nextId = list.length > 0 ? Math.max(...list.map(i => i.id)) + 1 : 1;
    const newItem = {
      id: nextId,
      title,
      content,
      categoryId,
      createdBy: (newsData.createdBy || 'Admin').trim(),
      status: Number(newsData.status) === 0 ? 0 : 1,
      tags: (newsData.tags || '').trim(),
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newItem, ...list];
    saveStorage(STORAGE_KEYS.NEWS, updated);
    return newItem;
  },

  update: (id, newsData) => {
    const list = newsService.getAll();
    const targetId = Number(id);
    const index = list.findIndex(item => item.id === targetId);

    if (index === -1) {
      throw new Error('News article not found.');
    }

    const title = (newsData.title || '').trim();
    const content = (newsData.content || '').trim();
    const categoryId = Number(newsData.categoryId);

    if (!title) throw new Error('News title is required.');
    if (!content) throw new Error('News content is required.');
    if (!categoryId) throw new Error('Please select a valid category.');

    const updatedItem = {
      ...list[index],
      title,
      content,
      categoryId,
      status: Number(newsData.status) === 0 ? 0 : 1,
      tags: (newsData.tags || '').trim()
    };

    const updatedList = list.map(item => (item.id === targetId ? updatedItem : item));
    saveStorage(STORAGE_KEYS.NEWS, updatedList);
    return updatedItem;
  },

  delete: (id) => {
    const list = newsService.getAll();
    const targetId = Number(id);
    const updated = list.filter(item => item.id !== targetId);
    saveStorage(STORAGE_KEYS.NEWS, updated);
    return true;
  },

  search: (list, keyword = '', categoryFilter = 'ALL', statusFilter = 'ALL') => {
    let result = [...list];

    if (keyword && keyword.trim()) {
      const norm = keyword.trim().toLowerCase();
      result = result.filter(item =>
        (item.title && item.title.toLowerCase().includes(norm)) ||
        (item.content && item.content.toLowerCase().includes(norm)) ||
        (item.tags && item.tags.toLowerCase().includes(norm)) ||
        (item.createdBy && item.createdBy.toLowerCase().includes(norm))
      );
    }

    if (categoryFilter !== 'ALL') {
      const catId = Number(categoryFilter);
      result = result.filter(item => Number(item.categoryId) === catId);
    }

    if (statusFilter !== 'ALL') {
      const stat = Number(statusFilter);
      result = result.filter(item => Number(item.status) === stat);
    }

    return result;
  }
};
