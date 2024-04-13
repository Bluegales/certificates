import lighthouse from '@lighthouse-web3/sdk'
import kavach from "@lighthouse-web3/kavach"
import { privateKeyToAccount } from 'viem/accounts';
import { config } from "../config.js";

async function uploadEncrypted() {
//   const apiKey = config.lightHouse.apiKey
//   const account = privateKeyToAccount(config.privateKey)
//   const message = await kavach.getAuthMessage(account.address)
//   if (message.message == null) {
//     throw "asd";
//   }
//   const signedMessage = await account.signMessage({
//     message: message.message,
//   })

//   const response = await lighthouse.uploadEncrypted(pathToFile, apiKey, account.address, signedMessage)
  const asd = await lighthouse.getBalance("0xd3ef574C602D9199f4bb10Da90939Cbe04ef927E")
//   lighthouse.getAuthMessage()
  console.log(asd)
}

uploadEncrypted()
