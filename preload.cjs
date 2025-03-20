const { contextBridge } = require('electron');
const axios = require('axios');

contextBridge.exposeInMainWorld('electron', {
  fetchData: (url) => {
    return axios.get(url)  // Perform HTTP request via axios
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error fetching data in preload:', error);
        return null;
      });
  }
});