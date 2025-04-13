// components/MilestoneCard.tsx
"use client";

import { addDays, differenceInDays, format } from "date-fns";
import { FiAward, FiHeart, FiStar } from "react-icons/fi";

interface MilestoneCardProps {
  days: number;
  startDate: string;
  isSpecial?: boolean;
}

export default function MilestoneCard({
  days,
  startDate,
  isSpecial = false,
}: MilestoneCardProps) {
  const calculateMilestone = () => {
    const start = new Date(startDate);
    const milestoneDate = addDays(start, days);
    const daysPassed = differenceInDays(new Date(), start);
    const daysLeft = differenceInDays(milestoneDate, new Date());

    return {
      date: milestoneDate,
      isPast: daysPassed >= days,
      daysLeft: daysLeft > 0 ? daysLeft : 0,
      percentage: Math.min(100, (daysPassed / days) * 100),
    };
  };

  const milestone = calculateMilestone();

  return (
    <div
      className={`border rounded-lg p-4 text-center transition-all relative overflow-hidden ${
        milestone.isPast
          ? "bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200"
          : "bg-white border-blue-200"
      }`}
    >
      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-pink-200"
        style={{ width: `${milestone.percentage}%` }}
      ></div>

      <div
        className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
          milestone.isPast
            ? "bg-pink-100 text-pink-600"
            : "bg-blue-100 text-blue-600"
        }`}
      >
        {isSpecial ? (
          <FiAward className="text-xl" />
        ) : (
          <FiStar className="text-xl" />
        )}
      </div>

      <h4 className="font-semibold">{days} ngày</h4>

      <p className="text-sm text-gray-600 mt-1">
        {format(milestone.date, "dd/MM/yyyy")}
      </p>

      {!milestone.isPast ? (
        <p className="text-xs mt-2 text-blue-600">
          Còn {milestone.daysLeft} ngày
        </p>
      ) : (
        <p className="text-xs mt-2 text-pink-600 flex items-center justify-center">
          <FiHeart className="mr-1" /> Đã đạt
        </p>
      )}
    </div>
  );
}
