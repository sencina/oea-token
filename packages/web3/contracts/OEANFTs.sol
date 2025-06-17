// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract OEANFTs is
    Initializable,
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable,
    OwnableUpgradeable
{
    mapping(address => uint) private _owners;
    uint256 private _counter;

    event NFTCreated(uint256 indexed tokenId);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string memory name_,
        string memory symbol_
    ) public initializer {
        __ERC721_init(name_, symbol_);
        __ERC721URIStorage_init();
        __Ownable_init(msg.sender);
        _counter = 0;
    }

    function mint(address to, string memory tokenURI_) public onlyOwner {
        _safeMint(to, _counter);
        _setTokenURI(_counter, tokenURI_);
        _owners[to] = _counter;
        emit NFTCreated(_counter);
        _counter++;
    }

    function setTokenURI(
        uint256 tokenId,
        string memory tokenURI_
    ) public onlyOwner {
        _setTokenURI(tokenId, tokenURI_);
    }

    function authenticate(
        address account,
        uint256 tokenId
    ) public view returns (bool) {
        return _owners[account] == tokenId;
    }

    function currentId() public view returns (uint256) {
        return _counter;
    }

    // The following functions are overrides required by Solidity
    function tokenURI(
        uint256 tokenId
    )
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
