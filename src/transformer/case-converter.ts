import { CamelCasePlugin } from 'kysely';

class CaseConverter extends CamelCasePlugin {
  toCamelCase(string: string) {
    return this.camelCase(string);
  }

  toSnakeCase(string: string) {
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
export const toCamelCase = (string: string) => {
  return new CaseConverter().toCamelCase(string).replace(/Id(?![a-z])/, 'ID');
};

/**
 * Returns a PascalCased string.
 *
 * @example
 * ```ts
 * pascalCase('foo_bar')
 * // FooBar
 * ```
 */
export const toPascalCase = (string: string) => {
  const camelCased = toCamelCase(string);
  return camelCased.slice(0, 1).toUpperCase() + camelCased.slice(1);
};
