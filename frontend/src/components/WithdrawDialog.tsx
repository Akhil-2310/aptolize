import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  aptosPriceInUsd,
  cellTokenPrice,
  swapCellToApt,
  swapWUsdcToApt,
  swapZUsdcToApt,
  unstakeWusdcZusdcPair,
  withdraw,
  wUsdcToAptAmount,
  zUsdcToAptAmount,
} from "@/lib/apiRequests";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import axios from "axios";
import { toast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";

function WithdrawDialog({ totalDeposit }: { totalDeposit: string }) {
  const { account, signTransaction } = useWallet();
  const [amount, setAmount] = useState(0);
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      console.log(`Withdrawing ${amount} USDT`);

      const withdrawResponse = await withdraw(account, BigInt(amount * 100000), signTransaction);
      console.log("withdrawResponse", withdrawResponse);

      // const fromTokenAmount = (aptosAmount / 2).toFixed(4).toString();
      // const lpToken = BigInt(0.5 * 100000);
      const lpToken = BigInt(amount * 100000);
      const unstakeResponse = await unstakeWusdcZusdcPair(lpToken);
      console.log("unstakeResponse", unstakeResponse);

      // const fromTokenAmount = "0.01";
      const fromTokenAmount = ((amount / 2) * 0.9).toString();
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
      const rewards = totalDepositsTenPercentagePerDay * duration

      if (rewards > 0) {
        const rewardwUsdcSwapResponse = await swapWUsdcToApt(rewards.toString());
        console.log("rewardwUsdcSwapResponse", rewardwUsdcSwapResponse);
        totalApt = totalApt + await wUsdcToAptAmount(rewards);
        console.log("totalApt", totalApt);
      }

      const depositEndPointResponse = await axios.post("/api/deposit", {
        address: account?.address,
        totalDeposits: depositAmount - amount,
        depositTimestamp: new Date()
      });
      console.log("depositEndPointResponse", depositEndPointResponse);
      toast({
        variant: "default",
        title: "Success!",
        description: "Your Funds withdrawn successfully",
      });
    } catch (ex: any) {
      // Handle the withdrawal logic here
      console.log("There is an Error", ex.message);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was an internal server error please try again",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">Withdraw</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Withdraw</DialogTitle>
        <DialogDescription>
          You have a total Deposits of {totalDeposit} USD. Please enter the amount you want to withdraw.
        </DialogDescription>
        <div className="mt-4">
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
          />
        </div>
        <DialogFooter>
          <div className="mt-4 flex justify-end">
            {isLoading ? (
              <Button type="button" className="" disabled>
                <div role="status" className="mr-2">
                  <svg
                    aria-hidden="true"
                    className="inline w-4 h-4 text-gray-200 animate-spin dark:text-blue-400 fill-blue-50"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>{" "}
                Processing...
              </Button>
            ) : (
              <Button variant="default" onClick={handleConfirm}>
                Confirm
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default WithdrawDialog;
