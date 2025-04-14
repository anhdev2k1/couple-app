"use client";

import { SavingCategory } from "@/app/types/saving";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

interface CategoryFormProps {
  onSubmit: (
    category: Omit<SavingCategory, "id" | "createdAt">
  ) => Promise<void>;
  isSubmitting?: boolean;
  initialData?: SavingCategory;
  onCancel?: () => void;
}

export default function CategoryForm({
  onSubmit,
  isSubmitting,
  initialData,
  onCancel,
}: CategoryFormProps) {
  const [name, setName] = useState<string>(initialData?.name || "");
  const [color, setColor] = useState<string>(initialData?.color || "#4ade80");
  const [icon, setIcon] = useState<string>(initialData?.icon || "");
  const [imageUrl, setImageUrl] = useState<string>(initialData?.imageUrl || "");
  const [showImageInput, setShowImageInput] = useState<boolean>(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setColor(initialData.color);
      setIcon(initialData.icon);
      setImageUrl(initialData.imageUrl || "");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name,
      color,
      icon,
      imageUrl: imageUrl || undefined,
    });

    if (!initialData) {
      setName("");
      setColor("#4ade80");
      setIcon("");
      setImageUrl("");
      setShowImageInput(false);
    }
  };

  const handleRandomImage = () => {
    const randomImages = [
      "https://img.icons8.com/color/96/savings.png",
      "https://img.icons8.com/color/96/money-bag.png",
      "https://img.icons8.com/color/96/gold-bars.png",
      "https://img.icons8.com/color/96/bitcoin.png",
      "https://img.icons8.com/color/96/stock.png",
    ];
    setImageUrl(randomImages[Math.floor(Math.random() * randomImages.length)]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Tên danh mục</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Màu sắc</label>
        <div className="flex items-center">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
          />
          <span className="ml-2 text-sm">{color}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Icon</label>
        <input
          type="text"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Tên icon (ví dụ: bank)"
        />
      </div>

      <div>
        {/* <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium">Ảnh đại diện</label>
          <button
            type="button"
            onClick={() => setShowImageInput(!showImageInput)}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            {showImageInput ? "Ẩn" : "Thêm ảnh"}
          </button>
        </div> */}

        {imageUrl && (
          <div className="mb-2 flex items-center">
            <Image
              src={imageUrl}
              alt={name}
              className="w-12 h-12 object-cover rounded-lg mr-2"
              width={20}
              height={20}
            />
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="text-red-500 hover:text-red-700"
            >
              <FiTrash2 />
            </button>
          </div>
        )}

        {showImageInput && (
          <div className="space-y-2">
            <div className="flex">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="URL ảnh"
              />
              <button
                type="button"
                onClick={handleRandomImage}
                className="px-3 bg-gray-100 rounded-r-lg border border-l-0 border-gray-300 hover:bg-gray-200"
                title="Chọn ảnh ngẫu nhiên"
              >
                <FiPlus />
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Để trống nếu muốn sử dụng ảnh ngẫu nhiên
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Đang lưu..."
            : initialData
            ? "Cập nhật"
            : "Thêm danh mục"}
        </button>
      </div>
    </form>
  );
}
