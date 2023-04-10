const ph_noInput = document.getElementById("ph_no");
const ph_noRegex = /^\d{10}$/;

nameInput.addEventListener("input", () => {
    if (!nameRegex.test(nameInput.value)) {
        nameInput.setCustomValidity("Please enter a valid name.");
        nameInput.reportValidity();
    } else {
        nameInput.setCustomValidity("");
    }
});

ph_noInput.addEventListener("input", () => {
    if (!ph_noRegex.test(ph_noInput.value)) {
        ph_noInput.setCustomValidity("Please enter a valid phone number.");
        ph_noInput.reportValidity();
    } else {
        ph_noInput.setCustomValidity("")
    }
});


acc_noInput.addEventListener("input", () => {
    if (!acc_noRegex.test(acc_noInput.value)) {
        acc_noInput.setCustomValidity("Please enter a valid account number.");
        acc_noInput.reportValidity();
    } else {
        acc_noInput.setCustomValidity("");
    }
});