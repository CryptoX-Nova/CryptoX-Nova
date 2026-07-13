//
// CryptoX Nova - Market JS
//


// Load Market Data

async function loadMarket(){


    try{


        const response = await fetch("/api/market");


        const data = await response.json();



        const table = document.getElementById("marketTable");


        table.innerHTML = "";



        if(!data.success){


            table.innerHTML = `

            <tr>

                <td colspan="3">
                    Failed loading market
                </td>

            </tr>

            `;


            return;


        }



        data.market.forEach(coin => {



            table.innerHTML += `


            <tr>


                <td>

                    ${coin.coin}

                </td>



                <td>

                    $${Number(coin.price).toLocaleString()}

                </td>



                <td>


                    <a href="trade.html?coin=${coin.coin}">

                        Trade

                    </a>


                </td>



            </tr>


            `;



        });



    }catch(error){


        console.log(error);


    }



}




loadMarket();