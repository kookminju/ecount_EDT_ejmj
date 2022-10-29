import { Content, ContentDetail } from "../util/interface";
import { addAccountBookContent, loadClassificationsByCategory, modifyAccountBookContent, removeAccountBookContent } from "../util/store";
import { refreshContents } from "./eliment";

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
    resetModal();
    if (content) {
        setSelectOption(content.category, content.subType);
        loadContentData(content);
        initButtonForModify(content);
    } else {
        setSelectOption("I");
        initButtonForCreate();
    }
    modal.classList.remove("hidden");
}

function resetModal() {
    initCommonButton();
    [inputDate.value, inputTime.value, inputAmount.value, inputMemo.value, selectbox.value] = ["", "", "", "", "none"];
}

async function setSelectOption(category: string, subType?: string) {
    document.querySelectorAll(".option").forEach(el => {
        if (!el.classList.contains("option_title")) { el.remove(); }
    });

    const options = await loadClassificationsByCategory(category);
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

function initCommonButton() {
    mdIncome.style.border = "1px solid rgb(227,108,103)";
    mdIncome.style.color = "rgb(227,108,103)";
    mdExpenditure.style.removeProperty("border");
    mdExpenditure.style.removeProperty("color");

    mdIncome.onclick = () => {
        setSelectOption("I");
        mdIncome.style.border = "1px solid rgb(227,108,103)";
        mdIncome.style.color = "rgb(227,108,103)";
        mdExpenditure.style.removeProperty("border");
        mdExpenditure.style.removeProperty("color");
    };

    mdExpenditure.onclick = () => {
        setSelectOption("O");
        mdExpenditure.style.border = "1px solid rgb(227,108,103)";
        mdExpenditure.style.color = "rgb(227,108,103)";
        mdIncome.style.removeProperty("border");
        mdIncome.style.removeProperty("color");
    };

    btnCancel.onclick = () => {
        modal.classList.add("hidden");
    };
}

function initButtonForCreate() {
    btnSave.onclick = () => {
        if (selectbox.value == "none" || !inputDate.value || !inputTime.value || !inputMemo.value || !inputAmount.value) {
            alert("input값을 모두 채워주세요 !")
            return;
        }
        saveContent();
        modal.classList.add("hidden");
        refreshContents();
    };

    btnDelete.onclick = () => {
        alert("삭제할 항목을 클릭해주세요");
    }
}

function initButtonForModify(content: ContentDetail) {
    btnSave.onclick = () => {
        if (selectbox.value == "none" || !inputDate.value || !inputTime.value || !inputMemo.value || !inputAmount.value) {
            alert("input값을 모두 채워주세요 !")
            return;
        }
        updateContent(content);
        modal.classList.add("hidden");
        refreshContents();
    }
    
    btnDelete.onclick = () => {
        alert("삭제할게요 ~!");
        removeAccountBookContent(content.contentId);
        modal.classList.add("hidden");
        refreshContents();
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

function loadContentData(content: ContentDetail) {
    const contentDate = content.contentDate.split(" ");
    inputDate.value = contentDate[0];
    inputTime.value = contentDate[1];
    inputAmount.value = content.amount + "";
    inputMemo.value = content.memo;
}