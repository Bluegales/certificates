import { EvmChains } from "@ethsign/sp-sdk";

interface Config {
    baseUrl: string;
    chain: EvmChains;
    documentHashSchema: `onchain_${string}`;
    attester: `0x${string}`;
}

export const config: Config = {
    baseUrl: 'https://testnet-rpc.sign.global/api/',
    chain: EvmChains.baseSepolia,
    documentHashSchema: 'onchain_evm_84532_0x11',
    attester: '0xc01A78dbf0b7fEbf6910784c4eB985Dcf67c1E5E',
};
