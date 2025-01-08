const { Connection, Transaction, PublicKey } = require('@solana/web3.js');
const { Market } = require('@project-serum/serum');
const { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } = require('@solana/spl-token');

async function sellToken(connection, wallet, tokenMintAddress, amount, marketAddress) {
    const market = await Market.load(connection, marketAddress, {}, TOKEN_PROGRAM_ID);
    const tokenAccountAddress = await getAssociatedTokenAddress(tokenMintAddress, wallet.publicKey);

    const tokenAccount = await connection.getAccountInfo(tokenAccountAddress);
    if (!tokenAccount) {
        console.log(`No token account found for wallet ${wallet.publicKey.toBase58()}`);
        return false;
    }

    console.log(`Selling ${amount} tokens from wallet ${wallet.publicKey.toBase58()}...`);

    const transaction = new Transaction();

    transaction.add(
        await market.makePlaceOrderInstruction(connection, wallet, {
            side: 'sell',
            price: 0.001,
            size: amount,
            orderType: 'limit',
        })
    );

    try {
        console.log('Placing sell order...');
        await connection.sendTransaction(transaction, [wallet]);
        console.log('Order placed successfully!');

        await connection.confirmTransaction(transaction);
        return true;
    } catch (err) {
        console.error('Error during token sale:', err);
        return false;
    }
}

module.exports = sellToken;
