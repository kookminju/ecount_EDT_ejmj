import { ContentDetail } from "../util/interface";
import { getContentById } from "../util/store";
import { openModal } from "./modal";

const contentEl = document.querySelector(".content") as HTMLDivElement;

export function createEliments(contents: ContentDetail[]) {
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
    amountEl.textContent = content.amount.toLocaleString('ko-KR') + "원";
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