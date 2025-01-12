const { Transaction, SystemProgram, sendAndConfirmTransaction } = require('@solana/web3.js');
const { getAssociatedTokenAddress, Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');

async function sendToWallets(connection, parentWallet, tokenAmount, wallets, tokenMintAddress = undefined, jitoApiUrlBundles) {
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
        const serializedTransaction = transaction.serializeMessage();
        const bundlePayload = {
            transactions: [
                {
                    transaction: Buffer.from(serializedTransaction).toString('base64'),
                    signature: parentWallet.signTransaction(transaction),
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
            console.log('Transaction sent successfully:', sendResponse.data);
        } else {
            console.error('Error bundling transaction:', response.data);
        }
        console.log('Transaction successful!');
    } catch (err) {
        console.error('Transaction failed', err);
    }
}

module.exports = sendToWallets;
