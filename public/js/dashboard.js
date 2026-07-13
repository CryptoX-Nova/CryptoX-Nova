// =====================================
// CryptoX Nova Dashboard JS
// =====================================


// =====================================
// LOAD USER
// =====================================

async function loadUser(){

    const response = await fetch("/api/user/me");

    const data = await response.json();

    if(!data.success){

        location.href="/login.html";
        return;

    }

    const welcome = document.getElementById("welcome");

    if(welcome){

        welcome.innerHTML =
        "Welcome, " + data.user.username + " 👋";

    }

}



// =====================================
// LOAD WALLET
// =====================================

async function loadWallet(){


    try{


        const response = await fetch("/api/wallet");

        const data = await response.json();



        if(!data.success){

            return;

        }





        const wallet = document.getElementById("wallet");



        const icons = {

            BTC:"₿",
            ETH:"Ξ",
            SOL:"◎",
            USDT:"$"

        };



        const colors = {

            BTC:"btc",
            ETH:"eth",
            SOL:"sol",
            USDT:"usdt"

        };



        const names = {

            BTC:"Bitcoin",
            ETH:"Ethereum",
            SOL:"Solana",
            USDT:"Tether"

        };





        let html = "";

        let portfolio = 0;





        data.wallet.forEach(asset=>{


            const balance = Number(asset.balance);

            const price = Number(asset.price);



            // calculate total portfolio value


            portfolio += balance * price;



            // Update USDT Balance Card

if(asset.coin === "USDT"){

    const usdtBalance = document.getElementById("usdtBalance");


    if(usdtBalance){

        usdtBalance.innerHTML =

        "$" + balance.toLocaleString(undefined,{

            minimumFractionDigits:2,

            maximumFractionDigits:2

        });

    }

}





            if(wallet){


                html += `

                <div class="coin-card">


                    <div class="coin-top">


                        <div class="coin-name">

                            ${names[asset.coin]}

                        </div>



                        <div class="coin-icon ${colors[asset.coin]}">

                            ${icons[asset.coin]}

                        </div>


                    </div>




                    <div class="coin-balance">

${
asset.coin === "USDT"

?

balance.toLocaleString(undefined,{
minimumFractionDigits:2,
maximumFractionDigits:2
})

:

balance.toFixed(6)

}

</div>



                    <small>

                        ${asset.coin} • Price: $${price.toLocaleString()}

                    </small>



                </div>


                `;


            }





            // Update market cards


            if(asset.coin === "BTC"){

                const btcPrice = document.getElementById("btcPrice");

                if(btcPrice){

                    btcPrice.innerHTML =
                    "$" + price.toLocaleString();

                }

            }




            if(asset.coin === "ETH"){

                const ethPrice = document.getElementById("ethPrice");

                if(ethPrice){

                    ethPrice.innerHTML =
                    "$" + price.toLocaleString();

                }

            }




            if(asset.coin === "SOL"){

                const solPrice = document.getElementById("solPrice");

                if(solPrice){

                    solPrice.innerHTML =
                    "$" + price.toLocaleString();

                }

            }



        });







        // Insert wallet cards

        if(wallet){

            wallet.innerHTML = html;

        }







        // Update portfolio balance


        const portfolioText =
        document.getElementById("portfolio");



        if(portfolioText){


            portfolioText.innerHTML =

            "$" + portfolio.toLocaleString(undefined,{

                minimumFractionDigits:2,

                maximumFractionDigits:2

            });


        }





    }

    catch(error){


        console.log("Dashboard Wallet Error:", error);


    }



}





// START

loadWallet();


// =====================================
// LOAD TRADE HISTORY
// =====================================

async function loadTradeHistory(){

    try{

        const response = await fetch("/api/history");

        const data = await response.json();


        const activity =
        document.getElementById("tradeHistory");


        if(!activity){

            return;

        }



        if(!data.success || data.history.length === 0){


            activity.innerHTML = `

            <div class="activity-item">

            <i class="fa-solid fa-clock"></i>

            <span>
            No recent activity
            </span>

            </div>

            `;


            return;

        }





        let html = "";



        data.history.slice(0,5).forEach(item=>{


            let icon =
            item.type === "BUY"
            ?
            "fa-arrow-trend-up"
            :
            "fa-arrow-trend-down";



            html += `


            <div class="activity-item">


            <i class="fa-solid ${icon}"></i>


            <span>

            ${item.type} ${item.coin}

            • ${Number(item.amount).toFixed(6)}

            <br>

            <small>
            ${item.created_at}
            </small>


            </span>


            </div>


            `;


        });



        activity.innerHTML = html;



    }

    catch(error){

        console.log(error);

    }

}

// =====================================
// LOAD MARKET
// =====================================

async function loadMarket(){

    const response = await fetch("/api/market");

    const data = await response.json();

    if(!data.success){

        return;

    }

    data.market.forEach(coin=>{

        if(coin.coin==="BTC"){

            document.getElementById("btcPrice").innerHTML =
            "$"+Number(coin.price).toLocaleString();

        }

        if(coin.coin==="ETH"){

            document.getElementById("ethPrice").innerHTML =
            "$"+Number(coin.price).toLocaleString();

        }

        if(coin.coin==="SOL"){

            document.getElementById("solPrice").innerHTML =
            "$"+Number(coin.price).toLocaleString();

        }

    });

}


// =====================================
// START DASHBOARD
// =====================================

loadUser();

loadMarket();

loadWallet();

loadTradeHistory();