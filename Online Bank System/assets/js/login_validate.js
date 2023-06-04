const accountNumberInput = document.getElementById('account_number');
accountNumberInput.setCustomValidity('Please enter a valid 24 length account number.');
const accountNumberRegex = /^[0-9a-z]{24}$/;
accountNumberInput.addEventListener('input', function (event) {
    if (!accountNumberRegex.test(event.target.value)) {
        accountNumberInput.setCustomValidity('Please enter a valid 24 length account number.');
        accountNumberInput.reportValidity();
    } else {
        accountNumberInput.setCustomValidity('');
    }
});