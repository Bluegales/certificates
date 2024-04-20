import lighthouse from '@lighthouse-web3/sdk'
import { privateKeyToAccount } from 'viem/accounts';
import { load } from 'ts-dotenv';

const env = load({
  PRIVATE_KEY: /^0x[0-9A-Fa-f]+$/,
}, '../.env');

export async function Share(cid: string, publicKey: string) {
    try {
        const account = privateKeyToAccount(env.PRIVATE_KEY as `0x${string}`)
        const message = await lighthouse.getAuthMessage(account.address)
        const signedMessage = await account.signMessage(message.data)
        const shareResponse = await lighthouse.shareFile(
            account.address,
          [publicKey],
          cid,
          signedMessage
        )
        console.log(shareResponse)
      } catch (error) {
        console.log(error)
      }
}

Share('QmXdq5dLd1xUoH4uub342XUNngh8awfF44Ao8ZwUmXVVLc', '0xE500695c1A67644Fe18AC423FEBdB2c123a1C08d')
