import express from "express";
import mysql from "mysql";
import { Classification, Content, ContentDetail, Record } from "../client/util/interface";

const connection = mysql.createConnection({
    host: "localhost",
    user: "local",
    password: "1q2w3e4r5t",
    database: "accountbook_ejmj",
});
connection.connect();

export const router = express.Router();

router.get("/contentDetail/:contentId", (req, res) => {
    try {
        if (!req.params.contentId) {
            res.sendStatus(400);
            return;
        }

        const contentId: string = req.params.contentId;
        const sql: string = "select ct.content_id, ct.classification_id, ct.memo, ct.amount, DATE_FORMAT(ct.content_date, '%Y-%m-%d %H:%i:%s') as content_date, cf.category, cf.main_type, cf.sub_type from content ct join classification cf on ct.classification_id = cf.classification_id where content_id = ?";
        connection.query(sql, [contentId],
            (err, rows) => {
                if(err) {
                    throw err;
                }
                const row = rows[0];
                const detail: ContentDetail = contentDetailHandler(row)
                res.send(detail);
            }
        );
    } catch(err) { res.sendStatus(500) }
})

router.get("/accountBook/:yyyymm?", (req, res) => {
    try {
        const baseSql: string = "select ct.content_id, ct.classification_id, ct.memo, ct.amount, DATE_FORMAT(ct.content_date, '%Y-%m-%d %H:%i:%s') as content_date, cf.category, cf.main_type, cf.sub_type from content ct join classification cf on ct.classification_id = cf.classification_id ";
        const orderSql = " order by content_date desc";

        let resultArr: ContentDetail[] = [];
        if(!req.params.yyyymm) {
            const whereSql: string = " where date_format(content_date, '%m') = month(now())";
            connection.query(baseSql + whereSql + orderSql, (err: Error, rows: any[]) => {
                if(err) {
                    throw err;
                }
                rows.forEach((row) => {
                    const detail: ContentDetail = contentDetailHandler(row)
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
                const detail: ContentDetail = contentDetailHandler(row)
                resultArr.push(detail);
            })
            res.send(resultArr);
        });
    } catch(err) { res.sendStatus(500) }
})

router.post("/accountBook", (req, res) => {
    try {
        if (!req.body?.content) {
            res.sendStatus(400);
            return;
        }

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

router.put("/accountBook/:contentId", (req, res) => {
    try {
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
    } catch(err) { res.sendStatus(500) }
});

router.delete("/accountBook/:contentId", (req, res) => {
    try {
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
    } catch(err) { res.sendStatus(500) }
});


router.get("/classification", (req, res) => {
    try {
        connection.query("select * from classification order by category, main_type, sub_type", (err: Error, rows: any[]) => {
            if(err) {
                throw err;
            }
            let resultArr: Classification[] = [];
            rows.forEach((row) => {
                const classification: Classification = classificationHandler(row);
                resultArr.push(classification);
            })
            res.send(resultArr);
        })
    } catch(err) { res.sendStatus(500) }
});

router.get("/classification/category/:category", (req, res) => {
    try {
        if (!req.params.category) {
            res.sendStatus(400);
            return;
        }

        const category: string = req.params.category;
        const sql: string = "select * from classification where category = ? order by category, main_type, sub_type";
        connection.query(sql, [category],
            (err, rows: any[]) => {
                if(err) {
                    throw err;
                }
                let resultArr: Classification[] = [];
                rows.forEach((row) => {
                    const classification: Classification = classificationHandler(row);
                    resultArr.push(classification);
                })
                res.send(resultArr);
            }
        );
    } catch(err) {

    }
})


router.get("/report/:yyyymm?", (req, res) => {
    try {
        const baseSql: string = "select c.*, amount_sum from classification c left join (select cf.*, sum(amount) as amount_sum from classification cf join content c on cf.classification_id = c.classification_id ";
        const tailSql: string = " group by cf.main_type, cf.sub_type) summary_cf on c.classification_id = summary_cf.classification_id order by category, main_type, sub_type "
        let resultArr: Record[] = [];
    
        if(!req.params.yyyymm) {
            const middleSql: string = " where date_format(content_date, '%m') = month(now())";
            connection.query(baseSql + middleSql + tailSql, (err: Error, rows: any[]) => {
                if(err) {
                    throw err;
                }
                rows.forEach((row) => {
                    const record: Record = recordHandler(row);
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
                const record: Record = recordHandler(row);
                resultArr.push(record);
            })
            res.send(resultArr);
        });
    } catch(err) { res.sendStatus(500) }
})


function contentDetailHandler(row: any): ContentDetail {
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
    return detail;
}

function classificationHandler(row: any): Classification {
    const classification: Classification = {
        classificationId: row["classification_id"],
        category: row["category"],
        mainType: row["main_type"],
        subType: row["sub_type"],
    }
    return classification;
}

function recordHandler(row: any): Record {
    const record: Record = {
        classificationId: row["classification_id"],
        category: row["category"],
        mainType: row["main_type"],
        subType: row["sub_type"],
        amountSum: row["amount_sum"],
    }
    return record;
}