// =====================================
// LOAD DASHBOARD STATS
// =====================================

async function loadStats(){

    try{

        const response = await fetch("/api/admin/stats",{
            credentials:"include"
        });

        const data = await response.json();

        if(!data.success){
            return;
        }

        const totalUsers = document.getElementById("totalUsers");
        const totalDeposits = document.getElementById("totalDeposits");
        const platformBalance = document.getElementById("platformBalance");
        const totalTrades = document.getElementById("totalTrades");

        if(totalUsers){
            totalUsers.textContent = data.totalUsers;
        }

        if(totalDeposits){
            totalDeposits.textContent =
                Number(data.totalDeposits).toLocaleString();
        }

        if(platformBalance){
            platformBalance.textContent =
                Number(data.platformBalance).toLocaleString();
        }

        if(totalTrades){
            totalTrades.textContent = data.totalTrades;
        }

    }catch(err){

        console.log(err);

    }

}

// =====================================
// LOAD USERS
// =====================================

async function loadUsers() {

    try {

        const response = await fetch("/api/admin/users", {

            credentials: "include"

        });

        const data = await response.json();

        if (!data.success) return;

        // Dropdown

        const select =
            document.getElementById("userSelect");

        select.innerHTML = "";

        // Users Table

        const table =
            document.getElementById("usersTable");

        table.innerHTML = "";

        data.users.forEach(user => {

            // Dropdown

            const option =
                document.createElement("option");

            option.value = user.id;

            option.textContent =
                user.username + " (" + user.email + ")";

            select.appendChild(option);

            // Table

           table.innerHTML += `

<tr>

<td>
${user.id}
</td>


<td>

<div class="user-info">

<i class="fa-solid fa-user"></i>

${user.username}

</div>

</td>


<td>

${user.email}

</td>



<td>

<span class="role-badge ${user.role}">

${user.role}

</span>

</td>



<td>

<span class="status-online">

Active

</span>

</td>


</tr>

`;

        });

    } catch (err) {

        console.log(err);

    }

}


// =====================================
// LOAD DEPOSIT HISTORY
// =====================================

async function loadDeposits() {

    try {

        const response = await fetch("/api/admin/deposits", {

            credentials: "include"

        });

        const data = await response.json();

        const table =
            document.getElementById("depositTable");

        if (!table) return;

        if (!data.success) {

            table.innerHTML = `

            <tr>

                <td colspan="4">

                    No deposit history.

                </td>

            </tr>

            `;

            return;

        }

        table.innerHTML = "";

        data.deposits.forEach(item => {

            table.innerHTML += `

            <tr>

                <td>${item.username}</td>

                <td>${item.coin}</td>

                <td>${Number(item.amount).toLocaleString()}</td>

                <td>${item.created_at}</td>

            </tr>

            `;

        });

    } catch (err) {

        console.log(err);

    }

}

// =====================================
// LOAD PENDING DEPOSITS
// =====================================

async function loadPendingDeposits(){

    console.log("LOADING PENDING DEPOSITS");

    try {

        const response = await fetch(
            "/api/admin/pending-deposits",
            {
                credentials:"include"
            }
        );


        console.log(
            "PENDING DEPOSIT STATUS:",
            response.status
        );


        const data = await response.json();


        console.log(
            "PENDING DEPOSIT DATA:",
            data
        );


        const table = 
            document.getElementById("pendingDepositTable");


        if(!table){
            console.log("pendingDepositTable not found");
            return;
        }


        table.innerHTML = "";


        if(!data.success){

            table.innerHTML = `

            <tr>

                <td colspan="6">
                    Failed to load deposits
                </td>

            </tr>

            `;

            return;

        }



        if(!data.deposits || data.deposits.length === 0){


            table.innerHTML = `

            <tr>

                <td colspan="6">
                    No pending deposits
                </td>

            </tr>

            `;


            return;

        }



        data.deposits.forEach(item => {


            table.innerHTML += `

            <tr>

                <td>
                    ${item.id}
                </td>


                <td>
                    ${item.username}
                </td>


                <td>
                    ${item.coin}
                </td>


                <td>
                    ${Number(item.amount).toLocaleString()}
                </td>


                <td>

                    <span class="status-pending">
                        ${item.status}
                    </span>

                </td>


                <td>

                    <button 
                    onclick="approveDeposit(${item.id})">

                        Approve

                    </button>


                    <button 
                    onclick="rejectDeposit(${item.id})">

                        Reject

                    </button>


                </td>


            </tr>

            `;


        });



    } catch(err) {


        console.log(
            "LOAD PENDING DEPOSIT ERROR:",
            err
        );


        const table =
        document.getElementById("pendingDepositTable");


        if(table){

            table.innerHTML = `

            <tr>

                <td colspan="6">
                    Server error
                </td>

            </tr>

            `;

        }


    }


}

// =====================================
// APPROVE DEPOSIT
// =====================================

async function approveDeposit(id){

    const response = await fetch(

        "/api/admin/deposit/approve/" + id,

        {
            method:"POST",
            credentials:"include"
        }

    );


    const data = await response.json();


    alert(data.message);


    loadPendingDeposits();

    loadDeposits();

    loadStats();

}



