const { Connection, Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');
require('dotenv').config();

const createRandomWallet = require('./createWallet');
const sendToWallets = require('./sendToWallets');
const sellToken = require('./sellToken');
const retryBuyToken = require('./retryBuyToken');

const PARENT_WALLET_PRIVATE_KEY = process.env.PARENT_WALLET_PRIVATE_KEY;
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL;

const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

const parentWallet = Keypair.fromSecretKey(bs58.decode(PARENT_WALLET_PRIVATE_KEY));

async function main() {
    const generatedWallets = Array.from({ length: 10 }, createRandomWallet);

    const tokenAmount = 100;

    try {
        await retryBuyToken(tokenAmount);

        await sendToWallets(connection, parentWallet, tokenAmount, generatedWallets);

        for (const wallet of generatedWallets) {
            await sellToken(wallet);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
