// JobMate - Complete Firebase Application Tracker
// =================================================

// Firebase SDK
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


// =================================================
// FIREBASE CONFIGURATION
// =================================================

const firebaseConfig = {
    apiKey: "AIzaSyC4ZK-zKWvGojS9aQaP9GTtml89dhfS_e4",
    authDomain: "jobmate-903e4.firebaseapp.com",
    projectId: "jobmate-903e4",
    storageBucket: "jobmate-903e4.firebasestorage.app",
    messagingSenderId: "190306290177",
    appId: "1:190306290177:web:8c2ce73d3c108758c58e00",
    measurementId: "G-LZBRQ91EX9"
};


// =================================================
// INITIALIZE FIREBASE
// =================================================

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("JobMate Firebase connected! ☁️");


// =================================================
// SHOW ADD APPLICATION FORM
// =================================================

function showForm() {

    const form = document.getElementById("applicationForm");

    if (form) {

        form.style.display = "block";

        form.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

window.showForm = showForm;


// =================================================
// HIDE ADD APPLICATION FORM
// =================================================

function hideForm() {

    const form = document.getElementById("applicationForm");

    if (form) {
        form.style.display = "none";
    }
}

window.hideForm = hideForm;


// =================================================
// SAVE APPLICATION
// =================================================

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


    // Check required fields

    if (!jobTitle || !company) {

        alert("Please enter the job title and company.");

        return;
    }


    // Disable submit button while saving

    const submitButton =
        form.querySelector('button[type="submit"]');

    if (submitButton) {

        submitButton.disabled = true;

        submitButton.textContent = "Saving...";
    }


    try {

        // Save to Firestore

        const applicationData = {

            jobTitle: jobTitle,

            company: company,

            status: status,

            appliedDate: appliedDate,

            interviewDate: interviewDate,

            notes: notes,

            favorite: false,

            createdAt: new Date().toISOString()
        };


        await addDoc(
            collection(db, "applications"),
            applicationData
        );


        // Success message

        alert("Application saved successfully! 🎉");


        // Clear form

        form.reset();


        // Hide form

        hideForm();


        // Reload applications

        await loadApplications();


    } catch (error) {

        console.error(
            "Error saving application:",
            error
        );

        alert(
            "Your application could not be saved.\n\n" +
            "Please check your Firebase connection and Firestore rules."
        );


    } finally {

        // Enable button again

        if (submitButton) {

            submitButton.disabled = false;

            submitButton.textContent = "Save Application";
        }
    }
}

window.saveApplication = saveApplication;


// =================================================
// LOAD APPLICATIONS
// =================================================

async function loadApplications() {

    const applicationsContainer =
        document.getElementById("applicationsList") ||
        document.getElementById("applicationList");


    if (!applicationsContainer) {

        console.log(
            "JobMate: Applications container not found."
        );

        return;
    }


    try {

        const querySnapshot =
            await getDocs(
                collection(db, "applications")
            );


        // Clear existing applications

        applicationsContainer.innerHTML = "";


        let totalApplications = 0;

        let interviews = 0;

        let offers = 0;

        let favorites = 0;


        // No applications

        if (querySnapshot.empty) {

            applicationsContainer.innerHTML = `
                <div class="no-applications">
                    <h3>No applications yet 📋</h3>
                    <p>Tap "Add Application" to add your first job.</p>
                </div>
            `;
        }


        // Display every application

        querySnapshot.forEach(
            (documentSnapshot) => {

                const application =
                    documentSnapshot.data();

                const id =
                    documentSnapshot.id;


                totalApplications++;


                // Count interviews

                if (
                    application.status &&
                    application.status
                        .toLowerCase()
                        .includes("interview")
                ) {

                    interviews++;
                }


                // Count offers

                if (
                    application.status &&
                    application.status
                        .toLowerCase()
                        .includes("offer")
                ) {

                    offers++;
                }


                // Count favorites

                if (
                    application.favorite === true
                ) {

                    favorites++;
                }


                // Create application card

                const card =
                    document.createElement("div");


                card.className =
                    "application-card";


                card.innerHTML = `

                    <h3>
                        ${escapeHTML(
                            application.jobTitle ||
                            "Untitled Job"
                        )}
                    </h3>

                    <p>
                        <strong>🏢 Company:</strong>
                        ${escapeHTML(
                            application.company ||
                            "Not provided"
                        )}
                    </p>

                    <p>
                        <strong>📌 Status:</strong>
                        ${escapeHTML(
                            application.status ||
                            "Applied"
                        )}
                    </p>

                    <p>
                        <strong>📅 Applied:</strong>
                        ${escapeHTML(
                            application.appliedDate ||
                            "Not provided"
                        )}
                    </p>

                    <p>
                        <strong>🎤 Interview:</strong>
                        ${escapeHTML(
                            application.interviewDate ||
                            "Not provided"
                        )}
                    </p>

                    <p>
                        <strong>📝 Notes:</strong>
                        ${escapeHTML(
                            application.notes ||
                            "No notes"
                        )}
                    </p>

                    <div class="application-actions">

                        <button
                            onclick="editApplication('${id}')"
                        >
                            ✏️ Edit
                        </button>

                        <button
                            onclick="deleteApplication('${id}')"
                        >
                            🗑️ Delete
                        </button>

                    </div>
                `;


                applicationsContainer.appendChild(card);
            }
        );


        // Update dashboard

        updateDashboard(
            totalApplications,
            interviews,
            offers,
            favorites
        );


    } catch (error) {

        console.error(
            "Error loading applications:",
            error
        );


        applicationsContainer.innerHTML = `
            <div class="no-applications">
                <h3>⚠️ Unable to load applications</h3>
                <p>Please check your Firebase connection.</p>
            </div>
        `;
    }
}


// =================================================
// UPDATE DASHBOARD
// =================================================

function updateDashboard(
    totalApplications,
    interviews,
    offers,
    favorites
) {

    const totalElement =
        document.getElementById(
            "totalApplications"
        );

    const interviewElement =
        document.getElementById(
            "interviews"
        );

    const offersElement =
        document.getElementById(
            "offers"
        );

    const favoritesElement =
        document.getElementById(
            "favorites"
        );


    if (totalElement) {

        totalElement.textContent =
            totalApplications;
    }


    if (interviewElement) {

        interviewElement.textContent =
            interviews;
    }


    if (offersElement) {

        offersElement.textContent =
            offers;
    }


    if (favoritesElement) {

        favoritesElement.textContent =
            favorites;
    }
}


// =================================================
// DELETE APPLICATION
// =================================================

async function deleteApplication(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this application?"
        );


    if (!confirmDelete) {

        return;
    }


    try {

        await deleteDoc(
            doc(
                db,
                "applications",
                id
            )
        );


        alert(
            "Application deleted successfully! 🗑️"
        );


        await loadApplications();


    } catch (error) {

        console.error(
            "Error deleting application:",
            error
        );


        alert(
            "Could not delete the application."
        );
    }
}

window.deleteApplication =
    deleteApplication;


// =================================================
// EDIT APPLICATION
// =================================================

async function editApplication(id) {

    const newJobTitle =
        prompt(
            "Enter the new job title:"
        );


    if (
        !newJobTitle ||
        !newJobTitle.trim()
    ) {

        return;
    }


    try {

        await updateDoc(
            doc(
                db,
                "applications",
                id
            ),
            {
                jobTitle:
                    newJobTitle.trim()
            }
        );


        alert(
            "Application updated successfully! ✏️"
        );


        await loadApplications();


    } catch (error) {

        console.error(
            "Error updating application:",
            error
        );


        alert(
            "Could not update the application."
        );
    }
}

window.editApplication =
    editApplication;


// =================================================
// ESCAPE HTML
// =================================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value);

    return div.innerHTML;
}


// =================================================
// START JOBMATE
// =================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "JobMate is starting..."
        );

        loadApplications();
    }
);
