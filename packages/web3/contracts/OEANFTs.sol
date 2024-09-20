// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract OEANFTs is ERC721URIStorage {
    address public owner;
    mapping (address => uint) owners;
    uint256 public counter;

    event NFTCreated(uint256 indexed tokenId);

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        owner = msg.sender;
        counter = 0;
    }

    function mint(address to, string memory _tokenURI) public {
        require(msg.sender == owner, "Only owner can mint");
        _safeMint(to, counter);
        _setTokenURI(counter, _tokenURI);
        owners[to] = counter;
        emit NFTCreated(counter);
        counter++;
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) public {
        require(msg.sender == owner, "Only owner can set token URI");
        _setTokenURI(tokenId, _tokenURI);
    }

    function authenticate(address sender, uint tokenId) public view returns (bool) {
        return owners[sender] == tokenId;
    }

    function currentId() public view returns (uint) {
        return counter;
    }
}
