import { env } from './server';
import { AttestationResult, EvmChains, SignProtocolClient, SpMode } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";
import { config } from "../../config";
import * as crypto from 'crypto';

const schemaId = config.documentHashSchema.split('_').slice(-1)[0];

export async function attestBuffer(buffer: Buffer): Promise<AttestationResult> {
  const hash = crypto.createHash('sha256');
  hash.update(buffer);
  const sha256Hash = hash.digest('hex');
  return createAttestation(`0x${sha256Hash}`);
}

export async function createAttestation(hash: `0x${string}`)
  : Promise<AttestationResult> {
  const client = new SignProtocolClient(SpMode.OnChain, {
    chain: config.chain as EvmChains,
    account: privateKeyToAccount(env.PRIVATE_KEY as `0x${string}`),
  });

  return await client.createAttestation({
    schemaId: schemaId,
    data: { hashOfDocument: hash },
    indexingValue: hash,
  });
}

