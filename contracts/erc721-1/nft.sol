// nft.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721Enumerable, Ownable {
    uint256 private _tokenIdCounter;

    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant MINT_PRICE = 0.1 ether;

    mapping(uint256 => uint256) public mintedTokens;

    constructor() ERC721("MyNFT", "MFT") {}

    function mint() external payable {
        require(totalSupply() < MAX_SUPPLY, "Max supply reached");
        require(msg.value >= MINT_PRICE, "Insufficient funds");

        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        _mint(msg.sender, tokenId);
        mintedTokens[tokenId] = block.timestamp;

        // If overpaid, refund excess funds
        if (msg.value > MINT_PRICE) {
            payable(msg.sender).transfer(msg.value - MINT_PRICE);
        }
    }

    function transferFrom(address from, address to, uint256 tokenId) public override(ERC721, IERC721) {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        _transfer(from, to, tokenId);
    }
}
