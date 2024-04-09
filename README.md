# student-certificate

**This project allows central authorities to attest and revoke certificate hashes on-chain for legitimacy checks. It abstracts the blockchain away for user-friendly experience. Additionally certificates can be stored permanently and encrypted on Filecoin.**

### description

This project enables central authorities to easily attest, and if necessary revoke, the hash of their certificates on-chain, giving anyone the ability to effortlessly verify the legitimacy of these certificates.
The blockchain is seamlessly abstracted away, providing a user-friendly experience for the central authority issuing certificates, the users downloading the certificates and the entities validating them.
Moreover, it empowers users with a wallet to securely store these certificates permanently and encrypted on Filecoin. No funds are required; all that's needed is a wallet.
The project is designed to facilitate self-issuance of certificates with minimal adjustments. It is currently fully operational for our coding school, 42Heilbronn.

### technical

This project consists of a backend automatically creating certificates as pdf files.
These SHA256 hash of these certificates are attested onchain.
Users are able to download the certificates on a frontend, while admins have a dashboard to revoke any of these attestations invalidating the certificate.

A separate frontend has the ability to drag&drop a file, hashing it on the frontend without uploading the file and making a request to the sign protocol api to get the eid of the attestation. 
That eid is used to get the exact attestation from an RPC, adding an additional layer of security, since its not required to trust the sign protocol api.
It is checked whether the attestation hasn’t been revoked, the hash matches and that it has been attested by the correct entity.
If all of these checks pass the uploaded file is shown as valid, otherwise it will be marked as invalid.
Since this does not depend on our backend a fork of the frontend can still be used, even after the institution origianlly giving out the certificates has shut down. 

If the user decides to connect with a wallet using wallet connect, he gets the ability to upload any certificate to filecoin / lighthouse. Lighthouse ensures a permanent encrypted storage. The users address is added to the allowed list of recipients. An attestation is then made with the cid of the file, a name chosen by the user and the address of the user as the recipient. This ensures that the user will never lose his cid.
On a different frontend, which doesn’t need a connection to our backend the user can connect with his wallet. A request to the sign protocol is made to get all the eids that have been liked to this users wallet. The user gets the ability to download any of these files from the filecoin network. Since this service does not depend on any backend the user should be able to always keep access to the certificates, even after the institution originally giving out the certificates has shut down.

## overview 

This project is in its early stage of development

Sample scripts can be found in the sample_scripts folder

`cp config_example.ts config.ts`

add your private key to the config.

make sure you have funds on the chain you specified


to test run:
`npx tsx sample_scripts/create_schema.ts`
`npx tsx sample_scripts/attest_hash.ts`
`npx tsx sample_scripts/verify_hash.ts`


## TODO

need code that
1. uploads a file
2. adds address to view permission
3. adds attestation about the file
   1. cid
   2. name??

and code that **in frontend?**
1. gets all shared files from attestation
2. download a file
3. decrypt it
