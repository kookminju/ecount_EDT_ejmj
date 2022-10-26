import { Content, Classification } from "../client/interface";
import express from "express";
import mysql from "mysql";
import bodyParser from "body-parser";

const PORT:number = 5500;
const connection = mysql.createConnection({
    host: "localhost",
    user: "local",
    password: "1q2w3e4r5t",
    database: "accountbook_ejmj",
});
connection.connect(); // 언제 해제하지

const app = express();
app.use(express.static("dist"));
app.use(express.json());

app.get("/api/accountBook/:yyyymm?", (req, res) => {
    if(!req.params.yyyymm) {
        const sql: string = "select * from content where date_format(content_date, '%m') = month(now())";
        connection.query(sql, (err, rows) => {
            if(err) {
                throw err;
            }
            res.send(rows);
        });
        return;
    }
    
    // yyyy년 mm월 가계부내역 조회
    const yyyymm: string[] = req.params.yyyymm.split("-");

    const sql: string = "select * from content where date_format(content_date, '%Y') = ? and date_format(content_date, '%m') = ?"
    connection.query(sql, [yyyymm[0], yyyymm[1]], (err, rows) => {
        if(err) {
            throw err;
        }
        res.send(rows);
    });
})

app.post("/api/accountBook/", (req, res) => {
    if (!req.body?.content) {
        res.sendStatus(400);
        return;
    }
    
    const content: Content = req.body.content;
    connection.query("insert todo content values (?, ?, ?, ?, ?)", 
        [content.contentId, content.classificationId, content.contentDate, content.memo, content.amount],
        (err, rows) => {
            if(err) {
                throw err;
            }
            res.sendStatus(200);
        }
    );
});

app.put("/api/accountBook/:contentId", (req, res) => {
    // 가계부에 내역 수정
});

app.delete("/api/accountBook/:contentId", (req, res) => {
    if(!req.params.contentId) {
        res.sendStatus(400);
        return;
    }

});


app.listen(PORT, () => {
    console.log("listening on " + PORT);
});