import mysql from "mysql";

const PASSWORD: string = "1q2w3e4r5t";

export const connection = mysql.createConnection({
    host: "localhost",
    user: "local",
    password: PASSWORD,
    database: "accountbook_ejmj",
});
