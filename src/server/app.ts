import { router as apiRouter } from "./apiRouter";
import express from "express";
import path from "path";

const PORT:number = 5500;

export const app = express();
app.use(express.static("dist"));
app.use(express.json());

// api 관련 코드 분리
app.use("/api", apiRouter);

app.get("/report", (req, res) => res.sendFile(path.join(__dirname, "../../dist", req.path + ".html")));

app.listen(PORT, () => {
    console.log("listening on " + PORT);
});