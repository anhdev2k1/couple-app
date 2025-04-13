// components/CategorySection.tsx
"use client";

import { FiEdit2, FiTrash2, FiPlus, FiLayers } from "react-icons/fi";
import { SavingCategory } from "@/app/types/saving";

interface CategorySectionProps {
  categories: SavingCategory[];
  onAdd: () => void;
  onEdit: (category: SavingCategory) => void;
  onDelete: (id: string) => void;
}

export default function CategorySection({
  categories,
  onAdd,
  onEdit,
  onDelete,
}: CategorySectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <FiLayers className="mr-2 text-purple-500" />
          Danh mục
        </h2>
        <button
          onClick={onAdd}
          className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
          title="Thêm danh mục"
        >
          <FiPlus />
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Chưa có danh mục nào</p>
          <button
            onClick={onAdd}
            className="mt-2 text-purple-600 hover:text-purple-800 text-sm font-medium"
          >
            Thêm danh mục mới
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              {category.imageUrl && (
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-10 h-10 object-cover rounded-full mr-3"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{category.name}</h4>
                <div className="flex items-center mt-1">
                  <span
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  ></span>
                  <span className="text-xs text-gray-500">{category.icon}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(category)}
                  className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                  title="Chỉnh sửa"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(category.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Xóa"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
