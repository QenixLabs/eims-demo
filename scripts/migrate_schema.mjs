import 'dotenv/config';
import mysql from 'mysql2/promise';
const u = new URL(process.env.DATABASE_URL);
const c = await mysql.createConnection({
  host: u.hostname, port: parseInt(u.port),
  user: u.username, password: u.password,
  database: u.pathname.slice(1),
  ssl: { rejectUnauthorized: false }
});

const statements = [
  "ALTER TABLE identity_applications ADD COLUMN first_name VARCHAR(255) NOT NULL DEFAULT '' AFTER full_name",
  "ALTER TABLE identity_applications ADD COLUMN middle_name VARCHAR(255) AFTER first_name",
  "ALTER TABLE identity_applications ADD COLUMN last_name VARCHAR(255) NOT NULL DEFAULT '' AFTER middle_name",
  "ALTER TABLE identity_applications ADD COLUMN marital_status ENUM('Single','Married','Divorced','Widowed') AFTER nationality",
  "ALTER TABLE identity_applications ADD COLUMN education_level VARCHAR(255) AFTER marital_status",
  "ALTER TABLE identity_applications ADD COLUMN profession VARCHAR(255) AFTER education_level",
  "ALTER TABLE identity_applications ADD COLUMN professional_address TEXT AFTER profession",
  "UPDATE identity_applications SET first_name = full_name, last_name = '' WHERE first_name = ''",
  "ALTER TABLE identity_applications DROP COLUMN full_name",
];

for (const sql of statements) {
  console.log('Running:', sql.substring(0, 60) + '...');
  try {
    await c.execute(sql);
    console.log('  OK');
  } catch (e) {
    console.error('  ERROR:', e.message);
  }
}

await c.end();
console.log('Migration complete.');
