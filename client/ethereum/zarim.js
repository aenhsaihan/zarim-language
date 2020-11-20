import Zarim from "../ethereum/build/Zarim.json";
import web3 from "../ethereum/web3";

const instance = async () => {
  try {
    // Use web3 to get the user's accounts.
    const accounts = await web3.eth.getAccounts();

    // Get the contract instance.
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Zarim.networks[networkId];
    const instance = new web3.eth.Contract(
      Zarim.abi,
      deployedNetwork && deployedNetwork.address
    );

    return instance;
  } catch (error) {
    // Catch any errors for any of the above operations.
    console.error(error);
  }
};

export default instance();
