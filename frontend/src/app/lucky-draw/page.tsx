"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import DepositDialogButton from "@/components/DepositDialog";
import ClaimRewardsDialog from "@/components/ClaimDeposit";
import WithdrawDialog from "@/components/WithdrawDialog";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AnimatedModalDemo } from "@/components/Popup";
import { Modal } from "@/components/ui/animated-modal";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

interface UserData {
  name: string;
  email: string;
  address: string;
  totalDeposits: number;
  depositTimestamp: string;
  rewardsWon: number;
  rewardsClaimable: number;
  wonToday: boolean;
}

const LuckyDrawPage = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const { account, connected } = useWallet();
  const [isUserWon, setIsUserWon] = useState(false);

  // useEffect(() => {
  //   async function connect() {
  //     const res = await axios.get("/api/connect");
  //     console.log(res);
  //   }

  //   connect();
  // }, []);

  useEffect(() => {
    // if (!account?.address || !triggerAPI) return;

    async function fetchData() {
      const response = await axios.get("/api/user", {
        params: { getAllAddresses: "true" },
      });

      if (response.status === 200) {
        const response = await axios.get("/api/user", {
          params: { getAllData: "true" },
        });
        console.log(response.data);
        //@ts-ignore
        const filteredData = response.data
          .filter(({ wonToday }: { wonToday: boolean }) => wonToday)
          .map(({ _id, id, __v, ...rest }: any) => rest);
        setUserData(filteredData);
      } else {
        throw new Error("Failed to fetch user rewards");
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!account?.address) return;
    console.log(account?.address);
    async function checkIfWinner() {
      const response = await axios.get("/api/user", {
        params: { address: account?.address },
      });

      setIsUserWon(response.data.wonToday);
    }

    checkIfWinner();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-background/40 text-white px-28 pb-28 pt-16">
        <Table>
          <TableCaption>A list of users won today.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="">Address</TableHead>
              {/* <TableHead>Name</TableHead> */}
              {/* <TableHead>Method</TableHead> */}
              <TableHead className="text-right">Rewards Won</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userData.map((data) => (
              <TableRow key={data.address}>
                <TableCell className="font-medium">{data.address}</TableCell>
                {/* <TableCell>{data.name}</TableCell> */}
                {/* <TableCell>{invoice.paymentMethod}</TableCell> */}
                <TableCell className="text-right">{data.rewardsWon}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
        </Table>
        {isUserWon && (
          <Modal>
            <AnimatedModalDemo />
          </Modal>
        )}
      </div>
    </>
  );
};

export default LuckyDrawPage;
