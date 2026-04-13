const sql = require("mssql");

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 1433),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let poolPromise;

async function getPool() {
  if (!poolPromise) {
    poolPromise = sql
      .connect(dbConfig)
      .then((pool) => {
        console.log("✅ Database connected successfully");
        return pool;
      })
      .catch((err) => {
        console.error("❌ Database connection failed:", err);
        poolPromise = null; // reset so it can retry
        throw err;
      });
  }
  return poolPromise;
}

module.exports = {
  sql,
  getPool,
};
