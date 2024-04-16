import { config } from "./config_public";
import { SignProtocolClient, SpMode } from "@ethsign/sp-sdk";

const client = new SignProtocolClient(SpMode.OnChain, {
    chain: config.chain
});

const schemaId = config.documentHashSchema.split('_').slice(-1)[0];

async function testAttestation(attestationId: string, hash: string): Promise<Boolean> {
    const res = await client.getAttestation(
        attestationId
    );
    if (res.revoked !== false) {
        console.log('revoked')
        return false
    }
    if (res.schemaId !== schemaId) {
        console.log('wrong schema got:', res.schemaId, " expected: ", schemaId)
        return false
    }
    if (res.attester !== config.attester) {
        console.log('wrong attester')
        return false
    }
    if (typeof res.data === 'object' && res.data !== null) {
        const hexString = `0x${res.data['hashOfDocument'].toString(16)}`;
        if (hexString !== hash) {
            console.log('wrong hash', res.data['hashOfDocument'], hexString, hash)
            return false
        }
    }
    return true
}

async function getAttestationId(hash: string): Promise<string | null> {
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
        schemaId: config.documentHashSchema,
        attester: config.attester,
        indexingValue: hash,
    };
    const queryString: string = new URLSearchParams(queryParams).toString();
    const fullUrl: string = `${config.baseUrl}index/attestations?${queryString}`;
    // const fullUrl: string = config.baseUrl + 'index/attestations' + '?' + queryString;

    try {
        const response = await fetch(fullUrl);
        if (response.ok) {
            const data = await response.json() as Data;
            if (data.success && data.statusCode === 200) {
                if (data.data.total > 0) {
                    const firstElement = data.data.rows[0];
                    return firstElement.attestationId;
                } else {
                    console.debug('not found');
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

async function verifyHash(hash: string) {
    const id = await getAttestationId(hash);
    if (id === null) {
        console.log("didnt find attestation")
        return false
    }
    return testAttestation(id, hash);
}

export default verifyHash;
