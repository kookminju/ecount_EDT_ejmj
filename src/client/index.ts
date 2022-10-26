import "../css/index.css";
import mainIcon from "../img/mainIcon.png";
import { ContentDetail } from "./interface";
import { loadContents } from "./store";

const btnPrevious = document.getElementById("btnPrevious") as HTMLButtonElement;
const btnNext = document.getElementById("btnNext") as HTMLButtonElement;

const btnTotal = document.getElementById("total");
const btnIncome = document.getElementById("income");
const btnExpenditure = document.getElementById("expenditure");
const btnTransfer = document.getElementById("transfer");

window.addEventListener('DOMContentLoaded', () => {
    const icon = document.getElementById("icon") as HTMLImageElement;
    icon.src = mainIcon;
    initHistory();
});

btnPrevious.addEventListener("click", () => {
    // 
})

// init 내역
function initHistory() {
    // 년,월 가져오기
    const date = document.getElementById("month") as HTMLDivElement;
    if (date.textContent) {
        let param: string = date.textContent;
        // const contents: ContentDetail[] = loadContents(param);
        
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