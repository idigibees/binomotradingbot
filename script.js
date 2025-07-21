let balance = 10000;
let lastPrice = 0;
let tradeLog = [];

async function fetchPrice() {
  const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=inr");
  const data = await res.json();
  const price = data.bitcoin.inr;
  document.getElementById("price").innerText = price.toLocaleString("en-IN");
  return price;
}

async function placeTrade(type) {
  const amount = parseInt(document.getElementById("amount").value);
  const priceNow = await fetchPrice();

  if (amount > balance) {
    document.getElementById("result").innerText = "❌ Not enough balance.";
    return;
  }

  if (lastPrice === 0) {
    lastPrice = priceNow;
    document.getElementById("result").innerText = "📊 First price saved. Wait for next move.";
    return;
  }

  const isUp = priceNow > lastPrice;
  const success = (type === 'buy' && isUp) || (type === 'sell' && !isUp);
  const payout = Math.round(amount * 0.83);

  if (success) {
    balance += payout;
    document.getElementById("result").innerText = `✅ You WON ₹${payout}`;
    logTrade(type, "WON", payout, priceNow);
  } else {
    balance -= amount;
    document.getElementById("result").innerText = `❌ You LOST ₹${amount}`;
    logTrade(type, "LOST", amount, priceNow);
  }

  document.getElementById("balance").innerText = balance;
  lastPrice = priceNow;
}

function logTrade(type, result, value, price) {
  const logItem = `${new Date().toLocaleTimeString()} - ${type.toUpperCase()} - ${result} - ₹${value} @ ₹${price}`;
  tradeLog.unshift(logItem);
  updateHistory();
}

function updateHistory() {
  const logEl = document.getElementById("trade-log");
  logEl.innerHTML = "";
  tradeLog.slice(0, 10).forEach(trade => {
    const li = document.createElement("li");
    li.innerText = trade;
    logEl.appendChild(li);
  });
}

// Initial price fetch every 5s
fetchPrice();
setInterval(fetchPrice, 5000);
