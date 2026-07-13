console.log("withdraw.js loaded");

// =====================================
// SUBMIT WITHDRAWAL
// =====================================

async function submitWithdraw() {

    const coin = document.getElementById("coin").value;

    const amount = Number(
        document.getElementById("amount").value
    );

    const address = document
        .getElementById("address")
        .value
        .trim();

    const message =
        document.getElementById("message");

    // VALIDATION

    if (amount <= 0) {

        message.innerHTML = "Please enter a valid amount.";
        message.style.color = "red";

        return;

    }

    if (address === "") {

        message.innerHTML = "Please enter wallet address.";
        message.style.color = "red";

        return;

    }

    try {

        const response = await fetch("/api/withdraw", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            credentials: "include",

            body: JSON.stringify({

                coin,
                amount,
                address

            })

        });

        const data = await response.json();

        if (data.success) {

            message.innerHTML =
                "✅ Withdrawal request submitted successfully.";

            message.style.color = "#22c55e";

            document.getElementById("amount").value = "";
            document.getElementById("address").value = "";

        } else {

            message.innerHTML = data.message;
            message.style.color = "red";

        }

    } catch (error) {

        console.log(error);

        message.innerHTML = "Server connection error.";
        message.style.color = "red";

    }

}