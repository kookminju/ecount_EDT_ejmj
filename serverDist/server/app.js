"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mysql_1 = __importDefault(require("mysql"));
const PORT = 5500;
const connection = mysql_1.default.createConnection({
    host: "localhost",
    user: "local",
    password: "1q2w3e4r5t",
    database: "accountbook_ejmj",
});
connection.connect(); // 언제 해제하지
const app = (0, express_1.default)();
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
app.get("/api/accountBook/:yyyymm", (req, res) => {
    // 현재 월에 해당하는 가계부내역 조회
    if (!req.params.yyyymm) {
        // 기본 가계부 조회
        // select * from Content where date_format(content_date, '%m') == month(now()); // 맞는지 실행해봐야할듯?
        connection.query("select * from content", (err, rows) => {
            if (err) {
                throw err;
            }
            res.send(rows);
        });
        return;
    }
    // yyyy년 mm월에 해당하는 가계부내역 조회
    connection.query("select * from content" /* 쿼리 입력하기 */, (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(rows);
    });
});
app.post("/api/accountBook/", (req, res) => {
    var _a;
    if (!((_a = req.body) === null || _a === void 0 ? void 0 : _a.content)) {
        res.sendStatus(400);
        return;
    }
    const content = req.body.content;
    connection.query("insert todo content values (?, ?, ?, ?, ?)", [content.contentId, content.classificationId, content.contentDate, content.memo, content.amount], (err, rows) => {
        if (err) {
            throw err;
        }
        res.sendStatus(200);
    });
});
app.put("/api/accountBook/:contentId", (req, res) => {
    // 가계부에 내역 수정
});
app.delete("/api/accountBook/:contentId", (req, res) => {
    if (!req.params.contentId) {
        res.sendStatus(400);
        return;
    }
});
app.listen(PORT, () => {
    console.log("listening on " + PORT);
});
