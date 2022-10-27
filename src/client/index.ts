// common.ts랑 합치고 중복 코드 리팩토링하기 (webpack.config.js)

import "../css/index.css";
import mainIcon from "../img/mainIcon.png";
import { ContentDetail } from "./interface";
import { getContentById, loadAllClassifications, loadContents } from "./store";

const btnPrevious = document.getElementById("btnPrevious") as HTMLButtonElement;
const btnNext = document.getElementById("btnNext") as HTMLButtonElement;
const dateEl = document.getElementById("month") as HTMLDivElement;
const btnCurrent = document.getElementById("current_month") as HTMLButtonElement;

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

const modal = document.querySelector(".modal") as HTMLDivElement;
const mdIncome = document.getElementById("md_income") as HTMLButtonElement;
const mdExpenditure = document.getElementById("md_expenditure") as HTMLButtonElement;
const inputDate = document.getElementById("inputDate") as HTMLInputElement;
const inputTime = document.getElementById("inputTime") as HTMLInputElement;
const selectbox = document.getElementById("category") as HTMLSelectElement;
const inputAmount = document.getElementById("inputAmount") as HTMLInputElement;
const inputMemo = document.getElementById("inputMemo") as HTMLInputElement;


let allContents: ContentDetail[];
let incomeContents: ContentDetail[];
let expenditureContents: ContentDetail[];

let date: string = "";

window.addEventListener('DOMContentLoaded', async () => {
    const icon = document.getElementById("icon") as HTMLImageElement;
    icon.src = mainIcon;
    btnTotal.style.borderBottom = "3px solid rgb(227,108,103)";

    dateEl.textContent = getDate();
    date = dateEl.textContent;

    allContents = await loadContents(date);
    incomeContents = allContents.filter(content => content.category === "I");
    expenditureContents = allContents.filter(content => content.category === "O");

    summarizeContents();
    createEliments(allContents);
});


btnPrevious.addEventListener("click", async() => {
    btnIncome.style.removeProperty("border-bottom");
    btnExpenditure.style.removeProperty("border-bottom");
    btnTotal.style.borderBottom = "3px solid rgb(227,108,103)";

    let [year, month]: string[] = date.split('-');
    if (month === "01") {
        date = (Number(year) - 1) + '-12';
    } else {
        date = year + '-' + ('0' + (Number(month) - 1)).slice(-2);
    }
    dateEl.textContent = date;

    allContents = await loadContents(date);
    incomeContents = allContents.filter(content => content.category === "I");
    expenditureContents = allContents.filter(content => content.category === "O");

    summarizeContents();
    createEliments(allContents);
});

btnNext.addEventListener("click", async() => {
    btnIncome.style.removeProperty("border-bottom");
    btnExpenditure.style.removeProperty("border-bottom");
    btnTotal.style.borderBottom = "3px solid rgb(227,108,103)";

    let [year, month]: string[] = date.split('-');
    if (month === "12") {
        date = (Number(year) + 1) + '-01';
    } else {
        date = year + '-' + ('0' + (Number(month) + 1)).slice(-2);
    }
    dateEl.textContent = date;

    allContents = await loadContents(date);
    incomeContents = allContents.filter(content => content.category === "I");
    expenditureContents = allContents.filter(content => content.category === "O");

    summarizeContents();
    createEliments(allContents);
});

btnCurrent.addEventListener("click", async() => { 
    date = getDate();
    dateEl.textContent = date;

    allContents = await loadContents(date);
    incomeContents = allContents.filter(content => content.category === "I");
    expenditureContents = allContents.filter(content => content.category === "O");

    summarizeContents();
    createEliments(allContents);
});

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
    divEl.setAttribute('data-id', content.contentId);

    const dateEl = document.createElement("div") as HTMLDivElement;
    dateEl.className = "list"
    dateEl.textContent = content.contentDate;
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
        openModal();
        let content: ContentDetail;
        if (divEl.dataset.id) {
            content = await getContentById(divEl.dataset.id);

            if (content.category == "I") {
                mdIncome.style.border = "1px solid rgb(227,108,103)";
                mdIncome.style.color = "rgb(227,108,103)";
            } else {
                mdExpenditure.style.border = "1px solid rgb(227,108,103)";
                mdExpenditure.style.color = "rgb(227,108,103)";
            }

            const contentDate = content.contentDate.split(" ");
            inputDate.value = contentDate[0];
            inputTime.value = contentDate[1];

            const options = await loadAllClassifications();
            options.forEach((option) => {
                const optionEl = document.createElement("option") as HTMLOptionElement;
                optionEl.text = option.subType;
                optionEl.value = option.classificationId + "";
                selectbox.append(optionEl);
            })
            selectbox.value = content.classificationId + "";

            inputAmount.value = content.amount + "";

            inputMemo.value = content.memo;
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

// 모달
const btnCreate = document.getElementById("btnCreate") as HTMLButtonElement;
const btnSave = document.getElementById("btnSave") as HTMLButtonElement;
const btnDelete = document.getElementById("btnDelete") as HTMLButtonElement;
const btnCancel = document.getElementById("btnCancel") as HTMLButtonElement;

btnCreate.addEventListener("click", () => {
    openModal();
})

btnCancel.addEventListener("click", () => {
    modal.classList.add("hidden");

})

function openModal() {
    resetModal();
    modal.classList.remove("hidden");
}

function resetModal() {
    mdIncome.style.border = "1px solid rgb(227,108,103)";
    mdIncome.style.color = "rgb(227,108,103)";
    mdExpenditure.style.removeProperty("border");
    mdExpenditure.style.removeProperty("color");
    inputDate.value = "YYYY-MM";
    inputTime.value = "hh-mm-ss";
    selectbox.value = "none";
    inputAmount.value = "";
    inputMemo.value = "";
}