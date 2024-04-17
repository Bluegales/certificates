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

async function createSchema() {
  const res = await client.createSchema({
    name: "sign document",
    data: [{ name: "hashOfDocument", type: "uint256" }],
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

createSchema().then(response => {
    console.log('validating existance of schema')
    getSchema(response.schemaId)
})
