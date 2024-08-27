import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import { Document } from "@/lib/connectDB";
import { cellTokenPrice, pickWinner, swapCellToApt } from "@/lib/apiRequests";
import { AccountAddress, MoveVector, Serializer } from "@aptos-labs/ts-sdk";

const mongoURI = process.env.NEXT_PUBLIC_MONGODB_URI;

if (!mongoURI) {
    throw new Error("MONGODB_URI is not defined in the environment variables.");
}
mongoose.connect(mongoURI).then(() => console.log("Connected! to db"));

export const POST = async (request: NextRequest) => {
    console.log("trigger POST request received");
    try {
        const existingUsers = await Document.find({});
        if (!existingUsers) {
            return NextResponse.json({ error: "Not registered users" }, { status: 409 });
        }

        const eligibleUsers = existingUsers
            .filter(item => item.totalDeposits !== 0)
            .map(item => item.address)

        const totalDeposits = existingUsers
            .reduce((sum, item) => {
                return sum + item.totalDeposits;
            }, 0);

        const cellTokenPriceInUsd = await cellTokenPrice();
        const totalDepositsFivePercentage = totalDeposits * 0.05;
        const totalDepositsFivePercentagePerDay = totalDepositsFivePercentage / 365;
        const totalDepositsFivePercentagePerDayInCell = totalDepositsFivePercentagePerDay / cellTokenPriceInUsd
        const amount = BigInt(Math.round(totalDepositsFivePercentagePerDayInCell * 1e6) * 10 ** 8);

        // TODO: Claim the reward from cellana finance

        const swapCellToAptResponse = await swapCellToApt("0.01");
        console.log("swapCellToAptResponse", swapCellToAptResponse);
        const pickWinnerResponse = await pickWinner(eligibleUsers, amount);
        console.log("pickWinnerResponse", pickWinnerResponse);

        return NextResponse.json({ message: "Winner picked successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error in POST:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
