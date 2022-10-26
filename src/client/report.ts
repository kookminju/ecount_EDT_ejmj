import "../css/common.css";
import "../css/report.css";
import mainIcon from "../img/mainIcon.png";

document.addEventListener('DOMContentLoaded', () => {
    const icon = document.getElementById("icon") as HTMLImageElement;
    icon.src = mainIcon;
});