"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Transformer_instances, _Transformer_collectSymbol, _Transformer_collectSymbols, _Transformer_createContext, _Transformer_createDatabaseExportNode, _Transformer_createRuntimeEnumDefinitionNodes, _Transformer_createDefinitionNodes, _Transformer_createImportNodes, _Transformer_getTableIdentifier, _Transformer_transformColumn, _Transformer_transformColumnToArgs, _Transformer_transformEnum, _Transformer_transformName, _Transformer_transformTables;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transformer = void 0;
const ast_1 = require("../ast");
const case_converter_1 = require("./case-converter");
const definitions_1 = require("./definitions");
const imports_1 = require("./imports");
const symbol_collection_1 = require("./symbol-collection");
const unionize = (args) => {
    switch (args.length) {
        case 0:
            return new ast_1.IdentifierNode('never');
        case 1:
            return args[0];
        default:
            return new ast_1.UnionExpressionNode(args);
    }
};
/**
 * Transforms database metadata into a TypeScript-compatible AST.
 */
class Transformer {
    constructor() {
        _Transformer_instances.add(this);
    }
    transform(options) {
        const context = __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_createContext).call(this, options);
        const tableNodes = __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_transformTables).call(this, context);
        const importNodes = __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_createImportNodes).call(this, context);
        const runtimeEnumDefinitionNodes = __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_createRuntimeEnumDefinitionNodes).call(this, context);
        const definitionNodes = __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_createDefinitionNodes).call(this, context);
        const databaseNode = __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_createDatabaseExportNode).call(this, context);
        return [
            ...importNodes,
            ...runtimeEnumDefinitionNodes,
            ...definitionNodes,
            ...tableNodes,
            databaseNode,
        ];
    }
}
exports.Transformer = Transformer;
_Transformer_instances = new WeakSet(), _Transformer_collectSymbol = function _Transformer_collectSymbol(name, context) {
    const definition = context.definitions[name];
    if (definition) {
        if (context.symbols.has(name)) {
            return;
        }
        context.symbols.set(name, {
            node: definition,
            type: symbol_collection_1.SymbolType.DEFINITION,
        });
        __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_collectSymbols).call(this, definition, context);
        return;
    }
    const moduleReference = context.imports[name];
    if (moduleReference) {
        if (context.symbols.has(name)) {
            return;
        }
        context.symbols.set(name, {
            node: moduleReference,
            type: symbol_collection_1.SymbolType.MODULE_REFERENCE,
        });
    }
}, _Transformer_collectSymbols = function _Transformer_collectSymbols(node, context) {
    switch (node.type) {
        case ast_1.NodeType.ARRAY_EXPRESSION:
            __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_collectSymbols).call(this, node.values, context);
            break;
        case ast_1.NodeType.EXTENDS_CLAUSE:
            __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_collectSymbols).call(this, node.extendsType, context);
            __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_collectSymbols).call(this, node.trueType, context);
            __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_collectSymbols).call(this, node.falseType, context);
            break;
        case ast_1.NodeType.GENERIC_EXPRESSION: {
            __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_collectSymbol).call(this, node.name, context);
            for (const arg of node.args) {
                __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_collectSymbols).call(this, arg, context);
            }
            break;
        }
        case ast_1.NodeType.IDENTIFIER:
            __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_collectSymbol).call(this, node.name, context);
            break;
        case ast_1.NodeType.INFER_CLAUSE:
            break;
        case ast_1.NodeType.LITERAL:
            break;
        case ast_1.NodeType.MAPPED_TYPE:
            __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_collectSymbols).call(this, node.value, context);
            break;
        case ast_1.NodeType.OBJECT_EXPRESSION:
            for (const property of node.properties) {
                __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_collectSymbols).call(this, property.value, context);
            }
            break;
        case ast_1.NodeType.TEMPLATE:
            __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_collectSymbols).call(this, node.expression, context);
            break;
        case ast_1.NodeType.UNION_EXPRESSION:
            for (const arg of node.args) {
                __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_collectSymbols).call(this, arg, context);
            }
            break;
    }
}, _Transformer_createContext = function _Transformer_createContext(options) {
    return {
        camelCase: !!options.camelCase,
        defaultScalar: options.dialect.adapter.defaultScalar ?? new ast_1.IdentifierNode('unknown'),
        defaultSchema: options.defaultSchema ?? options.dialect.adapter.defaultSchema,
        definitions: {
            ...definitions_1.GLOBAL_DEFINITIONS,
            ...options.dialect.adapter.definitions,
        },
        enums: options.metadata.enums,
        imports: {
            ...imports_1.GLOBAL_IMPORTS,
            ...options.dialect.adapter.imports,
        },
        metadata: options.metadata,
        runtimeEnums: !!options.runtimeEnums,
        scalars: {
            ...options.dialect.adapter.scalars,
        },
        symbols: new symbol_collection_1.SymbolCollection(),
    };
}, _Transformer_createDatabaseExportNode = function _Transformer_createDatabaseExportNode(context) {
    const tableProperties = [];
    for (const table of context.metadata.tables) {
        const identifier = __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_getTableIdentifier).call(this, table, context);
        const symbolName = context.symbols.getName(identifier);
        if (symbolName) {
            const value = new ast_1.IdentifierNode(symbolName);
            const tableProperty = new ast_1.PropertyNode(identifier, value);
            tableProperties.push(tableProperty);
        }
    }
    tableProperties.sort((a, b) => a.key.localeCompare(b.key));
    const body = new ast_1.ObjectExpressionNode(tableProperties);
    const argument = new ast_1.InterfaceDeclarationNode('DB', body);
    return new ast_1.ExportStatementNode(argument);
}, _Transformer_createRuntimeEnumDefinitionNodes = function _Transformer_createRuntimeEnumDefinitionNodes(context) {
    const runtimeEnumDefinitionNodes = [];
    for (const { name, symbol } of context.symbols.entries()) {
        if (symbol.type === symbol_collection_1.SymbolType.RUNTIME_ENUM_DEFINITION) {
            const argument = new ast_1.RuntimeEnumDeclarationNode(name, symbol.node);
            const runtimeEnumDefinitionNode = new ast_1.ExportStatementNode(argument);
            runtimeEnumDefinitionNodes.push(runtimeEnumDefinitionNode);
        }
    }
    return runtimeEnumDefinitionNodes.sort((a, b) => {
        return a.argument.name.localeCompare(b.argument.name);
    });
}, _Transformer_createDefinitionNodes = function _Transformer_createDefinitionNodes(context) {
    const definitionNodes = [];
    for (const { name, symbol } of context.symbols.entries()) {
        if (symbol.type === symbol_collection_1.SymbolType.DEFINITION) {
            const argument = new ast_1.AliasDeclarationNode(name, symbol.node);
            const definitionNode = new ast_1.ExportStatementNode(argument);
            definitionNodes.push(definitionNode);
        }
    }
    return definitionNodes.sort((a, b) => a.argument.name.localeCompare(b.argument.name));
}, _Transformer_createImportNodes = function _Transformer_createImportNodes(context) {
    var _a;
    const imports = {};
    const importNodes = [];
    for (const { id, name, symbol } of context.symbols.entries()) {
        if (symbol.type === symbol_collection_1.SymbolType.MODULE_REFERENCE) {
            (imports[_a = symbol.node.name] ?? (imports[_a] = [])).push(new ast_1.ImportClauseNode(id, name === id ? null : name));
        }
    }
    for (const [moduleName, symbolImports] of Object.entries(imports)) {
        importNodes.push(new ast_1.ImportStatementNode(moduleName, symbolImports));
    }
    return importNodes.sort((a, b) => a.moduleName.localeCompare(b.moduleName));
}, _Transformer_getTableIdentifier = function _Transformer_getTableIdentifier(table, context) {
    const name = table.schema &&
        context.defaultSchema &&
        table.schema !== context.defaultSchema
        ? `${table.schema}.${table.name}`
        : table.name;
    return __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_transformName).call(this, name, context);
}, _Transformer_transformColumn = function _Transformer_transformColumn(column, context) {
    let args = __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_transformColumnToArgs).call(this, column, context);
    if (column.isArray) {
        const unionizedArgs = unionize(args);
        const isSimpleNode = unionizedArgs.type === ast_1.NodeType.IDENTIFIER &&
            ['boolean', 'number', 'string'].includes(unionizedArgs.name);
        args = isSimpleNode
            ? [new ast_1.ArrayExpressionNode(unionizedArgs)]
            : [new ast_1.GenericExpressionNode('ArrayType', [unionizedArgs])];
    }
    if (column.isNullable) {
        args.push(new ast_1.IdentifierNode('null'));
    }
    let node = unionize(args);
    const isGenerated = column.hasDefaultValue || column.isAutoIncrementing;
    if (isGenerated) {
        node = new ast_1.GenericExpressionNode('Generated', [node]);
    }
    __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_collectSymbols).call(this, node, context);
    return node;
}, _Transformer_transformColumnToArgs = function _Transformer_transformColumnToArgs(column, context) {
    const dataType = column.dataType.toLowerCase();
    const scalarNode = context.scalars[dataType];
    if (scalarNode) {
        return [scalarNode];
    }
    // Used as a unique identifier for the data type:
    const dataTypeId = `${column.dataTypeSchema ?? context.defaultSchema}.${dataType}`;
    // Used for serializing the name of the symbol:
    const symbolId = column.dataTypeSchema && column.dataTypeSchema !== context.defaultSchema
        ? `${column.dataTypeSchema}.${dataType}`
        : dataType;
    const enumValues = context.enums.get(dataTypeId);
    if (enumValues) {
        const enumNode = unionize(__classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_transformEnum).call(this, enumValues));
        const symbolName = context.symbols.set(symbolId, {
            node: enumNode,
            type: context.runtimeEnums
                ? symbol_collection_1.SymbolType.RUNTIME_ENUM_DEFINITION
                : symbol_collection_1.SymbolType.DEFINITION,
        });
        const node = new ast_1.IdentifierNode(symbolName);
        return [node];
    }
    const symbolName = context.symbols.getName(symbolId);
    if (symbolName) {
        const node = new ast_1.IdentifierNode(symbolName ?? 'unknown');
        return [node];
    }
    if (column.enumValues) {
        return __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_transformEnum).call(this, column.enumValues);
    }
    return [context.defaultScalar];
}, _Transformer_transformEnum = function _Transformer_transformEnum(enumValues) {
    return enumValues.map((enumValue) => new ast_1.LiteralNode(enumValue));
}, _Transformer_transformName = function _Transformer_transformName(name, context) {
    return context.camelCase ? (0, case_converter_1.toCamelCase)(name) : name;
}, _Transformer_transformTables = function _Transformer_transformTables(context) {
    const tableNodes = [];
    for (const table of context.metadata.tables) {
        const tableProperties = [];
        for (const column of table.columns) {
            const key = /^[a-z].*[A-Z]/.test(column.name)
                ? `"${column.name}"`
                : __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_transformName).call(this, column.name, context);
            const value = __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_transformColumn).call(this, column, context);
            const comment = column.comment;
            const tableProperty = new ast_1.PropertyNode(key, value, comment);
            tableProperties.push(tableProperty);
        }
        const expression = new ast_1.ObjectExpressionNode(tableProperties);
        const identifier = __classPrivateFieldGet(this, _Transformer_instances, "m", _Transformer_getTableIdentifier).call(this, table, context);
        const symbolName = context.symbols.set(identifier, {
            type: symbol_collection_1.SymbolType.TABLE,
        });
        const tableNode = new ast_1.ExportStatementNode(new ast_1.InterfaceDeclarationNode(symbolName, expression));
        tableNodes.push(tableNode);
    }
    tableNodes.sort((a, b) => a.argument.name.localeCompare(b.argument.name));
    return tableNodes;
};
//# sourceMappingURL=transformer.js.map