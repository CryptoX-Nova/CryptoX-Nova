// =====================================
// CryptoX Nova Admin Panel V2
// =====================================

// =====================================
// ADMIN ACCESS CHECK
// =====================================

async function checkAdmin(){

    const response = await fetch("/api/user/me", {
        credentials:"include"
    });


    const data = await response.json();


    if(!data.success){

        window.location.href="/login.html";

        return;

    }


    if(data.user.role !== "admin"){

        alert("Admin access only");

        window.location.href="/dashboard.html";

        return;

    }


}


// =====================================
// DASHBOARD STATS
// =====================================

async function loadStats() {

    try {

        const response = await fetch("/api/admin/stats", {
            credentials: "include"
        });

        const data = await response.json();

        if (!data.success) return;

        document.getElementById("totalUsers").textContent =
            data.totalUsers;

        document.getElementById("totalDeposits").textContent =
            "$" + Number(data.totalDeposits).toLocaleString();

        document.getElementById("platformBalance").textContent =
            "$" + Number(data.platformBalance).toLocaleString();

            // HERO MINI STATS

const heroUsers = document.getElementById("heroUsers");

if(heroUsers){

    heroUsers.textContent = data.totalUsers;

}



const heroTrades = document.getElementById("heroTrades");

if(heroTrades){

    heroTrades.textContent = data.totalTrades;

}



const heroBalance = document.getElementById("heroBalance");

if(heroBalance){

    heroBalance.textContent =
    "$" + Number(data.platformBalance).toLocaleString();

}

        const trades = document.getElementById("totalTrades");

        if (trades) {

            trades.textContent = data.totalTrades;

        }

    } catch (err) {

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
// CryptoX Nova Admin Panel V2
// =====================================

// =====================================
// DASHBOARD STATS
// =====================================

async function loadStats() {

    try {

        const response = await fetch("/api/admin/stats", {
            credentials: "include"
        });

        const data = await response.json();

        if (!data.success) return;

        document.getElementById("totalUsers").textContent =
            data.totalUsers;

        document.getElementById("totalDeposits").textContent =
            "$" + Number(data.totalDeposits).toLocaleString();

        document.getElementById("platformBalance").textContent =
            "$" + Number(data.platformBalance).toLocaleString();

        const trades = document.getElementById("totalTrades");

        if (trades) {

            trades.textContent = data.totalTrades;

        }

    } catch (err) {

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

                <td>${user.id}</td>

                <td>${user.username}</td>

                <td>${user.email}</td>

                <td>${user.role}</td>

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

// =====================================
// ADMIN ANALYTICS CHART
// =====================================


async function loadAdminChart(){


const response = await fetch("/api/admin/stats",{

credentials:"include"

});


const data = await response.json();



const ctx =
document.getElementById("adminChart");



if(!ctx) return;



new Chart(ctx, {


type:"bar",


data:{


labels:[

"Users",

"Deposits",

"Balance",

"Trades"

],


datasets:[{

label:"Platform Data",

data:[

data.totalUsers,

data.totalDeposits,

data.platformBalance,

data.totalTrades

]


}]


},



options:{


responsive:true,


plugins:{


legend:{


display:false


}


}


}



});



}

// =====================================
// START
// =====================================

window.onload = () => {

    loadStats();

    loadUsers();

    loadDeposits();

    loadPendingDeposits();

    loadWithdrawals();

    loadAdminChart();

};