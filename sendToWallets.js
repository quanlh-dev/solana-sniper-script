const { Transaction, SystemProgram, sendAndConfirmTransaction } = require('@solana/web3.js');
const { getAssociatedTokenAddress, Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');

async function sendToWallets(connection, parentWallet, tokenAmount, wallets, tokenMintAddress = undefined) {
    const transaction = new Transaction();
    if (tokenMintAddress) {
        for (let wallet of wallets) {
            const token = new Token(connection, tokenMintAddress, TOKEN_PROGRAM_ID, parentWallet);

            const recipientTokenAccount = await getAssociatedTokenAddress(
                tokenMintAddress, wallet.publicKey
            );

            const transferInstruction = token.createTransferInstruction(
                parentWallet.publicKey,
                recipientTokenAccount,
                parentWallet.publicKey,
                tokenAmount,
                [],
                SystemProgram.programId
            );

            transaction.add(transferInstruction);
        }
    } else {
        for (let wallet of wallets) {
            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: parentWallet.publicKey,
                    toPubkey: wallet.publicKey,
                    lamports: tokenAmount,
                })
            );
        }
    }

    try {
        console.log('Sending transaction...');
        await sendAndConfirmTransaction(connection, transaction, [parentWallet]);
        console.log('Transaction successful!');
    } catch (err) {
        console.error('Transaction failed', err);
    }
}

module.exports = sendToWallets;
