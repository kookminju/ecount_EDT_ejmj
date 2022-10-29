import { ContentDetail } from "../util/interface";
import { createEliments } from "./eliment";

export const btnTotal = document.getElementById("total") as HTMLDivElement;
export const btnIncome = document.getElementById("income") as HTMLDivElement;
export const btnExpenditure = document.getElementById("expenditure") as HTMLDivElement;

const cntTotal = document.getElementById("cntTotal") as HTMLDivElement;
const cntIncome = document.getElementById("cntIncome") as HTMLDivElement;
const cntExpenditure = document.getElementById("cntExpenditure") as HTMLDivElement;

const sumTotal = document.getElementById("sumTotal") as HTMLSpanElement;
const sumIncome = document.getElementById("sumIncome") as HTMLSpanElement;
const sumExpenditure = document.getElementById("sumExpenditure") as HTMLSpanElement;

export function summarizeContents(all: ContentDetail[], income: ContentDetail[], expenditure: ContentDetail[]) {
    cntTotal.textContent = all.length + "";
    cntIncome.textContent = income.length + "";
    cntExpenditure.textContent = expenditure.length + "";

    let [sumTo, sumIn, sumEx] = [0, 0, 0];
    all.forEach((content) => {
        if (content.category === "I") {
            sumIn += content.amount;
        } else {
            sumEx += content.amount;
        }
    })
    sumTo = sumIn - sumEx;

    sumTotal.textContent = sumTo.toLocaleString('ko-KR') + "원";
    sumIncome.textContent = sumIn.toLocaleString('ko-KR') + "원";
    sumExpenditure.textContent = sumEx.toLocaleString('ko-KR') + "원";

    btnTotal.addEventListener("click", () => {
        createEliments(all);
        btnIncome.style.removeProperty("border-bottom");
        btnExpenditure.style.removeProperty("border-bottom");
        btnTotal.style.borderBottom = "3px solid rgb(227,108,103)";
    });
    
    btnIncome.addEventListener("click", () => {
        createEliments(income);
        btnTotal.style.removeProperty("border-bottom");
        btnExpenditure.style.removeProperty("border-bottom");
        btnIncome.style.borderBottom = "3px solid rgb(227,108,103)";
    });
    
    btnExpenditure.addEventListener("click", () => {
        createEliments(expenditure);
        btnTotal.style.removeProperty("border-bottom");
        btnIncome.style.removeProperty("border-bottom");
        btnExpenditure.style.borderBottom = "3px solid rgb(227,108,103)";
    });
}

export function initSummaryStyle() {
    btnIncome.style.removeProperty("border-bottom");
    btnExpenditure.style.removeProperty("border-bottom");
    btnTotal.style.borderBottom = "3px solid rgb(227,108,103)";
}