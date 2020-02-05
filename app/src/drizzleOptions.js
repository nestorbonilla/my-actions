//import Web3 from "web3";
import SimpleStorage from "./contracts/SimpleStorage.json";
import ActionStorage from "./contracts/ActionStorage.json";

const options = {
  web3: {
    block: false,
    //customProvider: new Web3("ws://localhost:7545"),
  },
  contracts: [SimpleStorage, ActionStorage],
  events: {
    SimpleStorage: ["StorageSet"],
    ActionStorage: ["LogNewOpportunity"]
  },
  polls: {
    accounts: 1500,
  },
};

export default options;
