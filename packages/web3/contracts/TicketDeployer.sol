// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "./My1155.sol";

contract Deployer {
    address public owner;

    event ContractDeployed(address indexed contractAddress);

    constructor() {
        owner = msg.sender;
    }

    function deploy(string memory uri) public {
        require(msg.sender == owner, "Only owner can deploy");

        My1155 newContract = new My1155(uri, msg.sender);
        emit ContractDeployed(address(newContract));
    }
}
