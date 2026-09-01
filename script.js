function showForm() {
    const form = document.getElementById("applicationForm");

    if (form) {
        form.style.display = "block";
    }
}

async function saveApplication(event) {
    event.preventDefault();

    const jobTitleElement = document.getElementById("jobTitle");
    const companyElement = document.getElementById("company");
    const statusElement = document.getElementById("status");

    if (!jobTitleElement || !companyElement || !statusElement) {
        alert("Please complete the application form.");
        return;
    }

    const jobTitle = jobTitleElement.value.trim();
    const company = companyElement.value.trim();
    const status = statusElement.value;

    if (!jobTitle || !company || !status) {
        alert("Please complete all required fields.");
        return;
    }

    try {
        if (typeof window.saveApplicationToFirebase !== "function") {
            alert("Firebase is still connecting. Please try again.");
            return;
        }

        const saved = await window.saveApplicationToFirebase(
            jobTitle,
            company,
            status
        );

        if (saved) {
            alert("Application saved! 🎉");

            const form = document.getElementById("applicationForm");

            if (form) {
                form.reset();
            }
        } else {
            alert("Could not save application. Please try again.");
        }

    } catch (error) {
        console.error("Error saving application:", error);
        alert("Could not save application. Please try again.");
    }
}
