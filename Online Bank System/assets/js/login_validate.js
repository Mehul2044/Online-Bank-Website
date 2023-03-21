const accountNumberInput = document.getElementById('account_number');
accountNumberInput.setCustomValidity('Please enter a valid integer.');
accountNumberInput.addEventListener('input', function (event) {
    if (!/^[0-9]+$/.test(event.target.value)) {
        accountNumberInput.setCustomValidity('Please enter a valid integer.');
        accountNumberInput.reportValidity();
    } else {
        accountNumberInput.setCustomValidity('');
    }
});
