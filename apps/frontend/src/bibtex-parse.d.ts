/// LLM generated type declarations for the bibtex-parse module.
declare module 'bibtex-parse' {
    export interface ParseOptions {
        number?: 'string' | 'number' | 'bigint';
        startRule?: string;
    }

    export type BibTeXDatatype = 'number' | 'quoted' | 'braced' | 'identifier' | 'concatinate' | 'null' | 'unenclosed';

    export interface BibTeXValue {
        value: string | number | bigint | BibTeXValue[] | null;
        datatype: BibTeXDatatype;
        raw: string;
    }

    export interface BibTeXField {
        name: string;
        value: string | number | bigint | BibTeXValue[] | null;
        datatype: BibTeXDatatype;
        raw: string;
    }

    export interface BibTeXPreamble {
        itemtype: 'preamble';
        enclosed: 'parentheses' | 'braces';
        value: string | number | bigint | BibTeXValue[] | null;
        datatype?: BibTeXDatatype;
        raw?: string;
    }

    export interface BibTeXString {
        itemtype: 'string';
        name: string;
        value: string | number | bigint | BibTeXValue[] | null;
        datatype: BibTeXDatatype;
        raw: string;
    }

    export interface BibTeXEntry {
        itemtype: 'entry';
        type: string;
        key: string;
        fields: BibTeXField[];
        enclosed: 'parentheses' | 'braces';
        raw?: string;
    }

    export interface BibTeXComment {
        itemtype: 'comment';
        comment: string;
    }

    export type BibTeXItem = BibTeXPreamble | BibTeXString | BibTeXEntry | BibTeXComment;

    export interface BibTeXEntryResult {
        key: string;
        type: string;
        [fieldName: string]: string | number | bigint | null | undefined;
    }

    export function parse(str: string, options?: ParseOptions): BibTeXItem[];

    export function entries(str: string, options?: ParseOptions): BibTeXEntryResult[];

    const bibtexParse: {
        parse: typeof parse;
        entries: typeof entries;
    };

    export default bibtexParse;
}
