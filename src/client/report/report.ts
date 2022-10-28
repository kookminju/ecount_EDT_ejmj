import "../../css/report.css";
import { btnNext, btnPrevious, dateEl, btnCurrent } from "../util/common";
import { Record } from "../util/interface";
import { renderReport } from "./reportRender";
import { getMonthlyRecords } from "../util/store";

document.addEventListener('DOMContentLoaded', () => {
    loadReport();
    btnPrevious.addEventListener("click", loadReport);
    btnNext.addEventListener("click", loadReport);
    btnCurrent.addEventListener("click", loadReport);
});

async function loadReport() {
    const date: string = dateEl.textContent ?? "";
    const records: Record[] = await getMonthlyRecords(date);
    renderReport(records);
}