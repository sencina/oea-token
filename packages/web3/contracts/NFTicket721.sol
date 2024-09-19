// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTicket721 is ERC721URIStorage {
    address public owner;
    uint256 public counter = 0;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        owner = msg.sender;
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) public {
        require(msg.sender == owner, "Only owner can set token URI");
        _setTokenURI(tokenId, _tokenURI);
    }

    function mintToken(address to, string memory _tokenURI) public {
        require(msg.sender == owner, "Only owner can mint token");
        uint256 tokenId = counter;
        _mint(to, tokenId);
        setTokenURI(tokenId, _tokenURI);
        counter++;
    }
}
