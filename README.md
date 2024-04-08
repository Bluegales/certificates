# student-certificate

Early stage of development

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
   2. name?

and code that **in frontend?**
1. gets all shared files from attestation
2. download a file
3. decrypt it
