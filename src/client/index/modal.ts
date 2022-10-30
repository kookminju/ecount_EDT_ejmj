import { Content, ContentDetail } from "../util/interface";
import { addAccountBookContent, getClassificationsByCategory, modifyAccountBookContent, removeAccountBookContent } from "../util/store";
import { refreshContents } from "./summary";

const modal = document.querySelector(".modal") as HTMLDivElement;
const mdIncome = document.getElementById("md_income") as HTMLButtonElement;
const mdExpenditure = document.getElementById("md_expenditure") as HTMLButtonElement;
const inputDate = document.getElementById("inputDate") as HTMLInputElement;
const inputTime = document.getElementById("inputTime") as HTMLInputElement;
const selectbox = document.getElementById("category") as HTMLSelectElement;
const inputAmount = document.getElementById("inputAmount") as HTMLInputElement;
const inputMemo = document.getElementById("inputMemo") as HTMLInputElement;

const btnSave = document.getElementById("btnSave") as HTMLButtonElement;
const btnDelete = document.getElementById("btnDelete") as HTMLButtonElement;
const btnCancel = document.getElementById("btnCancel") as HTMLButtonElement;

export function openModal(content?: ContentDetail) {
    if (content) {
        resetModal(content);
        setSelectOption(content.category, content.subType);
        loadContentData(content);
        initMDButtonEvent(content);
    } else {
        resetModal();
        setSelectOption("I");
        initMDButtonEvent();
    }
    modal.classList.remove("hidden");
}

function resetModal(content?: ContentDetail) {
    if (content) { initCommonButton(content); }
    else {initCommonButton(); }
    [inputDate.value, inputTime.value, inputAmount.value, inputMemo.value, selectbox.value] = ["", "", "", "", "none"];
}

async function setSelectOption(category: string, subType?: string) {
    document.querySelectorAll(".option").forEach(el => {
        if (!el.classList.contains("option_title")) { el.remove(); }
    });

    const options = await getClassificationsByCategory(category);
    options.forEach((option) => {
        const optionEl = document.createElement("option") as HTMLOptionElement;
        optionEl.classList.add("option");
        optionEl.text = option.subType;
        if (subType) {
            if (option.subType === subType) {
                optionEl.selected = true;
            }
        }
        optionEl.value = option.classificationId + "";
        selectbox.append(optionEl);
    })   
}

function initCommonButton(content?: ContentDetail) {
    if (content && content?.category === "I") { setIEButtonStyle(mdIncome) }
    else {setIEButtonStyle(mdExpenditure) };

    mdIncome.onclick = () => {
        setSelectOption("I");
        setIEButtonStyle(mdIncome);
    };

    mdExpenditure.onclick = () => {
        setSelectOption("O");
        setIEButtonStyle(mdExpenditure);
    };

    btnCancel.onclick = () => {
        modal.classList.add("hidden");
    };
}

function setIEButtonStyle(btn: HTMLButtonElement) {
    document.querySelectorAll(".IE").forEach((el) => {
        const buttonEl = el as HTMLButtonElement;
        if (buttonEl === btn) {
            buttonEl.style.border = "1px solid rgb(227,108,103)";
            buttonEl.style.color = "rgb(227,108,103)";
        } else { 
            buttonEl.style.removeProperty("border");
            buttonEl.style.removeProperty("color");
        }
    })
}

function loadContentData(content: ContentDetail) {
    const contentDate = content.contentDate.split(" ");
    inputDate.value = contentDate[0];
    inputTime.value = contentDate[1];
    inputAmount.value = content.amount + "";
    inputMemo.value = content.memo;
}

function initMDButtonEvent(content?: ContentDetail) {
    btnSave.onclick = () => {
        if (selectbox.value == "none" || !inputDate.value || !inputTime.value || !inputMemo.value || !inputAmount.value) {
            alert("input값을 모두 채워주세요 !")
            return;
        }
        if (!content) { saveContent(); } 
        else { updateContent(content); }
        modal.classList.add("hidden");
        refreshContents();
    }
    
    btnDelete.onclick = () => {
        if (content) {
            alert("삭제할게요 ~!");
            removeAccountBookContent(content.contentId);
            modal.classList.add("hidden");
            refreshContents();
        } else { alert("삭제할 항목을 클릭해주세요"); }
    }
}

function saveContent() {
    const newContent: Content = {
        contentId: crypto.randomUUID(),
        classificationId: +selectbox.value,
        contentDate: inputDate.value + " " +inputTime.value + ":00",
        memo: inputMemo.value,
        amount: +inputAmount.value,
    };
    addAccountBookContent(newContent);
}

function updateContent(content: ContentDetail) {
    const newContent: Content = {
        contentId: content.contentId,
        classificationId: +selectbox.value,
        contentDate: inputDate.value + " " + inputTime.value,
        memo: inputMemo.value,
        amount: +inputAmount.value,
    };
    modifyAccountBookContent(newContent);
}