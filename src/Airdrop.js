import React, {useEffect,useState} from 'react';
import Web3 from 'web3';
import { ABI } from './Components/ABI'

const Airdrop = () => {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    const [network, setNetwork] = useState(null);
    const [nftBalance, setNftBalance] = useState(null);
    const [tokenIds, setTokenIds] = useState([]);
    const [transactionHash, setTransactionHash] = useState(null);
  
  const ContractAdd = process.env.REACT_APP_CONTRACT_ADDRESS;
  const Private_key = process.env.REACT_APP_PRIVATE_KEY;
  const Owner = process.env.REACT_APP_OWNER_ADDRESS;
  
  console.log('Private Key:', Private_key);
  console.log('Contract Address:', ContractAdd);
  console.log('Owner Address:', Owner);
  
      useEffect(() => {
      if (window.ethereum) {
        window.ethereum.on("chainChanged", handleChainChanged);
        window.ethereum.on("accountsChanged", handleAccountsChanged);
      }
  
      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener("chainChanged", handleChainChanged);
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }, []);
  
    const handleChainChanged = async () => {
      const web3 = new Web3(window.ethereum);
      const networkId = Number(await web3.eth.net.getId());
      const networkName = getNetworkName(networkId);
      setNetwork(networkName);
  
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
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setCurrentAccount(accounts[0]);
  
        const web3 = new Web3(window.ethereum);
        const balanceWei = await web3.eth.getBalance(accounts[0]);
        const balanceEth = web3.utils.fromWei(balanceWei, "ether");
        setBalance(balanceEth);
  
        const networkId = Number(await web3.eth.net.getId());
        setNetwork(getNetworkName(networkId));
      } catch (error) {
        console.error(error);
        alert("An error occurred while connecting to the wallet");
      }
    };
  
    const getNetworkName = (networkId) => {
      switch (networkId) {
        case 713715:
          return "SEI DEV"
        default:
          return "Unknown";
      }
    };
  
    // const performNftAirdrop = async () => {
    //   try {
    //     if (!ContractAdd || !currentAccount) {
    //       alert("Please enter contract address and recipient address.");
    //       return;
    //     }
  
    //     const web3 = new Web3(window.ethereum);
    //     const contract = new web3.eth.Contract(ABI, ContractAdd);
  
    //     // Fetch token IDs owned by the current user
    //     const tokenIds = await contract.methods.tokensOfOwner(Owner).call();
    //     if (tokenIds.length === 0) {
    //       alert("You do not own any tokens to airdrop.");
    //       return;
    //     }
  
    //     const recipientTokenIds = await contract.methods.tokensOfOwner(currentAccount).call();
    //     if (recipientTokenIds.length > 0) {
    //         alert("Recipient has already received an NFT airdrop.");
    //         return;
    //     }
  
  
    //     const gas = await contract.methods
    //       .safeTransferUpdate(Owner, currentAccount)
    //       .estimateGas({ from: Owner });
  
    //     const gasPrice = await web3.eth.getGasPrice();
  
    //     const tx = {
    //       from:Owner,
    //       to: ContractAdd,
    //       gas: gas,
    //       gasPrice: gasPrice,
    //       data: contract.methods.safeTransferUpdate(Owner, currentAccount).encodeABI(),
    //     };
  
    //     const signedTx = await web3.eth.accounts.signTransaction(tx, Private_key);
  
    //     const receipt = await web3.eth.sendSignedTransaction(
    //       signedTx.rawTransaction
    //     );
  
    //     const updatedNftBalance = await contract.methods.balanceOf(Owner).call();
    //     setNftBalance(parseInt(updatedNftBalance, 10));
  
    //     const token = await contract.methods.tokensOfOwner(Owner).call();
    //     setTokenIds(token.map(id => id.toString()));
  
    //     setTransactionHash(receipt.transactionHash);
    //     alert("NFT Airdrop successful!");
    //   } catch (error) {
    //     console.error("Failed to perform NFT Airdrop:", error);
    //     alert("Failed to perform NFT Airdrop.");
    //   }
    // };
     
    const performNftAirdrop = async () => {
        try {
          if (!ContractAdd || !currentAccount) {
            alert("Please enter contract address and recipient address.");
            return;
          }
      
          const case1Address = '0xc8178ADF72863DF3Be7186Bb8Cc7e1c3868C3e2b';
          const case2Address = '0xfE597edD372fBd54f3E3a5637432fAa42a591A6D';
      
          const web3 = new Web3(window.ethereum);
          const contract = new web3.eth.Contract(ABI, ContractAdd);
      
          // Fetch token IDs owned by the owner
          const ownerTokenIds = await contract.methods.tokensOfOwner().call();
          if (ownerTokenIds.length === 0) {
            alert("Owner does not own any tokens to airdrop.");
            return;
          }
      
          const recipientTokenIds = await contract.methods.tokensOfOwner().call({ from: currentAccount });
          if (recipientTokenIds.length > 0) {
            alert("Recipient has already received an NFT airdrop.");
            return;
          }
      
          let methodToCall;
          let gas;
      
          // Determine which method to call based on the current account
          if (currentAccount.toLowerCase() === case1Address.toLowerCase()) {
            methodToCall = contract.methods.transferFirstTwoTokens(currentAccount);
          } else if (currentAccount.toLowerCase() === case2Address.toLowerCase()) {
            methodToCall = contract.methods.transferFirstTokens(currentAccount);
          } else {
            alert("Invalid recipient address.");
            return;
          }
      
          gas = await methodToCall.estimateGas({ from: Owner });
          const gasPrice = await web3.eth.getGasPrice();
      
          const tx = {
            from: Owner,
            to: ContractAdd,
            gas: gas,
            gasPrice: gasPrice,
            data: methodToCall.encodeABI(),
          };
      
          const signedTx = await web3.eth.accounts.signTransaction(tx, Private_key);
          const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      
          const updatedNftBalance = await contract.methods.balanceOf(Owner).call();
          setNftBalance(parseInt(updatedNftBalance, 10));
      
          const token = await contract.methods.tokensOfOwner().call();
          setTokenIds(token.map(id => id.toString()));
      
          setTransactionHash(receipt.transactionHash);
          alert("NFT Airdrop successful!");
        } catch (error) {
          console.error("Failed to perform NFT Airdrop:", error);
          alert("Failed to perform NFT Airdrop.");
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
          setTokenIds(tokenIds.map(id => id.toString()));
        } catch (error) {
          console.error("Failed to fetch token IDs:", error);
          setTokenIds([]);
        }
      };
  
      fetchTokenIds();
    }, [Owner,ContractAdd]);
  
  
  
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
       {ContractAdd && (<p>Contarct Add :{ContractAdd}</p>)}
       {currentAccount && (<p>Acc :{currentAccount}</p>)}
       <button onClick={performNftAirdrop}>Claim NFT</button>
       {transactionHash && (
         <p>Transaction Hash: <br/>{transactionHash}</p>
       )}
    </div>
    </div>
</div>
  )
}

export default Airdrop