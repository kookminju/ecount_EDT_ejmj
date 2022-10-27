import "../css/report.css";
import { Classification, ContentDetail, Record } from "./interface";
import { loadAllClassifications, loadContents, loadRecords } from "./store";

document.addEventListener('DOMContentLoaded', () => {
    initReport();
});

async function initReport() {
    const records: Record[] = await loadRecords();
    renderReport(records);
}

function renderReport(records: Record[]) {
    let outTypeArr: Record[] = [];
    let inTypeArr: Record[] = [];
    records.forEach((record) => {
        if(record.category === "O") {
            outTypeArr.push(record);
        } else {
            inTypeArr.push(record);
        }
    });

    const outTypeTableEl = document.querySelector("#money-out-tbl") as HTMLTableElement;
    const inTypeTableEl = document.querySelector("#money-in-tbl") as HTMLTableElement;

    renderTable(outTypeTableEl, outTypeArr);
    // renderTable(inTypeTableEl, inTypeArr);
}

function renderTable(targetTbl: HTMLTableElement, records: Record[]) {
    const theadEl = targetTbl.querySelector("thead");
    renderTopSummary();

    const tbodyEl = targetTbl.querySelector("tbody");
    records.forEach((record) => {
        console.log(record);
        
        const trEl = document.createElement("tr");
        trEl.className = "sub-type-record";
        const titleEl = document.createElement("td");
        titleEl.className = "col-title";
        titleEl.textContent = record.subType;
        const amountEl = document.createElement("td");
        amountEl.className = "col-amount";
        amountEl.textContent = record.amountSum ? record.amountSum.toString() : "0";

        trEl.append(titleEl, amountEl);
        tbodyEl?.append(trEl);
    })
    
}

function renderTopSummary() {}