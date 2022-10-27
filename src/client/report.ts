import "../css/report.css";
import { Classification, ContentDetail } from "./interface";
import { loadAllClassifications, loadContents } from "./store";
// import { btnCurrent, btnNext, btnPrevious, dateEl} from "./common";

document.addEventListener('DOMContentLoaded', () => {

});

async function initReport() {
    const classifications: Classification[] = await loadAllClassifications();
    const contents: ContentDetail[] = await loadContents();
}