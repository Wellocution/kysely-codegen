import { LogLevel } from './log-level';
/**
 * Provides pretty console logging.
 */
export declare class Logger {
    #private;
    readonly logLevel: LogLevel;
    constructor(logLevel?: LogLevel);
    debug(...values: unknown[]): void;
    error(...values: unknown[]): void;
    info(...values: unknown[]): void;
    log(...values: unknown[]): void;
    serializeDebug(...values: unknown[]): string;
    serializeError(...values: unknown[]): string;
    serializeInfo(...values: unknown[]): string;
    serializeSuccess(...values: unknown[]): string;
    serializeWarn(...values: unknown[]): string;
    success(...values: unknown[]): void;
    warn(...values: unknown[]): void;
}
