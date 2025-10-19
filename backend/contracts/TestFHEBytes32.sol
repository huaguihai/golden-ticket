// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, eaddress} from "@fhevm/solidity/lib/FHE.sol";

contract TestFHEBytes32 {
    function convertEaddressToBytes32(eaddress _addr) public pure returns (bytes32) {
        return FHE.toBytes32(_addr);
    }
}
