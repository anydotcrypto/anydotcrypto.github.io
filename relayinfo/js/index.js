var web3 = Web3
  ? new Web3(
      Web3.givenProvider ||
        new Web3.providers.WebsocketProvider(
          "wss://mainnet.infura.io/ws/v3/7333c8bcd07b4a179b0b0a958778762b"
        )
    )
  : null;

var web3Ropsten = Web3
  ? new Web3(
      Web3.givenProvider ||
        new Web3.providers.WebsocketProvider(
          "wss://ropsten.infura.io/ws/v3/7333c8bcd07b4a179b0b0a958778762b"
        )
    )
  : null;

$(document).ready(function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const relayTxId = urlParams.get("relayTxId");

  if (!relayTxId) {
    return;
  }
  fetch("https://api.anydot.dev/any.sender.ropsten/status/" + relayTxId).then(
    function (response) {
      response.json().then(function (res) {
        addTransactions(res, web3Ropsten, 3);
      });
    }
  );

  fetch("https://api.anydot.dev/any.sender.mainnet/status/" + relayTxId).then(
    function (response) {
      response.json().then(function (res) {
        addTransactions(res, web3, 1);
      });
    }
  );
});

function addTransactions(res, web3Provider, chainId) {
  const broadcasts = res["broadcasts"];
  if (broadcasts && broadcasts.length > 0) {
    for (let i = 0; i < broadcasts.length; i++) {
      const hash = broadcasts[i]["ethTxHash"];

      let etherscan;
      if (chainId == 1) {
        etherscan = "https://etherscan.io/tx/" + hash;
      } else {
        etherscan = "https://ropsten.etherscan.io/tx/" + hash;
      }

      const broadcastTime = new Date(broadcasts[i]["broadcastTime"]);
      const gasPrice = broadcasts[i]["gasPrice"];

      const htmlLink =
        `<td class="cell100 column1" style="white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;"><a href="` +
        etherscan +
        `">` +
        hash +
        `</a></td>`;
      const htmlGasPrice =
        `<td class="cell100 column2" style='white-space: pre'>` +
        Number(web3.utils.fromWei(gasPrice, "gwei")).toFixed(0) +
        ` gwei</td>`;
      const htmlBroadcastTime =
        `<td class="cell100 column3" style='white-space: pre'>` +
        broadcastTime.toLocaleString() +
        `</td>`;
      $("#relaytransactions").append(
        "<tr id=" +
          hash +
          ">" +
          htmlLink +
          htmlGasPrice +
          htmlBroadcastTime +
          "</tr>"
      );

      // Let's check if it is mined!
      web3Provider.eth.getTransactionReceipt(hash).then(function (tx) {
        // Did we find a transaction receipt?
        // Then we assume it is confirmed
        if (tx) {
          if (tx.status) {
            $("#" + hash).css({ "background-color": "#ccffcc" });
          } else {
            $("#" + hash).css({ "background-color": "red" });
          }
        }
      });
    }
  }
}
