// components/PlanForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Plan } from "@/app/types/plan";
import {
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiEdit2,
  FiPlus,
} from "react-icons/fi";

interface PlanFormProps {
  onSubmit: (plan: Omit<Plan, "id" | "createdAt">) => Promise<void>;
  isSubmitting?: boolean;
  initialData?: Plan;
}

export default function PlanForm({
  onSubmit,
  isSubmitting,
  initialData,
}: PlanFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [date, setDate] = useState(initialData?.date || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [budget, setBudget] = useState(initialData?.budget || 0);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setDate(initialData.date);
      setLocation(initialData.location);
      setBudget(initialData.budget);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      description,
      date,
      location,
      budget,
      completed: initialData?.completed || false,
    });

    if (!initialData) {
      setTitle("");
      setDescription("");
      setDate("");
      setLocation("");
      setBudget(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tiêu đề
        </label>
        <div className="relative">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tên kế hoạch"
            required
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {initialData ? <FiEdit2 /> : <FiPlus />}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mô tả
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Mô tả chi tiết kế hoạch..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FiCalendar className="mr-2 text-blue-500" /> Ngày
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FiMapPin className="mr-2 text-blue-500" /> Địa điểm
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nhập địa điểm..."
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
          <FiDollarSign className="mr-2 text-blue-500" /> Ngân sách (VND)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            ₫
          </span>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            placeholder="Nhập ngân sách..."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {initialData ? "Đang cập nhật..." : "Đang thêm..."}
          </span>
        ) : initialData ? (
          "Cập nhật kế hoạch"
        ) : (
          "Thêm kế hoạch"
        )}
      </button>
    </form>
  );
}
