import type { BooleanModel } from '@biodivine-boolean-models-website/database/src/generated/prisma/client.ts';
import { BibTeXEntry } from 'bibtex-parse';

export { type BooleanModel } from '@biodivine-boolean-models-website/database/src/generated/prisma/client.ts';

/**
 * Possible file formats currently supported by the backend.
 */
export type FileFormat = 'aeon' | 'sbml' | 'bnet' | 'booleannet' | 'bma';

/**
 * Possible criteria for sorting a list of `BooleanModel`s. Typically, the criteria are also extended with a boolean
 * value (true=ascending, false=descending). The values given here reflect the default setting of the
 * ascending/descending toggle that should be applied when the sorting criterion changes. This reflects the "likely
 * default" that the user is expecting when sorting based on this criterion.
 */
export const ModelSortKey = {
    ID: ['Model Id', true],
    NAME: ['Model Name', true],
    YEAR: ['Pub. Year', false],
    ALL_NODES: ['# All Nodes', false],
    INPUT_NODES: ['# Input Nodes', false],
    VARIABLE_NODES: [`# Variable Nodes`, false],
    REGULATIONS: ['# Regulations', false],
    QUERY_MATCHES: [`# Query Matches`, false],
} as const;

/**
 * The possible keys from `ModelSortKey`.
 */
export type ModelSortKeyValues =
    | 'Model Id'
    | 'Model Name'
    | 'Pub. Year'
    | '# All Nodes'
    | '# Input Nodes'
    | '# Variable Nodes'
    | '# Regulations'
    | '# Query Matches';

/**
 * An extension of the `BooleanModel` type that also includes other "preprocessed" data that we want to
 * only load once and then never recompute again.
 */
export interface LoadedBooleanModel extends BooleanModel {
    parsedBib: BibTeXEntry | undefined;
    journal: string | undefined;
    year: string | undefined;
}
