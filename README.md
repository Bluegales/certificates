# onchain-certificates


**The aim of this project is to offer a framework that anyone can fork and set up themselves. Central authorities can issue and revoke certificates, granting anyone the ability to easily verify their legitimacy, leveraging blockchain advantages while abstracting its complexity for a seamless user experience.** 

![logo](docs/images/logo.png)

### description

The project provides a simple structure for central authorities who want to utilize the advantages of blockchain. It is designed to facilitate self-issuance of certificates with minimal adjustments.

After the certificate has been created by the institution, the hash will be stored on-chain as an attestation, and the certificate file will be stored encrypted on Lighthouse. 
After users log in on the frontend, they can create the certificates, download them, and have the additional option to share them with a wallet address, granting that address the ability to download the certificate as well. 

An additional frontend gives anyone the ability to upload a certificate as a file and it will show whether this certificate is valid or not. Certificates can even be validated if the original institution issuing the certificate ceases to exist. The blockchain is completely abstracted away, providing a user-friendly experience for the central authority issuing certificates, the users downloading the certificates, and the entities validating them.

## overview 

The project consists of 5 parts:
- [example_scripts](example_scripts) This folder contains scripts for easily testing individual parts of the project.
- [overview](docs) the landing page with links to the following services
- [attester](attester) the service to create and download the certificates
- [validator](validator) the frontend to validate the certificates
- [filecoin-viewer](filecoin-viewer) the frontend to view and download own files from lighthouse / filecoin

## Process Workflow

### Certificate creation
```mermaid
sequenceDiagram
    actor User
    participant Institution
    participant Blockchain
    User-->>Institution: Create certificate
    Institution->>User: Certificate
    Institution->>Blockchain: Hash of certificate
    Note over Institution,Blockchain: as attestation on sign protocol
    opt optional revoke
        Institution->>Blockchain: Revoke attestation
    end
```


### Certificate validation
The diagram illustrates that the Institution's role in the process has become obsolete; even after its shutdown, the process continues to function seamlessly.

```mermaid
sequenceDiagram
    actor User
    participant Ext as External entity
    participant Blockchain
    participant Institution
    User->>Ext: Certificate
    Ext->>Blockchain: Hash of certificate 
    alt valid
        Blockchain->>Ext: ok
    else invalid
        Blockchain->>Ext: faked or revoked certificate
    end
```

## Optional decentalised storage of certificates

### Certificate upload
```mermaid
sequenceDiagram
    actor User
    participant Institution
    participant Filecoin
    participant Blockchain
    User-->>Institution: Upload to filecoin
    Institution->>Filecoin: Certificate
    Note over Institution,Filecoin: encrypted with Kavach
    Filecoin->>Institution: Cid of file
    Institution->>Filecoin: give user read permission
    Institution->>Blockchain: Cid of file
    Note over Institution,Blockchain: as attestation on sign protocol
    Note over Institution,Blockchain: user as recipient
```

### Certificate download from filecoin
The diagram illustrates that the Institution's role in the process has become obsolete; even after its shutdown, the user retains the ability to access its certificates.

```mermaid
sequenceDiagram
    actor User
    participant Filecoin
    participant Blockchain
    participant Institution
    User-->>Blockchain: Get my cids
    Blockchain->>User: Cids of files
    User-->>Filecoin: Download cid
    Note over User,Filecoin: as a signed message
    alt ok
        Filecoin->>User: file
    else no permission / wrong signature
        Filecoin->>User: error
    end
```

### technical

This project involves three components: a frontend + backend for managing certificate creation and download (called attestor), a frontend for certificate validation (called validator) and another frontend to view and download certificates directly from lighthouse (called filecoin_viewer)

On the attestor, logged-in users can access a page displaying available certificates and their creation status. They can initiate the creation process for certificates that haven't been generated yet. The system generates a PDF certificate, hashes it with SHA256, and stores it encrypted on Lighthouse. The hash is then attested on-chain using the ethsign SDK. The file's content identifier (CID) is stored in a local database.
For already created certificates, users can download them. The backend retrieves the certificate from Lighthouse and provides it to the user.
The user has also the ability to give any wallet the permission to download the certificate directly from lighthouse. The users address is added to the allowed list of recipients. An attestation is then made with the cid of the file and a name chosen by the user. This ensures that the user will never lose his cid.

The validator has the ability to drag&drop a file, hashing it on the frontend without uploading the file and making a request to the sign protocol api to get the eid of the attestation. 
That eid is used to get the exact attestation from an RPC, adding an additional layer of security, since its not required to trust the sign protocol api.
It is checked whether the attestation hasn’t been revoked, the hash matches and that it has been attested by the correct entity.
If all of these checks pass the uploaded file is shown as valid, otherwise it will be marked as invalid.
Since this does not depend on our backend a fork of the frontend can still be used, even after the institution origianlly giving out the certificates ceases to exist.

On the filecoin_viewer, which also doesn’t need a connection to our backend the user can connect with his wallet. A request to the sign protocol is made to get all the eids that have been liked to this users wallet utilising the previously made attestations. The user gets the ability to download any of these files from the filecoin network. Since this service does not depend on any backend the user should be able to always keep access to the certificates, even after the institution originally giving out the certificates ceases to exist.



