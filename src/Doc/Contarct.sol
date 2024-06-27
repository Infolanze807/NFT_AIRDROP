// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CARNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => string[]) private _tokenURIs;
    mapping(address => uint256[]) private _ownedTokens;
    mapping(string => bool) private _mintedTokenURIs;

    address private owner;

    constructor() ERC721("Cars", "C$") {
        owner = msg.sender;
    }

    function mint(string memory tokenURIs) external {
        require(msg.sender == owner, "Only owner can mint tokens");

        // Split the tokenURIs string into an array of individual URIs
        string[] memory uris = _splitTokenURIs(tokenURIs);

        // Mint tokens for each URI
        for (uint256 i = 0; i < uris.length; i++) {
            string memory uri = uris[i];
            require(!_mintedTokenURIs[uri], "TokenURI has already been minted");

            _tokenIds.increment();
            uint256 newTokenId = _tokenIds.current();
            _mint(owner, newTokenId);

            // Add the URI to the token's list of URIs
            _tokenURIs[newTokenId].push(uri);

            _ownedTokens[owner].push(newTokenId);
            _mintedTokenURIs[uri] = true;
        }
    }

    function _splitTokenURIs(string memory tokenURIs) private pure returns (string[] memory) {
        // Split the input string by comma delimiter
        bytes memory tokenURIsBytes = bytes(tokenURIs);
        uint256 count = 1;

        for (uint256 i = 0; i < tokenURIsBytes.length; i++) {
            if (tokenURIsBytes[i] == ',') {
                count++;
            }
        }

        string[] memory uris = new string[](count);
        uint256 lastIndex = 0;
        uint256 currentUriIndex = 0;

        for (uint256 i = 0; i < tokenURIsBytes.length; i++) {
            if (tokenURIsBytes[i] == ',') {
                uris[currentUriIndex] = _substring(tokenURIs, lastIndex, i);
                lastIndex = i + 1;
                currentUriIndex++;
            }
        }

        // Add the last URI
        uris[currentUriIndex] = _substring(tokenURIs, lastIndex, tokenURIsBytes.length);

        return uris;
    }

    function _substring(string memory str, uint256 startIndex, uint256 endIndex) private pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex - startIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = strBytes[i];
        }
        return string(result);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_tokenURIs[tokenId].length > 0, "ERC721Metadata: URI query for nonexistent token");

        // Return the first URI associated with the token
        return _tokenURIs[tokenId][0];
    }

    function tokensOfOwner() external view returns (uint256[] memory) {
        return _ownedTokens[owner];
    }

    function hasTokens() external view returns (bool) {
        return _ownedTokens[owner].length > 0;
    }

    function transferFirstTokens(address receiver) public {
        require(_ownedTokens[owner].length > 0, "Owner has no tokens");
        uint256 tokenId = _ownedTokens[owner][0];
        super.safeTransferFrom(owner, receiver, tokenId);
        _removeTokenId(tokenId);
    }

    function transferFirstTwoTokens(address receiver) public {
        require(_ownedTokens[owner].length >= 2, "Owner does not have at least two tokens");

        for (uint256 i = 0; i < 2; i++) {
            uint256 tokenId = _ownedTokens[owner][0]; // Always take the first token after removing previous ones
            super.safeTransferFrom(owner, receiver, tokenId);
            _removeTokenId(tokenId);
        }
    }

    function transferTokens(address receiver, uint256 numTokens) public {
        require(_ownedTokens[owner].length >= numTokens, "Owner does not have enough tokens");

        for (uint256 i = 0; i < numTokens; i++) {
            uint256 tokenId = _ownedTokens[owner][0]; // Always take the first token after removing previous ones
            super.safeTransferFrom(owner, receiver, tokenId);
            _removeTokenId(tokenId);
        }
    }

    function _removeTokenId(uint256 tokenId) private {
        uint256[] storage tokenIds = _ownedTokens[owner];
        require(tokenIds.length > 0, "Owner has no tokens");
        require(tokenIds[0] == tokenId, "Token ID does not match the first token");

        for (uint256 i = 0; i < tokenIds.length - 1; i++) {
            tokenIds[i] = tokenIds[i + 1];
        }

        tokenIds.pop();
    }
}


0xcfe494e1F424c42772bD664FBC67F739a5ECDce0



