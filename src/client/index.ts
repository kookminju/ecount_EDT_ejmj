const btnCreate = document.getElementById("btnCreate")
btnCreate?.addEventListener("click", (ev: Event) => {
    openModal();
})

function openModal() {
    const modal = document.querySelector(".modal");
    modal?.classList.remove("hidden")
}