"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const mysql_1 = __importDefault(require("mysql"));
exports.connection = mysql_1.default.createConnection({
    host: "localhost",
    user: "local",
    password: "1q2w3e4r5t",
    database: "accountbook_ejmj",
});
//# sourceMappingURL=dbConnection.js.map