import { Pool, QueryResultRow } from "pg";

export const pool = new Pool({
  host: process.env.POSTGRES_HOST as string,
  user: process.env.POSTGRES_USER as string,
  password: process.env.POSTGRES_PASSWORD as string,
  database: process.env.POSTGRES_DATABASE as string,
  max: 20,
  /**Local DB doesn't want SSl, the live Vercel DB does*/
  ssl: process.env.NODE_ENV === "development" ? false : true,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const query = <Result extends QueryResultRow>(
  text: string,
  params: any[] = []
) => {
  return pool.query<Result>(text, params);
};
