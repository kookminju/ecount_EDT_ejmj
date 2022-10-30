import { dateEl } from "../util/common";
import { ContentDetail } from "../util/interface";
import { getMonthlyContents } from "../util/store";
import { createEliments } from "./eliment";

const btnTotal = document.getElementById("total") as HTMLDivElement;
const btnIncome = document.getElementById("income") as HTMLDivElement;
const btnExpenditure = document.getElementById("expenditure") as HTMLDivElement;
const cntTotal = document.getElementById("cntTotal") as HTMLDivElement;
const cntIncome = document.getElementById("cntIncome") as HTMLDivElement;
const cntExpenditure = document.getElementById("cntExpenditure") as HTMLDivElement;
const sumTotal = document.getElementById("sumTotal") as HTMLSpanElement;
const sumIncome = document.getElementById("sumIncome") as HTMLSpanElement;
const sumExpenditure = document.getElementById("sumExpenditure") as HTMLSpanElement;

let allContents: ContentDetail[];
let incomeContents: ContentDetail[];
let expenditureContents: ContentDetail[];

let date: string = "";

export function summarizeContents(all: ContentDetail[], income: ContentDetail[], expenditure: ContentDetail[]) {
    initButtonEvent(all, income, expenditure);

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
}

function initButtonEvent(all: ContentDetail[], income: ContentDetail[], expenditure: ContentDetail[]) {
    btnTotal.addEventListener("click", () => {
        setButtonStyle(btnTotal);
        createEliments(all);
    });
    
    btnIncome.addEventListener("click", () => {
        setButtonStyle(btnIncome);
        createEliments(income);
    });
    
    btnExpenditure.addEventListener("click", () => {
        setButtonStyle(btnExpenditure);
        createEliments(expenditure);
    });
}

function setButtonStyle(btn: HTMLDivElement) {
    document.querySelectorAll(".category").forEach((el) => {
        const categoryEl = el as HTMLDivElement;
        if (categoryEl === btn) { categoryEl.style.borderBottom = "3px solid rgb(227,108,103)"; }
        else { categoryEl.style.removeProperty("border-bottom"); }
    })
}

export async function refreshContents() {
    setButtonStyle(btnTotal);

    date = dateEl.textContent ?? "";
    [ allContents, incomeContents, expenditureContents ] = await getMonthlyContents(date);

    summarizeContents(allContents, incomeContents, expenditureContents);
    createEliments(allContents);
}