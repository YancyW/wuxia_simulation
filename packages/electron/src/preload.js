const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  createGame: (input) => ipcRenderer.invoke('game:create', input),
  getState: (saveId) => ipcRenderer.invoke('game:state', saveId),
  nextTurn: (saveId) => ipcRenderer.invoke('game:next', saveId),
  makeChoice: (saveId, choiceIndex) => ipcRenderer.invoke('game:choose', saveId, choiceIndex),
  getSaveList: () => ipcRenderer.invoke('game:list'),
  deleteSave: (saveId) => ipcRenderer.invoke('game:delete', saveId),
});
