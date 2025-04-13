// components/SavingsList.tsx
"use client";

import { FiEdit, FiTrash2, FiSearch, FiDollarSign } from "react-icons/fi";
import { format } from "date-fns";
import { Saving, SavingCategory } from "@/app/types/saving";
import { useState } from "react";

interface SavingsListProps {
  savings: (Saving & { category?: SavingCategory })[];
  onDelete: (id: string) => Promise<void>;
  onEdit: (saving: Saving) => void;
  total: number;
  categories: SavingCategory[];
}

export default function SavingsList({
  savings,
  onDelete,
  onEdit,
  total,
  categories,
}: SavingsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredSavings = savings.filter((saving) => {
    const matchesSearch =
      saving.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      saving.amount.toString().includes(searchTerm);

    const category = categories.find((cat) => cat.id === saving.categoryId);
    const matchesCategory = category?.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesSearch || matchesCategory;
  });

  const getCategoryById = (id: string) => {
    return categories.find((category) => category.id === id);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <div className="flex justify-between items-center mb-4 max-sm:flex-col max-sm:gap-3">
        <h2 className="text-xl font-semibold flex items-center">
          <FiDollarSign className="mr-2 text-green-500" />
          Lịch sử tiết kiệm
        </h2>
        <div className="relative max-sm:w-full">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm max-sm:w-full"
          />
        </div>
      </div>

      {filteredSavings.length === 0 ? (
        <div className="text-center py-8">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiSearch className="text-gray-400 text-2xl" />
          </div>
          <p className="text-gray-500">
            {searchTerm
              ? "Không tìm thấy kết quả phù hợp"
              : "Chưa có khoản tiết kiệm nào"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số tiền
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSavings.map((saving) => {
                const category = getCategoryById(saving.categoryId);
                return (
                  <tr
                    key={saving.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-medium text-green-600">
                        {saving.amount.toLocaleString()} VND
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {category && (
                        <div className="flex items-center">
                          {category.imageUrl && (
                            <img
                              src={category.imageUrl}
                              alt={category.name}
                              className="w-6 h-6 object-cover rounded-full mr-2"
                            />
                          )}
                          <span>{category.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-600 max-w-xs truncate">
                        {saving.description || "-"}
                      </p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {format(new Date(saving.date), "dd/MM/yyyy")}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => onEdit(saving)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                          title="Sửa"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(saving.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          title="Xóa"
                          disabled={deletingId === saving.id}
                        >
                          {deletingId === saving.id ? (
                            <span className="animate-spin inline-block w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full"></span>
                          ) : (
                            <FiTrash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
