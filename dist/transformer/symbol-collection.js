"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolCollection = exports.SymbolType = void 0;
const case_converter_1 = require("./case-converter");
var SymbolType;
(function (SymbolType) {
    SymbolType["DEFINITION"] = "Definition";
    SymbolType["MODULE_REFERENCE"] = "ModuleReference";
    SymbolType["RUNTIME_ENUM_DEFINITION"] = "RuntimeEnumDefinition";
    SymbolType["TABLE"] = "Table";
})(SymbolType || (exports.SymbolType = SymbolType = {}));
class SymbolCollection {
    constructor(symbols = {}, symbolNames = {}) {
        this.symbolNames = symbolNames;
        this.symbols = symbols;
    }
    entries() {
        return Object.entries(this.symbols).map(([id, symbol]) => ({
            id,
            name: this.symbolNames[id],
            symbol: symbol,
        }));
    }
    get(id) {
        return this.symbols[id];
    }
    getName(id) {
        return this.symbolNames[id];
    }
    has(id) {
        return this.symbols[id] !== undefined;
    }
    set(id, symbol) {
        let symbolName = this.symbolNames[id];
        if (symbolName) {
            return symbolName;
        }
        const symbolNames = new Set(Object.values(this.symbolNames));
        symbolName = (0, case_converter_1.toPascalCase)(id.replaceAll(/[^\w$]/g, '_'));
        if (symbolNames.has(symbolName)) {
            let suffix = 2;
            while (symbolNames.has(`${symbolName}${suffix}`)) {
                suffix++;
            }
            symbolName += suffix;
        }
        this.symbols[id] = symbol;
        this.symbolNames[id] = symbolName;
        return symbolName;
    }
}
exports.SymbolCollection = SymbolCollection;
//# sourceMappingURL=symbol-collection.js.map