// =====================================
// REJECT DEPOSIT
// =====================================

async function rejectDeposit(id){

    const response = await fetch(

        "/api/admin/deposit/reject/" + id,

        {
            method:"POST",
            credentials:"include"
        }

    );


    const data = await response.json();


    alert(data.message);


    loadPendingDeposits();

}


// =====================================
// ADMIN ANALYTICS CHART
// =====================================

async function loadAdminChart(){

    try{

        const response = await fetch("/api/admin/stats",{
            credentials:"include"
        });


        const data = await response.json();


        const canvas = document.getElementById("adminChart");


        if(!canvas) return;



        new Chart(canvas, {


            type:"doughnut",


            data:{


                labels:[

                    "Users",

                    "Deposits",

                    "Trades"

                ],


                datasets:[{

                    data:[

                        data.totalUsers,

                        data.totalDeposits,

                        data.totalTrades

                    ]

                }]

            },


            options:{


                responsive:true,


                plugins:{


                    legend:{


                        position:"bottom",

                        labels:{

                            color:"#ffffff"

                        }


                    }


                }


            }


        });



    }catch(err){

        console.log(err);

    }


}

// =====================================
// ADMIN ADD BALANCE
// =====================================

const depositBtn = document.getElementById("depositBtn");


if(depositBtn){


depositBtn.addEventListener("click", async()=>{


    const user_id =
    document.getElementById("userSelect").value;


    const coin =
    document.getElementById("coinSelect").value;


    const amount =
    document.getElementById("amount").value;



    if(!user_id || !amount){

        alert("Complete all fields");

        return;

    }



    try{


        const response = await fetch("/api/admin/deposit",{


            method:"POST",


            headers:{


                "Content-Type":"application/json"


            },


            credentials:"include",


            body:JSON.stringify({


                user_id,

                coin,

                amount


            })


        });



        const data = await response.json();



        alert(data.message);



        if(data.success){


            document.getElementById("amount").value="";


            loadDeposits();

            loadStats();


        }



    }catch(err){


        console.log(err);


    }



});


}


// =========================
// LOAD PENDING WITHDRAWALS
// =========================

async function loadWithdrawals(){

    try{

        console.log("LOADING WITHDRAWALS");


        const response = await fetch(
            "/api/admin/pending-withdrawals",
            {
                credentials:"include"
            }
        );


        console.log(
            "WITHDRAW STATUS:",
            response.status
        );


        const data = await response.json();


        console.log(
            "WITHDRAW DATA:",
            data
        );


        const table = document.getElementById("withdrawTable");


        if(!table){

            console.log(
                "withdrawTable not found"
            );

            return;

        }


        table.innerHTML = "";


        if(
            !data.success ||
            !data.withdrawals ||
            data.withdrawals.length === 0
        ){

            table.innerHTML = `

            <tr>

                <td colspan="6">

                    No pending withdrawals.

                </td>

            </tr>

            `;

            return;

        }



        data.withdrawals.forEach(withdraw => {


            table.innerHTML += `

            <tr>

                <td>
                    ${withdraw.id}
                </td>


                <td>
                    ${withdraw.username}
                </td>


                <td>
                    ${withdraw.coin}
                </td>


                <td>
                    ${Number(withdraw.amount).toLocaleString()}
                </td>


                <td>

                    <span class="status-pending">

                        ${withdraw.status}

                    </span>

                </td>



                <td>


                    <button 
                    class="approve-btn"
                    onclick="approveWithdraw(${withdraw.id})">

                        Approve

                    </button>



                    <button 
                    class="reject-btn"
                    onclick="rejectWithdraw(${withdraw.id})">

                        Reject

                    </button>


                </td>


            </tr>

            `;


        });



    }catch(err){

        console.log(
            "WITHDRAW LOAD ERROR:",
            err
        );

    }

}

// =====================================
// APPROVE WITHDRAW
// =====================================

async function approveWithdraw(id){

    console.log("APPROVE WITHDRAW CLICKED:", id);


    const response = await fetch(
        "/api/admin/withdraw/approve/" + id,
        {
            method:"POST",
            credentials:"include"
        }
    );


    console.log("WITHDRAW APPROVE STATUS:", response.status);


    const data = await response.json();


    console.log("WITHDRAW APPROVE RESPONSE:", data);


    alert(data.message);


    loadWithdrawals();
    loadStats();

}


// =====================================
// REJECT WITHDRAW
// =====================================

async function rejectWithdraw(id){

    const response = await fetch(

        "/api/admin/withdraw/reject/" + id,

        {
            method:"POST",
            credentials:"include"
        }

    );

    const data = await response.json();

    alert(data.message);

loadWithdrawals();
loadStats();
}



// =====================================
// START
// =====================================

window.approveWithdraw = approveWithdraw;
window.rejectWithdraw = rejectWithdraw;

window.onload = () => {

    console.log("ADMIN JS START");

    console.log("loading stats");
    loadStats();

    console.log("loading users");
    loadUsers();

    console.log("loading deposits");
    loadDeposits();

    console.log("loading pending deposits");
    loadPendingDeposits();

    console.log("loading withdrawals");
    loadWithdrawals();

};