import { readFileSync } from 'fs';
import { Client } from 'pg';

const seedQuery = readFileSync('src/database/seed/users.sql', {
  encoding: 'utf-8',
});

const connection = new Client({
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT || 3306),
  database: process.env.DATABASE_NAME,
});

try {
  connection.connect();

  connection.query(seedQuery, (err) => {
    if (err) {
      throw err;
    }

    console.log('SQL seed completed!');
    connection.end();
  });
} catch (error) {
  connection.end();

  console.error(error.message);
}
