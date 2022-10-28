"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const apiRouter_1 = require("./apiRouter");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const PORT = 5500;
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.static("dist"));
exports.app.use(express_1.default.json());
exports.app.use("/api", apiRouter_1.router);
exports.app.get("/report", (req, res) => res.sendFile(path_1.default.join(__dirname, "../../dist", req.path + ".html")));
exports.app.listen(PORT, () => {
    console.log("listening on " + PORT);
});
//# sourceMappingURL=app.js.map