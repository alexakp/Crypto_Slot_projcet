(function () {
  const items = [
    '🍭',
    '💩',
  ];
  const doors = document.querySelectorAll('.door');
  let balance_usd = 1000;
  let bet_size_id = 0; // 1 5 10 50 100 200 500 1000, groups
  let bet_size_group = [1,5,10,20,50,100,200,500,1000]
  console.log('------------------')

  document.querySelector('#spinner').addEventListener('click', spin);
  document.querySelector('#decrease_bet_size').addEventListener('click', decrease_bet);
  document.getElementById("decrease_bet_size").disabled = true;
  document.querySelector('#increase_bet_size').addEventListener('click', increase_bet);

  function init(firstInit = true, groups = 1, duration = 2) {
  const arrBoxes = []

  document.getElementById("balance").textContent = "Balance: " + balance_usd +"$";

  document.getElementById("betsize").textContent = "Bet size: " + bet_size_group[bet_size_id] +"$";

    for (const door of doors) {

      const boxes = door.querySelector('.boxes');
      const boxesClone = boxes.cloneNode(false);
      let pool = ['❓'];



      // Only use ❓ for first spin
      if (!firstInit){
        pool = [];
      }

      // what ... does in JS
      // https://stackoverflow.com/questions/31048953/what-are-these-three-dots-in-react-doing#:~:text=(three%20dots%20in%20JavaScript)%20is,It%20is%20a%20JavaScript%20operator.

      // var arr1 = ['two', 'three'];
      // var arr2 = ['one', ...arr1, 'four', 'five'];
      // output // arr2 = ["one", "two", "three", "four", "five"]



      const arr = [];
      // randomize symbols shown before finale symbols
      for (let i = 0; i < 10; i++){
        for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
          arr.push(...items);
        }
      }

      pool.push(...shuffle(arr));


      let lastElement = pool.slice(-1)[0]
      arrBoxes.push(lastElement)
      console.log(pool)

      boxesClone.addEventListener(
        'transitionstart',
        function () {
          door.dataset.spinned = '1';
          this.querySelectorAll('.box').forEach((box) => {
            box.style.filter = 'blur(1px)';
          });
        },
        { once: true }
      );

      boxesClone.addEventListener(
        'transitionend',
        function () {
          this.querySelectorAll('.box').forEach((box, index) => {
            box.style.filter = 'blur(0)';
            if (index > 0) this.removeChild(box);
          });
        },
        { once: true }
      );
      
      for (let i = pool.length - 1; i >= 0; i--) {
        const box = document.createElement('div');
        box.classList.add('box');
        box.style.width = door.clientWidth + 'px';
        box.style.height = door.clientHeight + 'px';
        box.textContent = pool[i];
        boxesClone.appendChild(box);
      }
      boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
      boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
      door.replaceChild(boxesClone, boxes);
    }
    if (!firstInit){
      three_bool = three_in_a_row(arrBoxes)
      if (three_bool){
        balance_usd = balance_usd + 4 * bet_size_group[bet_size_id];
        console.log("THREE IN a  ROW EZ")
        return 1
      }
    }
    return 0
  }

  async function decrease_bet(){
    if(bet_size_id > 0){
      bet_size_id--;
      document.getElementById("increase_bet_size").disabled = false;
      if(bet_size_id == 0){
        document.getElementById("decrease_bet_size").disabled = true;
      }
    }
    document.getElementById("betsize").textContent = "Bet size: " + bet_size_group[bet_size_id] +"$";
    check_balance()
  }

  async function increase_bet(){
    if(bet_size_id < bet_size_group.length - 1){
      bet_size_id++;
      document.getElementById("decrease_bet_size").disabled = false;
      if(bet_size_id == bet_size_group.length - 1){
        document.getElementById("increase_bet_size").disabled = true;
      }
    }
    document.getElementById("betsize").textContent = "Bet size: " + bet_size_group[bet_size_id] +"$";
    check_balance()
  }

  async function check_balance(){
    if(balance_usd < bet_size_group[bet_size_id]){
      document.getElementById("spinner").disabled = true;
    }
    else if(balance_usd >= bet_size_group[bet_size_id]){
      document.getElementById("spinner").disabled = false;
    }
  }

  async function spin() {
    // update balance_usd
    balance_usd = balance_usd - bet_size_group[bet_size_id];

    document.getElementById("spinner").disabled = true;
    
    let is_win = init(false, 1, 2);
    
    for (const door of doors) {
      const boxes = door.querySelector('.boxes');
      const duration = parseInt(boxes.style.transitionDuration);
      boxes.style.transform = 'translateY(0)';
      await new Promise((resolve) => setTimeout(resolve, duration * 100));
    }
    await sleep(2200);
    if(is_win){
      let win_sound = new Audio("jackpot_sound.mp3")
      win_sound.volume = 0.2
      win_sound.play()
    }
    document.getElementById("balance").textContent = "Balance: " + balance_usd +"$";

    // Bet size needs to be smaller than balance
    if(balance_usd >= bet_size_group[bet_size_id]){
      document.getElementById("spinner").disabled = false;
    }
  }

  function shuffle([...arr]) {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function three_in_a_row(_array){ 
      if(typeof _array !== 'undefined'){
          return !!_array.reduce(function(a, b){ return (a === b) ? a : NaN; });
      }
          return "Array is Undefined";
  }
 init();
})();