const amountInput = document.getElementById("amount");

const amountRegex = /^\d+(\.\d+)?$/;

amountInput.addEventListener("input", ()=>{
   if (!amountRegex.test(amountInput.value)){
       amountInput.setCustomValidity("Please enter a valid number.");
       amountInput.reportValidity();
   } else {
       amountInput.setCustomValidity("");
   }
});