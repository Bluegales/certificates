import { Attestation, OnChainAttestation, SignProtocolClient, SpMode } from "@ethsign/sp-sdk";
import { decodeAbiParameters } from "viem";
import { config } from "../config";
import fetch from 'node-fetch';
import bs58 from "bs58";

const toHexString = (byteArray: Uint8Array) => {
  return Array.prototype.map
    .call(byteArray, function (byte) {
      return ("0" + (byte & 0xff).toString(16)).slice(-2);
    })
    .join("");
};
export const getBytes32FromIpfsHash = (ipfsListing: string) => {
  return "0x" + toHexString(bs58.decode(ipfsListing).slice(2));
};
export const getIpfsHashFromBytes32 = (bytes32Hex: string) => {
  const hashHex = "1220" + bytes32Hex.slice(2);
  const hashBytes = Buffer.from(hashHex, "hex");
  const hashStr = bs58.encode(hashBytes);
  return hashStr;
};
export const getIpfsHashFromUint256 = (uint: BigInt) => {
    const bigint: BigInt = uint
    return getIpfsHashFromBytes32('0x' + bigint.toString(16))
}

function rowsToFiles(rows: any[]) {
    return rows.map(row => {
        const schemaData = JSON.parse(row.schema.originalData).data;
        const decodedFile = decodeAbiParameters(schemaData, row.data);
        return { name: decodedFile[0], cid: getIpfsHashFromUint256(decodedFile[1]) };
    });
}

async function getCids(address: string): Promise<any | null> {
    interface Data {
        success: boolean;
        statusCode: number;
        data: {
            total: number;
            rows: any[];
            size: number;
            page: number;
        };
        message?: string;
    }
    const queryParams = {
        schemaId: config.cidFilesSchema,
        attester: config.attester,
    };
    const queryString: string = new URLSearchParams(queryParams).toString();
    const fullUrl: string = config.baseUrl + 'index/attestations' + '?' + queryString;
    try {
        const response = await fetch(fullUrl);
        if (response.ok) {
            const data = await response.json() as Data;
            if (data.success && data.statusCode === 200) {
                if (data.data.total > 0) {
                    return data.data.rows
                } else {
                    console.debug('no files');
                    return null;
                }
            } else {
                throw new Error("Response indicates failure: " + data.message);
            }
        } else {
            console.error('Request failed with status:', response.status);
            throw new Error("Request failed with status:" + response.status);
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function getFiles(address: string) {
    const id = await getCids(address);
    if (id === null) {
        return false
    }
    return rowsToFiles(id)
}

// example code

const address = '0xc01A78dbf0b7fEbf6910784c4eB985Dcf67c1E5E'

getFiles(address)
    .then(result => {
        console.log('valid result:', result);
    })
    .catch(error => {
        console.error('Error during verification:', error);
    });
