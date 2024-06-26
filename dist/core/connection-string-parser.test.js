"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnectionStringParser = void 0;
const assert_1 = require("assert");
const test_utils_1 = require("../test.utils");
const connection_string_parser_1 = require("./connection-string-parser");
const testConnectionStringParser = () => {
    const parser = new connection_string_parser_1.ConnectionStringParser();
    void (0, test_utils_1.describe)('connection-string-parser', () => {
        void (0, test_utils_1.describe)('postgres', () => {
            void (0, test_utils_1.it)('should infer the correct dialect name', () => {
                (0, assert_1.deepStrictEqual)(parser.parse({
                    connectionString: 'postgres://username:password@hostname/database',
                }), {
                    connectionString: 'postgres://username:password@hostname/database',
                    inferredDialectName: 'postgres',
                });
                (0, assert_1.deepStrictEqual)(parser.parse({
                    connectionString: 'postgresql://username:password@hostname/database',
                }), {
                    connectionString: 'postgresql://username:password@hostname/database',
                    inferredDialectName: 'postgres',
                });
                (0, assert_1.deepStrictEqual)(parser.parse({
                    connectionString: 'pg://username:password@hostname/database',
                }), {
                    connectionString: 'postgres://username:password@hostname/database',
                    inferredDialectName: 'postgres',
                });
            });
        });
        void (0, test_utils_1.describe)('mysql', () => {
            void (0, test_utils_1.it)('should infer the correct dialect name', () => {
                (0, assert_1.deepStrictEqual)(parser.parse({
                    connectionString: 'mysql://username:password@hostname/database',
                }), {
                    connectionString: 'mysql://username:password@hostname/database',
                    inferredDialectName: 'mysql',
                });
                (0, assert_1.deepStrictEqual)(parser.parse({
                    connectionString: 'mysqlx://username:password@hostname/database',
                }), {
                    connectionString: 'mysqlx://username:password@hostname/database',
                    inferredDialectName: 'mysql',
                });
            });
        });
        void (0, test_utils_1.describe)('sqlite', () => {
            void (0, test_utils_1.it)('should infer the correct dialect name', () => {
                (0, assert_1.deepStrictEqual)(parser.parse({
                    connectionString: 'C:/Program Files/sqlite3/db',
                }), {
                    connectionString: 'C:/Program Files/sqlite3/db',
                    inferredDialectName: 'sqlite',
                });
                (0, assert_1.deepStrictEqual)(parser.parse({
                    connectionString: '/usr/local/bin',
                }), {
                    connectionString: '/usr/local/bin',
                    inferredDialectName: 'sqlite',
                });
            });
        });
        void (0, test_utils_1.describe)('libsql', () => {
            void (0, test_utils_1.it)('should infer the correct dialect name', () => {
                (0, assert_1.deepStrictEqual)(parser.parse({
                    connectionString: 'libsql://token@hostname:port/db',
                }), {
                    connectionString: 'libsql://token@hostname:port/db',
                    inferredDialectName: 'libsql',
                });
                (0, assert_1.deepStrictEqual)(parser.parse({
                    connectionString: 'libsql://hostname:port/db',
                }), {
                    connectionString: 'libsql://hostname:port/db',
                    inferredDialectName: 'libsql',
                });
            });
        });
    });
};
exports.testConnectionStringParser = testConnectionStringParser;
//# sourceMappingURL=connection-string-parser.test.js.map