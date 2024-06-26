"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testTransformer = void 0;
const assert_1 = require("assert");
const ast_1 = require("../ast");
const core_1 = require("../core");
const dialects_1 = require("../dialects");
const test_utils_1 = require("../test.utils");
const definitions_1 = require("./definitions");
const transformer_1 = require("./transformer");
const testTransformer = () => {
    void (0, test_utils_1.describe)('transformer', () => {
        const enums = new core_1.EnumCollection({
            'public.mood': ['happy', 'ok', 'sad'],
            'public.mood_': ['', ',', "'", "'','"],
        });
        const transform = (tables, camelCase, runtimeEnums) => {
            const dialect = new dialects_1.PostgresDialect();
            const transformer = new transformer_1.Transformer();
            const metadata = new core_1.DatabaseMetadata(tables, enums);
            return transformer.transform({
                camelCase,
                dialect,
                metadata,
                runtimeEnums,
            });
        };
        void (0, test_utils_1.it)('should transform correctly', () => {
            const nodes = transform([
                new core_1.TableMetadata({
                    columns: [
                        new core_1.ColumnMetadata({
                            dataType: 'interval',
                            hasDefaultValue: true,
                            name: 'interval',
                        }),
                        new core_1.ColumnMetadata({
                            dataType: 'interval',
                            isArray: true,
                            name: 'intervals',
                        }),
                        new core_1.ColumnMetadata({
                            dataType: 'mood',
                            name: 'mood',
                        }),
                        new core_1.ColumnMetadata({
                            dataType: 'text',
                            isArray: true,
                            name: 'texts',
                        }),
                    ],
                    name: 'table',
                    schema: 'public',
                }),
            ], false, false);
            (0, assert_1.deepStrictEqual)(nodes, [
                new ast_1.ImportStatementNode('kysely', [new ast_1.ImportClauseNode('ColumnType')]),
                new ast_1.ImportStatementNode('postgres-interval', [
                    new ast_1.ImportClauseNode('IPostgresInterval'),
                ]),
                new ast_1.ExportStatementNode(new ast_1.AliasDeclarationNode('ArrayType', definitions_1.GLOBAL_DEFINITIONS.ArrayType)),
                new ast_1.ExportStatementNode(new ast_1.AliasDeclarationNode('ArrayTypeImpl', definitions_1.GLOBAL_DEFINITIONS.ArrayTypeImpl)),
                new ast_1.ExportStatementNode(new ast_1.AliasDeclarationNode('Generated', definitions_1.GLOBAL_DEFINITIONS.Generated)),
                new ast_1.ExportStatementNode(new ast_1.AliasDeclarationNode('Interval', new dialects_1.PostgresAdapter().definitions.Interval)),
                new ast_1.ExportStatementNode(new ast_1.AliasDeclarationNode('Mood', new ast_1.UnionExpressionNode([
                    new ast_1.LiteralNode('happy'),
                    new ast_1.LiteralNode('ok'),
                    new ast_1.LiteralNode('sad'),
                ]))),
                new ast_1.ExportStatementNode(new ast_1.InterfaceDeclarationNode('Table', new ast_1.ObjectExpressionNode([
                    new ast_1.PropertyNode('interval', new ast_1.GenericExpressionNode('Generated', [
                        new ast_1.IdentifierNode('Interval'),
                    ])),
                    new ast_1.PropertyNode('intervals', new ast_1.GenericExpressionNode('ArrayType', [
                        new ast_1.IdentifierNode('Interval'),
                    ])),
                    new ast_1.PropertyNode('mood', new ast_1.IdentifierNode('Mood')),
                    new ast_1.PropertyNode('texts', new ast_1.ArrayExpressionNode(new ast_1.IdentifierNode('string'))),
                ]))),
                new ast_1.ExportStatementNode(new ast_1.InterfaceDeclarationNode('DB', new ast_1.ObjectExpressionNode([
                    new ast_1.PropertyNode('table', new ast_1.IdentifierNode('Table')),
                ]))),
            ]);
        });
        void (0, test_utils_1.it)('should be able to transform to camelCase', () => {
            const nodes = transform([
                new core_1.TableMetadata({
                    columns: [
                        new core_1.ColumnMetadata({
                            dataType: '',
                            hasDefaultValue: true,
                            name: 'baz_qux',
                        }),
                    ],
                    name: 'foo_bar',
                    schema: 'public',
                }),
            ], true, false);
            (0, assert_1.deepStrictEqual)(nodes, [
                new ast_1.ImportStatementNode('kysely', [new ast_1.ImportClauseNode('ColumnType')]),
                new ast_1.ExportStatementNode(new ast_1.AliasDeclarationNode('Generated', definitions_1.GLOBAL_DEFINITIONS.Generated)),
                new ast_1.ExportStatementNode(new ast_1.InterfaceDeclarationNode('FooBar', new ast_1.ObjectExpressionNode([
                    new ast_1.PropertyNode('bazQux', new ast_1.GenericExpressionNode('Generated', [
                        new ast_1.IdentifierNode('string'),
                    ])),
                ]))),
                new ast_1.ExportStatementNode(new ast_1.InterfaceDeclarationNode('DB', new ast_1.ObjectExpressionNode([
                    new ast_1.PropertyNode('fooBar', new ast_1.IdentifierNode('FooBar')),
                ]))),
            ]);
        });
        void (0, test_utils_1.it)('should transform Postgres enums correctly', () => {
            const nodes = transform([
                new core_1.TableMetadata({
                    columns: [
                        new core_1.ColumnMetadata({
                            dataType: 'mood',
                            hasDefaultValue: false,
                            name: 'column1',
                        }),
                        new core_1.ColumnMetadata({
                            dataType: 'mood_',
                            hasDefaultValue: true,
                            name: 'column2',
                        }),
                    ],
                    name: 'table',
                    schema: 'public',
                }),
            ], false, false);
            (0, assert_1.deepStrictEqual)(nodes, [
                new ast_1.ImportStatementNode('kysely', [new ast_1.ImportClauseNode('ColumnType')]),
                new ast_1.ExportStatementNode(new ast_1.AliasDeclarationNode('Generated', definitions_1.GLOBAL_DEFINITIONS.Generated)),
                new ast_1.ExportStatementNode(new ast_1.AliasDeclarationNode('Mood', new ast_1.UnionExpressionNode([
                    new ast_1.LiteralNode('happy'),
                    new ast_1.LiteralNode('ok'),
                    new ast_1.LiteralNode('sad'),
                ]))),
                new ast_1.ExportStatementNode(new ast_1.AliasDeclarationNode('Mood2', new ast_1.UnionExpressionNode([
                    new ast_1.LiteralNode(''),
                    new ast_1.LiteralNode(','),
                    new ast_1.LiteralNode("'"),
                    new ast_1.LiteralNode("'','"),
                ]))),
                new ast_1.ExportStatementNode(new ast_1.InterfaceDeclarationNode('Table', new ast_1.ObjectExpressionNode([
                    new ast_1.PropertyNode('column1', new ast_1.IdentifierNode('Mood')),
                    new ast_1.PropertyNode('column2', new ast_1.GenericExpressionNode('Generated', [
                        new ast_1.IdentifierNode('Mood2'),
                    ])),
                ]))),
                new ast_1.ExportStatementNode(new ast_1.InterfaceDeclarationNode('DB', new ast_1.ObjectExpressionNode([
                    new ast_1.PropertyNode('table', new ast_1.IdentifierNode('Table')),
                ]))),
            ]);
        });
        void (0, test_utils_1.it)('should transform runtime enums correctly', () => {
            const nodes = transform([
                new core_1.TableMetadata({
                    columns: [
                        new core_1.ColumnMetadata({
                            dataType: 'mood',
                            hasDefaultValue: false,
                            name: 'column1',
                        }),
                        new core_1.ColumnMetadata({
                            dataType: 'mood_',
                            hasDefaultValue: true,
                            name: 'column2',
                        }),
                    ],
                    name: 'table',
                    schema: 'public',
                }),
            ], false, true);
            (0, assert_1.deepStrictEqual)(nodes, [
                new ast_1.ImportStatementNode('kysely', [new ast_1.ImportClauseNode('ColumnType')]),
                new ast_1.ExportStatementNode(new ast_1.RuntimeEnumDeclarationNode('Mood', new ast_1.UnionExpressionNode([
                    new ast_1.LiteralNode('happy'),
                    new ast_1.LiteralNode('ok'),
                    new ast_1.LiteralNode('sad'),
                ]))),
                new ast_1.ExportStatementNode(new ast_1.RuntimeEnumDeclarationNode('Mood2', new ast_1.UnionExpressionNode([
                    new ast_1.LiteralNode(''),
                    new ast_1.LiteralNode(','),
                    new ast_1.LiteralNode("'"),
                    new ast_1.LiteralNode("'','"),
                ]))),
                new ast_1.ExportStatementNode(new ast_1.AliasDeclarationNode('Generated', definitions_1.GLOBAL_DEFINITIONS.Generated)),
                new ast_1.ExportStatementNode(new ast_1.InterfaceDeclarationNode('Table', new ast_1.ObjectExpressionNode([
                    new ast_1.PropertyNode('column1', new ast_1.IdentifierNode('Mood')),
                    new ast_1.PropertyNode('column2', new ast_1.GenericExpressionNode('Generated', [
                        new ast_1.IdentifierNode('Mood2'),
                    ])),
                ]))),
                new ast_1.ExportStatementNode(new ast_1.InterfaceDeclarationNode('DB', new ast_1.ObjectExpressionNode([
                    new ast_1.PropertyNode('table', new ast_1.IdentifierNode('Table')),
                ]))),
            ]);
        });
    });
};
exports.testTransformer = testTransformer;
//# sourceMappingURL=transformer.test.js.map