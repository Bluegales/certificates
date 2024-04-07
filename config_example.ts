import { EvmChains } from "@ethsign/sp-sdk";

interface Config {
    baseUrl: string;
    chain: EvmChains;
    schemaId: `0x${string}`;
    schema: `onchain_${string}`;
    attester: `0x${string}`;
    privateKey: `0x${string}`;
}

export const config: Config = {
    baseUrl: 'https://testnet-rpc.sign.global/api/',
    chain: EvmChains.baseSepolia,
    schemaId: '0xd',
    schema: 'onchain_evm_84532_0xd',
    attester: '0xc01A78dbf0b7fEbf6910784c4eB985Dcf67c1E5E',
    privateKey: '0x'
};
