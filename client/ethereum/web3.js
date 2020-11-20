import Web3 from "web3";

const useLocalProvider = () => {
  const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
  const web3 = new Web3(provider);
  console.log("No web3 instance injected, using Local web3.");
  return web3;
};

const web3 = new Web3(Web3.givenProvider || useLocalProvider());

export default web3;
