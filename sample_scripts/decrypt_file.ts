import lighthouse from '@lighthouse-web3/sdk'
import { privateKeyToAccount } from 'viem/accounts';
import { config } from "../config";

async function decrypt(cid: string) {
    const account = privateKeyToAccount(config.privateKey)

    const message = await lighthouse.getAuthMessage(account.address)
    const signedMessage = await account.signMessage(message.data)

    var fileEncryptionKey
    fileEncryptionKey = await lighthouse.fetchEncryptionKey(
        cid,
        account.address,
        signedMessage
    )
    if (fileEncryptionKey.data.key == null) {
        throw "asd";
    }

    const decrypted = await lighthouse.decryptFile(
        cid,
        fileEncryptionKey.data.key
    )

    console.log(decrypted)
}

decrypt('QmVDjmNsSFJnqZ4rJEyV4t9uatqrfpJcimLMk4AA7SRtwf')

