const countryList = {
    AED: "AE", AFN: "AF", XCD: "AG", ALL: "AL", AMD: "AM", ANG: "AN", AOA: "AO",
    ARS: "AR", AUD: "AU", AZN: "AZ", BAM: "BA", BBD: "BB", BDT: "BD", BGN: "BG",
    BHD: "BH", BIF: "BI", BMD: "BM", BND: "BN", BOB: "BO", BRL: "BR", BSD: "BS",
    CAD: "CA", CHF: "CH", CLP: "CL", CNY: "CN", COP: "CO", CRC: "CR", CUP: "CU",
    CZK: "CZ", DKK: "DK", DOP: "DO", DZD: "DZ", EGP: "EG", EUR: "FR", GBP: "GB",
    GHS: "GH", HKD: "HK", INR: "IN", JPY: "JP", KES: "KE", KRW: "KR", KWD: "KW",
    LKR: "LK", MAD: "MA", MYR: "MY", MXN: "MX", NGN: "NG", NOK: "NO", NPR: "NP",
    NZD: "NZ", OMR: "OM", PKR: "PK", PLN: "PL", QAR: "QA", RUB: "RU", SAR: "SA",
    SEK: "SE", SGD: "SG", THB: "TH", TRY: "TR", TWD: "TW", TZS: "TZ", USD: "US",
    UYU: "UY", UZS: "UZ", VND: "VN", ZAR: "ZA", ZMW: "ZM", ZWL: "ZW"
};

const BASE_URL = "https://api.exchangerate-api.com/v4/latest";  // 🌟 Updated API URL
const dropdowns = document.querySelectorAll("select");
const fromFlag = document.querySelector(".from .select-container img");
const toFlag = document.querySelector(".to .select-container img");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amout input");
const btn = document.querySelector("form button");

// Populate dropdowns with currency options
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.value = currCode;
        newOption.innerText = currCode;
        
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.appendChild(newOption);
    }
}

// Function to update flags based on selected currency
const updateFlag = (currencyCode, imgElement) => {
    const countryCode = countryList[currencyCode];
    imgElement.src = `https://flagsapi.com/${countryCode}/shiny/64.png`;
};

// Update flags when dropdown selection changes
dropdowns.forEach((select) => {
    select.addEventListener("change", (event) => {
        const target = event.target;
        if (target.name === "from") {
            updateFlag(target.value, fromFlag);
        } else if (target.name === "to") {
            updateFlag(target.value, toFlag);
        }
        updateExchangeRate();  // 🌟 Added to update rate when currency changes
    });
});

// Initialize flags based on default selection
updateFlag("USD", fromFlag);
updateFlag("INR", toFlag);

// Function to fetch and display exchange rates
const updateExchangeRate = async () => {
    const fromCurrency = document.querySelector(".from select").value;
    const toCurrency = document.querySelector(".to select").value;
    let amount = amountInput.value || 1;  // Default to 1 if no amount entered

    const URL = `${BASE_URL}/${fromCurrency}`;
    try {
        const response = await fetch(URL);
        const data = await response.json();
        const rate = data.rates[toCurrency];
        const convertedAmount = (amount * rate).toFixed(2);

        msg.innerText = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        msg.innerText = "Failed to get exchange rate. Please try again.";
    }
};

// 🌟 Fetch exchange rate on button click
btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

// 🌟 Fetch exchange rate on page load
window.addEventListener("load", () => {
    updateExchangeRate();
});
