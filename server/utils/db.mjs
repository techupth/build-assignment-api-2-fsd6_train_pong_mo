// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
import "dontenv/config";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString:
    "postgresql://postgres:Kingtrain0$@localhost:5432/crdu_data_api",
});

export default connectionPool;
