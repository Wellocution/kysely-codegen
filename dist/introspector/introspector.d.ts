import { Kysely } from 'kysely';
import type { DatabaseMetadata, Dialect } from '../core';
export type ConnectOptions = {
    connectionString: string;
    dialect: Dialect;
};
export type IntrospectOptions<DB> = {
    db: Kysely<DB>;
    excludePattern?: string;
    includePattern?: string;
};
/**
 * Analyzes and returns metadata for a connected database.
 */
export declare abstract class Introspector<DB> {
    private establishDatabaseConnection;
    connect(options: ConnectOptions): Promise<Kysely<DB>>;
    protected getTables(options: IntrospectOptions<DB>): Promise<import("kysely").TableMetadata[]>;
    abstract introspect(options: IntrospectOptions<DB>): Promise<DatabaseMetadata>;
}
