import { initFederation } from '@angular-architects/native-federation';

(globalThis as any).ngDevMode = true;
(globalThis as any).ngServerMode = false;

initFederation('federation.manifest.json', {
  hostRemoteEntry: { url: './remoteEntry.json' },
})
  .catch((err) => console.error('Init federation error:', err))
  .then((_) => import('./bootstrap'))
  .catch((err) => console.error('Bootstrap error:', err));