*Final Contract*
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FINALNFTAIRDROP is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => string[]) private _tokenURIs;
    mapping(address => uint256[]) private _ownedTokens;
    mapping(string => bool) private _mintedTokenURIs;

    address private owner;

    constructor() ERC721("Designed Cars", "DC$") {owner = msg.sender;}

    function mint(string memory tokenURIs) external {
        require(msg.sender == owner, "Only owner can mint tokens");

        // Split the tokenURIs string into an array of individual URIs
        string[] memory uris = _splitTokenURIs(tokenURIs);

        // Mint tokens for each URI
        for (uint256 i = 0; i < uris.length; i++) {
            string memory uri = uris[i];
            require(!_mintedTokenURIs[uri], "TokenURI has already been minted");

            _tokenIds.increment();
            uint256 newTokenId = _tokenIds.current();
            _mint(owner, newTokenId);

            // Add the URI to the token's list of URIs
            _tokenURIs[newTokenId].push(uri);

            _ownedTokens[owner].push(newTokenId);
            _mintedTokenURIs[uri] = true;
        }
    }

    function _splitTokenURIs(string memory tokenURIs) private pure returns (string[] memory) {
        // Split the input string by comma delimiter
        bytes memory tokenURIsBytes = bytes(tokenURIs);
        uint256 count = 1;

        for (uint256 i = 0; i < tokenURIsBytes.length; i++) {
            if (tokenURIsBytes[i] == ',') {
                count++;
            }
        }

        string[] memory uris = new string[](count);
        uint256 lastIndex = 0;
        uint256 currentUriIndex = 0;

        for (uint256 i = 0; i < tokenURIsBytes.length; i++) {
            if (tokenURIsBytes[i] == ',') {
                uris[currentUriIndex] = _substring(tokenURIs, lastIndex, i);
                lastIndex = i + 1;
                currentUriIndex++;
            }
        }

        // Add the last URI
        uris[currentUriIndex] = _substring(tokenURIs, lastIndex, tokenURIsBytes.length);

        return uris;
    }

    function _substring(string memory str, uint256 startIndex, uint256 endIndex) private pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex - startIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = strBytes[i];
        }
        return string(result);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_tokenURIs[tokenId].length > 0, "ERC721Metadata: URI query for nonexistent token");

        // Return the first URI associated with the token
        return _tokenURIs[tokenId][0];
    }

    function tokensOfOwner() external view returns (uint256[] memory) {
        return _ownedTokens[owner];
    }

    function hasTokens() external view returns (bool) {
        return _ownedTokens[owner].length > 0;
    }

    function transferFirstTokens(address receiver) public {
        require(_ownedTokens[owner].length > 0, "Owner has no tokens");
        require(_ownedTokens[receiver].length < 8, "Recipient already owns a token");

        uint256 tokenId = _ownedTokens[owner][0];
        super.safeTransferFrom(owner, receiver, tokenId);
        _updateOwnedTokens(owner, receiver, tokenId);
    }

    function transferFirstTwoTokens(address receiver) public {
        require(_ownedTokens[owner].length >= 2, "Owner does not have at least two tokens");
        require(_ownedTokens[receiver].length < 8, "Recipient already owns a token");

        for (uint256 i = 0; i < 2; i++) {
            uint256 tokenId = _ownedTokens[owner][0]; // Always take the first token after removing previous ones
            super.safeTransferFrom(owner, receiver, tokenId);
            _updateOwnedTokens(owner, receiver, tokenId);
        }
    }

    function transferTokens(address receiver, uint256 numTokens) public {
        require(_ownedTokens[owner].length >= numTokens, "Owner does not have enough tokens");

        for (uint256 i = 0; i < numTokens; i++) {
            uint256 tokenId = _ownedTokens[owner][0]; // Always take the first token after removing previous ones
            super.safeTransferFrom(owner, receiver, tokenId);
            _updateOwnedTokens(owner, receiver, tokenId);
        }
    }

    function _updateOwnedTokens(address from, address to, uint256 tokenId) private {
        _removeTokenId(from, tokenId);
        _ownedTokens[to].push(tokenId);
    }

    function _removeTokenId(address from, uint256 tokenId) private {
        uint256[] storage tokenIds = _ownedTokens[from];
        require(tokenIds.length > 0, "Owner has no tokens");

        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (tokenIds[i] == tokenId) {
                for (uint256 j = i; j < tokenIds.length - 1; j++) {
                    tokenIds[j] = tokenIds[j + 1];
                }
                tokenIds.pop();
                break;
            }
        }
    }
}

0xB83Fc8a99e44b65785694A4576117138CD897335