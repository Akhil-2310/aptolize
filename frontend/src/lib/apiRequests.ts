import {
  Aptos,
  Account,
  Ed25519PrivateKey,
  Serializer,
  MoveVector,
  U64,
  Network,
  AptosConfig,
} from "@aptos-labs/ts-sdk";
import Panora from "@panoraexchange/swap-sdk";

const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
const wUSDC_TOKEN = "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T";
const zUSDC_TOKEN = "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC";
const toWalletAddress = "0xfff0b85abd60c84d99ea725cede9d711276c09e2ec435a45777df0ca933b27cc";

const privateKey = process.env.NEXT_PUBLIC_ADMIN_PK as string;

const aptos_mainnet = new Aptos(new AptosConfig({ network: Network.MAINNET }));
const aptos_devnet = new Aptos(new AptosConfig({ network: Network.DEVNET }));
const admin = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey(privateKey),
});
const cellanaAddress = "0x4bf51972879e3b95c4781a5cdcb9e1ee24ef483e7d22f2d903626f126df62bd1";
const aptolizeAddress = "0xfff0b85abd60c84d99ea725cede9d711276c09e2ec435a45777df0ca933b27cc";

// Initialize the Panora client
const client = new Panora({
  apiKey: "oLujOsvnXgFY9TjN5VxS@u@kmq+wWjcyTEnVL4LEPf5pwNtYdR90EfeBDj33F^4E",
});

export async function swapAptToWUsdc(amount: string) {
  return await panoraSwap(APTOS_COIN, wUSDC_TOKEN, amount, toWalletAddress, privateKey);
}

export async function swapAptToZUsdc(amount: string) {
  return await panoraSwap(APTOS_COIN, zUSDC_TOKEN, amount, toWalletAddress, privateKey);
}
//@ts-ignore
export async function panoraSwap(fromTokenAddress, toTokenAddress, fromTokenAmount, toWalletAddress, privateKey) {
  try {
    const response = await client.ExactInSwap(
      {
        chainId: "1",
        // "fromTokenAddress": "0x1::aptos_coin::AptosCoin",
        // "fromTokenAddress": "0x2ebb2ccac5e027a87fa0e2e5f656a3a4238d6a48d93ec9b610d570fc0aa0df12",
        // "toTokenAddress": "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
        // "toTokenAddress": "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T",
        // "toTokenAddress": "0x1::aptos_coin::AptosCoin",
        fromTokenAddress: fromTokenAddress,
        toTokenAddress: toTokenAddress,

        fromTokenAmount: fromTokenAmount,
        toWalletAddress: toWalletAddress,
        slippagePercentage: String(1),
      },
      privateKey,
    );

    console.log("Swap successful!");
    console.log("USDC amount sent:", fromTokenAmount);
    console.log("USDT amount received:", response);
    return response;
  } catch (error) {
    console.error("Error during swap:", error);
    throw error;
  }
}
//@ts-ignore
export async function stakeWusdcZusdcPair(wUsdcAmount, zUsdcAmount) {
  const transaction = await aptos_mainnet.transaction.build.simple({
    sender: admin.accountAddress,
    data: {
      function: `${cellanaAddress}::router::add_liquidity_and_stake_both_coins_entry`,
      typeArguments: [wUSDC_TOKEN, zUSDC_TOKEN],
      functionArguments: [true, wUsdcAmount, zUsdcAmount],
    },
  });

  const committedTxn = await aptos_mainnet.signAndSubmitTransaction({
    signer: admin,
    transaction: transaction,
  });
  const response = await aptos_mainnet.waitForTransaction({ transactionHash: committedTxn.hash });
  return response;
}
//@ts-ignoreSts
export async function deposit(user, amount, signTransaction) {
  console.log("user.address", user.address);
  const transaction = await aptos_devnet.transaction.build.multiAgent({
    sender: admin.accountAddress,
    secondarySignerAddresses: [user.address],
    data: {
      function: `${aptolizeAddress}::aptolize::deposit`,
      functionArguments: [amount],
    },
  });

  const adminSenderAuthenticator = aptos_devnet.transaction.sign({
    signer: admin,
    transaction: transaction,
  });

  const userSenderAuthenticator = await signTransaction(transaction);

  const committedTxn = await aptos_devnet.transaction.submit.multiAgent({
    transaction,
    senderAuthenticator: adminSenderAuthenticator,
    additionalSignersAuthenticators: [userSenderAuthenticator],
  });

  const response = await aptos_devnet.waitForTransaction({ transactionHash: committedTxn.hash });
  return response;
}
