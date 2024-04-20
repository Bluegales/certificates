import { env } from './server';
import { AttestationResult, EvmChains, SignProtocolClient, SpMode } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";
import { config } from "../../config";
import * as crypto from 'crypto';
import bs58 from "bs58";

const documentSchemaId = config.documentHashSchema.split('_').slice(-1)[0];
const fileSchemaId = config.cidFilesSchema.split('_').slice(-1)[0];


export async function attestBuffer(buffer: Buffer): Promise<AttestationResult> {
  const hash = crypto.createHash('sha256');
  hash.update(buffer);
  const sha256Hash = hash.digest('hex');
  return createAttestation(`0x${sha256Hash}`);
}

async function createAttestation(hash: `0x${string}`)
  : Promise<AttestationResult> {
  const client = new SignProtocolClient(SpMode.OnChain, {
    chain: config.chain as EvmChains,
    account: privateKeyToAccount(env.PRIVATE_KEY as `0x${string}`),
  });

  return await client.createAttestation({
    schemaId: documentSchemaId,
    data: { hashOfDocument: hash },
    indexingValue: hash,
  });
}

// attest own files


const toHexString = (byteArray: Uint8Array) => {
  return Array.prototype.map
    .call(byteArray, function (byte) {
      return ("0" + (byte & 0xff).toString(16)).slice(-2);
    })
    .join("");
};
const getBytes32FromIpfsHash = (ipfsListing: string) => {
  return "0x" + toHexString(bs58.decode(ipfsListing).slice(2));
};
const getIpfsHashFromBytes32 = (bytes32Hex: string) => {
  const hashHex = "1220" + bytes32Hex.slice(2);
  const hashBytes = Buffer.from(hashHex, "hex");
  const hashStr = bs58.encode(hashBytes);
  return hashStr;
};
const getIpfsHashFromUint256 = (uint: BigInt) => {
  const bigint: BigInt = uint
  return getIpfsHashFromBytes32('0x' + bigint.toString(16))
}

export async function createCidAttestation(name: string, cid: string) {
  const client = new SignProtocolClient(SpMode.OnChain, {
    chain: config.chain as EvmChains,
    account: privateKeyToAccount(env.PRIVATE_KEY as `0x${string}`),
  });
  const res = await client.createAttestation({
    schemaId: fileSchemaId,
    data: { name: name, cid: getBytes32FromIpfsHash(cid) },
    indexingValue: cid,
    recipients: ['0xE500695c1A67644Fe18AC423FEBdB2c123a1C08d']
  });

  console.log(res)
  return res
}
