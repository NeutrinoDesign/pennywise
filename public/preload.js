const { contextBridge, ipcRenderer } = require('electron');

// Whitelisted channels for event subscriptions from main
const allowedListenChannels = new Set([
  'embedVideos.set',
  'url.requested',
  'nav.focus',
  'nav.toggle',
  'nav.show',
  'webPage.reload',
  'opacity.sync'
]);

// Whitelisted channels for sending messages to main
const allowedSendChannels = new Set([
  'opacity.set'
]);

contextBridge.exposeInMainWorld('pennywise', {
  // Subscribe to main-process events (returns unsubscribe)
  on: (channel, listener) => {
    if (!allowedListenChannels.has(channel)) return () => {};
    const wrapped = (_event, ...args) => listener(...args);
    ipcRenderer.on(channel, wrapped);
    return () => ipcRenderer.removeListener(channel, wrapped);
  },
  once: (channel, listener) => {
    if (!allowedListenChannels.has(channel)) return;
    const wrapped = (_event, ...args) => listener(...args);
    ipcRenderer.once(channel, wrapped);
  },
  off: (channel, listener) => {
    if (!allowedListenChannels.has(channel)) return;
    ipcRenderer.removeListener(channel, listener);
  },

  // Fire-and-forget to main (limited)
  send: (channel, ...args) => {
    if (!allowedSendChannels.has(channel)) return;
    ipcRenderer.send(channel, ...args);
  },

  // Opacity helpers
  getOpacity: async () => {
    try {
      const value = await ipcRenderer.invoke('opacity.get');
      return typeof value === 'number' ? value : 100;
    } catch {
      return 100;
    }
  },
  setOpacity: (value) => {
    ipcRenderer.send('opacity.set', value);
  },

  // App/environment helpers
  getArgv: async () => {
    try {
      const args = await ipcRenderer.invoke('get-argv');
      return Array.isArray(args) ? args : [];
    } catch {
      return [];
    }
  },
  getPlatform: async () => {
    try {
      return await ipcRenderer.invoke('get-platform');
    } catch {
      return 'darwin';
    }
  }
});


