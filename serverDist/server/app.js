"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const dbConnection_1 = require("./dbConnection");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const PORT = 5500;
dbConnection_1.connection.connect();
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.static("dist"));
exports.app.use(express_1.default.json());
exports.app.get("/report", (req, res) => res.sendFile(path_1.default.join(__dirname, "../../dist", req.path + ".html")));
exports.app.get("/api/contentDetail/:contentId", (req, res) => {
    if (!req.params.contentId) {
        res.sendStatus(400);
        return;
    }
    try {
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
    }
    catch (err) {
        res.sendStatus(500);
    }
});
exports.app.get("/api/accountBook/:yyyymm?", (req, res) => {
    const baseSql = "select ct.content_id, ct.classification_id, ct.memo, ct.amount, DATE_FORMAT(ct.content_date, '%Y-%m-%d %H:%i:%s') as content_date, cf.category, cf.main_type, cf.sub_type from content ct join classification cf on ct.classification_id = cf.classification_id ";
    const orderSql = " order by content_date desc";
    try {
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
            return;
        }
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
        });
    }
    catch (err) {
        res.sendStatus(500);
    }
});
exports.app.post("/api/accountBook", (req, res) => {
    var _a;
    if (!((_a = req.body) === null || _a === void 0 ? void 0 : _a.content)) {
        res.sendStatus(400);
        return;
    }
    try {
        const content = req.body.content;
        dbConnection_1.connection.query("insert into content values (?, ?, ?, ?, ?)", [content.contentId, content.classificationId, content.contentDate, content.memo, content.amount], (err, rows) => {
            if (err) {
                throw err;
            }
            res.sendStatus(200);
        });
    }
    catch (err) {
        res.sendStatus(500);
    }
});
exports.app.put("/api/accountBook/:contentId", (req, res) => {
    var _a;
    if (!req.params.contentId || !((_a = req.body) === null || _a === void 0 ? void 0 : _a.content)) {
        res.sendStatus(400);
        return;
    }
    try {
        const content = req.body.content;
        dbConnection_1.connection.query("update content set classification_id = ?, content_date = ?, memo = ?, amount = ? where content_id = ?", [content.classificationId, content.contentDate, content.memo, content.amount, req.params.contentId], (err, rows) => {
            if (err) {
                throw err;
            }
            res.sendStatus(200);
        });
    }
    catch (err) {
        res.sendStatus(500);
    }
});
exports.app.delete("/api/accountBook/:contentId", (req, res) => {
    if (!req.params.contentId) {
        res.sendStatus(400);
        return;
    }
    try {
        const contentId = req.params.contentId;
        dbConnection_1.connection.query("delete from content where content_id = ?", [contentId], (err, rows) => {
            if (err) {
                throw err;
            }
            res.sendStatus(200);
        });
    }
    catch (err) {
        res.sendStatus(500);
    }
});
exports.app.get("/api/classification", (req, res) => {
    try {
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
    }
    catch (err) {
        res.sendStatus(500);
    }
});
exports.app.get("/api/report/:yyyymm?", (req, res) => {
    try {
        const baseSql = "select select ct.content_id, ct.classification_id, ct.memo, ct.amount, DATE_FORMAT(ct.content_date, '%Y-%m-%d %H:%i:%s') as content_date, amount_sum from classification c left join (select cf.*, sum(amount) as amount_sum from classification cf join content c on cf.classification_id = c.classification_id ";
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
    }
    catch (err) {
        res.sendStatus(500);
    }
});
exports.app.listen(PORT, () => {
    console.log("listening on " + PORT);
});
//# sourceMappingURL=app.js.map