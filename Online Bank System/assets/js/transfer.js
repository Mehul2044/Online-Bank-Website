const amountInput = document.getElementById("amount");
const acc_noInput = document.getElementById("accountNumber");

const amountRegex = /^\d+(\.\d+)?$/;
const acc_noRegex = /^[0-9]+$/;

amountInput.addEventListener("input", () => {
    if (!amountRegex.test(amountInput.value)) {
        amountInput.setCustomValidity("Please enter a valid number");
        amountInput.reportValidity();
    } else {
        amountInput.setCustomValidity("");
    }
});

acc_noInput.addEventListener("input", () => {
    if (!acc_noRegex.test(acc_noInput.value)) {
        acc_noInput.setCustomValidity("Please enter only an integer.");
        acc_noInput.reportValidity();
    } else {
        acc_noInput.setCustomValidity("");
    }
});