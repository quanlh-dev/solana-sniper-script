const { Connection, Transaction, PublicKey } = require('@solana/web3.js');
const { Market } = require('@project-serum/serum');
const { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const axios = require('axios');

async function sellToken(connection, wallet, tokenMintAddress, marketAddress, amountPerWallet, jitoApiUrlBundles) {
    const market = await Market.load(connection, marketAddress, {}, TOKEN_PROGRAM_ID);
    const tokenAccountAddress = await getAssociatedTokenAddress(tokenMintAddress, wallet.publicKey);

    const tokenAccount = await connection.getAccountInfo(tokenAccountAddress);
    if (!tokenAccount) {
        console.log(`No token account found for wallet ${wallet.publicKey.toBase58()}`);
        return false;
    }

    console.log(`Selling ${amount} tokens from wallet ${wallet.publicKey.toBase58()}...`);

    const transaction = new Transaction();
    const asks = await market.loadAsks(connection);
    const price = asks.getBestPrice();
    transaction.add(
        await market.makePlaceOrderInstruction(connection, wallet, {
            side: 'sell',
            price: price,
            size: amountPerWallet,
            orderType: 'limit',
        })
    );

    try {
        console.log('Placing sell order...');
        const serializedTransaction = transaction.serializeMessage();
        const bundlePayload = {
            transactions: [
                {
                    transaction: Buffer.from(serializedTransaction).toString('base64'),
                    signature: wallet.signTransaction(transaction),
                },
            ],
        };
        const response = await axios.post(jitoApiUrlBundles, bundlePayload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            console.log('Transaction successfully bundled:', response.data);
            const bundleId = response.data.bundleId;
            const sendResponse = await axios.post(`jitoApiUrlBundles${bundleId}/send`);
            console.log('Order placed successfully:', sendResponse.data);
        } else {
            console.error('Error bundling transaction:', response.data);
        }
        const confirmResponse = await connection.confirmTransaction(response.data.transaction);
        console.log('Transaction confirmed:', confirmResponse);
        return true;
    } catch (err) {
        console.error('Error during token sale:', err);
        return false;
    }
}

module.exports = sellToken;
