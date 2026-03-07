import { useState } from "react";
import ChatModal from "@/components/ChatModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API_BASE_URL from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  Loader2,
  Trash2,
  User,
  Phone,
  Mail,
  ChevronRight,
  MessageSquare,
  Send,
  Filter,
  ArrowDownUp,
  Download
} from "lucide-react";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function AdminOrders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: unreadCounts = [] } = useQuery({
    queryKey: ["admin-unread-messages"],
    queryFn: async () => {
      const adminPin = localStorage.getItem('admin_pin') || '';
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';
      const res = await fetch(`${API_BASE_URL}/api/messages/unread`, {
        headers: { "x-admin-pin": adminPin, "Authorization": `Bearer ${token}` }
      });
      return res.json();
    }
  });

  const [chatOrder, setChatOrder] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders", statusFilter, sortBy, sortOrder],
    queryFn: async () => {
      const adminPin = localStorage.getItem('admin_pin') || '';
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';

      const res = await fetch(`${API_BASE_URL}/api/orders?status=${statusFilter}&sortBy=${sortBy}&order=${sortOrder}`, {
        headers: {
          "x-admin-pin": adminPin,
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    }
  });

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(orders.map((o: any) => ({
      OrderID: o._id,
      Date: format(new Date(o.createdAt), "PPP p"),
      Customer: o.customerDetails?.email.split('@')[0] || 'Guest',
      Email: o.customerDetails?.email || 'N/A',
      Phone: o.customerDetails?.phone || 'N/A',
      Items: o.totalItems,
      Amount: o.totalPrice,
      Status: o.status,
      Location: `${o.shippingAddress?.district}, ${o.shippingAddress?.state}`
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "Podikart_Orders.xlsx");
  };

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const adminPin = localStorage.getItem('admin_pin') || '';
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';

      const res = await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": adminPin,
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      // Update selectedOrder state so the modal reflects the change immediately
      if (selectedOrder && selectedOrder._id === data._id) {
        setSelectedOrder(data);
      }
      toast({ title: "Status Updated", description: `Order is now ${data.status}` });
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold">Order Management</h1>
        <div className="flex items-center gap-3">
          <Button onClick={exportToExcel} variant="outline" className="gap-2 h-9">
            <Download className="w-4 h-4" /> Export Excel
          </Button>
          <div className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            {orders.length} Total Orders
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-6 items-center shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-lg border border-input bg-background px-3 py-1.5 focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Packing">In Packing</option>
            <option value="In Delivery">In Delivery</option>
            <option value="Done">Done</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <ArrowDownUp className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs rounded-lg border border-input bg-background px-3 py-1.5 focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="date">Order Date</option>
            <option value="amount">Amount</option>
            <option value="items">Items Count</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="text-xs rounded-lg border border-input bg-background px-3 py-1.5 focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="desc">High to Low / Newest</option>
            <option value="asc">Low to High / Oldest</option>
          </select>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left bg-muted/30">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Customer</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Items</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Amount</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">No orders found yet.</td>
                </tr>
              ) : (
                orders.map((o: any) => (
                  <tr key={o._id} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                      {format(new Date(o.createdAt), "MMM dd, hh:mm a")}
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-semibold">{o.customerDetails.email.split('@')[0]}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[150px]">{o.customerDetails.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 text-primary" />
                        <span className="truncate max-w-[120px]">{o.shippingAddress.district}, {o.shippingAddress.state}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center text-sm font-medium">{o.totalItems}</td>
                    <td className="p-4 text-center text-sm font-bold gold-text">₹{o.totalPrice}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border ${o.status === "Done" ? "bg-green-50 text-green-700 border-green-200" :
                        o.status === "Cancelled" ? "bg-red-50 text-red-700 border-red-200" :
                          o.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" :
                            "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 relative"
                        onClick={() => { setChatOrder(o); setIsChatOpen(true); }}
                      >
                        <MessageSquare className="w-4 h-4" />
                        {unreadCounts.find((u: any) => u._id === o._id) && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] flex items-center justify-center rounded-full border-2 border-background">
                            {unreadCounts.find((u: any) => u._id === o._id).count}
                          </span>
                        )}
                        <span className="hidden sm:inline">Chat</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5 text-primary hover:text-primary hover:bg-primary/10 font-bold"
                        onClick={() => { setSelectedOrder(o); setIsModalOpen(true); }}
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 border-none rounded-2xl shadow-2xl">
          {selectedOrder && (
            <>
              <div className="gold-gradient p-6 text-primary-foreground">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-display font-bold">Order Details</h2>
                    <p className="text-primary-foreground/80 text-sm">#{selectedOrder._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Final Amount</p>
                    <p className="text-xl font-bold">₹{selectedOrder.totalPrice}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{format(new Date(selectedOrder.createdAt), "PPP p")}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                    <Package className="w-4 h-4" />
                    <span className="text-sm">{selectedOrder.totalItems} Products</span>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8 bg-background">
                {/* Left Side: Products & Status */}
                <div className="space-y-8">
                  <section>
                    <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" /> Order Items
                    </h3>
                    <div className="space-y-3">
                      {selectedOrder.orderItems.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-4 bg-muted/20 p-3 rounded-xl border border-border">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold truncate">{item.name}</h4>
                            <p className="text-[10px] text-muted-foreground uppercase">{item.pack} Pack</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold">₹{item.price * item.quantity}</div>
                            <div className="text-[10px] text-muted-foreground">Qty: {item.quantity}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> Update Status
                    </h3>
                    <Select
                      defaultValue={selectedOrder.status}
                      onValueChange={(val) => updateStatusMutation.mutate({ id: selectedOrder._id, status: val })}
                    >
                      <SelectTrigger className="w-full rounded-xl border-2">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Packing">In Packing</SelectItem>
                        <SelectItem value="In Delivery">In Delivery</SelectItem>
                        <SelectItem value="Payment Pending">Payment Pending</SelectItem>
                        <SelectItem value="Done">Done</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </section>
                </div>

                {/* Right Side: Customer & Delivery */}
                <div className="space-y-8">
                  <section>
                    <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" /> Customer Info
                    </h3>
                    <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Email</p>
                          <p className="text-sm font-semibold">{selectedOrder.customerDetails.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 border-t border-border pt-3">
                        <Phone className="w-4 h-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Mobile</p>
                          <p className="text-sm font-semibold">{selectedOrder.customerDetails.phone}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" /> Delivery Address
                    </h3>
                    <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
                      <div className="p-2 bg-primary/5 rounded-lg border border-primary/10 inline-block text-[10px] font-bold uppercase text-primary mb-1">
                        {selectedOrder.shippingAddress.type} Address
                      </div>
                      <p className="text-sm font-medium leading-relaxed">{selectedOrder.shippingAddress.address}</p>
                      <div className="pt-2 border-t border-border space-y-1">
                        <p className="text-xs font-semibold">{selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.state}</p>
                        <p className="text-xs text-muted-foreground font-medium">PIN: {selectedOrder.shippingAddress.pincode}</p>
                        <p className="text-[10px] text-primary font-bold mt-2">
                          GPS: {selectedOrder.shippingAddress.lat}, {selectedOrder.shippingAddress.lng}
                        </p>
                      </div>
                    </div>
                  </section>

                  <div className="pt-4">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 rounded-xl"
                      onClick={() => {
                        const message = encodeURIComponent(`Regarding Order #${selectedOrder._id.slice(-8).toUpperCase()}...`);
                        window.open(`https://wa.me/${selectedOrder.customerDetails.phone}?text=${message}`, '_blank');
                      }}
                    >
                      <ChevronRight className="w-5 h-5 mr-2" />
                      Contact via WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {chatOrder && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          order={chatOrder}
          isAdmin={true}
        />
      )}
    </div>
  );
}
