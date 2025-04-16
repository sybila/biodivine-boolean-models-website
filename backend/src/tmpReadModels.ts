import { seed } from './seed';

seed()
    .then(() => console.log('success'))
    .catch((_) => console.error('error'));
