export const FAUCET_ADDRESS = "demo_faucet.flux-dev";
export const TOKEN_ADDRESS = "flux_fun_token2.flux-dev";
export const NULL_CONTRACT = 'null_contract.flux-dev';

export const NETWORK = "testnet";

export const TOKEN_CHANGE_METHODS = [];
export const TOKEN_VIEW_METHODS = ["get_balance"];

export const FAUCET_CHANGE_METHODS = ["claim"];
export const FAUCET_VIEW_METHODS = [];

export const  TESTNET_NETWORK_CONFIG = {
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
    contractName: null,
    walletUrl: 'https://wallet.testnet.near.org',
    initialBalance: 100000000
};