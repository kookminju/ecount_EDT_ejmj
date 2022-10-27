import "../css/index.css";
import mainIcon from "../img/mainIcon.png";
import { ContentDetail } from "./interface";
import { loadContents } from "./store";

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

window.addEventListener('DOMContentLoaded', () => {
    const icon = document.getElementById("icon") as HTMLImageElement;
    icon.src = mainIcon;

    dateEl.textContent = getDate();

    initHistory(dateEl.textContent, "A");
});

btnPrevious.addEventListener("click", () => {
    if (dateEl.textContent) {
        let [year, month]: string[] = dateEl.textContent.split('-');
        if (month === "01") {
            dateEl.textContent = (Number(year) - 1) + '-' + 12;
        } else {
            dateEl.textContent = year + '-' + ('0' + (Number(month) - 1)).slice(-2);
        }
        initHistory(dateEl.textContent, "A");
    }
});

btnNext.addEventListener("click", () => {
    if (dateEl.textContent) {
        let [year, month]: string[] = dateEl.textContent.split('-');
        if (month === "12") {
            dateEl.textContent = (Number(year) + 1) + '-01';
        } else {
            dateEl.textContent = year + '-' + ('0' + (Number(month) + 1)).slice(-2);
        }
        initHistory(dateEl.textContent, "A");
    }
});

btnCurrent.addEventListener("click", () => { 
    dateEl.textContent = getDate();
    initHistory(dateEl.textContent, "A");
});

function getDate(): string {
    const date = new Date();
    const year: number = date.getFullYear();
    const month: string = ('0' + (date.getMonth() + 1)).slice(-2);
    return year + '-' + month;
}

// init 내역
async function initHistory(date: string, category: string) {
    // if btnTotal 누르면 contents에 모든 contents를 포함
    let contents: ContentDetail[];
    if (category === "A"){
        contents = await getHistory(date);
        initSummaryStyle();
    } else if (category === "I") {  // 수입만 뽑아서 contents에
        contents = await (await getHistory(date)).filter(content => content.category === "I")
    } else {  // 지출만 뽑아서 contents에
        contents = await (await getHistory(date)).filter(content => content.category === "O")
    }

    document.querySelectorAll(".content_history").forEach(el => {
        if (!el.classList.contains("li_title")) { el.remove(); }
    });

    contents.forEach(content => {
        createListEl(content);
    });
}

// 초기화면이거나 month 이동시 summary style reset
function initSummaryStyle() {
    btnIncome.style.removeProperty("border-bottom");
    btnExpenditure.style.removeProperty("border-bottom");
    btnTotal.style.borderBottom = "3px solid rgb(227,108,103)";
}

function summarizeContents() {
}

async function getHistory(date: string) {
    const contents: ContentDetail[] = await loadContents(date);
    return contents;
}

function createListEl(content: ContentDetail) {
    const divEl = document.createElement("div") as HTMLDivElement;
    divEl.className = "content_history";

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
    
    // divEl에 클릭메소드 걸기
    // 클릭메소드 내부에서 divEl.setAttribute('data-content-id', content.contentId);

    contentEl.append(divEl);
}

function changeNotation(amount: Number) {
    return String(amount).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

// 조회 버튼 클릭시
btnTotal.addEventListener("click", () => {
    if (dateEl.textContent) {
        initHistory(dateEl.textContent, "A");
        btnIncome.style.removeProperty("border-bottom");
        btnExpenditure.style.removeProperty("border-bottom");
        btnTotal.style.borderBottom = "3px solid rgb(227,108,103)";
    }
})

btnIncome.addEventListener("click", () => {
    if (dateEl.textContent) {
        initHistory(dateEl.textContent, "I");
        btnTotal.style.removeProperty("border-bottom");
        btnExpenditure.style.removeProperty("border-bottom");
        btnIncome.style.borderBottom = "3px solid rgb(227,108,103)";
    }
})

btnExpenditure.addEventListener("click", () => {
    if (dateEl.textContent) {
        initHistory(dateEl.textContent, "O");
        btnTotal.style.removeProperty("border-bottom");
        btnIncome.style.removeProperty("border-bottom");
        btnExpenditure.style.borderBottom = "3px solid rgb(227,108,103)";
    }
})

// 모달
const btnCreate = document.getElementById("btnCreate") as HTMLButtonElement;
btnCreate.addEventListener("click", (e: Event) => {
    openModal();
})

function openModal() {
    const modal = document.querySelector(".modal");
    modal?.classList.remove("hidden");
}