// =====================================
// CryptoX Nova History JS
// =====================================

async function loadHistory(){

    try{

        const response = await fetch("/api/history");

        const data = await response.json();

        if(!data.success){

            alert(data.message);

            return;

        }

        const table = document.getElementById("historyTable");

        table.innerHTML = "";

        if(data.history.length === 0){

            table.innerHTML = `
                <tr>
                    <td colspan="6">No transactions found.</td>
                </tr>
            `;

            return;

        }

        data.history.forEach(item=>{

            table.innerHTML += `

                <tr>

                    <td>${item.created_at}</td>

                    <td>${item.type}</td>

                    <td>${item.coin}</td>

                    <td>${Number(item.amount).toFixed(8)}</td>

                    <td>$${Number(item.price).toLocaleString()}</td>

                    <td>$${Number(item.total).toFixed(2)}</td>

                </tr>

            `;

        });

    }catch(err){

        console.log(err);

    }

}

loadHistory();