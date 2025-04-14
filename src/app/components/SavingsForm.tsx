/* eslint-disable @typescript-eslint/no-explicit-any */
// components/SavingsForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Saving } from "@/app/types/saving";
import { FiDollarSign, FiFileText, FiTag, FiCalendar } from "react-icons/fi";

interface SavingsFormProps {
  onSubmit: (saving: Omit<Saving, "createdAt">) => Promise<void>;
  isSubmitting?: boolean;
  initialData?: Saving;
  categories: { _id?: any; name: string; imageUrl?: string }[];
}

export default function SavingsForm({
  onSubmit,
  isSubmitting,
  initialData,
  categories,
}: SavingsFormProps) {
  const [amount, setAmount] = useState(initialData?.amount || 0);
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().split("T")[0]
  );
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount);
      setDescription(initialData.description);
      setDate(String(initialData.date).split("T")[0]);
      setCategoryId(initialData.categoryId);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra dữ liệu hợp lệ
    if (amount <= 0 || !categoryId || !date) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    await onSubmit({
      amount,
      description,
      date,
      categoryId,
    });

    // Reset form chỉ khi thêm mới (không phải edit)
    if (!initialData) {
      setAmount(0);
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
      setCategoryId("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FiDollarSign className="mr-2 text-green-500" /> Số tiền (VND)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              ₫
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="1"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FiTag className="mr-2 text-purple-500" /> Danh mục
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
          <FiFileText className="mr-2 text-blue-500" /> Mô tả
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Nhập mô tả khoản tiết kiệm..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
          <FiCalendar className="mr-2 text-orange-500" /> Ngày
        </label>
        <input
          type="date"
          value={date as string}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          required
        />
      </div>

      <button
        type="submit"
        className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Đang xử lý..."
          : initialData
          ? "Cập nhật tiết kiệm"
          : "Thêm tiết kiệm"}
      </button>
    </form>
  );
}
