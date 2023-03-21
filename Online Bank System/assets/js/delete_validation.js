const aadharInput = document.querySelector('input[name="aadhar"]');

aadharInput.addEventListener('input', () => {
    const aadharValue = aadharInput.value;
    const regex = /^[0-9]{12}$/;

    if (!regex.test(aadharValue)) {
        aadharInput.setCustomValidity('Aadhaar number should contain only 12 digits');
        aadharInput.reportValidity();
    } else {
        aadharInput.setCustomValidity('');
    }
});