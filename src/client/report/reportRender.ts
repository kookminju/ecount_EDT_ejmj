import { Record } from "../util/interface";

export function renderReport(records: Record[]) {
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
    renderTable(inTypeTableEl, inTypeArr);
}

function renderTable(targetTbl: HTMLTableElement, records: Record[]) {
    let totalAmount: number = 0;
    records.forEach(record => totalAmount += record.amountSum);
    const totalAmountEl = targetTbl.querySelector("thead .col-amount") as HTMLTableCellElement;
    totalAmountEl.textContent = totalAmount.toLocaleString();

    const tbodyEl = targetTbl.querySelector("tbody") as HTMLTableSectionElement;
    tbodyEl.innerHTML = "";
    let comparisonType: string = "";
    records.forEach((record) => {
        if(comparisonType != record.mainType) {
            comparisonType = record.mainType;
            const mainTypeEl = createMainTypeEl(comparisonType);
            tbodyEl?.append(mainTypeEl);
        }

        const trEl = document.createElement("tr");
        trEl.className = "sub-type-record";

        const titleEl = document.createElement("td");
        titleEl.className = "col-title";
        titleEl.textContent = record.subType;

        const amountEl = document.createElement("td");
        amountEl.className = "col-amount";
        const percentEl = document.createElement("td");
        percentEl.className = "col-percent";

        if(record.amountSum) {
            const subSummaryEl = document.querySelector(`[data-main-type='${record.mainType}']`);
            const subSumAmountEl = subSummaryEl?.querySelector(".col-amount") as HTMLTableCellElement;

            const orgSumAmount = getAmountNumber(subSumAmountEl.textContent ?? "0");
            subSumAmountEl.textContent = (orgSumAmount + record.amountSum).toLocaleString("ko-KR");
            amountEl.textContent = record.amountSum.toLocaleString("ko-KR");

            if(totalAmount > 0) {
                percentEl.textContent = Math.round((record.amountSum)/totalAmount * 100).toString() + "%";
                
                const subPercentEl = subSummaryEl?.querySelector(".col-percent") as HTMLTableCellElement;
                subPercentEl.textContent = Math.round(getAmountNumber(subSumAmountEl.textContent)/totalAmount * 100).toString() + "%";
            }
        } else {
            amountEl.textContent = "0";
            percentEl.textContent = "0%";
        }

        trEl.append(titleEl, amountEl, percentEl);
        tbodyEl?.append(trEl);
    })

    totalAmount
}

function createMainTypeEl(mainType: string): HTMLTableRowElement {
    const trEl = document.createElement("tr");
    trEl.className = "main-type-record";
    trEl.dataset.mainType = mainType;

    const titleEl = document.createElement("td");
    titleEl.className = "col-title";
    titleEl.textContent = mainType;
    const amountEl = document.createElement("td");
    amountEl.className = "col-amount";
    amountEl.textContent = "0";
    const percentEl = document.createElement("td");
    percentEl.className = "col-percent";
    percentEl.textContent = "0%";

    trEl.append(titleEl, amountEl, percentEl);
    return trEl;
}

function getAmountNumber(localeString: string): number {
    return Number(localeString.replace(/,/g, ""));
}