"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const dbConnection_1 = require("./dbConnection");
app_1.app.get("/api/contentDetail/:contentId", (req, res) => {
    if (!req.params.contentId) {
        res.sendStatus(400);
        return;
    }
    dbConnection_1.connection.connect();
    const contentId = req.params.contentId;
    const sql = "select ct.*, cf.category, cf.main_type, cf.sub_type from content ct join classification cf on ct.classification_id = cf.classification_id where content_id = ?";
    dbConnection_1.connection.query(sql, [contentId], (err, rows) => {
        if (err) {
            throw err;
        }
        const row = rows[0];
        const detail = {
            contentId: row["content_id"],
            classificationId: row["classification_id"],
            contentDate: row["content_date"],
            memo: row["memo"],
            amount: row["amount"],
            category: row["category"],
            mainType: row["main_type"],
            subType: row["sub_type"],
        };
        res.send(detail);
    });
    dbConnection_1.connection.end();
});
app_1.app.get("/api/accountBook/:yyyymm?", (req, res) => {
    dbConnection_1.connection.connect();
    const baseSql = "select ct.*, cf.category, cf.main_type, cf.sub_type from content ct join classification cf on ct.classification_id = cf.classification_id ";
    const orderSql = " order by content_date desc";
    let resultArr = [];
    if (!req.params.yyyymm) {
        const whereSql = " where date_format(content_date, '%m') = month(now())";
        dbConnection_1.connection.query(baseSql + whereSql + orderSql, (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                const detail = {
                    contentId: row["content_id"],
                    classificationId: row["classification_id"],
                    contentDate: row["content_date"],
                    memo: row["memo"],
                    amount: row["amount"],
                    category: row["category"],
                    mainType: row["main_type"],
                    subType: row["sub_type"],
                };
                resultArr.push(detail);
            });
            res.send(resultArr);
        });
        dbConnection_1.connection.end();
        return;
    }
    // yyyy년 mm월 가계부내역 조회
    const yyyymm = req.params.yyyymm.split("-");
    const whereSql = " where date_format(content_date, '%Y') = ? and date_format(content_date, '%m') = ?";
    dbConnection_1.connection.query(baseSql + whereSql + orderSql, [yyyymm[0], yyyymm[1]], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            const detail = {
                contentId: row["content_id"],
                classificationId: row["classification_id"],
                contentDate: row["content_date"],
                memo: row["memo"],
                amount: row["amount"],
                category: row["category"],
                mainType: row["main_type"],
                subType: row["sub_type"],
            };
            resultArr.push(detail);
        });
        res.send(resultArr);
        dbConnection_1.connection.connect();
    });
});
app_1.app.post("/api/accountBook", (req, res) => {
    var _a;
    if (!((_a = req.body) === null || _a === void 0 ? void 0 : _a.content)) {
        res.sendStatus(400);
        return;
    }
    dbConnection_1.connection.connect();
    const content = req.body.content;
    dbConnection_1.connection.query("insert into content values (?, ?, ?, ?, ?)", [content.contentId, content.classificationId, content.contentDate, content.memo, content.amount], (err, rows) => {
        if (err) {
            throw err;
        }
        res.sendStatus(200);
    });
    dbConnection_1.connection.end();
});
app_1.app.put("/api/accountBook/:contentId", (req, res) => {
    var _a;
    if (!req.params.contentId || !((_a = req.body) === null || _a === void 0 ? void 0 : _a.content)) {
        res.sendStatus(400);
        return;
    }
    dbConnection_1.connection.connect();
    const content = req.body.content;
    dbConnection_1.connection.query("update content set classification_id = ?, content_date = ?, memo = ?, amount = ? where content_id = ?", [content.classificationId, content.contentDate, content.memo, content.amount, req.params.contentId], (err, rows) => {
        if (err) {
            throw err;
        }
        res.sendStatus(200);
    });
    dbConnection_1.connection.end();
});
app_1.app.delete("/api/accountBook/:contentId", (req, res) => {
    if (!req.params.contentId) {
        res.sendStatus(400);
        return;
    }
    dbConnection_1.connection.connect();
    const contentId = req.params.contentId;
    dbConnection_1.connection.query("delete from content where content_id = ?", [contentId], (err, rows) => {
        if (err) {
            throw err;
        }
        res.sendStatus(200);
    });
    dbConnection_1.connection.end();
});
app_1.app.get("/api/classification", (req, res) => {
    dbConnection_1.connection.connect();
    dbConnection_1.connection.query("select * from classification order by category, main_type, sub_type", (err, rows) => {
        if (err) {
            throw err;
        }
        let resultArr = [];
        rows.forEach((row) => {
            const classification = {
                classificationId: row["classification_id"],
                category: row["category"],
                mainType: row["main_type"],
                subType: row["sub_type"],
            };
            resultArr.push(classification);
        });
        res.send(resultArr);
    });
    dbConnection_1.connection.end();
});
app_1.app.get("/api/report/:yyyymm?", (req, res) => {
    dbConnection_1.connection.connect();
    const baseSql = "select c.*, amount_sum from classification c left join (select cf.*, sum(amount) as amount_sum from classification cf join content c on cf.classification_id = c.classification_id ";
    const tailSql = " group by cf.sub_type) summary_cf on c.classification_id = summary_cf.classification_id order by category, main_type, sub_type ";
    let resultArr = [];
    if (!req.params.yyyymm) {
        const middleSql = " where date_format(content_date, '%m') = month(now())";
        dbConnection_1.connection.query(baseSql + middleSql + tailSql, (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                const record = {
                    classificationId: row["classification_id"],
                    category: row["category"],
                    mainType: row["main_type"],
                    subType: row["sub_type"],
                    amountSum: row["amount_sum"],
                };
                resultArr.push(record);
            });
            res.send(resultArr);
        });
        dbConnection_1.connection.end();
        return;
    }
    const yyyymm = req.params.yyyymm.split("-");
    const middleSql = " where date_format(content_date, '%Y') = ? and date_format(content_date, '%m') = ?";
    dbConnection_1.connection.query(baseSql + middleSql + tailSql, [yyyymm[0], yyyymm[1]], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            const record = {
                classificationId: row["classification_id"],
                category: row["category"],
                mainType: row["main_type"],
                subType: row["sub_type"],
                amountSum: row["amount_sum"],
            };
            resultArr.push(record);
        });
        res.send(resultArr);
    });
    dbConnection_1.connection.end();
});
//# sourceMappingURL=api.js.map