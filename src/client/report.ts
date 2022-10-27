import "../css/report.css";
import { btnNext, btnPrevious, dateEl, btnCurrent } from "./common";
import { Record } from "./interface";
import { renderReport } from "./reportRender";
import { loadRecords } from "./store";

document.addEventListener('DOMContentLoaded', () => {
    loadReport();
    btnPrevious.addEventListener("click", loadReport);
    btnNext.addEventListener("click", loadReport);
    btnCurrent.addEventListener("click", loadReport);
});

async function loadReport() {
    const date: string = dateEl.textContent ?? "";
    const records: Record[] = await loadRecords(date);
    renderReport(records);
}