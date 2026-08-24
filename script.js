function showForm() {
    const form = document.getElementById("applicationForm");

    if (form) {
        form.style.display = "block";
    }
}

function saveApplication(event) {
    event.preventDefault();

    alert("Application saved! 🎉");
}
