// =====================================
// CryptoX Nova History JS
// =====================================


async function loadHistory(){

    try{


        const response = await fetch("/api/history");


        const data = await response.json();



        const table = document.getElementById("historyList");



        if(!table){

            console.error("History list element not found");

            return;

        }



        table.innerHTML = "";



        if(!data.success){


            table.innerHTML = `

                <tr>

                    <td colspan="5">

                        ${data.message || "Unable to load history"}

                    </td>

                </tr>

            `;


            return;

        }





        if(!data.history || data.history.length === 0){


            table.innerHTML = `

                <tr>

                    <td colspan="5">

                        No transactions found.

                    </td>

                </tr>

            `;


            return;

        }






        data.history.forEach(item=>{



            table.innerHTML += `


                <tr>


                    <td>

                        ${item.type}

                    </td>



                    <td>

                        ${item.coin}

                    </td>



                    <td>

                        ${Number(item.amount).toFixed(8)}

                    </td>



                    <td>

                        <span class="success">

                            Completed

                        </span>

                    </td>



                    <td>

                        ${item.created_at}

                    </td>



                </tr>


            `;



        });




    }


    catch(error){


        console.error("History loading error:", error);



        const table = document.getElementById("historyList");


        if(table){


            table.innerHTML = `

                <tr>

                    <td colspan="5">

                        Failed to load history.

                    </td>

                </tr>

            `;


        }


    }



}




// START

loadHistory();