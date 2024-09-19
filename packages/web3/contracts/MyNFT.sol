// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MyNFT is ERC721URIStorage {
    address public owner;

    constructor(string memory uri) ERC721("Santi", "SANTI") {
        owner = msg.sender;
        _mint(owner, 1);
        _setTokenURI(1, uri);
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) public {
        require(msg.sender == owner, "Only owner can set token URI");
        _setTokenURI(tokenId, _tokenURI);
    }
}
