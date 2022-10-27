import { Content, Classification, ContentDetail, Record } from "../client/interface";
import { connection } from "./dbConnection";
import express from "express";
import path from "path";

const PORT:number = 5500;
connection.connect();

export const app = express();
app.use(express.static("dist"));
app.use(express.json());

app.get("/report", (req, res) => res.sendFile(path.join(__dirname, "../../dist", req.path + ".html")));

app.get("/api/contentDetail/:contentId", (req, res) => {
    if (!req.params.contentId) {
        res.sendStatus(400);
        return;
    }

    try {
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
    } catch(err) { res.sendStatus(500) }
})

app.get("/api/accountBook/:yyyymm?", (req, res) => {
    const baseSql: string = "select ct.content_id, ct.classification_id, ct.memo, ct.amount, DATE_FORMAT(ct.content_date, '%Y-%m-%d %H:%i:%s') as content_date, cf.category, cf.main_type, cf.sub_type from content ct join classification cf on ct.classification_id = cf.classification_id ";
    const orderSql = " order by content_date desc";

    try {
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
    } catch(err) { res.sendStatus(500) }
})

app.post("/api/accountBook", (req, res) => {
    if (!req.body?.content) {
        res.sendStatus(400);
        return;
    }

    try {
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
    } catch(err) { res.sendStatus(500) }
});

app.put("/api/accountBook/:contentId", (req, res) => {
    if (!req.params.contentId || !req.body?.content) {
        res.sendStatus(400);
        return;
    }

    try {
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
    } catch(err) { res.sendStatus(500) }
});

app.delete("/api/accountBook/:contentId", (req, res) => {
    if(!req.params.contentId) {
        res.sendStatus(400);
        return;
    }

    try {
        const contentId: string = req.params.contentId;
        connection.query("delete from content where content_id = ?", [contentId],
            (err, rows) => {
                if(err) {
                    throw err;
                }
                res.sendStatus(200);
            }
        );
    } catch(err) { res.sendStatus(500) }
});

app.get("/api/classification", (req, res) => {
    try {
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
    } catch(err) { res.sendStatus(500) }
});

app.get("/api/report/:yyyymm?", (req, res) => {
    try {
        const baseSql: string = "select c.*, amount_sum from classification c left join (select cf.*, sum(amount) as amount_sum from classification cf join content c on cf.classification_id = c.classification_id ";
        const tailSql: string = " group by cf.sub_type) summary_cf on c.classification_id = summary_cf.classification_id order by category, main_type, sub_type "
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
        connection.query(baseSql + middleSql + tailSql, [yyyymm[0], yyyymm[1]], (err, rows: any[]) => {
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
    } catch(err) { res.sendStatus(500) }
})


app.listen(PORT, () => {
    console.log("listening on " + PORT);
});