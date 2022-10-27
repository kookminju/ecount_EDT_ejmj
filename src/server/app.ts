import { Content, Classification, ContentDetail, Record } from "../client/interface";
import express from "express";
import mysql from "mysql";
import path from "path";
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

app.get("/report", (req, res) => res.sendFile(path.join(__dirname, "../../dist", req.path + ".html")));

app.get("/api/contentDetail/:contentId", (req, res) => {
    if (!req.params.contentId) {
        res.sendStatus(400);
        return;
    }

    const contentId: string = req.params.contentId;
    const sql: string = "select ct.*, cf.category, cf.main_type, cf.sub_type from content ct join classification cf on ct.classification_id = cf.classification_id where content_id = ?";
    connection.query(sql, [contentId],
        (err, rows) => {
            if(err) {
                throw err;
            }
            const row = rows[0];
            const detail: ContentDetail = {
                contentId: row["content_id"],
                classificationId: row["classification_id"],
                contentDate: row["content_date"],
                memo: row["memo"],
                amount: row["amount"],
                category: row["category"],
                mainType: row["main_type"],
                subType: row["sub_type"],
            }
            res.send(detail);
        }
    );
})

app.get("/api/accountBook/:yyyymm?", (req, res) => {
    const baseSql: string = "select ct.*, cf.category, cf.main_type, cf.sub_type from content ct join classification cf on ct.classification_id = cf.classification_id ";
    const orderSql = " order by content_date desc";

    let resultArr: ContentDetail[] = [];
    if(!req.params.yyyymm) {
        const whereSql: string = " where date_format(content_date, '%m') = month(now())";
        connection.query(baseSql + whereSql + orderSql, (err: Error, rows: any[]) => {
            if(err) {
                throw err;
            }
            rows.forEach((row) => {
                const detail: ContentDetail = {
                    contentId: row["content_id"],
                    classificationId: row["classification_id"],
                    contentDate: row["content_date"],
                    memo: row["memo"],
                    amount: row["amount"],
                    category: row["category"],
                    mainType: row["main_type"],
                    subType: row["sub_type"],
                }
                resultArr.push(detail);
            })
            res.send(resultArr);
        });
        return;
    }
    
    // yyyy년 mm월 가계부내역 조회
    const yyyymm: string[] = req.params.yyyymm.split("-");
    const whereSql: string = " where date_format(content_date, '%Y') = ? and date_format(content_date, '%m') = ?"
    connection.query(baseSql + whereSql + orderSql, [yyyymm[0], yyyymm[1]], (err, rows: any[]) => {
        if(err) {
            throw err;
        }
        rows.forEach((row) => {
            const detail: ContentDetail = {
                contentId: row["content_id"],
                classificationId: row["classification_id"],
                contentDate: row["content_date"],
                memo: row["memo"],
                amount: row["amount"],
                category: row["category"],
                mainType: row["main_type"],
                subType: row["sub_type"],
            }
            resultArr.push(detail);
        })
        res.send(resultArr);
    });
})

app.post("/api/accountBook", (req, res) => {
    if (!req.body?.content) {
        res.sendStatus(400);
        return;
    }

    /*
        {
            "content": {
                "contentId": "test-post-01",
                "classificationId": 9,
                "contentDate": "2022-10-26 13:02:15",
                "memo": "초밥",
                "amount": 12000
            }
        }
     */
    const content: Content = req.body.content;
    connection.query("insert into content values (?, ?, ?, ?, ?)", 
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
    if (!req.params.contentId || !req.body?.content) {
        res.sendStatus(400);
        return;
    }

    const content: Content = req.body.content;
    connection.query("update content set classification_id = ?, content_date = ?, memo = ?, amount = ? where content_id = ?", 
        [content.classificationId, content.contentDate, content.memo, content.amount, req.params.contentId],
        (err, rows) => {
            if(err) {
                throw err;
            }
            res.sendStatus(200);
        }
    );
});

app.delete("/api/accountBook/:contentId", (req, res) => {
    if(!req.params.contentId) {
        res.sendStatus(400);
        return;
    }

    const contentId: string = req.params.contentId;
    connection.query("delete from content where content_id = ?", [contentId],
        (err, rows) => {
            if(err) {
                throw err;
            }
            res.sendStatus(200);
        }
    );
});


app.get("/api/classification", (req, res) => {
    connection.query("select * from classification order by category, main_type, sub_type", (err: Error, rows: any[]) => {
        if(err) {
            throw err;
        }
        let resultArr: Classification[] = [];
        rows.forEach((row) => {
            const classification: Classification = {
                classificationId: row["classification_id"],
                category: row["category"],
                mainType: row["main_type"],
                subType: row["sub_type"],
            }
            resultArr.push(classification);
        })
        res.send(resultArr);
    })
});

app.get("/api/report/:yyyymm?", (req, res) => {
    const baseSql: string = "select cf.*, sum(amount) as amount_sum from classification cf join content c on cf.classification_id = c.classification_id ";
    const tailSql: string = " group by cf.classification_id order by category, main_type, sub_type"
    let resultArr: Record[] = [];

    if(!req.params.yyyymm) {
        const middleSql: string = " where date_format(content_date, '%m') = month(now())";
        connection.query(baseSql + middleSql + tailSql, (err: Error, rows: any[]) => {
            if(err) {
                throw err;
            }
            rows.forEach((row) => {
                const record: Record = {
                    classificationId: row["classification_id"],
                    category: row["category"],
                    mainType: row["main_type"],
                    subType: row["sub_type"],
                    amountSum: row["amount_sum"],
                }
                resultArr.push(record);
            })
            res.send(resultArr);
        });
        return;
    }
    
    const yyyymm: string[] = req.params.yyyymm.split("-");
    const middleSql: string = " where date_format(content_date, '%Y') = ? and date_format(content_date, '%m') = ?";
    connection.query(baseSql + middleSql + tailSql, (err: Error, rows: any[]) => {
        if(err) {
            throw err;
        }
        rows.forEach((row) => {
            const record: Record = {
                classificationId: row["classification_id"],
                category: row["category"],
                mainType: row["main_type"],
                subType: row["sub_type"],
                amountSum: row["amount_sum"],
            }
            resultArr.push(record);
        })
        res.send(resultArr);
    });
})


app.listen(PORT, () => {
    console.log("listening on " + PORT);
});