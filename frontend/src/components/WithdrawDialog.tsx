import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cellToAptAmount, cellTokenPrice, panoraAptosAmount, swapCellToApt, swapWUsdcToApt, swapZUsdcToApt, unstakeWusdcZusdcPair, withdraw, wUsdcToAptAmount, zUsdcToAptAmount } from "@/lib/apiRequests";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import axios from "axios";
import { toast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";

function WithdrawDialog({ totalDeposit }: { totalDeposit: string }) {
  const { account, signTransaction } = useWallet();
  const [amount, setAmount] = useState(100);

  const handleConfirm = async () => {
    try {
      console.log(`Withdrawing ${amount} USDT`);

      const withdrawResponse = await withdraw(account, amount, signTransaction);
      console.log("withdrawResponse", withdrawResponse);

      const lpToken = BigInt(0.5 * 100000);
      const unstakeResponse = await unstakeWusdcZusdcPair(lpToken);
      console.log("unstakeResponse", unstakeResponse);

      const fromTokenAmount = "0.001";
      const wUsdcSwapResponse = await swapWUsdcToApt(fromTokenAmount);
      console.log("wUsdcSwapResponseresponse", wUsdcSwapResponse);
      const zUsdcSwapResponse = await swapZUsdcToApt(fromTokenAmount);
      console.log("zUsdcSwapResponse", zUsdcSwapResponse);

      let totalApt = 0
      totalApt = totalApt + await wUsdcToAptAmount(fromTokenAmount);
      totalApt = totalApt + await zUsdcToAptAmount(fromTokenAmount);

      const userEndPointResponse = await axios.get("/api/user?address=" + account?.address);
      console.log("userEndPointResponse", userEndPointResponse);
      const depositAmount = userEndPointResponse.data.totalDeposits

      const totalDepositsTenPercentage = depositAmount * 0.1;
      const totalDepositsTenPercentagePerDay = totalDepositsTenPercentage / 365;
      const duration = 1
      // const duration = userEndPointResponse.data.depositTimestamp - new Date()
      const rewards = totalDepositsTenPercentagePerDay * duration

      // const totalDepositsTenPercentagePerDayInCell = totalDepositsTenPercentagePerDay / cellTokenPriceInUsd
      // const cellAmount = BigInt(Math.round(totalDepositsTenPercentagePerDayInCell * 1e6) * 10 ** 8);
      // TODO: Claim the reward from cellana finance
      const rewardwUsdcSwapResponse = await swapWUsdcToApt(rewards.toString());
      console.log("rewardwUsdcSwapResponse", rewardwUsdcSwapResponse);
      totalApt = totalApt + await wUsdcToAptAmount(rewards);

      // const cellRewards = "0.01";
      // const swapCellToAptResponse = await swapCellToApt(cellRewards);
      // console.log("swapCellToAptResponse", swapCellToAptResponse);

      // totalApt = totalApt + await cellToAptAmount(cellRewards);
      console.log("totalApt", totalApt);

      const depositEndPointResponse = await axios.post("/api/deposit", {
        address: account?.address,
        totalDeposits: 0,
        depositTimestamp: "0"
      });
      console.log("depositEndPointResponse", depositEndPointResponse);

      toast({
        variant: "default",
        title: "Success!",
        description: "Your Funds withdrawn successfully",
      });
    }
    // Handle the withdrawal logic here
    catch (ex: any) {
      console.log("There is an Error", ex.message);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was an internal server error please try again",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">Withdraw</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Withdraw</DialogTitle>
        <DialogDescription>
          You have a total Deposits of {totalDeposit} USD. Please enter the amount you want to withdraw.
        </DialogDescription>
        <div className="mt-4">
          <Input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} />
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
