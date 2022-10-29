import "../../css/index.css";
import { ContentDetail } from "../util/interface";
import { getContentById, loadContents } from "../util/store";
import { btnPrevious, btnNext, dateEl, btnCurrent } from "../util/common";
import { openModal } from "./modal";

const btnTotal = document.getElementById("total") as HTMLDivElement;
const btnIncome = document.getElementById("income") as HTMLDivElement;
const btnExpenditure = document.getElementById("expenditure") as HTMLDivElement;

const contentEl = document.querySelector(".content") as HTMLDivElement;

const cntTotal = document.getElementById("cntTotal") as HTMLDivElement;
const cntIncome = document.getElementById("cntIncome") as HTMLDivElement;
const cntExpenditure = document.getElementById("cntExpenditure") as HTMLDivElement;

const sumTotal = document.getElementById("sumTotal") as HTMLSpanElement;
const sumIncome = document.getElementById("sumIncome") as HTMLSpanElement;
const sumExpenditure = document.getElementById("sumExpenditure") as HTMLSpanElement;

const btnCreate = document.getElementById("btnCreate") as HTMLButtonElement;

let allContents: ContentDetail[];
let incomeContents: ContentDetail[];
let expenditureContents: ContentDetail[];

let date: string = "";

window.addEventListener('DOMContentLoaded', async () => {
    btnTotal.style.borderBottom = "3px solid rgb(227,108,103)";

    date = dateEl.textContent ?? "";

    allContents = await loadContents(date);
    incomeContents = allContents.filter(content => content.category === "I");
    expenditureContents = allContents.filter(content => content.category === "O");

    summarizeContents();
    createEliments(allContents);

    btnPrevious.addEventListener("click", async() => {
        initSummaryStyle();
    
        date = dateEl.textContent ?? "";
    
        allContents = await loadContents(date);
        incomeContents = allContents.filter(content => content.category === "I");
        expenditureContents = allContents.filter(content => content.category === "O");
    
        summarizeContents();
        createEliments(allContents);
    });
    
    btnNext.addEventListener("click", async() => {
        initSummaryStyle();
    
        date = dateEl.textContent ?? "";
    
        allContents = await loadContents(date);
        incomeContents = allContents.filter(content => content.category === "I");
        expenditureContents = allContents.filter(content => content.category === "O");
    
        summarizeContents();
        createEliments(allContents);
    });
    
    btnCurrent.addEventListener("click", async() => { 
        initSummaryStyle();
        
        date = getDate();
        dateEl.textContent = date;
    
        allContents = await loadContents(date);
        incomeContents = allContents.filter(content => content.category === "I");
        expenditureContents = allContents.filter(content => content.category === "O");
    
        summarizeContents();
        createEliments(allContents);
    });
});

function initSummaryStyle() {
    btnIncome.style.removeProperty("border-bottom");
    btnExpenditure.style.removeProperty("border-bottom");
    btnTotal.style.borderBottom = "3px solid rgb(227,108,103)";
}

function getDate(): string {
    const date = new Date();
    const year: number = date.getFullYear();
    const month: string = ('0' + (date.getMonth() + 1)).slice(-2);
    return year + '-' + month;
}

function summarizeContents() {
    cntTotal.textContent = allContents.length + "";
    cntIncome.textContent = incomeContents.length + "";
    cntExpenditure.textContent = expenditureContents.length + "";

    let [sumTo, sumIn, sumEx] = [0, 0, 0];
    allContents.forEach((content) => {
        if (content.category === "I") {
            sumIn += content.amount;
        } else {
            sumEx += content.amount;
        }
    })
    sumTo = sumIn - sumEx;

    sumTotal.textContent = changeNotation(sumTo) + "원";
    sumIncome.textContent = changeNotation(sumIn) + "원";
    sumExpenditure.textContent = changeNotation(sumEx) + "원";
}

function createEliments(contents: ContentDetail[]) {
    document.querySelectorAll(".content_history").forEach(el => {
        if (!el.classList.contains("li_title")) { el.remove(); }
    });

    contents.forEach(content => {
        createListEl(content);
    });
}

function createListEl(content: ContentDetail) {
    const divEl = document.createElement("div") as HTMLDivElement;
    divEl.className = "content_history";
    divEl.classList.add("li_content");
    divEl.setAttribute('data-id', content.contentId);

    const dateEl = document.createElement("div") as HTMLDivElement;
    dateEl.className = "list"
    dateEl.textContent = content.contentDate.slice(0, -3);
    divEl.append(dateEl)

    const categoryEl = document.createElement("div") as HTMLDivElement;
    categoryEl.className = "list"
    categoryEl.textContent = content.subType;
    divEl.append(categoryEl)

    const memoEl = document.createElement("div") as HTMLDivElement;
    memoEl.className = "list"
    memoEl.textContent = content.memo;
    divEl.append(memoEl);

    const amountEl = document.createElement("div") as HTMLDivElement;
    amountEl.className = "list"
    amountEl.textContent = changeNotation(content.amount) + "원";
    if (content.category === "O") {
        amountEl.style.color = "rgb(217, 37, 73)"
    } else if (content.category === "I") {
        amountEl.style.color = "rgb(88, 138, 214)"
    }
    divEl.append(amountEl);
    
    divEl.addEventListener("click", async() => {
        let content: ContentDetail;
        if (divEl.dataset.id) {
            content = await getContentById(divEl.dataset.id);
            openModal(content);
        }
    })

    contentEl.append(divEl);
}

btnTotal.addEventListener("click", () => {
    createEliments(allContents);
    btnIncome.style.removeProperty("border-bottom");
    btnExpenditure.style.removeProperty("border-bottom");
    btnTotal.style.borderBottom = "3px solid rgb(227,108,103)";
});

btnIncome.addEventListener("click", () => {
    createEliments(incomeContents);
    btnTotal.style.removeProperty("border-bottom");
    btnExpenditure.style.removeProperty("border-bottom");
    btnIncome.style.borderBottom = "3px solid rgb(227,108,103)";
});

btnExpenditure.addEventListener("click", () => {
    createEliments(expenditureContents);
    btnTotal.style.removeProperty("border-bottom");
    btnIncome.style.removeProperty("border-bottom");
    btnExpenditure.style.borderBottom = "3px solid rgb(227,108,103)";
});

function changeNotation(amount: Number) {
    return String(amount).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

btnCreate.addEventListener("click", () => openModal());