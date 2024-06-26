import type { ExpressionNode, ModuleReferenceNode, TemplateNode } from '../ast';
export type SymbolMap = {
    [K in string]?: SymbolNode;
};
export type SymbolNameMap = {
    [K in string]?: string;
};
export type SymbolNode = {
    node: ExpressionNode | TemplateNode;
    type: SymbolType.DEFINITION;
} | {
    node: ExpressionNode;
    type: SymbolType.RUNTIME_ENUM_DEFINITION;
} | {
    node: ModuleReferenceNode;
    type: SymbolType.MODULE_REFERENCE;
} | {
    type: SymbolType.TABLE;
};
export declare const enum SymbolType {
    DEFINITION = "Definition",
    MODULE_REFERENCE = "ModuleReference",
    RUNTIME_ENUM_DEFINITION = "RuntimeEnumDefinition",
    TABLE = "Table"
}
export declare class SymbolCollection {
    readonly symbolNames: SymbolNameMap;
    readonly symbols: SymbolMap;
    constructor(symbols?: SymbolMap, symbolNames?: SymbolNameMap);
    entries(): {
        id: string;
        name: string;
        symbol: SymbolNode;
    }[];
    get(id: string): SymbolNode | undefined;
    getName(id: string): string | undefined;
    has(id: string): boolean;
    set(id: string, symbol: SymbolNode): string;
}
