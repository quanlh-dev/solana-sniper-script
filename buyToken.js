const { Transaction } = require('@solana/web3.js');
const { Market } = require('@project-serum/serum');
const { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const axios = require('axios');



async function buyToken(connection, payer, marketAddress, amount, jitoApiUrlBundles) {
    const market = await Market.load(connection, marketAddress, {}, TOKEN_PROGRAM_ID);
    const payerAddress = payer.publicKey;

    console.log(`Buying ${amount} tokens for SOL...`);

    const payerTokenAddress = await getAssociatedTokenAddress(market.quoteMintAddress, payerAddress);

    const asks = await market.loadAsks(connection);
    const price = asks.getBestPrice();
    const transaction = new Transaction();
    transaction.add(
        await market.makePlaceOrderInstruction(connection, payer, {
            side: 'buy',
            price: price,
            size: amount,
            orderType: 'limit',
            clientId: undefined,
            openOrdersAddress: undefined,
        })
    );

    const serializedTransaction = transaction.serializeMessage();

    const bundlePayload = {
        transactions: [
            {
                transaction: Buffer.from(serializedTransaction).toString('base64'),
                signature: parentWallet.signTransaction(transaction),
            },
        ],
    };

    try {
        const response = await axios.post(jitoApiUrlBundles, bundlePayload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const { status, data } = response;
        if (status === 200) {
            console.log('Successfully bundled transaction:', data);
            const bundleId = data.bundleId;

            // Send the bundle transaction to Solana using Jito's endpoint
            const sendResponse = await axios.post(`${jitoApiUrlBundles}/${bundleId}/send`);
            console.log('Transaction sent successfully:', sendResponse.data);
        } else {
            console.error('Error bundling transaction:', data);
        }
    } catch (err) {
        console.error('Failed to buy tokens:', err);
        return false;
    }
}

module.exports = buyToken;
