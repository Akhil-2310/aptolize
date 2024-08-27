"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import DepositDialogButton from "@/components/DepositDialog";
import ClaimRewardsDialog from "@/components/ClaimDeposit";
import WithdrawDialog from "@/components/WithdrawDialog";

const DashboardPage = () => {
  // Dummy data for the metrics
  const [lotteriesWon, setLotteriesWon] = useState(5);
  const [totalDeposited, setTotalDeposited] = useState("$10,000");
  const [lotteryRewards, setLotteryRewards] = useState(50);

  // useEffect(() => {
  //   async function connect() {
  //     const res = await axios.get("/api/connect");
  //     console.log(res);
  //   }

  //   connect();
  // }, []);
  const handelCliks = async () => {
    try {
      const res = await axios.post("/api/user", {
        // _id: "1",
        name: "John Doe",
        email: "a",
        address: "0x1234",
      });
      console.log("Res Notif", res);
    } catch (error) {
      console.error("An error occurred while requesting payment", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-gray-800 shadow-lg text-white">
            <CardHeader>
              <CardTitle className="text-xl">Lotteries Won</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{lotteriesWon}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 shadow-lg text-white">
            <CardHeader>
              <CardTitle className="text-xl">Total Deposited Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{totalDeposited}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 shadow-lg text-white">
            <CardHeader>
              <CardTitle className="text-xl">Total Lottery Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{lotteryRewards}</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-around">
          <DepositDialogButton />
          <WithdrawDialog totalDeposit="123" />
          <ClaimRewardsDialog totalClaim="123" />

          {/* <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Deposit</Button> */}
          {/* <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">Withdraw</Button> */}
          {/* <Button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md" onClick={handelCliks}>
            Claim Lottery Rewards
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
