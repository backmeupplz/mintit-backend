# Farcaster MintIt backend code

- Listens to the @mintit mentions and mints cast tokens
- Returns metadata and images for tokens

## Installation and local launch

1. Clone this repo: `git clone https://github.com/backmeupplz/mintit-backend`
2. Create `.env` with the environment variables listed below
3. Run `yarn` in the root folder
   4 . Run `yarn start`

And you should be good to go! Feel free to fork and submit pull requests.

## Environment variables

| Name                 | Description                              |
| -------------------- | ---------------------------------------- |
| `MONGO`              | URL of the mongo database                |
| `PORT`               | Port to run server on (defaults to 1337) |
| `FARCASTER_MNEMONIC` | Mnemonic for the bot's account           |
| `CONTRACT_ADDRESS`   | Address of the contract to mint tokens   |
| `ETH_RPC`            | Ethereum RPC endpoint                    |

Also, please, consider looking at `.env.sample`.
