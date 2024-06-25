// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString:
    "postgresql://postgres:pong34756@localhost:5432/Build the Complete CRUD APIs Assignment",
});

export default connectionPool;
