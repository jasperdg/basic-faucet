import React, { useEffect, useState } from 'react';
import { connect, WalletConnection, Contract, keyStores } from 'near-api-js';
import './App.css';
import { TESTNET_NETWORK_CONFIG, NULL_CONTRACT, TOKEN_ADDRESS, TOKEN_VIEW_METHODS, TOKEN_CHANGE_METHODS, FAUCET_ADDRESS, FAUCET_VIEW_METHODS, FAUCET_CHANGE_METHODS } from './constants';
import BN from 'bn.js';

const PREPAID_GAS = new BN("150000000000000");
const ZERO = new BN("0");

function App() {
  const [walletConnection, setWalletConnection] = useState(null)
  const [near, setNear] = useState(null);
  const [faucetBalance, setFaucetBalance] = useState("loading...");
  const [userBalance, setUserBalance] = useState("loading...");
  const [faucetContract, setFaucetContract] = useState(() => {});
  useEffect(() => {  
    connect({...TESTNET_NETWORK_CONFIG, deps: {keyStore: new keyStores.BrowserLocalStorageKeyStore}})
    .then(connection => {
      const walletInstance = new WalletConnection(connection, NULL_CONTRACT);

      const tokenContract = new Contract(walletInstance.account(), TOKEN_ADDRESS, {
        viewMethods: TOKEN_VIEW_METHODS,
        changeMethods: TOKEN_CHANGE_METHODS,
      });
      
      const faucetContractInstance = new Contract(walletInstance.account(), FAUCET_ADDRESS, {
        viewMethods: FAUCET_VIEW_METHODS,
        changeMethods: FAUCET_CHANGE_METHODS,
      });

      setFaucetContract(faucetContractInstance);

      tokenContract.get_balance({owner_id: FAUCET_ADDRESS}).then(balance => {
        setFaucetBalance(balance)
      });
      
      if (walletInstance.getAccountId()) {
        tokenContract.get_balance({owner_id: walletInstance.getAccountId()}).then(balance => {
          setUserBalance(balance)
        });
      }
      
      setWalletConnection(walletInstance)
      setNear(connection)
    });
  }, [])

  return (
    <div className="App">
      {
        near && <div> 
          { walletConnection &&  walletConnection.getAccountId() ? 
            <> 
              <div> Hi, {walletConnection.getAccountId()}</div> 
              <button onClick={() => {walletConnection.signOut(); window.location.reload()}}>Sign out</button> 
            </> 
            : <button onClick={ () => walletConnection.requestSignIn(NULL_CONTRACT, "faucet") }>Sign in</button> }
          <div>Faucet balance: { faucetBalance } </div>

          { walletConnection &&  walletConnection.getAccountId() && <div>
              <div>User balance: { userBalance } </div>
              <button onClick={() => {
                faucetContract.claim({}, PREPAID_GAS, ZERO).then(() => {
                  window.location.reload();
                })
              }}> claim </button>
          </div> }

        </div>
      }
      
    </div>
  );
}

export default App;
