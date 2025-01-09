const { Connection, PublicKey, Transaction, SystemProgram, clusterApiUrl } = require('@solana/web3.js');
const { Market, OpenOrders } = require('@project-serum/serum');
const { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const { JitoBundler } = require('jito-solana');

async function buyToken(connection, payer, marketAddress, amount, price) {
    const market = await Market.load(connection, marketAddress, {}, TOKEN_PROGRAM_ID);
    const payerAddress = payer.publicKey;

    const totalCost = price * amount;

    console.log(`Buying ${amount} tokens for a total of ${totalCost} SOL...`);

    const payerTokenAddress = await getAssociatedTokenAddress(market.quoteMintAddress, payerAddress);

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
    try {
        const bundler = new JitoBundler(connection);
        const bundledTransaction = await bundler.bundleTransaction(transaction, [payer]);

        await connection.sendRawTransaction(bundledTransaction.serialize());
        console.log('Order placed successfully!');

        await connection.confirmTransaction(bundledTransaction);
        return true;
    } catch (err) {
        console.error('Failed to buy tokens:', err);
        return false;
    }
}

module.exports = buyToken;
