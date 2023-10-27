import { selector } from 'recoil';
import {filteredModelsAtom} from "./filtersAtom";

export const numberOfModelsSelector = selector({
    key: 'numberOfModelsSelector',
    get: ({ get }) => {
        const filteredModels = get(filteredModelsAtom); // Assuming you have an atom called filteredModelsState
        return filteredModels.length;
    },
});
