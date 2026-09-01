// ===============================
// JobMate - Firebase Application
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ===============================
// FIREBASE CONFIG
// ===============================

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("JobMate Firebase connected! ☁️");

// ===============================
// SHOW ADD APPLICATION FORM
// ===============================

function showForm() {
    const form = document.getElementById("applicationForm");

    if (form) {
        form.style.display = "block";
        form.scrollIntoView({ behavior: "smooth" });
    }
}

// Make function available to HTML buttons
window.showForm = showForm;


// ===============================
// HIDE APPLICATION FORM
// ===============================

function hideForm() {
    const form = document.getElementById("applicationForm");

    if (form) {
        form.style.display = "none";
    }
}

window.hideForm = hideForm;


// ===============================
// SAVE APPLICATION
// ===============================

async function saveApplication(event) {
    event.preventDefault();

    const form = event.target;

    const jobTitle =
        form.querySelector('[name="jobTitle"]')?.value.trim() || "";

    const company =
        form.querySelector('[name="company"]')?.value.trim() || "";

    const status =
        form.querySelector('[name="status"]')?.value || "Applied";

    const appliedDate =
        form.querySelector('[name="appliedDate"]')?.value || "";

    const interviewDate =
        form.querySelector('[name="interviewDate"]')?.value || "";

    const notes =
        form.querySelector('[name="notes"]')?.value.trim() || "";

    if (!jobTitle || !company) {
        alert("Please enter the job title and company.");
        return;
    }

    try {
        await addDoc(collection(db, "applications"), {
            jobTitle: jobTitle,
            company: company,
            status: status,
            appliedDate: appliedDate,
            interviewDate: interviewDate,
            notes: notes,
            favorite: false,
            createdAt: new Date().toISOString()
        });

        // SUCCESS MESSAGE
        alert("Application saved successfully! 🎉");

        // Clear form
        form.reset();

        // Hide form
        hideForm();

        // Reload applications
        loadApplications();

    } catch (error) {
        console.error("Error saving application:", error);
        alert("Sorry, your application could not be saved. Please try again.");
    }
}

window.saveApplication = saveApplication;


// ===============================
// LOAD APPLICATIONS
// ===============================

async function loadApplications() {
    const applicationsContainer =
        document.getElementById("applicationsList") ||
        document.getElementById("applicationList");

    if (!applicationsContainer) {
        return;
    }

    try {
        const querySnapshot =
            await getDocs(collection(db, "applications"));

        applicationsContainer.innerHTML = "";

        let totalApplications = 0;
        let interviews = 0;
        let offers = 0;
        let favorites = 0;

        querySnapshot.forEach((documentSnapshot) => {

            const application = documentSnapshot.data();
            const id = documentSnapshot.id;

            totalApplications++;

            if (
                application.status &&
                application.status.toLowerCase() === "interview"
            ) {
                interviews++;
            }

            if (
                application.status &&
                application.status.toLowerCase() === "offer"
            ) {
                offers++;
            }

            if (application.favorite === true) {
                favorites++;
            }

            const card = document.createElement("div");

            card.className = "application-card";

            card.innerHTML = `
                <h3>${escapeHTML(application.jobTitle || "Untitled Job")}</h3>

                <p>
                    <strong>🏢 Company:</strong>
                    ${escapeHTML(application.company || "Not provided")}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${escapeHTML(application.status || "Applied")}
                </p>

                <p>
                    📅 Applied:
                    ${escapeHTML(application.appliedDate || "Not provided")}
                </p>

                <p>
                    🎤 Interview:
                    ${escapeHTML(application.interviewDate || "Not provided")}
                </p>

                <p>
                    📝 ${escapeHTML(application.notes || "No notes")}
                </p>

                <button onclick="editApplication('${id}')">
                    ✏️ Edit
                </button>

                <button onclick="deleteApplication('${id}')">
                    🗑️ Delete
                </button>
            `;

            applicationsContainer.appendChild(card);
        });

        updateDashboard(
            totalApplications,
            interviews,
            offers,
            favorites
        );

    } catch (error) {
        console.error("Error loading applications:", error);
    }
}


// ===============================
// UPDATE DASHBOARD
// ===============================

function updateDashboard(
    totalApplications,
    interviews,
    offers,
    favorites
) {

    const totalElement =
        document.getElementById("totalApplications");

    const interviewElement =
        document.getElementById("interviews");

    const offersElement =
        document.getElementById("offers");

    const favoritesElement =
        document.getElementById("favorites");

    if (totalElement) {
        totalElement.textContent = totalApplications;
    }

    if (interviewElement) {
        interviewElement.textContent = interviews;
    }

    if (offersElement) {
        offersElement.textContent = offers;
    }

    if (favoritesElement) {
        favoritesElement.textContent = favorites;
    }
}


// ===============================
// DELETE APPLICATION
// ===============================

async function deleteApplication(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this application?");

    if (!confirmDelete) {
        return;
    }

    try {

        await deleteDoc(
            doc(db, "applications", id)
        );

        alert("Application deleted successfully! 🗑️");

        loadApplications();

    } catch (error) {

        console.error("Error deleting application:", error);

        alert("Could not delete the application.");
    }
}

window.deleteApplication = deleteApplication;


// ===============================
// EDIT APPLICATION
// ===============================

async function editApplication(id) {

    const newJobTitle =
        prompt("Enter the new job title:");

    if (!newJobTitle) {
        return;
    }

    try {

        await updateDoc(
            doc(db, "applications", id),
            {
                jobTitle: newJobTitle.trim()
            }
        );

        alert("Application updated successfully! ✏️");

        loadApplications();

    } catch (error) {

        console.error("Error updating application:", error);

        alert("Could not update the application.");
    }
}

window.editApplication = editApplication;


// ===============================
// ESCAPE HTML
// ===============================

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


// ===============================
// START JOBMATE
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    loadApplications();

});
