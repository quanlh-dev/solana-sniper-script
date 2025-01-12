const { Connection, Keypair } = require('@solana/web3.js');
require('dotenv').config();

const bs58 = require('bs58');
const fs = require('fs');


const createRandomWallet = require('./createWallet');
const sendToWallets = require('./sendToWallets');
const sellToken = require('./sellToken');
const retryBuyToken = require('./retryBuyToken');

const PARENT_WALLET_PRIVATE_KEY = process.env.PARENT_WALLET_PRIVATE_KEY;
const JITO_SOLANA_RPC_URL = process.env.JITO_SOLANA_RPC_URL;
const JITO_API_URL_BUNDLES = process.env.JITO_API_URL_BUNDLES

if (!JITO_SOLANA_RPC_URL) {
    throw new Error('JITO_SOLANA_RPC_URL is not set in the environment variables');
}

const connection = new Connection(JITO_SOLANA_RPC_URL, 'confirmed');
const jitoApiUrlBundles = JITO_API_URL_BUNDLES
const walletFile = fs.readFileSync('mywallet.json', 'utf8');
const walletData = JSON.parse(walletFile);
const secretKey = Uint8Array.from(walletData.privateKey);
const parentWallet = Keypair.fromSecretKey(secretKey);
const marketAddress = '9xQeWvG8R5X8i9B59oYVt2r7GoVqxVt3EKM65dNEhQYw'
async function main() {
    const generatedWallets = Array.from({ length: 10 }, createRandomWallet);

    const tokenAmount = 10;

    try {
        await retryBuyToken(connection, parentWallet, marketAddress, tokenAmount, jitoApiUrlBundles);

        const amountPerWallet = tokenAmount / 10;
        await sendToWallets(connection, parentWallet, amountPerWallet, generatedWallets, jitoApiUrlBundles);

        for (const wallet of generatedWallets) {
            await sellToken(connection, wallet, marketAddress, amountPerWallet, jitoApiUrlBundles);
        }

        await connection.sendTransaction(transaction, [parentWallet, ...generatedWallets.map(wallet => wallet.keypair)]);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
