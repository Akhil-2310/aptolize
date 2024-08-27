import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deposit, stakeWusdcZusdcPair, swapAptToWUsdc, swapAptToZUsdc } from "@/lib/apiRequests";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const DepositDialogButton = () => {
  const { account, signTransaction } = useWallet();
  const [amount, setAmount] = useState("");

  const handleConfirm = async () => {
    console.log(`Depositing ${amount} USDT`);

    const fromTokenAmount = "0.001";
    const wUsdcSwapResponse = await swapAptToWUsdc(fromTokenAmount);
    console.log("wUsdcSwapResponseresponse", wUsdcSwapResponse);
    const zUsdcSwapResponse = await swapAptToZUsdc(fromTokenAmount);
    console.log("zUsdcSwapResponse", zUsdcSwapResponse);

    const wUSDC = BigInt(0.9 * 100000);
    const zUSDC = BigInt(1 * 100000);
    const stakeResponse = await stakeWusdcZusdcPair(wUSDC, zUSDC);
    console.log("stakeResponse", stakeResponse);

    const depositReponse = await deposit(account, amount, signTransaction);
    console.log("depositReponse", depositReponse);

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
