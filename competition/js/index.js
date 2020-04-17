var web3 = Web3 ? new Web3(Web3.givenProvider || "ws://localhost:8546") : null;

var account;
web3.eth.getAccounts().then((f) => {
  account = f[0];
});

abi = JSON.parse(
  `[{"inputs":[{"internalType":"string","name":"_msg","type":"string"}],"name":"setMessage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"num","type":"uint256"}],"name":"getLatestMessages","outputs":[{"components":[{"internalType":"string","name":"message","type":"string"},{"internalType":"uint256","name":"blockno","type":"uint256"}],"internalType":"struct MessageBoard.Msg[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMessages","outputs":[{"components":[{"internalType":"string","name":"message","type":"string"},{"internalType":"uint256","name":"blockno","type":"uint256"}],"internalType":"struct MessageBoard.Msg[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"msgList","outputs":[{"internalType":"string","name":"message","type":"string"},{"internalType":"uint256","name":"blockno","type":"uint256"}],"stateMutability":"view","type":"function"}]`
);
contract = new web3.eth.Contract(abi);
contract.options.address = "0x219E6C517D0d2fD0480cED38ceaDdA4707B99EAf";

$(document).ready(function () {
  contract.methods
    .getLatestMessages(25)
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
    });
});
