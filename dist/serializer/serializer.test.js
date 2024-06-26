"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testSerializer = void 0;
const assert_1 = require("assert");
const ast_1 = require("../ast");
const core_1 = require("../core");
const dialects_1 = require("../dialects");
const test_utils_1 = require("../test.utils");
const transformer_1 = require("../transformer");
const serializer_1 = require("./serializer");
const testSerializer = () => {
    void (0, test_utils_1.describe)('serializer', () => {
        const serializer = new serializer_1.Serializer();
        void (0, test_utils_1.it)('serializeAliasDeclaration', () => {
            (0, assert_1.strictEqual)(serializer.serializeAliasDeclaration(new ast_1.AliasDeclarationNode('MyType', new ast_1.LiteralNode('foo'))), 'type MyType = "foo";');
            (0, assert_1.strictEqual)(serializer.serializeAliasDeclaration(new ast_1.AliasDeclarationNode('Union', new ast_1.TemplateNode(['A', 'B'], new ast_1.UnionExpressionNode([
                new ast_1.IdentifierNode('A'),
                new ast_1.IdentifierNode('B'),
            ])))), 'type Union<A, B> = A | B;');
        });
        void (0, test_utils_1.it)('serializeArrayExpression', () => {
            (0, assert_1.strictEqual)(serializer.serializeArrayExpression(new ast_1.ArrayExpressionNode(new ast_1.IdentifierNode('Json'))), 'Json[]');
        });
        void (0, test_utils_1.it)('serializeExportStatement', () => {
            (0, assert_1.strictEqual)(serializer.serializeExportStatement(new ast_1.ExportStatementNode(new ast_1.AliasDeclarationNode('MyType', new ast_1.LiteralNode('foo')))), 'export type MyType = "foo";');
        });
        void (0, test_utils_1.it)('serializeExtendsClause', () => {
            (0, assert_1.strictEqual)(serializer.serializeExtendsClause(new ast_1.ExtendsClauseNode(new ast_1.IdentifierNode('A'), new ast_1.IdentifierNode('B'), new ast_1.IdentifierNode('A'), new ast_1.IdentifierNode('C'))), 'A extends B\n  ? A\n  : C');
        });
        void (0, test_utils_1.it)('serializeGenericExpression', () => {
            (0, assert_1.strictEqual)(serializer.serializeGenericExpression(new ast_1.GenericExpressionNode('MyType', [
                new ast_1.IdentifierNode('A'),
                new ast_1.IdentifierNode('B'),
            ])), 'MyType<A, B>');
        });
        void (0, test_utils_1.it)('serializeIdentifier', () => {
            (0, assert_1.strictEqual)(serializer.serializeIdentifier(new ast_1.IdentifierNode('MyIdentifier')), 'MyIdentifier');
        });
        void (0, test_utils_1.it)('serializeImportClause', () => {
            (0, assert_1.strictEqual)(serializer.serializeImportClause(new ast_1.ImportClauseNode('ColumnType')), 'ColumnType');
            (0, assert_1.strictEqual)(serializer.serializeImportClause(new ast_1.ImportClauseNode('RawBuilder', 'R')), 'RawBuilder as R');
        });
        void (0, test_utils_1.it)('serializeImportStatement', () => {
            (0, assert_1.strictEqual)(serializer.serializeImportStatement(new ast_1.ImportStatementNode('kysely', [
                new ast_1.ImportClauseNode('ColumnType'),
                new ast_1.ImportClauseNode('RawBuilder', 'R'),
            ])), 'import type { ColumnType, RawBuilder as R } from "kysely";');
        });
        void (0, test_utils_1.it)('serializeInferClause', () => {
            (0, assert_1.strictEqual)(serializer.serializeInferClause(new ast_1.InferClauseNode('A')), 'infer A');
        });
        void (0, test_utils_1.it)('serializeInterfaceDeclaration', () => {
            (0, assert_1.strictEqual)(serializer.serializeInterfaceDeclaration(new ast_1.InterfaceDeclarationNode('MyInterface', new ast_1.ObjectExpressionNode([
                new ast_1.PropertyNode('foo', new ast_1.LiteralNode('bar')),
            ]))), 'interface MyInterface {\n  foo: "bar";\n}');
        });
        void (0, test_utils_1.it)('serializeLiteral', () => {
            (0, assert_1.strictEqual)(serializer.serializeLiteral(new ast_1.LiteralNode('foo')), '"foo"');
        });
        void (0, test_utils_1.it)('serializeMappedType', () => {
            (0, assert_1.strictEqual)(serializer.serializeMappedType(new ast_1.MappedTypeNode(new ast_1.IdentifierNode('Json'))), '{\n  [K in string]?: Json;\n}');
        });
        void (0, test_utils_1.it)('serializeObjectExpression', () => {
            (0, assert_1.strictEqual)(serializer.serializeObjectExpression(new ast_1.ObjectExpressionNode([])), '{}');
            (0, assert_1.strictEqual)(serializer.serializeObjectExpression(new ast_1.ObjectExpressionNode([
                new ast_1.PropertyNode('bar baz', new ast_1.IdentifierNode('BarBaz')),
                new ast_1.PropertyNode('foo', new ast_1.IdentifierNode('Foo')),
            ])), '{\n  "bar baz": BarBaz;\n  foo: Foo;\n}');
        });
        void (0, test_utils_1.describe)('serializeObjectExpression', () => {
            void (0, test_utils_1.it)('should order fields properly', () => {
                (0, assert_1.strictEqual)(serializer.serializeObjectExpression(new ast_1.ObjectExpressionNode([
                    new ast_1.PropertyNode('zip', new ast_1.IdentifierNode('Num7')),
                    new ast_1.PropertyNode('avocado field', new ast_1.IdentifierNode('Num3')),
                    new ast_1.PropertyNode('brachiosaurus', new ast_1.IdentifierNode('Num4')),
                    new ast_1.PropertyNode('Zoo_field', new ast_1.IdentifierNode('Num1')),
                    new ast_1.PropertyNode('jc_33', new ast_1.IdentifierNode('Num5')),
                    new ast_1.PropertyNode('HelloField', new ast_1.IdentifierNode('Num0')),
                    new ast_1.PropertyNode('typescript_LANG', new ast_1.IdentifierNode('Num6')),
                    new ast_1.PropertyNode('_TEST', new ast_1.IdentifierNode('Num2')),
                ])), `{
  _TEST: Num2;
  "avocado field": Num3;
  brachiosaurus: Num4;
  HelloField: Num0;
  jc_33: Num5;
  typescript_LANG: Num6;
  zip: Num7;
  Zoo_field: Num1;
}`);
            });
        });
        void (0, test_utils_1.it)('serializeProperty', () => {
            (0, assert_1.strictEqual)(serializer.serializeProperty(new ast_1.PropertyNode('foo', new ast_1.IdentifierNode('Foo'))), 'foo: Foo;\n');
            (0, assert_1.strictEqual)(serializer.serializeProperty(new ast_1.PropertyNode('bar baz', new ast_1.IdentifierNode('BarBaz'))), '"bar baz": BarBaz;\n');
        });
        void (0, test_utils_1.it)('serializeUnionExpression', () => {
            (0, assert_1.strictEqual)(serializer.serializeUnionExpression(new ast_1.UnionExpressionNode([
                new ast_1.IdentifierNode('JsonArray'),
                new ast_1.IdentifierNode('JsonObject'),
                new ast_1.IdentifierNode('JsonPrimitive'),
            ])), 'JsonArray | JsonObject | JsonPrimitive');
        });
        void (0, test_utils_1.describe)('serializeUnionExpression', () => {
            void (0, test_utils_1.it)('should order union constituents properly', () => {
                (0, assert_1.strictEqual)(serializer.serializeUnionExpression(new ast_1.UnionExpressionNode([
                    new ast_1.IdentifierNode('z_TYPE'),
                    new ast_1.IdentifierNode('undefined'),
                    new ast_1.IdentifierNode('Aa_Type'),
                    new ast_1.IdentifierNode('AA3Type'),
                    new ast_1.IdentifierNode('Z_TYPE'),
                    new ast_1.IdentifierNode('HType'),
                    new ast_1.IdentifierNode('null'),
                    new ast_1.IdentifierNode('AA_Type'),
                    new ast_1.IdentifierNode('Aa3Type'),
                ])), 'AA3Type | AA_Type | Aa3Type | Aa_Type | HType | Z_TYPE | z_TYPE | null | undefined');
            });
        });
        void (0, test_utils_1.describe)('serialize', () => {
            void (0, test_utils_1.it)('should serialize JSON fields properly', () => {
                const dialect = new dialects_1.MysqlDialect();
                const enums = new core_1.EnumCollection();
                const transformer = new transformer_1.Transformer();
                const ast = transformer.transform({
                    camelCase: true,
                    dialect,
                    metadata: new core_1.DatabaseMetadata([
                        new core_1.TableMetadata({
                            columns: [
                                new core_1.ColumnMetadata({
                                    comment: 'Hello!\nThis is a comment.',
                                    dataType: 'json',
                                    name: 'json',
                                }),
                            ],
                            name: 'foo',
                            schema: 'public',
                        }),
                    ], enums),
                });
                (0, assert_1.strictEqual)(serializer.serialize(ast), 'import type { ColumnType } from "kysely";\n' +
                    '\n' +
                    'export type Json = ColumnType<JsonValue, string, string>;\n' +
                    '\n' +
                    'export type JsonArray = JsonValue[];\n' +
                    '\n' +
                    'export type JsonObject = {\n' +
                    '  [K in string]?: JsonValue;\n' +
                    '};\n' +
                    '\n' +
                    'export type JsonPrimitive = boolean | number | string | null;\n' +
                    '\n' +
                    'export type JsonValue = JsonArray | JsonObject | JsonPrimitive;\n' +
                    '\n' +
                    'export interface Foo {\n' +
                    '  /**\n' +
                    '   * Hello!\n' +
                    '   * This is a comment.\n' +
                    '   */\n' +
                    '  json: Json;\n' +
                    '}\n' +
                    '\n' +
                    'export interface DB {\n' +
                    '  foo: Foo;\n' +
                    '}\n');
            });
        });
        void (0, test_utils_1.describe)('serialize', () => {
            void (0, test_utils_1.it)('should serialize Postgres JSON fields properly', () => {
                const dialect = new dialects_1.PostgresDialect();
                const enums = new core_1.EnumCollection();
                const transformer = new transformer_1.Transformer();
                const ast = transformer.transform({
                    camelCase: true,
                    dialect,
                    metadata: new core_1.DatabaseMetadata([
                        new core_1.TableMetadata({
                            columns: [
                                new core_1.ColumnMetadata({ dataType: 'json', name: 'json' }),
                            ],
                            name: 'foo',
                            schema: 'public',
                        }),
                    ], enums),
                });
                (0, assert_1.strictEqual)(serializer.serialize(ast), 'export type Json = JsonValue;\n' +
                    '\n' +
                    'export type JsonArray = JsonValue[];\n' +
                    '\n' +
                    'export type JsonObject = {\n' +
                    '  [K in string]?: JsonValue;\n' +
                    '};\n' +
                    '\n' +
                    'export type JsonPrimitive = boolean | number | string | null;\n' +
                    '\n' +
                    'export type JsonValue = JsonArray | JsonObject | JsonPrimitive;\n' +
                    '\n' +
                    'export interface Foo {\n' +
                    '  json: Json;\n' +
                    '}\n' +
                    '\n' +
                    'export interface DB {\n' +
                    '  foo: Foo;\n' +
                    '}\n');
            });
        });
        void (0, test_utils_1.describe)('serialize', () => {
            const enumSerializer = new serializer_1.Serializer({ camelCase: true });
            void (0, test_utils_1.it)('should serialize runtime enums properly', () => (0, assert_1.strictEqual)(enumSerializer.serializeRuntimeEnum(new ast_1.RuntimeEnumDeclarationNode('Mood', new ast_1.UnionExpressionNode([
                new ast_1.LiteralNode('sad'),
                new ast_1.LiteralNode('happy'),
                new ast_1.LiteralNode('happy_or_sad'),
            ]))), 'enum Mood {\n' +
                '  happy = "happy",\n' +
                '  happyOrSad = "happy_or_sad",\n' +
                '  sad = "sad",\n' +
                '}'));
        });
    });
};
exports.testSerializer = testSerializer;
//# sourceMappingURL=serializer.test.js.map