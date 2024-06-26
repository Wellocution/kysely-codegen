"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testE2E = void 0;
const assert_1 = require("assert");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const dialects_1 = require("../dialects");
const generator_1 = require("../generator");
const test_utils_1 = require("../test.utils");
const fixtures_1 = require("./fixtures");
const logger_1 = require("./logger");
const TESTS = [
    {
        connectionString: 'mysql://user:password@localhost/database',
        dialect: new dialects_1.MysqlDialect(),
        values: { false: 0, id: 1, true: 1 },
    },
    {
        connectionString: 'postgres://user:password@localhost:5433/database',
        dialect: new dialects_1.PostgresDialect(),
        values: { false: false, id: 1, true: true },
    },
    {
        connectionString: ':memory:',
        dialect: new dialects_1.SqliteDialect(),
        values: { false: 0, id: 1, true: 1 },
    },
    {
        connectionString: 'libsql://localhost:8080?tls=0',
        dialect: new dialects_1.LibsqlDialect(),
        values: { false: 0, id: 1, true: 1 },
    },
];
const readDialectOutput = async (dialect) => {
    const dialectName = dialect.constructor.name.slice(0, -'Dialect'.length);
    return await (0, promises_1.readFile)((0, path_1.join)(__dirname, 'outputs', `${dialectName.toLowerCase()}.output.ts`), 'utf8');
};
const testValues = async (db, expectedValues) => {
    await db
        .insertInto('fooBar')
        .values({ false: expectedValues.false, true: expectedValues.true })
        .execute();
    const row = await db
        .selectFrom('fooBar')
        .selectAll()
        .executeTakeFirstOrThrow();
    (0, assert_1.deepStrictEqual)({ false: row.false, id: row.id, true: row.true }, expectedValues);
};
const testE2E = async () => {
    await (0, test_utils_1.describe)('e2e', async () => {
        const logger = new logger_1.Logger();
        await (0, test_utils_1.it)('should generate the correct output', async () => {
            for (const { connectionString, dialect, values } of TESTS) {
                logger.info(`Testing ${dialect.constructor.name}...`);
                const db = await (0, fixtures_1.migrate)(dialect, connectionString);
                await testValues(db, values);
                const output = await new generator_1.Generator().generate({
                    camelCase: true,
                    db,
                    dialect,
                    logger,
                });
                await db.destroy();
                const expectedOutput = await readDialectOutput(dialect);
                (0, assert_1.strictEqual)(output, expectedOutput);
            }
        });
        await (0, test_utils_1.it)('verifies generated types', async () => {
            for (const { connectionString, dialect, values } of TESTS) {
                const dialectName = dialect.constructor.name.slice(0, -'Dialect'.length);
                const outFile = (0, path_1.join)(__dirname, 'outputs', `${dialectName.toLowerCase()}.output.ts`);
                logger.info(`Testing ${dialectName}...`);
                const db = await (0, fixtures_1.migrate)(dialect, connectionString);
                await testValues(db, values);
                await new generator_1.Generator().generate({
                    camelCase: true,
                    db,
                    dialect,
                    logger,
                    outFile,
                });
                const output = await new generator_1.Generator().generate({
                    camelCase: true,
                    db,
                    dialect,
                    logger,
                    outFile,
                    verify: true,
                });
                const expectedOutput = await readDialectOutput(dialect);
                (0, assert_1.strictEqual)(output, expectedOutput);
                await (0, fixtures_1.addExtraColumn)(db);
                try {
                    await new generator_1.Generator().generate({
                        camelCase: true,
                        db,
                        dialect,
                        logger,
                        outFile,
                        verify: true,
                    });
                }
                catch (error) {
                    if (error instanceof Error) {
                        (0, assert_1.strictEqual)(error.message, "Generated types are not up-to-date! Use '--log-level=error' option to view the diff.");
                    }
                    else {
                        throw error;
                    }
                }
                await db.destroy();
            }
        });
    });
};
exports.testE2E = testE2E;
//# sourceMappingURL=e2e.test.js.map