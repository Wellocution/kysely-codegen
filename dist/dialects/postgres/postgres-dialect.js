"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PostgresDialect_options;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresDialect = void 0;
const kysely_1 = require("kysely");
const core_1 = require("../../core");
const postgres_adapter_1 = require("./postgres-adapter");
const postgres_introspector_1 = require("./postgres-introspector");
const pg_1 = require("pg");
class PostgresDialect extends core_1.Dialect {
    constructor(options = { domains: true }) {
        super();
        _PostgresDialect_options.set(this, void 0);
        this.adapter = new postgres_adapter_1.PostgresAdapter();
        __classPrivateFieldSet(this, _PostgresDialect_options, options, "f");
        this.introspector = new postgres_introspector_1.PostgresIntrospector(this.adapter, __classPrivateFieldGet(this, _PostgresDialect_options, "f"));
    }
    async createKyselyDialect(options) {
        return new kysely_1.PostgresDialect({
            pool: new pg_1.Pool({
                connectionString: options.connectionString,
                ssl: options.ssl ? { rejectUnauthorized: false } : false,
            }),
        });
    }
}
exports.PostgresDialect = PostgresDialect;
_PostgresDialect_options = new WeakMap();
//# sourceMappingURL=postgres-dialect.js.map