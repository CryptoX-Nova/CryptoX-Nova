document.addEventListener("DOMContentLoaded", () => {


loadExchangeWallet();



const amountInput = document.getElementById("exchangeAmount");
const fromCoin = document.getElementById("fromCoin");
const toCoin = document.getElementById("toCoin");
const receiveAmount = document.getElementById("receiveAmount");
const exchangeBtn = document.querySelector(".exchange-btn");




// TEMP PRICE MAP

const prices = {

    USDT: 1,

    BTC: 65000,

    ETH: 3500,

    SOL: 150

};





// ===============================
// CALCULATE EXCHANGE
// ===============================


if(
    amountInput &&
    fromCoin &&
    toCoin &&
    receiveAmount
){



function calculateExchange(){


    let amount = Number(amountInput.value);


    let from = fromCoin.value;

    let to = toCoin.value;



    if(amount <= 0){

        receiveAmount.value = "0.00";

        return;

    }



    if(from === to){

        receiveAmount.value = "0.00";

        return;

    }



    let usdValue = amount * prices[from];


    let result = usdValue / prices[to];



    receiveAmount.value =
    result.toFixed(8);



}



amountInput.addEventListener(
"input",
calculateExchange
);



fromCoin.addEventListener(
"change",
calculateExchange
);



toCoin.addEventListener(
"change",
calculateExchange
);



}





// ===============================
// CONFIRM EXCHANGE
// ===============================


if(exchangeBtn){



exchangeBtn.addEventListener(
"click",

async()=>{


let amount = Number(amountInput.value);

let receive = Number(receiveAmount.value);



if(!amount || amount <= 0){

alert("Enter amount");

return;

}




if(fromCoin.value === toCoin.value){

alert("Cannot exchange same coin");

return;

}





const confirmExchange = confirm(

`Convert ${amount} ${fromCoin.value} to ${receive} ${toCoin.value}?`

);



if(!confirmExchange){

return;

}





try{


const response = await fetch(

"/api/exchange",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

fromCoin: fromCoin.value,

toCoin: toCoin.value,

amount: amount,

receiveAmount: receive

})


}

);





const data = await response.json();





if(data.success){


alert(
"Exchange Successful!"
);



amountInput.value="";

receiveAmount.value="";



loadExchangeWallet();



}

else{


alert(

data.message || 
"Exchange failed"

);


}



}


catch(error){


console.log(
"Exchange Error:",
error
);


alert(
"Server connection error"
);


}



}


);



}



});









// ===============================
// LOAD WALLET BALANCE
// ===============================


async function loadExchangeWallet(){



try{



const res = await fetch(
"/api/wallet"
);



const data = await res.json();



if(!data.success){

return;

}





let balances = {

USDT:0,

BTC:0,

ETH:0,

SOL:0

};





data.wallet.forEach(asset=>{


if(balances.hasOwnProperty(asset.coin)){


balances[asset.coin] = asset.balance;


}


});







// PAY BALANCE


const payBalance =
document.getElementById("payBalance");


if(payBalance){


payBalance.innerHTML =

balances.USDT.toFixed(2)+" USDT";


}







// EXCHANGE BALANCE


const exchangeBalance =
document.getElementById("exchangeBalance");


if(exchangeBalance){


exchangeBalance.innerHTML =

balances.USDT.toFixed(2)+" USDT";


}







// ASSETS DISPLAY



const usdtBalance =
document.getElementById("usdtBalance");


if(usdtBalance){

usdtBalance.innerHTML =
balances.USDT.toFixed(2);

}





const btcBalance =
document.getElementById("btcBalance");


if(btcBalance){

btcBalance.innerHTML =
balances.BTC.toFixed(8);

}





const ethBalance =
document.getElementById("ethBalance");


if(ethBalance){

ethBalance.innerHTML =
balances.ETH.toFixed(8);

}





const solBalance =
document.getElementById("solBalance");


if(solBalance){

solBalance.innerHTML =
balances.SOL.toFixed(8);

}





}


catch(error){


console.log(

"Wallet Load Error:",
error

);


}



}