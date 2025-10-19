// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GoldenTicketNFT is ERC721, Ownable {
    uint256 private _nextTokenId; // Declare a counter for token IDs

    constructor(string memory name, string memory symbol, address initialOwner)
        ERC721(name, symbol)
        Ownable(initialOwner)
    {
        _nextTokenId = 0; // Initialize the counter
    }

    function mint(address to) public onlyOwner {
        uint256 tokenId = _nextTokenId; // Get the current token ID
        _nextTokenId++; // Increment for the next mint
        _safeMint(to, tokenId);
    }

    // Optional: A function to get the current total supply (number of minted tokens)
    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }
}
