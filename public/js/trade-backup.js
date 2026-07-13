// =====================================
// CryptoX Nova Trade JS
// =====================================

// Load Wallet Balance
async function loadBalance(){

    const response = await fetch("/api/wallet");

    const data = await response.json();

    if(!data.success){

        document.getElementById("balance").innerHTML =
        "USDT Balance: 0";

        return;

    }

    const usdt = data.wallet.find(
        item => item.coin === "USDT"
    );

    document.getElementById("balance").innerHTML =
    "USDT Balance: " +
    Number(usdt.balance).toLocaleString() +
    " USDT";

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