import { Package, ShoppingCart, Users, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import API_BASE_URL from "@/lib/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';

export default function AdminDashboard() {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';
      const adminPin = localStorage.getItem('admin_pin') || '';
      const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "x-admin-pin": adminPin
        }
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    }
  });

  const stats = [
    { label: "Revenue", value: `₹${statsData?.totalRevenue || 0}`, icon: TrendingUp, change: "Delivered orders only", color: "text-green-600" },
    { label: "Pending", value: statsData?.ordersByStatus?.Pending || 0, icon: Clock, change: "Awaiting action", color: "text-amber-600" },
    { label: "Customers", value: statsData?.totalUsers || 0, icon: Users, change: "Total registered", color: "text-purple-600" },
    { label: "Total Orders", value: statsData?.totalOrders || 0, icon: ShoppingCart, change: "All time", color: "text-primary" },
  ];

  const statusData = statsData?.ordersByStatus ? Object.entries(statsData.ordersByStatus).map(([name, value]) => ({ name, value })) : [];

  const chartData = statsData?.dailySales || [];

  const COLORS = ['#f59e0b', '#8b5cf6', '#3b82f6', '#f43f5e', '#10b981', '#6b7280'];

  const statusBoxes = [
    { label: "Pending", count: statsData?.ordersByStatus?.Pending || 0, color: "border-amber-200 bg-amber-50 text-amber-700" },
    { label: "In Packing", count: statsData?.ordersByStatus?.["In Packing"] || 0, color: "border-purple-200 bg-purple-50 text-purple-700" },
    { label: "In Delivery", count: statsData?.ordersByStatus?.["In Delivery"] || 0, color: "border-blue-200 bg-blue-50 text-blue-700" },
    { label: "Payment Pending", count: statsData?.ordersByStatus?.["Payment Pending"] || 0, color: "border-rose-200 bg-rose-50 text-rose-700" },
    { label: "Done", count: statsData?.ordersByStatus?.Done || 0, color: "border-green-200 bg-green-50 text-green-700" },
    { label: "Cancelled", count: statsData?.ordersByStatus?.Cancelled || 0, color: "border-gray-200 bg-gray-50 text-gray-700" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Dashboard <span className="gold-text">Overview</span></h1>
        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground bg-muted px-3 py-1 rounded-full">
          Live Data
        </div>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{s.label}</span>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div className="text-3xl font-display font-bold text-foreground">{s.value}</div>
                <div className="text-[10px] font-bold text-primary mt-2 uppercase tracking-tighter opacity-70">{s.change}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {statusBoxes.map((box) => (
              <div key={box.label} className={`p-4 rounded-xl border-2 ${box.color} flex flex-col items-center justify-center text-center shadow-sm`}>
                <span className="text-2xl font-bold">{box.count}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider mt-1">{box.label}</span>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Sales Trend */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-display font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Sales Trend (Last 7 Days)
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="total" stroke="#d4af37" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Status Distribution */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-display font-bold mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Order Status Distribution
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
