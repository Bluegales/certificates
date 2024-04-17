import lighthouse from '@lighthouse-web3/sdk'
import kavach from "@lighthouse-web3/kavach"
import { privateKeyToAccount } from 'viem/accounts';
import { config } from "../config.js";
import { load } from 'ts-dotenv';

const env = load({
  PRIVATE_KEY: /^0x[0-9A-Fa-f]+$/,
  LIGHT_HOUSE_API_KEY: String,
}, '../.env');

async function uploadEncrypted(pathToFile: string) {
  const apiKey = env.LIGHT_HOUSE_API_KEY
  const account = privateKeyToAccount(env.PRIVATE_KEY as `0x${string}`)
  const message = await kavach.getAuthMessage(account.address)
  if (message.message == null) {
    throw "asd";
  }
  const signedMessage = await account.signMessage({
    message: message.message,
  })

  const response = await lighthouse.uploadEncrypted(pathToFile, apiKey, account.address, signedMessage)
  console.log(response)
}

uploadEncrypted('./sample.txt')
