import "../../css/common.css";
import mainIcon from "../../img/mainIcon.png";

export const btnPrevious = document.getElementById("btnPrevious") as HTMLButtonElement;
export const btnNext = document.getElementById("btnNext") as HTMLButtonElement;
export const dateEl = document.getElementById("month") as HTMLDivElement;
export const btnCurrent = document.getElementById("current_month") as HTMLButtonElement;

document.addEventListener('DOMContentLoaded', () => {
    const icon = document.getElementById("icon") as HTMLImageElement;
    icon.src = mainIcon;
    dateEl.textContent = getDate();
    calendarClick();
});

function calendarClick() {
    btnPrevious.addEventListener("click", () => {
        if (dateEl.textContent) {
            let [year, month]: string[] = dateEl.textContent.split('-');
            if (month === "01") {
                dateEl.textContent = (Number(year) - 1) + '-' + 12;
            } else {
                dateEl.textContent = year + '-' + ('0' + (Number(month) - 1)).slice(-2);
            }
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
        }
    });
    
    btnCurrent.addEventListener("click", () => { 
        dateEl.textContent = getDate();
    });
}

function getDate(): string {
    const date = new Date();
    const year: number = date.getFullYear();
    const month: string = ('0' + (date.getMonth() + 1)).slice(-2);
    return year + '-' + month;
}