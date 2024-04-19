import { env } from './server';
import { EvmChains, SignProtocolClient, SpMode } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";
import { config } from "../../config";

const schemaId = config.documentHashSchema.split('_').slice(-1)[0];

export async function createAttestation(hash: `0x${string}`) {
  const client = new SignProtocolClient(SpMode.OnChain, {
    chain: config.chain as EvmChains,
    account: privateKeyToAccount(env.PRIVATE_KEY as `0x${string}`),
  });
  
  const res = await client.createAttestation({
    schemaId: schemaId,
    data: { hashOfDocument: hash },
    indexingValue: hash,
  });

  console.log(res)
  return res
}

