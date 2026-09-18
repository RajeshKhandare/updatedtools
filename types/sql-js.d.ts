declare module 'sql.js' {
  interface SqlJsConfig {
    locateFile?: (file: string) => string;
  }

  interface QueryResult {
    columns: string[];
    values: unknown[][];
  }

  interface Database {
    run(sql: string, params?: unknown[]): void;
    exec(sql: string, params?: unknown[]): QueryResult[];
    close(): void;
  }

  interface SqlJsStatic {
    Database: new (data?: ArrayLike<number> | Uint8Array) => Database;
  }

  const initSqlJs: (config?: SqlJsConfig) => Promise<SqlJsStatic>;

  export default initSqlJs;
}
