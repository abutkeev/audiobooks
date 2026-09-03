const mediaCacheSupported = 'caches' in window && 'serviceWorker' in navigator;

export default mediaCacheSupported;
