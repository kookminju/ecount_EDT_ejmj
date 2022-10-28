import { Record } from "../util/interface";

export function renderReport(records: Record[]) {
    const outTypeTableEl = document.querySelector("#money-out-tbl") as HTMLTableElement;
    const inTypeTableEl = document.querySelector("#money-in-tbl") as HTMLTableElement;

    const mainSummary: TotalSummary = getTotalSummary(records);
    renderTotalSummary(mainSummary, outTypeTableEl, inTypeTableEl);

    let outTypeArr: Record[] = [];
    let inTypeArr: Record[] = [];
    for(let record of records) {
        if(record.category === "O") {
            outTypeArr.push(record);
        } else {
            inTypeArr.push(record);
        }
    }
    renderTableBody(outTypeTableEl, outTypeArr, mainSummary.outputAmount);
    renderTableBody(inTypeTableEl, inTypeArr, mainSummary.inputAmount);
}

interface TotalSummary {
    inputAmount: number;
    outputAmount: number;
    total: number;
}

function getTotalSummary(records: Record[]): TotalSummary {
    let inputAmount: number = 0;
    let outputAmount: number = 0;

    for(let record of records) {
        if(record.category === "O") {
            outputAmount += record.amountSum;
        } else {
            inputAmount += record.amountSum;
        }
    }

    return { inputAmount, outputAmount, total: (inputAmount - outputAmount) }
}

function getMidSummarys(records: Record[]) {
    const mainTypeMap: Map<string, number> = new Map<string, number>();
    for(let record of records) {
        const orgAmount = mainTypeMap.get(record.mainType) ?? 0;
        mainTypeMap.set(record.mainType, orgAmount + record.amountSum);
    }
    return mainTypeMap;
}

function renderTotalSummary(mainSummary: TotalSummary, outTypeTableEl: HTMLTableElement, inTypeTableEl: HTMLTableElement) {
    const balanceEl = document.querySelector("#monthly-balance") as HTMLParagraphElement
    balanceEl.textContent = mainSummary.total.toLocaleString("ko-KR");
    function renderTableTop(targetTbl: HTMLTableElement, totalAmount: number) {
        const totalAmountEl = targetTbl.querySelector("thead .col-amount") as HTMLTableCellElement;
        totalAmountEl.textContent = totalAmount.toLocaleString();
    }

    renderTableTop(outTypeTableEl, mainSummary.outputAmount);
    renderTableTop(inTypeTableEl, mainSummary.inputAmount);
}

function renderTableBody(targetTbl: HTMLTableElement, records: Record[], compareAmount: number) {
    const tbodyEl = targetTbl.querySelector("tbody") as HTMLTableSectionElement;
    tbodyEl.innerHTML = "";

    renderMidSummary(records, tbodyEl, compareAmount);

    for(let record of records) {
        const parentCategoryEl = document.querySelector(`[data-main-type='${record.mainType}'`);
        const trEl = createTrEl(record.subType, record.amountSum, compareAmount);
        trEl.className = "sub-type-record";
        parentCategoryEl?.insertAdjacentElement('afterend', trEl);
    }
}

function renderMidSummary(records: Record[], tbodyEl: HTMLTableSectionElement, compareAmount: number) {
    const mainTypeSummary: Map<string, number> = getMidSummarys(records);
    for(let entry of mainTypeSummary) {
        const trEl = createTrEl(entry[0], entry[1], compareAmount);
        trEl.className = "main-type-record";
        trEl.dataset.mainType = entry[0];
        tbodyEl.append(trEl);
    }
}

function createTrEl(typeName: string, amount: number, compareAmount: number): HTMLTableRowElement {
    const trEl = document.createElement("tr");

    const titleEl = document.createElement("td");
    titleEl.className = "col-title";
    titleEl.textContent = typeName;
    const amountEl = document.createElement("td");
    amountEl.className = "col-amount";
    amountEl.textContent = amount ? amount.toLocaleString("ko-KR") : "0";
    const percentEl = document.createElement("td");
    percentEl.className = "col-percent";
    if(compareAmount > 0) {
        percentEl.textContent = Math.round(amount/compareAmount * 100).toString() + "%";
    } else {
        percentEl.textContent = "0%";
    }

    trEl.append(titleEl, amountEl, percentEl);
    return trEl;
}