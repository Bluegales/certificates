import React, { useState, useEffect } from 'react';
import { getFiles } from './get_cids';
import {ethers} from 'ethers'
import lighthouse from '@lighthouse-web3/sdk'

interface Element {
  name: string;
  cid: string;
}

const App: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [fileURL, setFileURL] = React.useState(null)

  

  // Async function to fetch elements
  const fetchElements = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const address = await signer.getAddress()
    try {
      const data = await getFiles(address);
      setElements(data);
    } catch (error) {
      console.error('Error fetching elements:', error);
    }
  };

  useEffect(() => {
    fetchElements();
  }, []);

  // Function to handle download
  const handleDownload = async (cid: string) => {
    try {
      console.log(`Downloading element with CID: ${cid}`);
      await decrypt(cid);
      console.log(`Download of element with CID ${cid} successful`);
    } catch (error) {
      console.error(`Error downloading element with CID ${cid}:`, error);
    }
  };

  const encryptionSignature = async() =>{
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const address = await signer.getAddress()
    const messageRequested = (await lighthouse.getAuthMessage(address)).data.message
    const signedMessage = await signer.signMessage(messageRequested)
    return({
      signedMessage: signedMessage,
      publicKey: address
    })
  }

  const decrypt = async(cid: string) =>{
    // Fetch file encryption key
    // const cid = "QmVkbVeTGA7RHgvdt31H3ax1gW3pLi9JfW6i9hDdxTmcGK" //replace with your IPFS CID
    const {publicKey, signedMessage} = await encryptionSignature()
    const keyObject = await lighthouse.fetchEncryptionKey(
      cid,
      publicKey,
      signedMessage
    )   
    const fileType = "application/pdf"
    const decrypted = await lighthouse.decryptFile(cid, keyObject.data.key as string, fileType)
    console.log(decrypted)

    const url = URL.createObjectURL(decrypted)
    console.log(url)
    // setFileURL(url)
    const link = document.createElement("a");
    link.href = url;
    link.download = "certificate.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div>
      <h1>Element List</h1>
      <ul>
        {elements.map((element) => (
          <li key={element.cid}>
            {element.name}
            <button onClick={() => handleDownload(element.cid)}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
