"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mysql_1 = __importDefault(require("mysql"));
const path_1 = __importDefault(require("path"));
const PORT = 5500;
const connection = mysql_1.default.createConnection({
    host: "localhost",
    user: "local",
    password: "1q2w3e4r5t",
    database: "accountbook_ejmj",
});
connection.connect(); // 언제 해제하지
const app = (0, express_1.default)();
app.use(express_1.default.static("dist"));
app.use(express_1.default.json());
app.get("/report", (req, res) => res.sendFile(path_1.default.join(__dirname, "../../dist", req.path + ".html")));
app.get("/api/contentDetail/:contentId", (req, res) => {
    if (!req.params.contentId) {
        res.sendStatus(400);
        return;
    }
    const contentId = req.params.contentId;
    const sql = "select ct.*, cf.category, cf.main_type, cf.sub_type from content ct join classification cf on ct.classification_id = cf.classification_id where content_id = ?";
    connection.query(sql, [contentId], (err, rows) => {
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
});
app.get("/api/accountBook/:yyyymm?", (req, res) => {
    const baseSql = "select ct.*, cf.category, cf.main_type, cf.sub_type from content ct join classification cf on ct.classification_id = cf.classification_id ";
    const orderSql = " order by content_date desc";
    let resultArr = [];
    if (!req.params.yyyymm) {
        const whereSql = " where date_format(content_date, '%m') = month(now())";
        connection.query(baseSql + whereSql + orderSql, (err, rows) => {
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
        return;
    }
    // yyyy년 mm월 가계부내역 조회
    const yyyymm = req.params.yyyymm.split("-");
    const whereSql = " where date_format(content_date, '%Y') = ? and date_format(content_date, '%m') = ?";
    connection.query(baseSql + whereSql + orderSql, [yyyymm[0], yyyymm[1]], (err, rows) => {
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
});
app.post("/api/accountBook", (req, res) => {
    var _a;
    if (!((_a = req.body) === null || _a === void 0 ? void 0 : _a.content)) {
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
    const content = req.body.content;
    connection.query("insert into content values (?, ?, ?, ?, ?)", [content.contentId, content.classificationId, content.contentDate, content.memo, content.amount], (err, rows) => {
        if (err) {
            throw err;
        }
        res.sendStatus(200);
    });
});
app.put("/api/accountBook/:contentId", (req, res) => {
    var _a;
    if (!req.params.contentId || !((_a = req.body) === null || _a === void 0 ? void 0 : _a.content)) {
        res.sendStatus(400);
        return;
    }
    const content = req.body.content;
    connection.query("update content set classification_id = ?, content_date = ?, memo = ?, amount = ? where content_id = ?", [content.classificationId, content.contentDate, content.memo, content.amount, req.params.contentId], (err, rows) => {
        if (err) {
            throw err;
        }
        res.sendStatus(200);
    });
});
app.delete("/api/accountBook/:contentId", (req, res) => {
    if (!req.params.contentId) {
        res.sendStatus(400);
        return;
    }
    const contentId = req.params.contentId;
    connection.query("delete from content where content_id = ?", [contentId], (err, rows) => {
        if (err) {
            throw err;
        }
        res.sendStatus(200);
    });
});
app.get("/api/classification", (req, res) => {
    connection.query("select * from classification order by category, main_type, sub_type", (err, rows) => {
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
});
app.get("/api/report/:yyyymm?", (req, res) => {
    const baseSql = "select c.*, amount_sum from classification c left join (select cf.*, sum(amount) as amount_sum from classification cf join content c on cf.classification_id = c.classification_id ";
    const tailSql = " group by cf.sub_type) summary_cf on c.classification_id = summary_cf.classification_id order by category, main_type, sub_type ";
    let resultArr = [];
    if (!req.params.yyyymm) {
        const middleSql = " where date_format(content_date, '%m') = month(now())";
        connection.query(baseSql + middleSql + tailSql, (err, rows) => {
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
        return;
    }
    const yyyymm = req.params.yyyymm.split("-");
    const middleSql = " where date_format(content_date, '%Y') = ? and date_format(content_date, '%m') = ?";
    connection.query(baseSql + middleSql + tailSql, (err, rows) => {
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
});
app.listen(PORT, () => {
    console.log("listening on " + PORT);
});
//# sourceMappingURL=app.js.map