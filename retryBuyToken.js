const buyToken = require('./buyToken');
async function retryBuyToken(connection, parentWallet, marketAddress, amount, jitoApiUrlBundles) {
    retries = 3
    let attempt = 0;
    while (attempt < retries) {
        try {
            const success = await buyToken(connection, parentWallet, marketAddress, amount, jitoApiUrlBundles);
            if (success) {
                console.log('Token bought successfully!');
                return true;
            }
        } catch (error) {
            console.log(`Attempt ${attempt + 1} failed: ${error.message}`);
        }
        attempt++;
        console.log('Retrying...');
    }
    throw new Error('All attempts to buy tokens failed');
}

module.exports = retryBuyToken;