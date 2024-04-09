import { SignProtocolClient, SpMode } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";
import { config } from "../config";

const client = new SignProtocolClient(SpMode.OnChain, {
  chain: config.chain,
  account: privateKeyToAccount(config.privateKey),
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
