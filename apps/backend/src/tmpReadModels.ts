import { seed } from './seed';

seed()
    .then(() => console.log('success'))
    .catch((e) => console.error('error:' + e.toString()));
