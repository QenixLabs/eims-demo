import 'dotenv/config';
import mysql from 'mysql2/promise';
const u = new URL(process.env.DATABASE_URL);
const c = await mysql.createConnection({
  host: u.hostname, port: parseInt(u.port),
  user: u.username, password: u.password,
  database: u.pathname.slice(1),
  ssl: { rejectUnauthorized: false }
});
const [cols] = await c.execute("SHOW COLUMNS FROM identity_applications");
console.log("identity_applications columns:");
cols.forEach(r => console.log("  " + r.Field + " : " + r.Type));
await c.end();
