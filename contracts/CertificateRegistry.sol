// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CertificateRegistry {
    struct Certificate {
        bytes32 certificateHash;
        bool isValid;
        bool isRevoked;
        uint256 timestamp;
    }

    mapping(string => Certificate) public certificates;
    uint256 public certificateCount;
    address public owner;

    event CertificateIssued(string indexed certificateId, bytes32 certificateHash, uint256 timestamp);
    event CertificateRevoked(string indexed certificateId, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function issueCertificate(string memory certificateId, bytes32 certificateHash) public onlyOwner {
        require(!certificates[certificateId].isValid, "Certificate already exists");
        
        certificates[certificateId] = Certificate({
            certificateHash: certificateHash,
            isValid: true,
            isRevoked: false,
            timestamp: block.timestamp
        });
        
        certificateCount++;
        emit CertificateIssued(certificateId, certificateHash, block.timestamp);
    }

    function verifyCertificate(string memory certificateId) public view returns (
        bytes32 certificateHash,
        bool isValid,
        bool isRevoked,
        uint256 timestamp
    ) {
        Certificate memory cert = certificates[certificateId];
        return (cert.certificateHash, cert.isValid, cert.isRevoked, cert.timestamp);
    }

    function revokeCertificate(string memory certificateId) public onlyOwner {
        require(certificates[certificateId].isValid, "Certificate does not exist");
        require(!certificates[certificateId].isRevoked, "Certificate already revoked");
        
        certificates[certificateId].isRevoked = true;
        emit CertificateRevoked(certificateId, block.timestamp);
    }

    function getCertificateCount() public view returns (uint256) {
        return certificateCount;
    }
}
