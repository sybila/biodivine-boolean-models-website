import { seed } from './staticSeed';

seed()
    .then(() => console.log('success'))
    .catch((e) => console.error('error:' + e.toString()));
