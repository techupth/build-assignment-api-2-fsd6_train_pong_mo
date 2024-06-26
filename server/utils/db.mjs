// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
import "dotenv/config";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString: process.env.DB_URL,
});

export default connectionPool;
