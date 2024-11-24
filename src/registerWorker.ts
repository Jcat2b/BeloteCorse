export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/worker.js', {
        scope: '/'
      });
      
      console.log('Service Worker registered successfully:', registration.scope);
      
      // Vérifie la connexion avec le worker
      registration.active?.postMessage({ type: 'PING' });
      
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'PONG') {
          console.log('Worker connection successful');
        } else if (event.data.type === 'ERROR') {
          console.error('Worker connection error:', event.data.error);
        }
      });

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};