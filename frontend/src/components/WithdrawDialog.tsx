import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cellTokenPrice, swapCellToApt, swapWUsdcToApt, swapZUsdcToApt, unstakeWusdcZusdcPair, withdraw } from "@/lib/apiRequests";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import axios from "axios";

function WithdrawDialog({ totalDeposit }: { totalDeposit: string }) {
  const { account, signTransaction } = useWallet();
  const [amount, setAmount] = useState(0);

  const handleConfirm = async () => {
    // Handle the withdrawal logic here
    console.log(`Withdrawing ${amount} USDT`);

    const lpToken = BigInt(0.5 * 100000);
    const unstakeResponse = await unstakeWusdcZusdcPair(lpToken);
    console.log("unstakeResponse", unstakeResponse);

    const fromTokenAmount = "0.01";
    const wUsdcSwapResponse = await swapWUsdcToApt(fromTokenAmount);
    console.log("wUsdcSwapResponseresponse", wUsdcSwapResponse);
    const zUsdcSwapResponse = await swapZUsdcToApt(fromTokenAmount);
    console.log("zUsdcSwapResponse", zUsdcSwapResponse);

    const userEndPointResponse = await axios.get("/api/user?address=" + account?.address);
    const depositAmount = userEndPointResponse.data.totalDeposits
    console.log("depositAmount", depositAmount);

    const cellTokenPriceInUsd = await cellTokenPrice();
    const totalDepositsTenPercentage = depositAmount * 0.1;
    const totalDepositsTenPercentagePerDay = totalDepositsTenPercentage / 365;
    const totalDepositsTenPercentagePerDayInCell = totalDepositsTenPercentagePerDay / cellTokenPriceInUsd
    const cellAmount = BigInt(Math.round(totalDepositsTenPercentagePerDayInCell * 1e6) * 10 ** 8);

    // TODO: Claim the reward from cellana finance

    const swapCellToAptResponse = await swapCellToApt("0.01");
    console.log("swapCellToAptResponse", swapCellToAptResponse);

    const withdrawResponse = await withdraw(account, amount, signTransaction);
    console.log("withdrawResponse", withdrawResponse);

    const depositEndPointResponse = await axios.post("/api/deposit", {
      address: account?.address,
      totalDeposits: depositAmount - amount,
      depositTimestamp: new Date()
    });
    console.log("depositEndPointResponse", depositEndPointResponse)
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">Withdraw</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Withdraw</DialogTitle>
        <DialogDescription>
          You have a total Deposits of {totalDeposit} USDT. Please enter the amount you want to withdraw.
        </DialogDescription>
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
}

export default WithdrawDialog;
