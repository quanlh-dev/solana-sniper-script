# Solana Token Sniper Script

A simple Node.js script that automates the process of buying tokens on **pump.fun** and distributing them across multiple generated wallets. The script also provides functionality to sell tokens back into SOL, with retry logic for failed purchases.

## Project Overview

This script:

- **Spawns 10 generated wallets**.
- **Buys tokens** from a parent wallet and distributes them equally into the generated wallets.
- **Sends tokens** in a single transaction from the parent wallet to the generated wallets.
- Includes **retry logic** in case the buy fails.
- Allows you to **sell tokens** from each generated wallet back to SOL.

### Requirements

- Node.js (version 14.x or higher)
- A Solana wallet (Parent wallet) with enough SOL balance to perform transactions.
- Access to the **Solana RPC URL** for interaction with the blockchain.

## Setup & Installation

1. **Clone the repository** (if you're using Git):

   ```bash
   git clone
   cd solana-sniper-script

2. **Install the dependencies**:

   ```bash
   npm install


3. **Update the configuration**:

   - Copy the `.env.example` file to `.env`.
   - Update the configuration values with your Solana wallet address, private key, and the Solana RPC URL.


4. **Run the script**:

   ```bash
   node sniper.js

## Output

```bash
Generated Wallet Address: 8AE7Cu99KoXeE1Jkc3ybfyBT8QygXxkUwr7AWAp7qUFi
Generated Wallet Address: FmT4CwmbdkNUDfZyaZ767kCLYvW2RdQyXfFyPYypRGkF
Generated Wallet Address: 5kJk4nWf5iptYHTPuc8VPfdujZhRF6Z8kdSx4YcPkQQ6
Generated Wallet Address: FcCKGrud2Viku1S476UNu6kgzDPX3JNW2SN789rxtZeK
Generated Wallet Address: 2B8kwuzxK47KhgFCZb3jPVSxUcotWQL6WH2eWfzQzphi
Generated Wallet Address: qrws5fuK4MBJDacNnNMmH5byPaseSo4L31zqMHLEr43
Generated Wallet Address: fHSNEvTFuTFsA35XMKMz5GS13s8K2Z2LkaBiQNuxXVo
Generated Wallet Address: 6Zkmq6BgVAVgfezYb7qxCHwwi3gcqwVq3d687jy5Hq91
Generated Wallet Address: 7nC7QJ43GB8tWND1rXY56YfHMJNF2uZd3gkw6MMXQoV5
Generated Wallet Address: 8rHhCvPMn3E2tfFKLpaCCA9jertN4txDy8RtJodAQono
