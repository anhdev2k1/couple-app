// components/PlanList.tsx
"use client";

import { Plan } from "@/app/types/plan";
import { format, isAfter, isBefore } from "date-fns";
import { useState } from "react";
import {
  FiCheck,
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiDollarSign,
  FiCalendar,
} from "react-icons/fi";

interface PlanListProps {
  plans: Plan[];
  onEdit: (plan: Plan) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleComplete: (id: string, completed: boolean) => Promise<void>;
}

export default function PlanList({
  plans,
  onEdit,
  onDelete,
  onToggleComplete,
}: PlanListProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "all">(
    "upcoming"
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredPlans = plans.filter((plan) => {
    const planDate = new Date(plan.date);
    const now = new Date();

    if (activeTab === "upcoming")
      return !plan.completed && isAfter(planDate, now);
    if (activeTab === "past") return plan.completed || isBefore(planDate, now);
    return true;
  });

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (plans.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <FiCalendar className="text-blue-500 text-2xl" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Chưa có kế hoạch nào
        </h3>
        <p className="text-gray-500">Bắt đầu bằng cách thêm kế hoạch mới</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Tab navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex-1 ${
              activeTab === "upcoming"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Sắp tới
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex-1 ${
              activeTab === "past"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Đã qua
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex-1 ${
              activeTab === "all"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Tất cả
          </button>
        </nav>
      </div>

      {/* Plan list */}
      <div className="divide-y divide-gray-200">
        {filteredPlans.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Không có kế hoạch nào trong mục này
          </div>
        ) : (
          filteredPlans.map((plan) => {
            const planDate = new Date(plan.date);
            const isPast = isBefore(planDate, new Date());

            return (
              <div
                key={plan.id}
                className={`p-5 hover:bg-gray-50 transition-colors ${
                  plan.completed ? "bg-green-50" : isPast ? "bg-yellow-50" : ""
                }`}
              >
                <div className="flex items-start">
                  {/* Checkbox */}
                  <button
                    onClick={() => onToggleComplete(plan.id, !plan.completed)}
                    className={`mt-1 mr-3 flex-shrink-0 w-6 h-6 rounded flex items-center justify-center ${
                      plan.completed
                        ? "bg-green-500 text-white"
                        : "border border-gray-300 hover:border-blue-500"
                    }`}
                  >
                    {plan.completed && <FiCheck />}
                  </button>

                  {/* Plan content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3
                        className={`text-lg font-medium ${
                          plan.completed
                            ? "line-through text-gray-500"
                            : "text-gray-900"
                        }`}
                      >
                        {plan.title}
                      </h3>
                      <div className="flex space-x-2 ml-3">
                        <button
                          onClick={() => onEdit(plan)}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          title="Sửa"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Xóa"
                          disabled={deletingId === plan.id}
                        >
                          {deletingId === plan.id ? (
                            <span className="animate-spin inline-block w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full"></span>
                          ) : (
                            <FiTrash2 />
                          )}
                        </button>
                      </div>
                    </div>

                    {plan.description && (
                      <p className="text-gray-600 mt-1">{plan.description}</p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center">
                        <FiCalendar className="mr-1.5" />
                        {format(planDate, "dd/MM/yyyy")}
                      </span>

                      {plan.location && (
                        <span className="flex items-center">
                          <FiMapPin className="mr-1.5" />
                          {plan.location}
                        </span>
                      )}

                      {plan.budget > 0 && (
                        <span className="flex items-center">
                          <FiDollarSign className="mr-1.5" />
                          {plan.budget.toLocaleString()} VND
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
