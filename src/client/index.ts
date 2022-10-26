import "../css/index.css";
import mainIcon from "../img/mainIcon.png";
import { ContentDetail } from "./interface";
import { loadContents } from "./store";

const btnPrevious = document.getElementById("btnPrevious") as HTMLButtonElement;
const btnNext = document.getElementById("btnNext") as HTMLButtonElement;
const dateEl = document.getElementById("month") as HTMLDivElement;
const btnCurrent = document.getElementById("current_month") as HTMLButtonElement;

const btnTotal = document.getElementById("total");
const btnIncome = document.getElementById("income");
const btnExpenditure = document.getElementById("expenditure");
const btnTransfer = document.getElementById("transfer");

window.addEventListener('DOMContentLoaded', () => {
    const icon = document.getElementById("icon") as HTMLImageElement;
    icon.src = mainIcon;

    dateEl.textContent = getDate();

    initHistory(dateEl.textContent);
});

btnPrevious.addEventListener("click", () => {
    if (dateEl.textContent) {
        let [year, month]: string[] = dateEl.textContent.split('-');
        if (month === "1") {
            dateEl.textContent = (Number(year) - 1) + '-' + 12;
        } else {
            dateEl.textContent = year + '-' + (Number(month) - 1);
        }
    }
    initHistory(dateEl.textContent);
});

btnNext.addEventListener("click", () => {
    if (dateEl.textContent) {
        let [year, month]: string[] = dateEl.textContent.split('-');
        if (month === "12") {
            dateEl.textContent = (Number(year) + 1) + '-' + 1;
        } else {
            dateEl.textContent = year + '-' + (Number(month) + 1);
        }
    }
    initHistory(dateEl.textContent);
});

btnCurrent.addEventListener("click", () => { 
    dateEl.textContent = getDate();
    initHistory(dateEl.textContent);
});

function getDate(): string {
    const date = new Date();
    const year: number = date.getFullYear();
    const month: string = ('0' + (date.getMonth() + 1)).slice(-2);
    return year + '-' + month;
}

// init 내역
function initHistory(date: string | null) {
    if (date) {
        const contents: Promise<ContentDetail[]> = loadContents(date);
        // contents.forEach(content => {
            
        // });
        
        // <div class="content_history">
        //     <div class="list">날짜</div>
        //     <div class="list">분류</div>
        //     <div class="list">내용</div>
        //     <div class="list">금액</div>
        // </div>
    }
}

// 조회 버튼 클릭시
// btnTotal?.addEventListener("click", () => {
//     inquiryHistory(btnTotal);
// })

// btnIncome?.addEventListener("click", () => {
//     inquiryHistory(btnIncome);
// })

// btnExpenditure?.addEventListener("click", () => {
//     inquiryHistory(btnExpenditure);
// })

// btnTransfer?.addEventListener("click", () => {
//     inquiryHistory(btnTransfer);
// })

// function inquiryHistory(btnInquiry: HTMLElement) {
//     btnInquiry.style.borderBottom = "3px solid rgb(227,108,103)";

//     // 내역 조회

// }


// 모달
const btnCreate = document.getElementById("btnCreate") as HTMLButtonElement;
btnCreate.addEventListener("click", (e: Event) => {
    openModal();
})

function openModal() {
    const modal = document.querySelector(".modal");
    modal?.classList.remove("hidden");
}