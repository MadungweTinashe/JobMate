function showForm() {
    const form = document.getElementById("applicationForm");

    if (form) {
        form.style.display = "block";
    }
}

async function saveApplication(event) {
    event.preventDefault();

    const jobTitle = document.getElementById("jobTitle").value;
    const company = document.getElementById("company").value;
    const status = document.getElementById("status").value;

    try {
        const saved = await window.saveApplicationToFirebase(
            jobTitle,
            company,
            status
        );

        if (saved) {
            alert("Application saved! 🎉");
            document.getElementById("applicationForm").reset();
        } else {
            alert("Could not save application. Please try again.");
        }

    } catch (error) {
        console.error("Error saving application:", error);
        alert("Could not save application. Please try again.");
    }
}
