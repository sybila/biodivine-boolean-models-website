import {seed} from "./seed";

seed()
    .then((_) => console.log('success'))
    .catch((_) => console.error('error'))
