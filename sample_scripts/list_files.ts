import lighthouse from '@lighthouse-web3/sdk'
import { config } from "../config.js";

async function getUploads() {
    const response = await lighthouse.getUploads(config.lightHouse.apiKey)
    response.data.fileList.forEach((element) => console.log(element))
    // console.log(response)
    
    /* Sample response
      {
        data: {
          fileList: [
            {
              publicKey: '0x4e6d5be93ab7c1f75e30dd5a7f574f42f675eed3',
              fileName: 'sample.txt',
              mimeType: 'text/plain',
              txHash: '',
              status: 'queued',
              createdAt: 1691087810426,
              fileSizeInBytes: '14',
              cid: 'QmQK9V46b4vpNUd7pe7EcCqihBEmcSLH4NVNWukLJhGzgN',
              id: '1b2623bd-64ca-4434-8619-24c9a1eca840',
              lastUpdate: 1691087810426,
              encryption: false
            }
          ]
        }
      }
    */
  }

  getUploads()
