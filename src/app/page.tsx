/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CountdownTimer from "@/app/components/CountdownTimer";
import PlanForm from "@/app/components/PlanForm";
import PlanList from "@/app/components/PlanList";
import SavingsChart from "@/app/components/SavingsChart";
import SavingsForm from "@/app/components/SavingsForm";
import SavingsList from "@/app/components/SavingsList";
import TabNavigation from "@/app/components/TabNavigation";
import { useEffect, useState } from "react";
import {
  FiAward,
  FiCalendar,
  FiDollarSign,
  FiEdit2,
  FiHeart,
  FiLayers,
  FiPlusCircle,
} from "react-icons/fi";
import CategoryForm from "./components/CategoryForm";
import CategorySection from "./components/CategorySection";
import HeartBeat from "./components/HeartBeat";
import MilestoneCard from "./components/MilestoneCard";
import Modal from "./components/Modal";
import { Saving, SavingCategory } from "./types/saving";
import { Plan } from "./types/plan";
import { addDays, differenceInDays } from "date-fns";

export default function Home() {
  const [activeTab, setActiveTab] = useState("love");
  const [coupleData, setCoupleData] = useState({
    startDate: new Date().toISOString(),
  });
  const [currentMonthSavings, setCurrentMonthSavings] = useState(0);
  const [plans, setPlans] = useState([]);
  const [savings, setSavings] = useState([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState([]);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingSaving, setEditingSaving] = useState<Saving | null>(null);
  const [savingCategories, setSavingCategories] = useState<SavingCategory[]>(
    []
  );
  const [savingsByCategory, setSavingsByCategory] = useState([]);
  const [editingCategory, setEditingCategory] = useState<SavingCategory | null>(
    null
  );

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Hàm mở modal
  const openCategoryModal = (category?: SavingCategory) => {
    setEditingCategory(category || null);
    setIsCategoryModalOpen(true);
  };

  // Hàm đóng modal
  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          coupleRes,
          plansRes,
          savingsRes,
          totalRes,
          monthlyRes,
          categoriesRes,
          byCategoryRes,
          currentMonthRes,
        ] = await Promise.all([
          fetch("/api/couple"),
          fetch("/api/plans?upcoming=true"),
          fetch("/api/savings"),
          fetch("/api/savings?total=true"),
          fetch("/api/savings?byMonth=true"),
          fetch("/api/savings/categories"),
          fetch("/api/savings?byCategory=true"),
          fetch("/api/savings?currentMonth=true"),
        ]);

        setCoupleData(await coupleRes.json());
        setPlans(await plansRes.json());
        setSavings(await savingsRes.json());
        setTotalSavings((await totalRes.json()).total);
        setMonthlySavings(await monthlyRes.json());
        setSavingCategories(await categoriesRes.json());
        setSavingsByCategory(await byCategoryRes.json());
        setCurrentMonthSavings((await currentMonthRes.json()).amount);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
      }
    };

    fetchData();
  }, []);

  // Couple functions
  const updateStartDate = async (newDate: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/couple", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startDate: newDate }),
      });
      setCoupleData(await response.json());
    } catch (error) {
      console.error("Error updating start date:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePlan = async (planData: Omit<Plan, "id" | "createdAt">) => {
    if (!editingPlan) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/plans?id=${editingPlan.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(planData),
      });

      if (!response.ok) throw new Error("Failed to update plan");

      // Cập nhật lại danh sách
      const updatedPlans = await fetch("/api/plans?upcoming=true").then((res) =>
        res.json()
      );
      setPlans(updatedPlans);
      setEditingPlan(null);
    } catch (error) {
      console.error("Error updating plan:", error);
      alert("Có lỗi khi cập nhật kế hoạch");
    } finally {
      setIsSubmitting(false);
    }
  };
  // Plan functions
  const handleAddPlan = async (planData: Omit<Plan, "id" | "createdAt">) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(planData),
      });

      if (!response.ok) throw new Error("Failed to add plan");

      // Cập nhật lại danh sách
      const updatedPlans = await fetch("/api/plans?upcoming=true").then((res) =>
        res.json()
      );
      setPlans(updatedPlans);
    } catch (error) {
      console.error("Error adding plan:", error);
      alert("Có lỗi khi thêm kế hoạch mới");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    try {
      await fetch(`/api/plans?id=${id}`, {
        method: "DELETE",
      });

      // Cập nhật lại danh sách
      const updatedPlans = await fetch("/api/plans?upcoming=true").then((res) =>
        res.json()
      );
      setPlans(updatedPlans);
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      await fetch(`/api/plans?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });

      // Cập nhật lại danh sách
      const updatedPlans = await fetch("/api/plans?upcoming=true").then((res) =>
        res.json()
      );
      setPlans(updatedPlans);
    } catch (error) {
      console.error("Error toggling plan completion:", error);
    }
  };

  const handleAddSaving = async (saving: Omit<Saving, "id" | "createdAt">) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/savings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saving),
      });

      if (!response.ok) throw new Error("Failed to add saving");

      // Cập nhật tất cả dữ liệu liên quan
      const [savingsRes, totalRes, monthlyRes, byCategoryRes, currentMonthRes] =
        await Promise.all([
          fetch("/api/savings"),
          fetch("/api/savings?total=true"),
          fetch("/api/savings?byMonth=true"),
          fetch("/api/savings?byCategory=true"),
          fetch("/api/savings?currentMonth=true"),
        ]);

      setSavings(await savingsRes.json());
      setTotalSavings((await totalRes.json()).total);
      setMonthlySavings(await monthlyRes.json());
      setSavingsByCategory(await byCategoryRes.json());
      setCurrentMonthSavings((await currentMonthRes.json()).amount);

      // Reset form
      setEditingSaving(null);
    } catch (error) {
      console.error("Error adding saving:", error);
      alert("Có lỗi khi thêm khoản tiết kiệm");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSaving = async (
    saving: Omit<Saving, "id" | "createdAt">
  ) => {
    if (!editingSaving) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/savings?id=${editingSaving.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saving),
      });

      if (!response.ok) throw new Error("Failed to update saving");

      // Cập nhật dữ liệu (tương tự handleAddSaving)
      const [savingsRes, totalRes, monthlyRes, byCategoryRes, currentMonthRes] =
        await Promise.all([
          fetch("/api/savings"),
          fetch("/api/savings?total=true"),
          fetch("/api/savings?byMonth=true"),
          fetch("/api/savings?byCategory=true"),
          fetch("/api/savings?currentMonth=true"),
        ]);

      setSavings(await savingsRes.json());
      setTotalSavings((await totalRes.json()).total);
      setMonthlySavings(await monthlyRes.json());
      setSavingsByCategory(await byCategoryRes.json());
      setCurrentMonthSavings((await currentMonthRes.json()).amount);

      // Reset form
      setEditingSaving(null);
    } catch (error) {
      console.error("Error updating saving:", error);
      alert("Có lỗi khi cập nhật khoản tiết kiệm");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSaving = async (id: string) => {
    try {
      await fetch(`/api/savings?id=${id}`, {
        method: "DELETE",
      });

      const [savingsRes, totalRes, monthlyRes] = await Promise.all([
        fetch("/api/savings"),
        fetch("/api/savings?total=true"),
        fetch("/api/savings?byMonth=true"),
      ]);

      setSavings(await savingsRes.json());
      setTotalSavings((await totalRes.json()).total);
      setMonthlySavings(await monthlyRes.json());
    } catch (error) {
      console.error("Error deleting saving:", error);
    }
  };

  const handleCategorySubmit = async (
    category: Omit<SavingCategory, "id" | "createdAt">
  ) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await fetch(`/api/savings/categories?id=${editingCategory.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(category),
        });
      } else {
        await fetch("/api/savings/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(category),
        });
      }

      const [categoriesRes, byCategoryRes] = await Promise.all([
        fetch("/api/savings/categories"),
        fetch("/api/savings?byCategory=true"),
      ]);

      setSavingCategories(await categoriesRes.json());
      setSavingsByCategory(await byCategoryRes.json());
      closeCategoryModal(); // Đóng modal sau khi submit thành công
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleEditCategory = (category: SavingCategory) => {
    setEditingCategory(category);
  };

  const handleDeleteCategory = async (id: string) => {
    if (
      confirm(
        "Bạn có chắc muốn xóa danh mục này? Các khoản tiết kiệm thuộc danh mục sẽ bị xóa."
      )
    ) {
      try {
        await fetch(`/api/savings/categories?id=${id}`, {
          method: "DELETE",
        });

        const [categoriesRes, savingsRes, totalRes, monthlyRes, byCategoryRes] =
          await Promise.all([
            fetch("/api/savings/categories"),
            fetch("/api/savings"),
            fetch("/api/savings?total=true"),
            fetch("/api/savings?byMonth=true"),
            fetch("/api/savings?byCategory=true"),
          ]);

        setSavingCategories(await categoriesRes.json());
        setSavings(await savingsRes.json());
        setTotalSavings((await totalRes.json()).total);
        setMonthlySavings(await monthlyRes.json());
        setSavingsByCategory(await byCategoryRes.json());
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-pink-600">
        Hi, Couple!
      </h1>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={closeCategoryModal}
        title={editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
      >
        <CategoryForm
          onSubmit={handleCategorySubmit}
          isSubmitting={isSubmitting}
          initialData={editingCategory!}
          onCancel={closeCategoryModal}
        />
      </Modal>
      <div className="mt-6">
        {activeTab === "love" && (
          <div className="space-y-6">
            <div className="relative rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 opacity-90"></div>
              <div className="relative z-10 p-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Hành trình yêu của chúng mình
                </h2>
                <p className="text-white/90">
                  Từng giây phút bên nhau là những kỷ niệm đáng trân trọng
                </p>
              </div>
            </div>

            {/* Countdown timer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-center mb-6">
                  <div className="flex flex-col items-center mb-2">
                    <HeartBeat />
                    <h3 className="text-xl font-semibold text-pink-600 mt-2">
                      Chúng mình đã yêu nhau được
                    </h3>
                  </div>
                  <CountdownTimer startDate={coupleData.startDate} />
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mb-4">
                    <FiHeart className="text-4xl text-rose-500" />
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    Ngày bắt đầu:{" "}
                    {new Date(coupleData.startDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              {/* Date picker */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-pink-600 mb-4">
                  Cập nhật ngày yêu
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày bắt đầu
                    </label>
                    <div className="flex items-center">
                      <input
                        type="date"
                        value={coupleData.startDate.split("T")[0]}
                        onChange={(e) => updateStartDate(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        max={new Date().toISOString().split("T")[0]}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => updateStartDate(coupleData.startDate)}
                      disabled={isSubmitting}
                      className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors ${
                        isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
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
                          Đang cập nhật...
                        </span>
                      ) : (
                        "Cập nhật ngày yêu"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Memory milestones */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-pink-600 mb-4 flex items-center">
                <FiAward className="mr-2" />
                Cột mốc tình yêu
              </h3>

              {/* Kiểm tra nếu đã đạt hết các mốc cơ bản */}
              {(() => {
                const basicMilestones = [100, 365, 500, 1000];
                const allBasicAchieved = basicMilestones.every((days) => {
                  const start = new Date(coupleData.startDate);
                  return (
                    differenceInDays(new Date(), addDays(start, days)) >= 0
                  );
                });

                // Các mốc cơ bản
                const milestonesToShow = [...basicMilestones];

                // Nếu đã đạt hết thì thêm các mốc đặc biệt
                if (allBasicAchieved) {
                  milestonesToShow.push(2000, 3000, 5000, 10000);
                }

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {milestonesToShow.map((days, index) => (
                      <MilestoneCard
                        key={days}
                        days={days}
                        startDate={coupleData.startDate}
                        isSpecial={index >= basicMilestones.length} // Đánh dấu mốc đặc biệt
                      />
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {activeTab === "plans" && (
          <div className="space-y-6">
            {/* Header với background đẹp */}
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">Kế hoạch hẹn hò</h2>
                <p className="opacity-90">
                  Lưu giữ những kỷ niệm đáng nhớ của hai chúng ta
                </p>
              </div>
              <div className="absolute right-4 top-4 opacity-20">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
            </div>

            {/* Form và danh sách */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form thêm/chỉnh sửa kế hoạch */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-md p-5 sticky top-4">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    {editingPlan ? (
                      <>
                        <FiEdit2 className="mr-2 text-blue-500" />
                        Chỉnh sửa kế hoạch
                      </>
                    ) : (
                      <>
                        <FiPlusCircle className="mr-2 text-green-500" />
                        Kế hoạch mới
                      </>
                    )}
                  </h3>
                  <PlanForm
                    onSubmit={editingPlan ? handleUpdatePlan : handleAddPlan}
                    isSubmitting={isSubmitting}
                    initialData={editingPlan}
                  />
                </div>
              </div>

              {/* Danh sách kế hoạch */}
              <div className="lg:col-span-2">
                <PlanList
                  plans={plans}
                  onEdit={setEditingPlan}
                  onDelete={handleDeletePlan}
                  onToggleComplete={handleToggleComplete}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "savings" && (
          <div className="space-y-6">
            {/* Thống kê nhanh */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">Tổng tiết kiệm</p>
                    <p className="text-2xl font-bold mt-1">
                      {totalSavings.toLocaleString()} VND
                    </p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-lg">
                    <FiDollarSign className="text-xl" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4 text-white shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">Tháng này</p>
                    <p className="text-2xl font-bold mt-1">
                      {currentMonthSavings.toLocaleString()} VND
                    </p>
                    <p className="text-xs opacity-80 mt-1">
                      {new Date().toLocaleString("vi-VN", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-lg">
                    <FiCalendar className="text-xl" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">Danh mục</p>
                    <p className="text-2xl font-bold mt-1">
                      {savingCategories.length}
                    </p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-lg">
                    <FiLayers className="text-xl" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-5">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiPlusCircle className="mr-2 text-green-500" />
                {editingSaving ? "Cập nhật tiết kiệm" : "Thêm tiết kiệm mới"}
              </h2>
              <SavingsForm
                onSubmit={editingSaving ? handleUpdateSaving : handleAddSaving}
                isSubmitting={isSubmitting}
                initialData={editingSaving!}
                categories={savingCategories}
              />
            </div>

            {/* Biểu đồ và Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SavingsChart
                  monthlyData={monthlySavings}
                  categoryData={savingsByCategory}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SavingsList
                  savings={savings}
                  onDelete={handleDeleteSaving}
                  onEdit={setEditingSaving}
                  total={totalSavings}
                  categories={savingCategories}
                />
              </div>

              <div>
                <CategorySection
                  categories={savingCategories}
                  onAdd={() => openCategoryModal()}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                />
              </div>
            </div>

            {/* Modal danh mục */}
            <Modal
              isOpen={isCategoryModalOpen}
              onClose={closeCategoryModal}
              title={
                editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"
              }
            >
              <CategoryForm
                onSubmit={handleCategorySubmit}
                isSubmitting={isSubmitting}
                initialData={editingCategory!}
                onCancel={closeCategoryModal}
              />
            </Modal>
          </div>
        )}
      </div>
    </div>
  );
}
