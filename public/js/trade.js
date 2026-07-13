// =====================================
// CryptoX Nova Trade JS V2
// =====================================


// ==============================
// SHOW MESSAGE
// ==============================

function showMessage(text, type=""){

    const message = document.getElementById("message");

    if(!message) return;


    message.innerHTML = text;


    message.className = type;


    setTimeout(()=>{

        message.innerHTML = "";

    },4000);

}




// ==============================
// LOAD WALLET BALANCE
// ==============================

async function loadBalance(){

    try{


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



        if(usdt){


            document.getElementById("balance").innerHTML =

            Number(usdt.balance)
            .toLocaleString()

            + " USDT";


        }



    }

    catch(error){


        console.error(error);


        showMessage(
            "Unable to load balance",
            "error"
        );


    }


}




// ==============================
// BUY COIN
// ==============================

async function buyCoin(){


    const coin =
    document.getElementById("coin").value;



    const amount =
    Number(
        document.getElementById("amount").value
    );



    if(!amount || amount <= 0){


        showMessage(
            "Enter valid amount",
            "error"
        );


        return;

    }



    try{


        const response = await fetch(
            "/api/trade/buy",
            {


            method:"POST",


            headers:{


                "Content-Type":"application/json"

            },


            body:JSON.stringify({

                coin,
                amount

            })


        });



        const data =
        await response.json();



        showMessage(
            data.message,
            data.success ? "success":"error"
        );



        document.getElementById("amount").value="";



        loadBalance();



    }


    catch(error){


        console.error(error);


        showMessage(
            "Buy failed",
            "error"
        );


    }


}




// ==============================
// SELL COIN
// ==============================

async function sellCoin(){



    const coin =
    document.getElementById("sellCoin").value;



    const amount =
    Number(
        document.getElementById("sellAmount").value
    );



    if(!amount || amount <= 0){


        showMessage(
            "Enter valid amount",
            "error"
        );


        return;

    }




    try{


        const response = await fetch(
            "/api/trade/sell",
            {


            method:"POST",


            headers:{


                "Content-Type":"application/json"

            },


            body:JSON.stringify({

                coin,
                amount

            })


        });



        const data =
        await response.json();



        showMessage(
            data.message,
            data.success ? "success":"error"
        );



        document.getElementById("sellAmount").value="";



        loadBalance();



    }



    catch(error){


        console.error(error);


        showMessage(
            "Sell failed",
            "error"
        );


    }


}





// ==============================
// START
// ==============================

loadBalance();