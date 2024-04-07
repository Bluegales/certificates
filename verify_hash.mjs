import { config } from "./config.mjs";

function verifyHash(hash) {
    const queryParams = {
        schema: config.schema,
        attester: config.attester,
        indexingValue: hash,
    }
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = config.baseUrl + 'index/attestations' + '?' + queryString;
    
    return fetch(fullUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error('Request failed with status:', response.status);
                throw "Request failed with status:" + response.status
            }
        })
        .then(data => {
            if (data.success && data.statusCode === 200) {
                if (data.data.total > 0) {
                    const firstElement = data.data.rows[0];
                    const attestationId = firstElement.onchain_evm_84532_0x1c;
                    // possibility to check this onchain now if we don't trust the backend
                    if (firstElement.revoked) {
                        console.debug('revoked');
                        return false;
                    }
                    return true;
                } else {
                    console.debug('not found');
                    return false;
                }
            } else {
                throw "Response indicates failure:" + data.message
            }
        });
}

// example code

const validHash = '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
const invalidHash = '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b856'

verifyHash(validHash)
    .then(result => {
        console.log('valid result:', result);
    })
    .catch(error => {
        console.error('Error during verification:', error);
    });

verifyHash(invalidHash)
    .then(result => {
        console.log('invalid result:', result);
    })
    .catch(error => {
        console.error('Error during verification:', error);
    });

