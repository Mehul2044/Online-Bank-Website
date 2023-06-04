// const firstNameInput = document.getElementById("fName");
// const lastNameInput = document.getElementById("lName");
// const passwordInput = document.getElementById("password");
// const confirmPasswordInput = document.getElementById("confirm");
//
// const firstNameRegex = /^[a-zA-Z]+$/;
// const lastNameRegex = /^[a-zA-Z]+$/;
// const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
//
// firstNameInput.addEventListener("input", () => {
//     if (!firstNameRegex.test(firstNameInput.value)) {
//         firstNameInput.setCustomValidity("Please enter a valid first name.");
//         firstNameInput.reportValidity();
//     } else {
//         firstNameInput.setCustomValidity("");
//     }
// });
//
// lastNameInput.addEventListener("input", () => {
//     if (!lastNameRegex.test(lastNameInput.value)) {
//         lastNameInput.setCustomValidity("Please enter a valid last name.");
//         lastNameInput.reportValidity();
//     } else {
//         lastNameInput.setCustomValidity("");
//     }
// });
//
// passwordInput.addEventListener("input", () => {
//     if (!passwordRegex.test(passwordInput.value)) {
//         passwordInput.setCustomValidity("Password should be at least 8 characters long, and contain at least one digit, one lowercase and one uppercase letter.");
//         passwordInput.reportValidity();
//     } else {
//         passwordInput.setCustomValidity("");
//     }
// });
//
// confirmPasswordInput.addEventListener("input", () => {
//     if (confirmPasswordInput.value !== passwordInput.value) {
//         confirmPasswordInput.setCustomValidity("Passwords do not match.");
//         confirmPasswordInput.reportValidity();
//     } else {
//         confirmPasswordInput.setCustomValidity("");
//     }
// });