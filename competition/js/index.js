var web3 = Web3 ? new Web3(Web3.givenProvider || "ws://localhost:8546") : null;

var account;
web3.eth.getAccounts().then((f) => {
  account = f[0];
});

messageBoardAbi = JSON.parse(
  `[{"inputs":[{"internalType":"string","name":"_msg","type":"string"}],"name":"setMessage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"num","type":"uint256"}],"name":"getLatestMessages","outputs":[{"components":[{"internalType":"string","name":"message","type":"string"},{"internalType":"uint256","name":"blockno","type":"uint256"}],"internalType":"struct MessageBoard.Msg[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMessages","outputs":[{"components":[{"internalType":"string","name":"message","type":"string"},{"internalType":"uint256","name":"blockno","type":"uint256"}],"internalType":"struct MessageBoard.Msg[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"msgList","outputs":[{"internalType":"string","name":"message","type":"string"},{"internalType":"uint256","name":"blockno","type":"uint256"}],"stateMutability":"view","type":"function"}]`
);

messageBoard = new web3.eth.Contract(messageBoardAbi);
messageBoard.options.address = "0xd2Ab7112E6A29680F856050E422cbAccEe79a904";

cyberDiceAbi = JSON.parse(
  `[{"inputs":[{"internalType":"address[]","name":"_relayers","type":"address[]"},{"internalType":"address","name":"_relayHub","type":"address"},{"internalType":"address","name":"_oracleCon","type":"address"},{"internalType":"uint256","name":"_deadline","type":"uint256"},{"internalType":"uint256","name":"_roundNumber","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"depositor","type":"address"},{"indexed":false,"internalType":"uint256","name":"deposit","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"signer","type":"address"},{"indexed":true,"internalType":"uint256","name":"newTickets","type":"uint256"},{"indexed":true,"internalType":"string","name":"message","type":"string"}],"name":"Entry","type":"event"},{"anonymous":false,"inputs":[],"name":"RequestBeacon","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"winningTicket","type":"uint256"},{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":true,"internalType":"uint256","name":"prize","type":"uint256"}],"name":"Winner","type":"event"},{"inputs":[],"name":"beacon","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"board","outputs":[{"internalType":"contract MessageBoard","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"computeWinner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"deadline","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"entries","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"oracleCon","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"relayHub","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"relayers","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"roundNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"sendPrize","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"startBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_message","type":"string"}],"name":"submit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalTickets","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userTickets","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"winner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]`
);
cyberDice = new web3.eth.Contract(cyberDiceAbi);
cyberDice.options.address = "0x122cDba8fc2F5A07A340165e48c9bdE5c2020212";

const totalMessages = 20;
$(document).ready(function () {
  messageBoard.methods
    .getLatestMessages(totalMessages)
    .call()
    .then((f) => {
      for (let i = 0; i < f.length; i++) {
        $("#blockTable").append(
          `<tr><td class="cell100 column1">` + f[i][1] + `</td></tr>`
        );
        $("#messages").append(
          `<tr><td class="cell100 column2">` + f[i][0] + `</td></tr>`
        );
      }

      if (f.length < totalMessages) {
        const diff = totalMessages - f.length;

        for (let i = 0; i < diff; i++) {
          $("#blockTable").append(`<tr><td class="cell100 column1"></td></tr>`);
          $("#messages").append(`<tr><td class="cell100 column2"></td></tr>`);
        }
      }
    });

  cyberDice.methods
    .deadline()
    .call()
    .then((f) => {
      const date = new Date(f * 1000);
      $("#deadline").append(date.toLocaleString());
    });
});
