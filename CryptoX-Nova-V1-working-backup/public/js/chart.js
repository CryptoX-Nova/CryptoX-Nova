function loadChart(symbol="BINANCE:BTCUSDT"){


    const chart = document.getElementById("tradingview_chart");


    chart.innerHTML="";



    new TradingView.widget({

        "width":"100%",

        "height":650,

        "symbol":symbol,

        "interval":"15",

        "timezone":"Asia/Manila",

        "theme":"dark",

        "style":"1",

        "locale":"en",

        "toolbar_bg":"#111827",

        "enable_publishing":false,

        "hide_top_toolbar":false,

        "hide_legend":false,

        "allow_symbol_change":true,

        "container_id":"tradingview_chart"


    });


}




window.onload=function(){

    loadChart();

};