

const run = async () => {

  // change ticker/symbol for other crypto pairs availbe at binance, updates every 1000 ms
  let streams = ['btcusdt','ethusdt','bnbusdt','bchusdt','maticusdt','runeusdt'];

  let streams2 = await fetchText();

  // https://binance-docs.github.io/apidocs/spot/en/#all-market-rolling-window-statistics-streams
  //let ws = new WebSocket("wss://stream.binance.com:9443/ws/" + streams.join('/'));
  let ws = new WebSocket("wss://stream.binance.com:9443/ws/" + streams2.join('@ticker/')+"@ticker");

  // let ws2 = new WebSocket("wss://stream.binance.com:9443/ws/" + "!ticker@arr");



  
  // loop through stream list and add ticker name (cell1) make cell2 and 3 empty
  // while waiting for info from binance/ws
    

    async function fetchText() {

      let new_ticker = "ethbtc"
      add_new_ticker(new_ticker, streams)

      let table = document.getElementById("myTable");
      // remove dup from array
      let tickers = [...new Set(streams)];
      console.log(tickers)

      let response2 = await fetch('tokenlist.json');
      let data2 = await response2.text();
      const obj2 = JSON.parse(data2);

      let sec_ticker = ['USDT','BUSD','BTC']
      

      for (let i = 0; i < tickers.length; i++) {

        let row = table.insertRow(-1);
        let cell0 = row.insertCell(0);
        let cell1 = row.insertCell(1);
        let cell2 = row.insertCell(2);
        let cell3 = row.insertCell(3);
        let ticker = tickers[i].toUpperCase()
        let sec_pair = "";

        for (let j = 0; j < sec_ticker.length; j++){
          if((ticker.split(sec_ticker[j])[0]).length < ticker.length ){
            ticker = ticker.split(sec_ticker[j])[0]
            sec_pair = sec_ticker[j]
            break;
          }
        }


        let long_name = obj2.tokens.find(el => el.symbol === ticker);

        let url_ = long_name["logoURI"];

        const myHtml = '<img src="' + url_ + '" width="20" height=20>';
  
        ticker = ticker + sec_pair;
        cell0.innerHTML = myHtml
        cell1.textContent = ticker;
        cell2.textContent = "NULL";
        cell3.textContent = "NULL"
        cell1.id = ticker
        cell2.id = ticker + "p"
        cell3.id = ticker + "_P"
      }
      return streams;
  }

  async function add_new_ticker(ticker_name, streams_in){
    
    let stream_out = streams_in.push(ticker_name)

    return stream_out;
  }

  ws.onmessage = async(msg) =>{
    const incomingData = JSON.parse(msg.data.toString());
    if (incomingData.E) {
      
      // rounds up 2 decimal fix if need more decimals points for some
      const symbolPrice = (Number(incomingData.c)).toFixed(2);

      // price
      let para = document.getElementById(incomingData.s.toUpperCase()+"p");
      para.textContent = symbolPrice;

      // percentage 24 hours
      let para2 = document.getElementById(incomingData.s.toUpperCase()+'_P');
      para2.textContent = (Number(incomingData.P)).toFixed(2)+'%';

      if ((Number(incomingData.P)).toFixed(2) >= 0.01){
        para2.style.color = '#178b00' // green
      }
      else if((Number(incomingData.P)).toFixed(2) <= -0.01){
        para2.style.color = '#8b0000' // red
      }
      else{
        para2.style.color = '#ffffff' // white
      }

      
  }
 }
}

function sortTable(n, type_of) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("myTable");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      x = x.textContent;
      y = y.textContent;

      if(type_of){
        x = x.split('%')[0]
        y = y.split('%')[0]
        x = parseFloat(x);
        y = parseFloat(y);
      }
    
      if (dir == "asc") {
        if (x > y) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x < y) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

run();