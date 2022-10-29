import "../../css/index.css";
import { btnPrevious, btnNext, btnCurrent } from "../util/common";
import { openModal } from "./modal";
import { refreshContents } from "./summary";

const btnCreate = document.getElementById("btnCreate") as HTMLButtonElement;

window.addEventListener('DOMContentLoaded', async () => {
    refreshContents();

    btnPrevious.addEventListener("click", refreshContents);
    btnNext.addEventListener("click", refreshContents);
    btnCurrent.addEventListener("click", refreshContents);
    btnCreate.addEventListener("click", () => openModal());
});