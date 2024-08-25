"use client"
import { useState } from "react";
import clsx from "clsx";

import PlusIcon from "../assets/icons/plus.svg";
import MinusIcon from "../assets/icons/minus.svg"
import { AnimatePresence, motion } from "framer-motion";

const items = [
  {
    question: "What is the minimum amount required to start staking?",
    answer:
      "There is no minimum amount required. You can start staking with any amount of USDT that you’re comfortable with.",
  },
  {
    question: "How does the lottery system work?",
    answer:
      "Every day, 5% of the staking rewards are pooled to fund the lottery. The longer you keep your funds staked, the higher your chances of winning. Winners are selected randomly, and rewards are automatically added to your staked amount",
  },
  {
    question: "Can I withdraw my funds at any time?",
    answer:
      "Yes, you can withdraw your funds along with any accrued rewards at any time. The process involves unstaking the liquidity pair, converting USDC back to USDT, and transferring the full amount to your wallet.",
  },
  {
    question: "How are rewards calculated and distributed?",
    answer:
      " Rewards are calculated based on the staked liquidity pair and are distributed daily. 10% of the rewards are reinvested into your staked amount, 5% funds the lottery, and 1% is retained as a platform fee.",
  },
  {
    question: "What happens if I withdraw my funds before the end of the staking period?",
    answer: "You are free to withdraw your funds at any time without any penalties. However, withdrawing early means you may miss out on the benefits of compounding rewards and lottery participation."
  }
];

const AccordionItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="py-7 border-b border-white/30 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
      <div className="flex items-center">
        <span className="flex-1 sm:text-xl font-bold select-none">
          {question}
        </span>
        {
          isOpen ? <MinusIcon /> : <PlusIcon />
        }
      </div>
      <AnimatePresence>
        {isOpen &&
          <motion.div
            className={clsx("mt-4", { hidden: !isOpen, "": isOpen })}
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
          >
            {answer}
          </motion.div>
        }
      </AnimatePresence>
    </div>
  )
}

export const FAQs = () => {
  return (
    <div className="bg-black text-white bg-gradient-to-b from-[#5D2CA8] to-black py-[72px] sm:py-24">
      <div className="container">
        <h2 className="text-center text-5xl sm:text-6xl font-bold tracking-tighter">Frequently asked questions</h2>
        <div className="mt-12 max-w-5xl mx-auto">
          {
            items.map((item, index) => (
              <AccordionItem key={index} question={item.question} answer={item.answer} />
            ))
          }
        </div>
      </div>
    </div>
  );
};
