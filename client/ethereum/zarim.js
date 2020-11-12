import Zarim from "../ethereum/build/Zarim.json";
import getWeb3 from "../ethereum/getWeb3";

const instance = async () => {
  try {
    // Get network provider and web3 instance.
    const web3 = await getWeb3();

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
    alert(
      `Failed to load web3, accounts, or contract. Check console for details.`
    );
    console.error(error);
  }
};

export default instance();
