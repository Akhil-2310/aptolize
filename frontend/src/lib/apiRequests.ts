import Panora from "@panoraexchange/swap-sdk";

// Initialize the Panora client
const client = new Panora({
    apiKey: "oLujOsvnXgFY9TjN5VxS@u@kmq+wWjcyTEnVL4LEPf5pwNtYdR90EfeBDj33F^4E",
});

//@ts-ignore
export async function panoraSwap(fromTokenAddress, toTokenAddress, fromTokenAmount, toWalletAddress, privateKey) {
    try {
        const response = await client.ExactInSwap(
            {
                "chainId": "1",
                // "fromTokenAddress": "0x1::aptos_coin::AptosCoin",
                // "fromTokenAddress": "0x2ebb2ccac5e027a87fa0e2e5f656a3a4238d6a48d93ec9b610d570fc0aa0df12",
                // "toTokenAddress": "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
                // "toTokenAddress": "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T",
                // "toTokenAddress": "0x1::aptos_coin::AptosCoin",
                "fromTokenAddress": fromTokenAddress,
                "toTokenAddress": toTokenAddress,

                "fromTokenAmount": fromTokenAmount,
                "toWalletAddress": toWalletAddress,
                "slippagePercentage": String(1),
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