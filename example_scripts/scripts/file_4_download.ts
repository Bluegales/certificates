import lighthouse from '@lighthouse-web3/sdk'
import { privateKeyToAccount } from 'viem/accounts';
import { config } from "../config";

async function decrypt(cid: string) {
    const account = privateKeyToAccount(config.privateKey)

    // this is the message that we would need to give to the wallet to sign
    const message = await lighthouse.getAuthMessage(account.address)

    // this step would then be done by the wallet not our account
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

    console.log(decrypted)
}

decrypt('QmWC9AkGa6vSbR4yizoJrFMfmZh4XjZXxvRDknk2LdJffc')

