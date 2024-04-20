import lighthouse from '@lighthouse-web3/sdk'
import kavach from "@lighthouse-web3/kavach"
import { privateKeyToAccount } from 'viem/accounts';
import { env } from '.';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as crypto from 'crypto';
import { IFileUploadedResponse } from '@lighthouse-web3/sdk/dist/types';

export async function Download(cid: string): Promise<ArrayBuffer> {
    const account = privateKeyToAccount(env.PRIVATE_KEY as `0x${string}`)
    const message = await lighthouse.getAuthMessage(account.address)
    const signedMessage = await account.signMessage(message.data)
    var fileEncryptionKey
    fileEncryptionKey = await lighthouse.fetchEncryptionKey(
        cid,
        account.address,
        signedMessage
    )
    const decrypted: ArrayBuffer = await lighthouse.decryptFile(
        cid,
        fileEncryptionKey.data.key as string
    )
    return decrypted
}

export async function Upload(buffer: Buffer): Promise<IFileUploadedResponse[]>{
    // the lighthouse sdk doesn't support encrypted upload of buffers
    // we need a temporary intermediate file
    const path = await createTempFile(buffer)
    const cid = await uploadEncrypted(path)
    await deleteTempFile(path)
    return cid.data
}

export async function Share(cid: string, publicKey: string) {
    const account = privateKeyToAccount(env.PRIVATE_KEY as `0x${string}`)
    const message = await lighthouse.getAuthMessage(account.address)
    const signedMessage = await account.signMessage(message.data)
    const shareResponse = await lighthouse.shareFile(
        account.address,
        [publicKey],
        cid,
        signedMessage
    )
    return shareResponse
}

async function uploadEncrypted(pathToFile: string) {
    const apiKey = env.LIGHT_HOUSE_API_KEY
    const account = privateKeyToAccount(env.PRIVATE_KEY as `0x${string}`)
    const message = await kavach.getAuthMessage(account.address)
    if (message.message == null) {
      throw "error getting message";
    }
    const signedMessage = await account.signMessage({
      message: message.message,
    })
  
    const response = await lighthouse.uploadEncrypted(pathToFile, apiKey, account.address, signedMessage)
    return response
}

function createTempFile(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
      // Generate a unique filename
      const randomBytes = crypto.randomBytes(16).toString('hex');
      const tempFilePath = path.join(os.tmpdir(), `tempfile_${randomBytes}`);

      // Write the buffer to the temporary file
      fs.writeFile(tempFilePath, buffer, (err) => {
          if (err) {
              reject(err);
          } else {
              resolve(tempFilePath);
          }
      });
  });
}

function deleteTempFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
          if (err) {
              reject(err);
          } else {
              resolve();
          }
      });
  });
}
