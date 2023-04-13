// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

contract Frontrunning {

    function deploySmartWallet(bytes32 salt)
        internal
        returns (address instance)
    {
        assembly {
            let ptr := mload(0x40)
            mstore(
                ptr,
                0x60803d60043d630c5a6f2f60e01b600052335afa600051611234553d61002780
            )
            mstore(
                add(ptr, 0x20),
                0x6100273d3981f360006000361561002557363d3d373d3d3d363d611234545af4
            )
            mstore(
                add(ptr, 0x40),
                0x3d82803e903d9161002557fd5bf3000000000000000000000000000000000000
            )

            instance := create2(0, ptr, 0x4e, salt)
        }
        require(instance != address(0), "ERC1167: create2 failed");
    }
    
}