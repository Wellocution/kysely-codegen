"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Logger_instances, _Logger_inspect;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const chalk_1 = __importDefault(require("chalk"));
const util_1 = require("util");
const log_level_1 = require("./log-level");
/**
 * Provides pretty console logging.
 */
class Logger {
    constructor(logLevel = log_level_1.LogLevel.INFO) {
        _Logger_instances.add(this);
        this.logLevel = logLevel;
    }
    debug(...values) {
        if (this.logLevel >= log_level_1.LogLevel.DEBUG) {
            for (const value of values) {
                console.debug(this.serializeDebug(value));
            }
        }
    }
    error(...values) {
        if (this.logLevel >= log_level_1.LogLevel.ERROR) {
            for (const value of values) {
                console.error(this.serializeError(value));
            }
        }
    }
    info(...values) {
        if (this.logLevel >= log_level_1.LogLevel.INFO) {
            for (const value of values) {
                console.info(this.serializeInfo(value));
            }
        }
    }
    log(...values) {
        if (this.logLevel >= log_level_1.LogLevel.INFO) {
            for (const value of values) {
                console.log(value);
            }
        }
    }
    serializeDebug(...values) {
        return chalk_1.default.gray(`  ${__classPrivateFieldGet(this, _Logger_instances, "m", _Logger_inspect).call(this, values)}`);
    }
    serializeError(...values) {
        return chalk_1.default.red(`✗ ${__classPrivateFieldGet(this, _Logger_instances, "m", _Logger_inspect).call(this, values)}`);
    }
    serializeInfo(...values) {
        return chalk_1.default.blue(`• ${__classPrivateFieldGet(this, _Logger_instances, "m", _Logger_inspect).call(this, values)}`);
    }
    serializeSuccess(...values) {
        return chalk_1.default.green(`✓ ${__classPrivateFieldGet(this, _Logger_instances, "m", _Logger_inspect).call(this, values)}`);
    }
    serializeWarn(...values) {
        return chalk_1.default.yellow(`⚠ ${__classPrivateFieldGet(this, _Logger_instances, "m", _Logger_inspect).call(this, values)}`);
    }
    success(...values) {
        if (this.logLevel >= log_level_1.LogLevel.INFO) {
            for (const value of values) {
                console.log(this.serializeSuccess(value));
            }
        }
    }
    warn(...values) {
        if (this.logLevel >= log_level_1.LogLevel.WARN) {
            for (const value of values) {
                console.warn(this.serializeWarn(value));
            }
        }
    }
}
exports.Logger = Logger;
_Logger_instances = new WeakSet(), _Logger_inspect = function _Logger_inspect(values) {
    return values
        .map((value) => {
        return value instanceof Object
            ? (0, util_1.inspect)(value, { colors: true })
            : value;
    })
        .join(' ');
};
//# sourceMappingURL=logger.js.map