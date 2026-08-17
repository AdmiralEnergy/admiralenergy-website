import { getDatabase } from "@netlify/database";

export interface CommerceQueryResult<Row> {
  rows: Row[];
  rowCount: number | null;
}

export interface CommerceQueryClient {
  query<Row = Record<string, unknown>>(
    text: string,
    values?: unknown[],
  ): Promise<CommerceQueryResult<Row>>;
  release?: () => void;
}

export interface CommercePool extends CommerceQueryClient {
  connect(): Promise<CommerceQueryClient>;
}

export class CommerceDatabaseUnavailableError extends Error {
  constructor(cause?: unknown) {
    super("Commerce database is unavailable.", { cause });
    this.name = "CommerceDatabaseUnavailableError";
  }
}

export function getCommercePool(): CommercePool {
  try {
    return getDatabase().pool as unknown as CommercePool;
  } catch (error) {
    throw new CommerceDatabaseUnavailableError(error);
  }
}

export async function withTransaction<T>(work: (client: CommerceQueryClient) => Promise<T>) {
  const client = await getCommercePool().connect();
  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    client.release?.();
  }
}

export async function checkDatabaseHealth() {
  try {
    const result = await getCommercePool().query<{ ok: number }>("SELECT 1 AS ok");
    return result.rows[0]?.ok === 1;
  } catch {
    return false;
  }
}
