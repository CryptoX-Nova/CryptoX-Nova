// =====================================
// CryptoX Nova Deposit
// =====================================

const coin = document.getElementById("coin");
const amount = document.getElementById("amount");
const depositBtn = document.getElementById("depositBtn");
const historyBody = document.getElementById("historyBody");

// =====================================
// SUBMIT DEPOSIT
// =====================================

depositBtn.addEventListener("click", submitDeposit);

async function submitDeposit() {

    const selectedCoin = coin.value;
    const depositAmount = Number(amount.value);

    if (!selectedCoin || depositAmount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    try {

        const response = await fetch("/api/deposit", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                coin: selectedCoin,
                amount: depositAmount

            })

        });

        const data = await response.json();

        alert(data.message);

        if (data.success) {

            amount.value = "";

            loadDepositHistory();

        }

    } catch (error) {

        console.error(error);

        alert("Server connection error.");

    }

}

// =====================================
// LOAD HISTORY
// =====================================

async function loadDepositHistory() {

    try {

        const response = await fetch("/api/deposit/history");

        const data = await response.json();

        historyBody.innerHTML = "";

        if (!data.success) {

            historyBody.innerHTML = `
                <tr>
                    <td colspan="5">No records found.</td>
                </tr>
            `;

            return;

        }

        data.deposits.forEach(deposit => {

            historyBody.innerHTML += `

                <tr>

                    <td>${deposit.id}</td>

                    <td>${deposit.coin}</td>

                    <td>${deposit.amount}</td>

                    <td>${deposit.status}</td>

                    <td>${deposit.created_at}</td>

                </tr>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}

// =====================================
// CryptoX Nova Admin Deposit
// =====================================

const pendingDepositTable =
document.getElementById("pendingDepositTable");

// =====================================
// LOAD PENDING DEPOSITS
// =====================================

async function loadPendingDeposits() {

    try {

        const response = await fetch("/api/admin/pending-deposits");

        const data = await response.json();

        pendingDepositTable.innerHTML = "";

        if (!data.success || data.deposits.length === 0) {

            pendingDepositTable.innerHTML = `
                <tr>
                    <td colspan="6">
                        No pending deposits.
                    </td>
                </tr>
            `;

            return;

        }

        data.deposits.forEach(deposit => {

            pendingDepositTable.innerHTML += `

                <tr>

                    <td>${deposit.id}</td>

                    <td>${deposit.username}</td>

                    <td>${deposit.coin}</td>

                    <td>${deposit.amount}</td>

                    <td>${deposit.status}</td>

                    <td>

                        <button onclick="approveDeposit(${deposit.id})">

                            Approve

                        </button>

                        <button onclick="rejectDeposit(${deposit.id})">

                            Reject

                        </button>

                    </td>

                </tr>

            `;

        });

    }

    catch (error) {

        console.error(error);

    }

}

// =====================================
// APPROVE
// =====================================

async function approveDeposit(id) {

    if (!confirm("Approve this deposit?")) {

        return;

    }

    const response = await fetch(

        `/api/admin/deposit/approve/${id}`,

        {
            method: "POST"
        }

    );

    const data = await response.json();

    alert(data.message);

    if(pendingDepositTable){

    loadPendingDeposits();

}
}

// =====================================
// REJECT
// =====================================

async function rejectDeposit(id) {

    if (!confirm("Reject this deposit?")) {

        return;

    }

    const response = await fetch(

        `/api/admin/deposit/reject/${id}`,

        {
            method: "POST"
        }

    );

    const data = await response.json();

    alert(data.message);

    loadPendingDeposits();

}

// =====================================
// START
// =====================================

loadDepositHistory();


if(pendingDepositTable){

    loadPendingDeposits();

}