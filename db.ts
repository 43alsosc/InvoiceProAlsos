import mysql from "mysql";

const pool = mysql.createPool({
  host: "172.20.128.80",
  user: "root",
  password: "Skole123",
  database: "invoices",
});

export const query = (sql: string, values?: any) =>
  new Promise<any>((resolve, reject) => {
    pool.query(sql, values, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });