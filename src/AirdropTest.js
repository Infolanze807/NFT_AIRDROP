import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { ABI } from "./Components/ABI";

const AirdropTest = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState(null);
  const [nftBalance, setNftBalance] = useState(null);
  const [tokenIds, setTokenIds] = useState([]);
  const [transactionHash, setTransactionHash] = useState(null);
  const [recipientTokenIds, setrecipientTokenIds] = useState(null);
  const ContractAdd = process.env.REACT_APP_CONTRACT_ADDRESS;
  const Private_key = process.env.REACT_APP_PRIVATE_KEY;
  const Owner = process.env.REACT_APP_OWNER_ADDRESS;

  console.log("Private Key:", Private_key);
  console.log("Contract Address:", ContractAdd);
  console.log("Owner Address:", Owner);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", handleChainChanged);
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  });

  const handleChainChanged = async (chainIdHex) => {
    const networkId = parseInt(chainIdHex, 16); // Convert hexadecimal chainId to decimal
    console.log("Chain ID returned by MetaMask:", networkId);

    switch (networkId) {
      case 713715: // SEI Devnet
        setNetwork("SEI Devnet");
        break;
      default:
        setNetwork(null);
        setCurrentAccount(null);
        setBalance(null);
        alert("Please switch to SEI Devnet network");
        await switchToSeiDevnet();
        break;
    }
  };

  const handleAccountsChanged = async () => {
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
      setCurrentAccount(accounts[0]);
      const balanceWei = await web3.eth.getBalance(accounts[0]);
      const balanceEth = web3.utils.fromWei(balanceWei, "ether");
      setBalance(balanceEth);
    } else {
      setCurrentAccount(null);
      setBalance(null);
      setNetwork(null);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum.isMetaMask) {
        return alert("MetaMask is not installed");
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
      console.log("Wallet connected:", accounts[0]);

      const chainIdHex = await window.ethereum.request({
        method: "eth_chainId",
      });
      const networkId = parseInt(chainIdHex, 16);
      console.log("Chain ID returned by MetaMask:", networkId);

      switch (networkId) {
        case 713715:
          setNetwork("SEI Devnet");

          break;
        default:
          setNetwork(null);
          setCurrentAccount(null);
          setBalance(null);
          alert("Please switch to SEI Devnet network");
          await switchToSeiDevnet();
          break;
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while connecting to the wallet");
    }
  };

  const switchToSeiDevnet = async () => {
    const networks = {
      SEI_DEVNET: {
        chainId: "0xae3f3",
        chainName: "SEI Devnet",
        nativeCurrency: {
          name: "SEI Devnet",
          symbol: "SEI",
          decimals: 18,
        },
        rpcUrls: ["https://evm-rpc-arctic-1.sei-apis.com"],
        blockExplorerUrls: ["https://seistream.app"],
      },
    };

    const params = networks.SEI_DEVNET;

    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [params],
      });
    } catch (error) {
      console.error("Failed to switch network:", error);
      alert("Failed to switch network.");
    }
  };

  const performNftAirdropCase1 = async () => {
    try {
      if (!ContractAdd || !currentAccount) {
        alert("Please enter contract address and recipient address.");
        return;
      }

      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(ABI, ContractAdd);

      const recipientTokenIds = await contract.methods
      .tokensOfReciver(currentAccount)
      .call();
    console.log("token of reciver :",recipientTokenIds)  
      const recipientTokenCount = recipientTokenIds.length;
  
      if (recipientTokenCount >= 8) {
        alert(
          "You have already claimed 8 tokens. You are not eligible to claim more NFTs."
        );
        return;
      }

      const ownerTokenIds = await contract.methods.tokensOfOwner().call();
      if (ownerTokenIds.length === 0) {
        alert("Owner does not own any tokens to airdrop.");
        return;
      }

      const methodToCall =
        contract.methods.transferFirstTwoTokens(currentAccount);
      const gas = await methodToCall.estimateGas({ from: Owner });
      const gasPrice = await web3.eth.getGasPrice();

      const tx = {
        from: Owner,
        to: ContractAdd,
        gas: gas,
        gasPrice: gasPrice,
        data: methodToCall.encodeABI(),
      };

      const signedTx = await web3.eth.accounts.signTransaction(tx, Private_key);
      const receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );

      const updatedNftBalance = await contract.methods.balanceOf(Owner).call();
      setNftBalance(parseInt(updatedNftBalance, 10));

      const token = await contract.methods.tokensOfOwner().call();
      setTokenIds(token.map((id) => id.toString()));

      setTransactionHash(receipt.transactionHash);
      alert("You Have Successfull Claim 2 NFTs");
    } catch (error) {
      console.error("Failed to perform NFT Airdrop for Case 1:", error);
      alert("Failed to Claim 2 NFTs");
    }
  };

  const performNftAirdropCase2 = async () => {
    try {
      if (!ContractAdd || !currentAccount) {
        alert("Please enter contract address and recipient address.");
        return;
      }

      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(ABI, ContractAdd);

      const recipientTokenIds = await contract.methods
      .tokensOfReciver(currentAccount)
      .call();
    console.log("token of reciver :",recipientTokenIds)  
      const recipientTokenCount = recipientTokenIds.length;
  
      if (recipientTokenCount >= 8) {
        alert(
          "You have already claimed 8 tokens. You are not eligible to claim more NFTs."
        );
        return;
      }

      const ownerTokenIds = await contract.methods.tokensOfOwner().call();
      if (ownerTokenIds.length === 0) {
        alert("Owner does not own any tokens to airdrop.");
        return;
      }

      const methodToCall = contract.methods.transferFirstTokens(currentAccount);
      const gas = await methodToCall.estimateGas({ from: Owner });
      const gasPrice = await web3.eth.getGasPrice();

      const tx = {
        from: Owner,
        to: ContractAdd,
        gas: gas,
        gasPrice: gasPrice,
        data: methodToCall.encodeABI(),
      };

      const signedTx = await web3.eth.accounts.signTransaction(tx, Private_key);
      const receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );

      const updatedNftBalance = await contract.methods.balanceOf(Owner).call();
      setNftBalance(parseInt(updatedNftBalance, 10));

      const token = await contract.methods.tokensOfOwner().call();
      setTokenIds(token.map((id) => id.toString()));

      setTransactionHash(receipt.transactionHash);
      alert("You Have Successfull Claim 1 NFT");
    } catch (error) {
      console.error("Failed to perform NFT Airdrop for Case 2:", error);
      alert("Failed to Claim 1 NFT");
    }
  };

  useEffect(() => {
    const fetchNftBalance = async () => {
      try {
        if (!Owner || !ContractAdd) {
          return;
        }

        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(ABI, ContractAdd);

        const balance = await contract.methods.balanceOf(Owner).call();
        setNftBalance(parseInt(balance, 10));
      } catch (error) {
        console.error("Failed to fetch NFT balance:", error);
        setNftBalance(null);
      }
    };

    fetchNftBalance();
  }, [Owner, ContractAdd]);

  useEffect(() => {
    const fetchTokenIds = async () => {
      try {
        if (!Owner || !ContractAdd) {
          return;
        }

        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(ABI, ContractAdd);
        const tokenIds = await contract.methods.tokensOfOwner(Owner).call();
        setTokenIds(tokenIds.map((id) => id.toString()));
      } catch (error) {
        console.error("Failed to fetch token IDs:", error);
        setTokenIds([]);
      }
    };

    fetchTokenIds();
  }, [Owner, ContractAdd]);

  return (
    <div className="box">
      <h1>NFT Airdrop App</h1>
      <h3>Remaining NFTs: {nftBalance}</h3>
      <div className="heder">
        <div>Connect your wallet</div>
        <button onClick={connectWallet} className="btn-1">
          Connect
        </button>
      </div>
      <div className="form-main">
        <div className="form">
          {ContractAdd && <p>Contarct Add :{ContractAdd}</p>}
          {currentAccount && <p>Acc :{currentAccount}</p>}
          <button onClick={performNftAirdropCase1}>Claim 2 NFT</button>
          <button onClick={performNftAirdropCase2}>Claim 1 NFT</button>
          {transactionHash && (
            <p>
              Transaction Hash: <br />
              {transactionHash}
            </p>
          )}
          {recipientTokenIds && (
            <p>
              Your Token:{recipientTokenIds}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AirdropTest;
