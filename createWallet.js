const { Keypair } = require('@solana/web3.js');
function createRandomWallet() {
    const wallet = Keypair.generate();

    console.log('Generated Wallet Address:', wallet.publicKey.toBase58());

    return {
        publicKey: wallet.publicKey.toBase58(),
        privateKey: wallet.secretKey.toString('base64'),
    };
}

module.exports = createRandomWallet;
