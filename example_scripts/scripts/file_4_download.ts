import lighthouse from '@lighthouse-web3/sdk'
import { privateKeyToAccount } from 'viem/accounts';
import { load } from 'ts-dotenv';

const env = load({
  PRIVATE_KEY: /^0x[0-9A-Fa-f]+$/,
}, '../.env');

async function decrypt(cid: string) {
    const account = privateKeyToAccount(env.PRIVATE_KEY as `0x${string}`)
    const message = await lighthouse.getAuthMessage(account.address)
    const signedMessage = await account.signMessage(message.data)
    var fileEncryptionKey
    try {
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
        console.log(decrypted as Buffer)

    } catch (err) {
        console.log(err)
    }
}

decrypt('QmXdq5dLd1xUoH4uub342XUNngh8awfF44Ao8ZwUmXVVLc')

