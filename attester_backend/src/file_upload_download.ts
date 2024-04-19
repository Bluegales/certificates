import lighthouse from '@lighthouse-web3/sdk'
import kavach from "@lighthouse-web3/kavach"
import { privateKeyToAccount } from 'viem/accounts';
import { env } from './server';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as crypto from 'crypto';

export async function uploadEncrypted(pathToFile: string) {
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

export async function downloadDecrypt(cid: string) {
    const account = privateKeyToAccount(env.PRIVATE_KEY as `0x${string}`)
    const message = await lighthouse.getAuthMessage(account.address)
    const signedMessage = await account.signMessage(message.data)
    var fileEncryptionKey
    fileEncryptionKey = await lighthouse.fetchEncryptionKey(
        cid,
        account.address,
        signedMessage
    )
    if (fileEncryptionKey.data.key == null) {
        throw "?";
    }
    const decrypted = await lighthouse.decryptFile(
        cid,
        fileEncryptionKey.data.key
    )
    return decrypted
}

export function createTempFile(buffer: Buffer): Promise<string> {
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

export function deleteTempFile(filePath: string): Promise<void> {
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
// decrypt('QmVDjmNsSFJnqZ4rJEyV4t9uatqrfpJcimLMk4AA7SRtwf')

