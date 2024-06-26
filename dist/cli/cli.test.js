"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testCli = void 0;
const assert_1 = require("assert");
const core_1 = require("../core");
const test_utils_1 = require("../test.utils");
const cli_1 = require("./cli");
const constants_1 = require("./constants");
const testCli = () => {
    const cli = new cli_1.Cli();
    const DEFAULT_CLI_OPTIONS = {
        camelCase: false,
        dialectName: undefined,
        domains: false,
        envFile: undefined,
        excludePattern: undefined,
        includePattern: undefined,
        logLevel: constants_1.DEFAULT_LOG_LEVEL,
        outFile: constants_1.DEFAULT_OUT_FILE,
        print: false,
        runtimeEnums: false,
        schema: undefined,
        typeOnlyImports: true,
        url: constants_1.DEFAULT_URL,
        verify: false,
    };
    void (0, test_utils_1.describe)('cli', () => {
        void (0, test_utils_1.it)('should parse options correctly', () => {
            const assert = (args, expectedOptions) => {
                const cliOptions = cli.parseOptions(args, { silent: true });
                (0, assert_1.deepStrictEqual)(cliOptions, {
                    ...DEFAULT_CLI_OPTIONS,
                    ...expectedOptions,
                });
            };
            assert(['--camel-case'], { camelCase: true });
            assert(['--dialect=mysql'], { dialectName: 'mysql' });
            assert(['--domains'], { domains: true });
            assert(['--no-domains'], { domains: false });
            assert(['--exclude-pattern=public._*'], { excludePattern: 'public._*' });
            assert(['--help'], {});
            assert(['-h'], {});
            assert(['--include-pattern=public._*'], { includePattern: 'public._*' });
            assert(['--log-level=debug'], { logLevel: core_1.LogLevel.DEBUG });
            assert(['--out-file=./db.ts'], { outFile: './db.ts' });
            assert(['--print'], { outFile: undefined, print: true });
            assert(['--type-only-imports'], { typeOnlyImports: true });
            assert(['--type-only-imports=true'], { typeOnlyImports: true });
            assert(['--type-only-imports=false'], { typeOnlyImports: false });
            assert(['--no-type-only-imports'], { typeOnlyImports: false });
            assert(['--url=postgres://u:p@s/d'], { url: 'postgres://u:p@s/d' });
            assert(['--schema=foo'], { schema: 'foo' });
            assert(['--verify'], { verify: true });
            assert(['--verify=true'], { verify: true });
            assert(['--verify=false'], { verify: false });
        });
    });
};
exports.testCli = testCli;
//# sourceMappingURL=cli.test.js.map