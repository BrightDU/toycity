if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw-min-cache.js')
    .then(console.log)
    .catch(console.error);
}