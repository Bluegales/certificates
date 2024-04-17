# Example Scripts

This folder contains scripts for easily testing individual parts of the project.

## Get Started

1. Copy `config_example.ts` to `config.ts`.
2. *Optional:* Change the chain.
3. Add the following to the config
   1. your public key under attester.
4. Add the following enviroment variables
   1. PRIVATE_KEY
   2. LIGHT_HOUSE_API_KEY
5. Ensure you have funds on the specified chain.

To test, run:

**IMPORTANT** run these scripts from within this directory!

`npx tsx sample_scripts/script.ts`

# Scripts

## Hash

Scripts for verifying documents.

### create_schema

Facilitates creating a schema for attestations.

**Elements:**
- `hash`: uint256 representing the hash of the file.

**Instructions:**
- One-time use.
- After deployment, add the generated schema ID to `config.ts` under `documentHashSchema`.

### attest

Creates an on-chain attestation about the validity of a document.

### verify

Verifies if a given hash is valid.

## File

Scripts for handling decentralized stored files.

### create_schema

Facilitates creating a schema for user files.

**Elements:**
- `name`: string representing the user's chosen name.
- `cid`: uint256 representing the CID stored on Lighthouse.

**Instructions:**
- One-time use.
- After deployment, add the generated schema ID to `config.ts` under `cidFilesSchema`.

### upload

Uploads a file to Lighthouse.

### attest

Creates an attestation with the users wallet as a recipient. This ensures the user does not lose their CID, making it impossible to access the file. Additionally, it adds a user-chosen name to the file, allowing them to identify it.

### get_cids

Uses the previously created attestation about CIDs belonging to a user to retrieve all files associated with the wallet.

### download

Requires the user to sign a message to prove their identity. Once authenticated, the file will be downloaded.
