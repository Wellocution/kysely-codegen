"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BunSqliteAdapter = void 0;
const ast_1 = require("../../ast");
const core_1 = require("../../core");
class BunSqliteAdapter extends core_1.Adapter {
    constructor() {
        super(...arguments);
        this.defaultScalar = new ast_1.IdentifierNode('string');
        this.scalars = {
            any: new ast_1.IdentifierNode('unknown'),
            blob: new ast_1.IdentifierNode('Buffer'),
            boolean: new ast_1.IdentifierNode('number'),
            integer: new ast_1.IdentifierNode('number'),
            numeric: new ast_1.IdentifierNode('number'),
            real: new ast_1.IdentifierNode('number'),
            text: new ast_1.IdentifierNode('string'),
        };
    }
}
exports.BunSqliteAdapter = BunSqliteAdapter;
//# sourceMappingURL=bun-sqlite-adapter.js.map