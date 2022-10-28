// common.ts랑 합치고 중복 코드 리팩토링하기 (webpack.config.js)

import "../css/index.css";
import mainIcon from "../img/mainIcon.png";
import { Classification, Content, ContentDetail } from "./interface";
import { addAccountBookContent, getContentById, loadAllClassifications, loadClassificationsByCategory, loadContents, modifyAccountBookContent, removeAccountBookContent } from "./store";
import { btnPrevious, btnNext, dateEl, btnCurrent } from "./common";

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
        let content: ContentDetail;
        if (divEl.dataset.id) {
            content = await getContentById(divEl.dataset.id);

            openModal(content);
            initModalButton(content);

            mdIncome.addEventListener("click", () => {
                content.category = "I";
                setSelectOption("I");

                mdIncome.style.border = "1px solid rgb(227,108,103)";
                mdIncome.style.color = "rgb(227,108,103)";
                mdExpenditure.style.removeProperty("border");
                mdExpenditure.style.removeProperty("color");
            })

            mdExpenditure.addEventListener("click", () => {
                content.category = "O";
                setSelectOption("O");

                mdExpenditure.style.border = "1px solid rgb(227,108,103)";
                mdExpenditure.style.color = "rgb(227,108,103)";
                mdIncome.style.removeProperty("border");
                mdIncome.style.removeProperty("color");
            })

            if (content.category == "I") {
                mdIncome.style.border = "1px solid rgb(227,108,103)";
                mdIncome.style.color = "rgb(227,108,103)";
                mdExpenditure.style.removeProperty("border");
                mdExpenditure.style.removeProperty("color");
            } else {
                mdExpenditure.style.border = "1px solid rgb(227,108,103)";
                mdExpenditure.style.color = "rgb(227,108,103)";
                mdIncome.style.removeProperty("border");
                mdIncome.style.removeProperty("color");
            }

            const contentDate = content.contentDate.split(" ");
            inputDate.value = contentDate[0];
            inputTime.value = contentDate[1];

            selectbox.value = content.classificationId + "";

            inputAmount.value = content.amount + "";

            inputMemo.value = content.memo;

            // put content
            btnSave.onclick = () => {
                // value로 새로 변경할 content를 채우자
                const newContent: Content = {
                    contentId: content.contentId,
                    classificationId: +selectbox.value,
                    contentDate: inputDate.value + " " + inputTime.value,
                    memo: inputMemo.value,
                    amount: +inputAmount.value,
                };
                modifyAccountBookContent(newContent);
                modal.classList.add("hidden");
                refreshContents(date);
            }

            btnDelete.onclick = () => {
                alert("삭제할게요 ~!");
                // 현재 content 삭제
                removeAccountBookContent(content.contentId);
                modal.classList.add("hidden");
                refreshContents(date);
            }
        }
    })

    contentEl.append(divEl);
}

async function refreshContents(date: string) {
    btnTotal.style.borderBottom = "3px solid rgb(227,108,103)";

    allContents = await loadContents(date);
    incomeContents = allContents.filter(content => content.category === "I");
    expenditureContents = allContents.filter(content => content.category === "O");

    summarizeContents();
    createEliments(allContents);
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

    // post content
    btnSave.onclick = () => {
        if (!selectbox.value || !inputDate.value || !inputTime.value || !inputMemo.value || !inputAmount.value) {
            alert("input값을 모두 채워주세요 !")
            return;
        }
        const newContent: Content = {
            contentId: crypto.randomUUID(),
            classificationId: +selectbox.value,
            contentDate: inputDate.value + " " +inputTime.value + ":00",
            memo: inputMemo.value,
            amount: +inputAmount.value,
        };
        addAccountBookContent(newContent);
        modal.classList.add("hidden");
        refreshContents(date);
    }

    btnDelete.onclick = () => {
        alert("삭제할 항목을 클릭해주세요");
    }
})

function openModal(content?: ContentDetail) {
    if (content) {
        setSelectOption(content.category);
    } else {
        setSelectOption();
    }
    
    resetModal();
    modal.classList.remove("hidden");
}

async function resetModal() {
    mdIncome.setAttribute("data-category", "I");

    mdIncome.style.border = "1px solid rgb(227,108,103)";
    mdIncome.style.color = "rgb(227,108,103)";
    mdExpenditure.style.removeProperty("border");
    mdExpenditure.style.removeProperty("color");
    inputDate.value = "";
    inputTime.value = "";
    selectbox.value = "none";
    inputAmount.value = "";
    inputMemo.value = "";
}

// 모달 열때 (+버튼, 각 divEl 버튼 클릭 시)
async function setSelectOption(category?: string) {
    document.querySelectorAll(".option").forEach(el => {
        if (!el.classList.contains("option_title")) { el.remove(); }
    });
    if (category) {
        const options = await loadClassificationsByCategory(category);
        options.forEach((option) => {
            const optionEl = document.createElement("option") as HTMLOptionElement;
            optionEl.classList.add("option");
            optionEl.text = option.subType;
            optionEl.value = option.classificationId + "";
            selectbox.append(optionEl);
        })
    } else {
        const options = await loadClassificationsByCategory("I");
        options.forEach((option) => {
            const optionEl = document.createElement("option") as HTMLOptionElement;
            optionEl.classList.add("option");
            optionEl.text = option.subType;
            optionEl.value = option.classificationId + "";
            selectbox.append(optionEl);
        })
    }
}

// 두동작이 
function initModalButton(content: ContentDetail) {
    mdIncome.addEventListener("click", () => {
        setSelectOption("I");
        mdIncome.style.border = "1px solid rgb(227,108,103)";
        mdIncome.style.color = "rgb(227,108,103)";
        mdExpenditure.style.removeProperty("border");
        mdExpenditure.style.removeProperty("color");
        mdIncome.setAttribute("data-category", "I");
    });

    mdExpenditure.addEventListener("click", () => {
        setSelectOption("E");
        mdExpenditure.style.border = "1px solid rgb(227,108,103)";
        mdExpenditure.style.color = "rgb(227,108,103)";
        mdIncome.style.removeProperty("border");
        mdIncome.style.removeProperty("color");
        mdIncome.setAttribute("data-category", "O");
    });

    btnCancel.addEventListener("click", () => {
        modal.classList.add("hidden");
    });
}