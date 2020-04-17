web3 = new Web3(Web3.givenProvider);

var account;
web3.eth.getAccounts().then((f) => {
  account = f[0];
});

abi = JSON.parse(
  `[{"inputs":[{"internalType":"string","name":"_msg","type":"string"}],"name":"setMessage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"num","type":"uint256"}],"name":"getLatestMessages","outputs":[{"components":[{"internalType":"string","name":"message","type":"string"},{"internalType":"uint256","name":"blockno","type":"uint256"}],"internalType":"struct MessageBoard.Msg[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMessages","outputs":[{"components":[{"internalType":"string","name":"message","type":"string"},{"internalType":"uint256","name":"blockno","type":"uint256"}],"internalType":"struct MessageBoard.Msg[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"msgList","outputs":[{"internalType":"string","name":"message","type":"string"},{"internalType":"uint256","name":"blockno","type":"uint256"}],"stateMutability":"view","type":"function"}]`
);
contract = new web3.eth.Contract(abi);
contract.options.address = "0xBb2fCC6727e4475F8843dE10289345D750AD1EfA";

$(document).ready(function() {
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
