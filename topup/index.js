
let web3 = undefined;
let relay = undefined;

let apiAddress = undefined;

let UIenabled = true;

const BALANCE_API_ADDRESS_MAINNET = "https://api.anydot.dev/any.sender.mainnet/balance"
const BALANCE_API_ADDRESS_ROPSTEN = "https://api.anydot.dev/any.sender.ropsten/balance"

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

function setError(message) {
  $("#errorMessage").text(message);
}
function refreshUI() {
  const address = $("#inpAddress").val();
  const amount = $("#inpAmount").val();

  $("#btnCheckBalance").prop("disabled", !UIenabled && !address);
  $("#btnRecharge").prop("disabled", !UIenabled && (!address || !amount));
}

function setupUI() {
  $("#inpAddress,#inpAmount").on("input", refreshUI);
  $("#btnCheckBalance").click(async (e) => {
    e.preventDefault();
    try {
      const address = $("#inpAddress").val();

      const response = await fetch(`${balanceApiAddress}/${address}`);
      const result = await response.json();
      alert(`Current balance: ${web3.utils.fromWei(result.balance, "ether")} Ξ`);
    } catch(doh) {
      setError(doh.message);
    }
  });

  $("#btnRecharge").click(async (e) => {
    e.preventDefault();
    try {
      const address = $("#inpAddress").val();
      const amount = $("#inpAmount").val();
  
      const accounts = await ethereum.enable();
  
      await relay.methods.depositFor(address).send({
        from: accounts[0],
        value: web3.utils.toWei(amount, "ether")
      });
    } catch (doh) {
      setError(doh.message);
    }
  });
}

async function startApp() {
  try {
    await ethereum.enable();

    web3 = new Web3(Web3.givenProvider);
    if (ethereum.chainId === "0x1") balanceApiAddress = BALANCE_API_ADDRESS_MAINNET
    else if (ethereum.chainId === "0x3") balanceApiAddress = BALANCE_API_ADDRESS_ROPSTEN
    else {
      setError("Only mainnet and Ropsten are supported.");
      UIenabled = false;
    }

    relay = new web3.eth.Contract(ABI, "0x9b4FA5A1D9f6812e2B56B36fBde62736Fa82c2a7");

    setupUI();
  } catch (doh) {
    setError(doh.message);
  }
}

startApp().catch((doh) => {
  console.log(doh);
});
