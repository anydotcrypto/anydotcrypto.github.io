
let web3 = undefined;
let relay = undefined;

const ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      }
    ],
    "name": "depositFor",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

function refreshUI() {
  const address = $("#inpAddress").val();
  const amount = $("#inpAmount").val();

  $("#btnCheckBalance").prop("disabled", !address);
  $("#btnRecharge").prop("disabled", !address || !amount);
}

function setupUI() {
  $("#inpAddress,#inpAmount").on("input", refreshUI);
  $("#btnCheckBalance").click(async (e) => {
    e.preventDefault();
    const address = $("#inpAddress").val();

    const response = await fetch(`https://api.anydot.dev/any.sender.ropsten/balance/${address}`);
    const result = await response.json();
    alert(result.balance);
  });

  $("#btnRecharge").click(async (e) => {
    e.preventDefault();
    const address = $("#inpAddress").val();
    const amount = $("#inpAmount").val();

    const accounts = await ethereum.enable();

    await relay.methods.depositFor(address).send({
      from: accounts[0],
      value: web3.utils.toWei(amount, "ether")
    });
  });
}

async function startApp() {
  try {
    await ethereum.enable();

    web3 = new Web3(Web3.givenProvider);

    relay = new web3.eth.Contract(ABI, "0xa404d1219Ed6Fe3cF2496534de2Af3ca17114b06");

    setupUI();
  } catch (error) {
    // Handle error. Likely the user rejected the login
    console.error(error);
  }
}

startApp().catch((doh) => {
  console.log(doh);
});
