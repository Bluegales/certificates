import { EvmChains, SignProtocolClient, SpMode } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";
import { config } from "../config";
import { load } from 'ts-dotenv';

const env = load({
  PRIVATE_KEY: /^0x[0-9A-Fa-f]+$/,
}, '../.env');

const client = new SignProtocolClient(SpMode.OnChain, {
  chain: config.chain as EvmChains,
  account: privateKeyToAccount(env.PRIVATE_KEY as `0x${string}`),
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

var hex: `0x${string}`  = '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
 
createAttestation(hex).then(response => {
  console.log('validating existance of attestation')
  getAttestation(response.attestationId)
})
