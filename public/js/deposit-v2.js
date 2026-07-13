console.log("deposit.js loaded");

async function submitDeposit() {

    alert("Button clicked!");

    const coin = document.getElementById("coin").value;
    const amount = Number(document.getElementById("amount").value);
    const message = document.getElementById("message");

    if (amount <= 0) {

        message.innerHTML = "Please enter a valid amount.";
        message.style.color = "red";
        return;

    }

    try {

        const response = await fetch("/api/deposit", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                coin,
                amount
            })

        });

        const data = await response.json();

        if (data.success) {

            message.innerHTML = "✅ Deposit request submitted successfully.";
            message.style.color = "#22c55e";

            document.getElementById("amount").value = "";

        } else {

            message.innerHTML = data.message;
            message.style.color = "red";

        }

    } catch (error) {

        console.error(error);

        message.innerHTML = "Server error.";
        message.style.color = "red";

    }

}