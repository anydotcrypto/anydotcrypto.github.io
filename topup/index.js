let web3 = undefined;

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

    const balance = web3.utils.fromWei(await web3.eth.getBalance(address));
    alert(balance);
  });

  $("#btnRecharge").click(async (e) => {
    e.preventDefault();
    const address = $("#inpAddress").val();
    const amount = $("#inpAmount").val();

    const accounts = await ethereum.enable();

    web3.eth.sendTransaction(
      {
        from: accounts[0],
        to: address,
        value: web3.utils.toWei(amount, "ether")
      },
      function (err, transactionHash) {
        if (!err) console.log(transactionHash + " success");
      }
    );
  });
}

async function startApp() {
  try {
    const accounts = await ethereum.enable();

    web3 = new Web3(window.web3.currentProvider);

    setupUI();
  } catch (error) {
    // Handle error. Likely the user rejected the login
    console.error(error);
  }
}

startApp().catch((doh) => {
  console.log(doh);
});
