const firstNameInput = document.getElementById("fname");
const lastNameInput = document.getElementById("lname");

const firstNameRegex = /^$|^[a-zA-Z]+$/;
const lastNameRegex = /^$|^[a-zA-Z]+$/;

firstNameInput.addEventListener("input", () => {
    if (!firstNameRegex.test(firstNameInput.value)) {
        firstNameInput.setCustomValidity("Please enter a valid first name.");
        firstNameInput.reportValidity();
    } else {
        firstNameInput.setCustomValidity("");
    }
});

lastNameInput.addEventListener("input", () => {
    if (!lastNameRegex.test(lastNameInput.value)) {
        lastNameInput.setCustomValidity("Please enter a valid last name.");
        lastNameInput.reportValidity();
    } else {
        lastNameInput.setCustomValidity("");
    }
});