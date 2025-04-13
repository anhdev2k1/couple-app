"use client";

import { FiCalendar, FiDollarSign, FiHeart } from "react-icons/fi";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  const tabs = [
    { id: "love", icon: <FiHeart />, label: "Tình yêu" },
    { id: "plans", icon: <FiCalendar />, label: "Kế hoạch" },
    { id: "savings", icon: <FiDollarSign />, label: "Tiết kiệm" },
  ];

  return (
    <div className="flex border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center justify-center px-4 py-3 text-sm font-medium w-full ${
            activeTab === tab.id
              ? "border-b-2 border-pink-500 text-pink-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <span className="mr-2">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
