"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPascalCase = exports.toCamelCase = void 0;
const kysely_1 = require("kysely");
class CaseConverter extends kysely_1.CamelCasePlugin {
    toCamelCase(string) {
        return this.camelCase(string);
    }
    toSnakeCase(string) {
        return this.snakeCase(string);
    }
}
/**
 * Returns a camelCased string.
 *
 * @example
 * ```ts
 * camelCase('foo_bar')
 * // fooBar
 * ```
 */
const toCamelCase = (string) => {
    return new CaseConverter().toCamelCase(string).replace(/Id(?![a-z])/, 'ID');
};
exports.toCamelCase = toCamelCase;
/**
 * Returns a PascalCased string.
 *
 * @example
 * ```ts
 * pascalCase('foo_bar')
 * // FooBar
 * ```
 */
const toPascalCase = (string) => {
    const camelCased = (0, exports.toCamelCase)(string);
    return camelCased.slice(0, 1).toUpperCase() + camelCased.slice(1);
};
exports.toPascalCase = toPascalCase;
//# sourceMappingURL=case-converter.js.map