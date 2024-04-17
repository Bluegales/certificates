import lighthouse from '@lighthouse-web3/sdk'
import { privateKeyToAccount } from 'viem/accounts';
import { load } from 'ts-dotenv';

const env = load({
  PRIVATE_KEY: /^0x[0-9A-Fa-f]+$/,
}, '../.env');

async function decrypt(cid: string) {
    const account = privateKeyToAccount(env.PRIVATE_KEY as `0x${string}`)

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

