import "../css/index.css";
import mainIcon from "../img/mainIcon.png";


window.addEventListener('DOMContentLoaded', () => {
    const icon = document.getElementById("icon") as HTMLImageElement;
    icon.src = mainIcon;
});

const btnCreate = document.getElementById("btnCreate") as HTMLButtonElement;
btnCreate.addEventListener("click", (e: Event) => {
    openModal();
})

function openModal() {
    const modal = document.querySelector(".modal");
    modal?.classList.remove("hidden");
}