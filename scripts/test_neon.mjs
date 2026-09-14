import { getPool, initializeDatabase } from "/home/rohith-reddy/Downloads/doctor-nextjs-app/lib/db.js";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

async function testNeon() {
  console.log("1. Checking DATABASE_URL from .env.local...");
  let url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL not found in environment!");
  }
  // Sanitize for node-postgres (strip channel_binding if present)
  if (url.includes("channel_binding")) {
    url = url.replace(/&channel_binding=[^&]*/, "").replace(/\?channel_binding=[^&]*&?/, "?");
  }
  // Strip channel_binding which can cause issue in node-postgres
  if (url.includes("channel_binding")) {
    url = url.replace(/&channel_binding=[^&]*/, "").replace(/\?channel_binding=[^&]*&?/, "?");
  }
  process.env.DATABASE_URL = url;
  console.log("   URL Host:", url.split("@")[1]?.split("/")[0] || "Found");

  console.log("2. Initializing pg pool...");
  const { Pool } = await import("pg");
  const pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  console.log("3. Testing simple connection (SELECT NOW())...");
  const client = await pool.connect();
  const res = await client.query("SELECT NOW() as current_time, version() as pg_version");
  console.log("✓ Connected successfully to Neon PostgreSQL!");
  console.log("   Current Server Time:", res.rows[0].current_time);
  console.log("   Postgres Version:", res.rows[0].pg_version.split(" ")[0] + " " + res.rows[0].pg_version.split(" ")[1]);
  client.release();

  console.log("\n4. Running initializeDatabase() schema creation...");
  await initializeDatabase();
  console.log("✓ All tables checked / created in Neon DB!");

  console.log("\n5. Checking existing tables in Neon DB...");
  const client2 = await pool.connect();
  const tablesRes = await client2.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);
  console.log("   Tables in public schema:", tablesRes.rows.map(r => r.table_name).join(", "));
  client2.release();

  console.log("\n=== NEON DB CONNECTION AND SCHEMA TEST PASSED! ===");
  process.exit(0);
}

testNeon().catch((err) => {
  console.error("Neon DB Test Error:", err);
  process.exit(1);
});
