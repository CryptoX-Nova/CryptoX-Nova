// =====================================
// CryptoX Nova Admin Panel JS
// =====================================


// =====================================
// LOAD USERS
// =====================================

async function loadUsers() {

    const response = await fetch("/api/admin/users", {

        credentials: "include"

    });

    const data = await response.json();

    const select = document.getElementById("userSelect");

    if (!data.success) {

        select.innerHTML =
            "<option>Error loading users</option>";

        return;

    }

    select.innerHTML = "";

    data.users.forEach(user => {

        const option = document.createElement("option");

        option.value = user.id;

        option.textContent =
            user.username + " (" + user.email + ")";

        select.appendChild(option);

    });

}



// =====================================
// ADD BALANCE
// =====================================

document
    .getElementById("depositBtn")
    .addEventListener("click", async () => {

        const user_id =
            document.getElementById("userSelect").value;

        const coin =
            document.getElementById("coinSelect").value;

        const amount =
            document.getElementById("amount").value;

        if (!user_id || !amount) {

            showMessage(
                "Please complete all fields",
                false
            );

            return;

        }

        const response = await fetch("/api/admin/deposit", {

            method: "POST",

            credentials: "include",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                user_id: user_id,

                coin: coin,

                amount: amount

            })

        });

        const data = await response.json();

        showMessage(
            data.message,
            data.success
        );

        if (data.success) {

            document.getElementById("amount").value = "";

            loadDeposits();

        }

    });




// =====================================
// LOAD DEPOSIT HISTORY
// =====================================

async function loadDeposits() {

    const response = await fetch("/api/admin/deposits", {

        credentials: "include"

    });

    const data = await response.json();

    const table =
        document.getElementById("depositTable");

    if (!data.success) {

        table.innerHTML =

            `
            <tr>
                <td colspan="4">
                    No Data
                </td>
            </tr>
            `;

        return;

    }

    table.innerHTML = "";

    data.deposits.forEach(item => {

        table.innerHTML +=

            `
            <tr>

                <td>${item.username}</td>

                <td>${item.coin}</td>

                <td>${item.amount}</td>

                <td>${item.created_at}</td>

            </tr>
            `;

    });

}



// =====================================
// MESSAGE
// =====================================

function showMessage(message, success) {

    const box =
        document.getElementById("adminMessage");

    box.innerHTML = message;

    if (success) {

        box.style.color = "#22c55e";

    } else {

        box.style.color = "#ef4444";

    }

}



// =====================================
// START
// =====================================

window.onload = function () {

    loadUsers();

    loadDeposits();

};