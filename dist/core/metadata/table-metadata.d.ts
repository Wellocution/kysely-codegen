import type { ColumnMetadataOptions } from './column-metadata';
import { ColumnMetadata } from './column-metadata';
export type TableMetadataOptions = {
    columns: ColumnMetadataOptions[];
    name: string;
    schema?: string;
};
export declare class TableMetadata {
    readonly columns: ColumnMetadata[];
    readonly name: string;
    readonly schema?: string;
    constructor(options: TableMetadataOptions);
}
