//
// CryptoX Nova - Wallet JS V3
//


async function loadWallet() {


    try {


        const response = await fetch("/api/wallet");

        const data = await response.json();



        if(!data.success){


            location.href = "login.html";

            return;


        }





        // ===============================
        // WALLET / PORTFOLIO VALUE
        // ===============================


        const portfolioValue = document.getElementById("portfolioValue");


        if(portfolioValue){


            portfolioValue.innerHTML =

            "$" + Number(data.portfolioValue).toLocaleString(undefined,{

                minimumFractionDigits:2,

                maximumFractionDigits:2

            });


        }





        // ===============================
        // 24H PROFIT
        // ===============================


        const profit24h = document.getElementById("profit24h");


        if(profit24h){


            profit24h.innerHTML = "+12.5% Today";


        }







        // ===============================
        // WALLET ASSETS
        // ===============================


        if(data.wallet){


            data.wallet.forEach(asset=>{


                const balance = Number(asset.balance);

                const price = Number(asset.price);





                switch(asset.coin){



                    case "BTC":


                        const btcBalance = document.getElementById("btcBalance");


                        if(btcBalance){

                            btcBalance.innerHTML =
                            balance.toFixed(6);

                        }



                        const btcPrice = document.getElementById("btcPrice");


                        if(btcPrice){

                            btcPrice.innerHTML =
                            "BTC • $" + price.toLocaleString();

                        }


                    break;






                    case "ETH":


                        const ethBalance = document.getElementById("ethBalance");


                        if(ethBalance){

                            ethBalance.innerHTML =
                            balance.toFixed(6);

                        }



                        const ethPrice = document.getElementById("ethPrice");


                        if(ethPrice){

                            ethPrice.innerHTML =
                            "ETH • $" + price.toLocaleString();

                        }


                    break;








                    case "SOL":


                        const solBalance = document.getElementById("solBalance");


                        if(solBalance){

                            solBalance.innerHTML =
                            balance.toFixed(6);

                        }



                        const solPrice = document.getElementById("solPrice");


                        if(solPrice){

                            solPrice.innerHTML =
                            "SOL • $" + price.toLocaleString();

                        }


                    break;








                    case "USDT":


                        const usdtBalance = document.getElementById("usdtBalance");


                        if(usdtBalance){

                            usdtBalance.innerHTML =

                            balance.toLocaleString(undefined,{

                                minimumFractionDigits:2,

                                maximumFractionDigits:2

                            });


                        }




                        const usdtPrice = document.getElementById("usdtPrice");


                        if(usdtPrice){

                            usdtPrice.innerHTML =
                            "USDT • $1.00";

                        }


                    break;



                }



            });



        }



    }


    catch(error){


        console.log("Wallet Error:",error);


    }



}





loadWallet();