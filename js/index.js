import Web3 from 'web3';
import {useEffect}  from 'react';

let balance = null;
let web3Object = null;
let metamaskAccount = null;

localStorage.clear();

const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            rpc: {
                137: "https://polygon-rpc.com/",
            },
            chainId: 137,
            infuraId: "d85fda7b424b4212ba72f828f48fbbe1",
            pollingInterval: "10000",
        },
    },
};

let web3Modal = new Web3Modal({
    providerOptions,
    cacheProvider: false,
    disableInjectedProvider: false,
});


function addrTruncation(addr) {
    return addr.slice(0, 6) + "…" + addr.slice(addr.length - 4, addr.length);
}

// function onDisconnect() {
//     localStorage.clear();
//     web3Object = null;
//     metamaskAccount = null
//     document.getElementById("btn-disconnect").innerHTML = ""
//     document.getElementById("btn-disconnect").style.display = "none"
//     document.getElementById("btn-connect").style.display = "block"
//     notify("Wallet Disconnected!");
// }

// async function onConnect() {
//     try {
//         let provider = await web3Modal.connect();
//         onProvider(provider);

//         provider.on("accountsChanged", (accounts) => {
//             console.log(accounts);
//             onProvider(provider);
//         });
//     } catch (e) {
//         console.log("Could not get a wallet connection", e);
//         return;
//     }
// }

useEffect(() => {
    async function onConnect() {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
        } else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider);
        } else {
          window.alert(
            "Non-Ethereum browser detected. You should consider trying MetaMask!"
          );
        }
        //loadBlockchainData();
      }
      onConnect();
}, []);


async function onProvider(provider) {
    web3Object = new Web3(provider);

    let chainId = await web3Object.eth.getChainId();
    if (chainId !== 137) {
        notify("Please connect your Wallet to the Polygon Network to use this site.");
        return;
    }

    let accounts = await web3Object.eth.getAccounts();
    metamaskAccount = accounts[0]

    document.getElementById("btn-connect").style.display = "none"
    document.getElementById("btn-disconnect").innerHTML = addrTruncation(metamaskAccount)
    document.getElementById("btn-disconnect").style.display = "block"
    notify("Wallet Connected Successfully!");
}


function notify(msg) {
    Toastify({
        text: msg,
        duration: 3000,
        gravity: "bottom",
        position: "right",
        style: {
            fontSize: "17px",
            fontWeight: "600",
            color: "white",
            background: "#000000",
            border: "2px solid red",
            maxWidth: "90%"
        },
    }).showToast();
}