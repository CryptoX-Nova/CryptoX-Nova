// =====================================
// CryptoX Nova Trade JS
// =====================================

// ==============================
// LOAD WALLET BALANCE
// ==============================

async function loadBalance(){

    const balance = document.getElementById("balance");

    try{

        const response = await fetch("/api/wallet");

        const data = await response.json();


        if(!balance){
            console.error("Balance element not found");
            return;
        }


        if(!data.success){

            balance.innerHTML = "USDT Balance: 0";

            return;

        }


        const usdt = data.wallet.find(
            item => item.coin === "USDT"
        );


        if(usdt){

            balance.innerHTML =
            Number(usdt.balance).toLocaleString()
            + " USDT";

        } else {

            balance.innerHTML =
            "USDT Balance: 0";

        }


    }

    catch(error){

        console.error("Balance loading error:", error);


        if(balance){

            balance.innerHTML =
            "USDT Balance: Error";

        }


        showMessage(
            "Unable to load balance",
            "error"
        );

    }

}



// BUY
async function buyCoin(){

    const coin = document.getElementById("coin").value;

    const amount = Number(
        document.getElementById("amount").value
    );

    if(!amount || amount <= 0){

        alert("Enter valid amount");
        return;

    }

    const response = await fetch("/api/trade/buy",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            coin,
            amount

        })

    });

    const data = await response.json();

    alert(data.message);

    document.getElementById("amount").value = "";

    loadBalance();

}



// SELL
async function sellCoin(){

    const coin = document.getElementById("sellCoin").value;


    const amount = Number(
        document.getElementById("sellAmount").value
    );


    if(!amount || amount <= 0){

        alert("Enter valid amount");
        return;

    }



    const response = await fetch("/api/trade/sell",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            coin,
            amount

        })

    });



    const data = await response.json();


    alert(data.message);



    document.getElementById("sellAmount").value = "";


    loadBalance();


}



// Load balance when page opens
loadBalance();