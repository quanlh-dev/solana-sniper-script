const { Connection, Keypair } = require('@solana/web3.js');
require('dotenv').config();

const bs58 = require('bs58');

const createRandomWallet = require('./createWallet');
const sendToWallets = require('./sendToWallets');
const sellToken = require('./sellToken');
const retryBuyToken = require('./retryBuyToken');

const PARENT_WALLET_PRIVATE_KEY = process.env.PARENT_WALLET_PRIVATE_KEY;
const JITO_SOLANA_RPC_URL = process.env.JITO_SOLANA_RPC_URL;

if (!JITO_SOLANA_RPC_URL) {
    throw new Error('JITO_SOLANA_RPC_URL is not set in the environment variables');
}

const connection = new Connection(JITO_SOLANA_RPC_URL, 'confirmed');

secretKey = bs58.decode(PARENT_WALLET_PRIVATE_KEY);
const parentWallet = Keypair.fromSecretKey(secretKey);

async function main() {
    const generatedWallets = Array.from({ length: 10 }, createRandomWallet);

    const tokenAmount = 100;

    try {
        await retryBuyToken(tokenAmount);

        await sendToWallets(connection, parentWallet, tokenAmount, generatedWallets);

        for (const wallet of generatedWallets) {
            await sellToken(wallet);
        }

        await connection.sendTransaction(transaction, [parentWallet, ...generatedWallets.map(wallet => wallet.keypair)]);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
