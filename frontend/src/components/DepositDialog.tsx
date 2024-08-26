import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Aptos,
  Account,
  Ed25519PrivateKey,
  Serializer,
  MoveVector,
  U64,
  Network,
  AptosConfig
} from "@aptos-labs/ts-sdk";
import { panoraSwap } from "@/lib/apiRequests";

const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
const wUSDC_TOKEN = "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T";
const zUSDC_TOKEN = "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC";

const DepositDialogButton = () => {
  const [amount, setAmount] = useState("");

  const handleConfirm = async () => {
    // Add the logic for handling the deposit here
    console.log(`Depositing ${amount} USDT`);

    const fromTokenAmount = "0.001"; // Amount of USDC to swap
    const toWalletAddress = "0xfff0b85abd60c84d99ea725cede9d711276c09e2ec435a45777df0ca933b27cc";
    const privateKey = process.env.NEXT_PUBLIC_ADMIN_PK;

    const wUsdcSwapResponse = await panoraSwap(APTOS_COIN, wUSDC_TOKEN, fromTokenAmount, toWalletAddress, privateKey);
    console.log("response", wUsdcSwapResponse);
    const zUsdcSwapResponse = await panoraSwap(APTOS_COIN, zUSDC_TOKEN, fromTokenAmount, toWalletAddress, privateKey);
    console.log("response", zUsdcSwapResponse);

    const config = new AptosConfig({ network: Network.MAINNET });
    const aptos = new Aptos(config);
    const privateKeyInstance = new Ed25519PrivateKey(
      privateKey
    );
    const admin = Account.fromPrivateKey({ privateKey: privateKeyInstance });
    const moduleAddress = "0x4bf51972879e3b95c4781a5cdcb9e1ee24ef483e7d22f2d903626f126df62bd1";
    const wUSDC = BigInt(1 * 100000);
    const zUSDC = BigInt(1 * 100000);

    const transaction = await aptos.transaction.build.simple({
      sender: admin.accountAddress,
      data: {
        function: `${moduleAddress}::router::add_liquidity_and_stake_both_coins_entry`,
        typeArguments: [wUSDC_TOKEN, zUSDC_TOKEN],
        functionArguments: [true, wUSDC, zUSDC],
      },
    });

    const committedTxn = await aptos.signAndSubmitTransaction({ signer: admin, transaction: transaction });
    await aptos.waitForTransaction({ transactionHash: committedTxn.hash });
    console.log(`Committed transaction: ${committedTxn.hash}`);

    setAmount("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Deposit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Deposit</DialogTitle>
        <DialogDescription>Please enter the amount of USDT you want to deposit.</DialogDescription>
        <div className="mt-4">
          <Input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="default" onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DepositDialogButton;
