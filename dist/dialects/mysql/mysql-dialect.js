"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlDialect = void 0;
const kysely_1 = require("kysely");
const core_1 = require("../../core");
const mysql_adapter_1 = require("./mysql-adapter");
const mysql_introspector_1 = require("./mysql-introspector");
class MysqlDialect extends core_1.Dialect {
    constructor() {
        super(...arguments);
        this.adapter = new mysql_adapter_1.MysqlAdapter();
        this.introspector = new mysql_introspector_1.MysqlIntrospector();
    }
    async createKyselyDialect(options) {
        const { createPool } = await Promise.resolve().then(() => __importStar(require('mysql2')));
        return new kysely_1.MysqlDialect({
            pool: createPool({
                uri: options.connectionString,
            }),
        });
    }
}
exports.MysqlDialect = MysqlDialect;
//# sourceMappingURL=mysql-dialect.js.map