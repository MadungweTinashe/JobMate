function showForm() {
    
    
   const firebaseConfig = {
  // your Firebase config goes here
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
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
        await db.collection("applications").add({
            jobTitle: jobTitle,
            company: company,
            status: status,
            createdAt: new Date()
        });

        alert("Application saved! 🎉");

        document.getElementById("applicationForm").reset();

    } catch (error) {
        console.error("Error saving application:", error);
        alert("Could not save application. Please try again.");
    }
}
)
