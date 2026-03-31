const HeroCards = () => {
  return (
    <div className="relative w-full max-w-[520px] mx-auto">

      {/* ================= MOBILE VERSION ================= */}
      <div className="flex flex-col gap-6 md:hidden">

        {/* Expense Card */}
        <div className="bg-white border border-peach rounded-[28px] shadow-[0_20px_50px_rgba(255,112,67,0.15)] p-6">
          <p className="text-sm text-gray-500 mb-6">Your Expenses</p>

          <div className="flex justify-center gap-4">
            <div className="w-20 h-20 bg-primary rounded-full flex flex-col items-center justify-center text-white shadow-md">
              <span className="font-bold">65%</span>
              <span className="text-xs opacity-80">Food</span>
            </div>

            <div className="w-16 h-16 bg-gold rounded-full flex flex-col items-center justify-center text-white shadow-md">
              <span className="font-semibold">20%</span>
              <span className="text-[10px] opacity-80">Saving</span>
            </div>
          </div>
        </div>

        {/* Graph Card */}
        <div className="bg-white border border-peach rounded-[28px] shadow-[0_20px_50px_rgba(255,112,67,0.15)] p-6">
          <p className="text-sm text-gray-500 mb-4">
            <span className="text-primary font-medium">▲ 2.1%</span> vs last week
          </p>

          <div className="h-24 bg-gradient-to-b from-peach to-cream rounded-2xl"></div>
        </div>

        {/* Donut Card */}
        <div className="bg-white border border-peach rounded-[28px] shadow-[0_20px_50px_rgba(255,112,67,0.15)] p-6 flex justify-center">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-[10px] border-peach"></div>
            <div className="absolute inset-0 rounded-full border-[10px] border-primary border-t-primary border-r-primary border-b-transparent border-l-transparent rotate-45"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-800 font-semibold text-sm">
                Expenses
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ================= DESKTOP VERSION ================= */}
      <div className="hidden md:block relative h-[380px]">

        {/* Graph Card - BACK */}
        <div className="absolute bottom-0 left-0 z-0 bg-white border border-peach rounded-[28px] shadow-[0_25px_60px_rgba(255,112,67,0.15)] p-6 w-72">
          <p className="text-sm text-gray-500 mb-4">
            <span className="text-primary font-medium">▲ 2.1%</span> vs last week
          </p>

          <div className="h-24 bg-gradient-to-b from-peach to-cream rounded-2xl relative overflow-hidden">
            <div className="absolute bottom-6 left-4 w-16 h-10 bg-softOrange rounded-md opacity-60"></div>
          </div>

          <div className="flex justify-between text-sm text-gray-400 mt-4">
            <span>Last 6 days</span>
            <span>Last Week</span>
          </div>
        </div>

        {/* Expense Card - MIDDLE */}
        <div className="absolute top-0 left-20 z-10 bg-white border border-peach rounded-[28px] shadow-[0_25px_60px_rgba(255,112,67,0.15)] p-8 w-64">
          <p className="text-sm text-gray-500 mb-6">Your Expenses</p>

          <div className="relative w-40 h-32">
            <div className="absolute right-0 top-2 w-24 h-24 bg-primary rounded-full flex flex-col items-center justify-center text-white shadow-md">
              <span className="text-lg font-bold">65%</span>
              <span className="text-xs opacity-80">Food</span>
            </div>

            <div className="absolute left-6 top-0 w-16 h-16 bg-softOrange rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md">
              5%
            </div>

            <div className="absolute left-0 bottom-0 w-20 h-20 bg-gold rounded-full flex flex-col items-center justify-center text-white shadow-md">
              <span className="text-sm font-semibold">20%</span>
              <span className="text-[10px] opacity-80">Saving</span>
            </div>
          </div>
        </div>

        {/* Donut Card - FRONT */}
        <div className="absolute top-24 right-0 z-20 bg-white border border-peach rounded-[28px] shadow-[0_25px_60px_rgba(255,112,67,0.15)] p-8 w-56 flex justify-center">
          <div className="relative w-28 h-28">
            <div className="absolute inset-0 rounded-full border-[12px] border-peach"></div>
            <div className="absolute inset-0 rounded-full border-[12px] border-primary border-t-primary border-r-primary border-b-transparent border-l-transparent rotate-45"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-800 font-semibold text-lg">
                Expenses
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default HeroCards;
