import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PieChart as PieIcon,
  Eye,
  BarChart3,
  TrendingUp
} from "lucide-react";

import {
  LayoutDashboard,
  ArrowLeftRight,
  Calculator,
  CalendarDays,
  User,
  LogOut
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area
} from "recharts";

import API from "../../api";

const Reports = () => {

  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [activeTab, setActiveTab] = useState("Income Summary");

  const [filter, setFilter] = useState({
    year: "2025"
  });

  const [reportData, setReportData] = useState({
    income: 0,
    expense: 0,
    netSavings: 0,
    estTax: 0
  });

  const [chartData, setChartData] = useState([]);

  const handleDownload = () => {

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Metric,Value\n" +
      `Total Income,${reportData.income}\n` +
      `Total Expense,${reportData.expense}\n` +
      `Net Savings,${reportData.netSavings}\n` +
      `Estimated Tax,${reportData.estTax}`;

    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");

    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TaxPal_Report_${filter.year}.csv`);

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  const fetchReports = async () => {

    try {

      const fy = `${filter.year}-${parseInt(filter.year.slice(-2)) + 1}`;

      const incExpRes = await API.get(`/reports/income-expense?year=${filter.year}`);

      const taxRes = await API.get(`/reports/tax?financialYear=${fy}`);

      const income = incExpRes.data.income || 0;
      const expense = incExpRes.data.expense || 0;
      const tax = taxRes.data.totalTax || 0;

      setReportData({
        income,
        expense,
        netSavings: income - expense,
        estTax: tax
      });

      const quarters = [
        { name: "Q1", income: income * 0.25, expense: expense * 0.2 },
        { name: "Q2", income: income * 0.35, expense: expense * 0.25 },
        { name: "Q3", income: income * 0.2, expense: expense * 0.3 },
        { name: "Q4", income: income * 0.2, expense: expense * 0.25 }
      ];

      setChartData(quarters);

    } catch (error) {

      console.error("Report error:", error);

    }
  };

  useEffect(() => {

    fetchReports();

  }, [filter.year]);

  const getChartConfig = () => {

    switch (activeTab) {

      case "Income Summary":
        return { key: "income", color: "#f97316" };

      case "Expense Summary":
        return { key: "expense", color: "#ef4444" };

      case "Tax Report":
        return { key: "tax", color: "#eab308" };

      default:
        return { key: "income", color: "#f97316" };
    }
  };

  const config = getChartConfig();

  return (

    <div className="flex min-h-screen bg-[#FDFCFB] font-sans text-gray-900">

      {/* SIDEBAR */}

      <aside className="w-64 bg-[#1a1a1a] flex flex-col fixed h-full shadow-2xl">

        <div className="p-8">
          <h1 className="text-3xl font-black italic text-white">
            Tax<span className="text-[#ff4d00]">Pal</span>
          </h1>
        </div>

        <nav className="flex-1 px-3 mt-2 space-y-1">

          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" onClick={()=>navigate("/dashboard")}/>
          <NavItem icon={<ArrowLeftRight size={20}/>} label="Transactions" onClick={()=>navigate("/transactions")}/>
          <NavItem icon={<Wallet size={20}/>} label="Budgets" onClick={()=>navigate("/budgets")}/>
          <NavItem icon={<Calculator size={20}/>} label="Tax Estimator" onClick={()=>navigate("/tax-estimator")}/>
          <NavItem icon={<CalendarDays size={20}/>} label="Tax Calendar" onClick={()=>navigate("/tax-calendar")}/>
          <NavItem icon={<BarChart3 size={20}/>} label="Reports" active/>
          <NavItem icon={<User size={20}/>} label="Profile" onClick={()=>navigate("/profile")}/>

        </nav>

        <div className="p-3 border-t border-white/10">

          <div className="flex items-center gap-2 mb-3 text-white">

            <div className="w-8 h-8 bg-[#ff4d00] rounded-full flex items-center justify-center text-sm font-semibold">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[11px] text-gray-400 truncate">
                {user?.email}
              </p>
            </div>

          </div>

          <button
            onClick={()=>{
              localStorage.clear();
              navigate("/login");
            }}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#ff4d00]"
          >
            <LogOut size={14}/> Logout
          </button>

        </div>

      </aside>

      {/* REPORT PAGE */}

      <div className="p-8 bg-[#FDFCFB] min-h-screen ml-64 w-full">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-3xl font-black text-gray-900">
              Reports Center
            </h1>

            <p className="text-gray-400 text-sm">
              Visualization for FY {filter.year}
            </p>

          </div>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-800"
          >
            <Download size={18} />
            Download CSV
          </button>

        </div>

        {/* TABS */}

        <div className="bg-white border border-gray-100 p-6 rounded-2xl mb-8 shadow-sm">

          <div className="flex justify-between flex-wrap gap-4">

            <div className="flex gap-2 bg-gray-50 p-1 rounded-xl border">

              {["Income Summary","Expense Summary","Tax Report"].map((tab)=>(
                <button
                  key={tab}
                  onClick={()=>setActiveTab(tab)}
                  className={`px-5 py-2 rounded-lg text-xs font-bold ${
                    activeTab === tab
                      ? "bg-gray-900 text-white"
                      : "text-gray-500"
                  }`}
                >
                  {tab}
                </button>
              ))}

            </div>

            <select
              className="border px-4 py-2 rounded-xl text-sm"
              value={filter.year}
              onChange={(e)=>setFilter({year:e.target.value})}
            >

              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>

            </select>

          </div>

        </div>

        {/* MAIN GRID */}

        <div className="grid grid-cols-12 gap-8 mb-10">

          {/* BAR CHART */}

          <div className="col-span-8 bg-white p-8 rounded-3xl shadow-sm border">

            <h3 className="font-bold mb-6 flex items-center gap-2">
              <BarChart3 size={18}/> {activeTab}
            </h3>

            <div className="h-[300px]">

              <ResponsiveContainer width="100%" height="100%">

                <BarChart data={chartData}>

                  <CartesianGrid strokeDasharray="3 3"/>

                  <XAxis dataKey="name"/>

                  <YAxis/>

                  <Tooltip/>

                  <Bar
                    dataKey={config.key}
                    fill={config.color}
                    radius={[10,10,0,0]}
                  >
                    {chartData.map((entry,index)=>(
                      <Cell key={index} fillOpacity={1-index*0.15}/>
                    ))}
                  </Bar>

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* SIDE STATS */}

          <div className="col-span-4 flex flex-col gap-6">

            <StatMiniCard
              title="Total Savings"
              amount={reportData.netSavings}
              color="text-green-600"
              bg="bg-green-50"
            />

            <StatMiniCard
              title="Tax Liability"
              amount={reportData.estTax}
              color="text-orange-600"
              bg="bg-orange-50"
            />

          </div>

        </div>

        {/* AREA TREND */}

        <div className="bg-white p-8 rounded-3xl shadow-sm border">

          <h3 className="font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-green-600"/>
            Income vs Expense Trend
          </h3>

          <div className="h-[250px]">

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart data={chartData}>

                <CartesianGrid strokeDasharray="3 3"/>

                <XAxis dataKey="name"/>

                <Tooltip/>

                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#f97316"
                  fill="#fed7aa"
                />

                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  fill="#fecaca"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* BOTTOM CARDS */}

        <div className="grid grid-cols-4 gap-6 mt-10">

          <ReportCard
            title="REVENUE"
            amount={reportData.income}
            icon={<ArrowUpRight size={18} className="text-green-600"/>}
          />

          <ReportCard
            title="SPEND"
            amount={reportData.expense}
            icon={<ArrowDownRight size={18} className="text-red-500"/>}
          />

          <ReportCard
            title="SURPLUS"
            amount={reportData.netSavings}
            icon={<Wallet size={18} className="text-blue-500"/>}
          />

          <ReportCard
            title="TAX DUE"
            amount={reportData.estTax}
            icon={<PieIcon size={18} className="text-orange-500"/>}
          />

        </div>

      </div>

    </div>
  );
};

const NavItem = ({icon,label,active=false,onClick})=>(

  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
      active
        ? "bg-[#ff4d00] text-white"
        : "text-gray-400 hover:text-white hover:bg-gray-700/40"
    }`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </div>

);

const ReportCard = ({ title, amount, icon }) => (

  <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">

    <div className="flex justify-between mb-2">

      <p className="text-xs text-gray-400">
        {title}
      </p>

      {icon}

    </div>

    <h4 className="text-2xl font-black">
      ₹{amount.toLocaleString()}
    </h4>

  </div>

);

const StatMiniCard = ({ title, amount, color, bg }) => (

  <div className={`${bg} p-6 rounded-2xl`}>

    <p className="text-xs text-gray-400 mb-1">
      {title}
    </p>

    <h4 className={`text-2xl font-black ${color}`}>
      ₹{amount.toLocaleString()}
    </h4>

  </div>

);

export default Reports;