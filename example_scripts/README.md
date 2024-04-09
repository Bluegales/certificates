# example_scripts

This folder contains scripts to easily test single parts of the whole project.

## Get started

`cp config_example.ts config.ts`

**Optional:** change the chain

add your private key to the config
add your public key under attester
make sure you have funds on the chain you specified

to test run:
`npx tsx sample_scripts/script.ts`

## Scripts

### create_schema

This script facilitates the creation of a schema for attestations. The schema is designed to accommodate a single `uint256` value, representing the hash of the file.

Instructions
- This script is intended for one-time use.
- After deployment, ensure to add the generated schema ID to the `config.ts` file under `elements.schemaId`. 

### attest_hash

### derypt_file

### list_files

### upload_file

### verify_hash
