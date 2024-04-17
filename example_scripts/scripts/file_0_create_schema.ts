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

async function createSchemaCid() {
  const res = await client.createSchema({
    name: "ipfs files",
    data: [{ name: "name", type: "string" }, { name: "cid", type: "uint256" }],
  });

  console.log(res)
  return res
}

async function getSchema(schemaId: string) {
  const res = await client.getSchema(
    schemaId
  );

  console.log(res)
  return res
}

createSchemaCid().then(response => {
  console.log('validating existance of schema')
  getSchema(response.schemaId)
})
