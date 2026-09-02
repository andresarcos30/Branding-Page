import { initFederation } from '@angular-architects/native-federation';

(globalThis as any).ngDevMode = true;
(globalThis as any).ngServerMode = false;

initFederation(
  {},
  {
    hostRemoteEntry: { url: './remoteEntry.json' },
  },
)
  .catch((err) => console.error(err))
  .then((_) => import('./bootstrap'))
  .catch((err) => console.error(err));
