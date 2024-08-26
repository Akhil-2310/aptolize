import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DepositDialogButton = () => {
  const [amount, setAmount] = useState("");

  const handleConfirm = () => {
    // Add the logic for handling the deposit here
    console.log(`Depositing ${amount} USDT`);
    // Close the dialog after confirming
    setAmount("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Deposit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Deposit USDT</DialogTitle>
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
