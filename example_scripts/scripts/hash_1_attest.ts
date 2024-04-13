import { SignProtocolClient, SpMode } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";
import { config } from "../config";

const client = new SignProtocolClient(SpMode.OnChain, {
  chain: config.chain,
  account: privateKeyToAccount(config.privateKey),
});

const schemaId = config.documentHashSchema.split('_').slice(-1)[0];

async function createAttestation(hash: `0x${string}`) {
  const res = await client.createAttestation({
    schemaId: schemaId,
    data: { hashOfDocument: hash },
    indexingValue: hash,
  });

  console.log(res)
  return res
}

async function getAttestation(attestationId: string) {
  const res = await client.getAttestation(
    attestationId
  );
  console.log(res)
}

// get_attestation('0x1e')

var hex: `0x${string}`  = '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
 
createAttestation(hex).then(response => {
  console.log('validating existance of attestation')
  getAttestation(response.attestationId)
})
