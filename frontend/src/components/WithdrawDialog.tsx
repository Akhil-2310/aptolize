import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

function WithdrawDialog({ totalDeposit }: { totalDeposit: string }) {
  const [amount, setAmount] = useState("");

  const handleConfirm = () => {
    // Handle the withdrawal logic here
    console.log(`Withdrawing ${amount} USDT`);
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
