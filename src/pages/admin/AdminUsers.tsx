import { useQuery } from "@tanstack/react-query";
import { Users, Mail, Phone, Calendar, ArrowDownUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import API_BASE_URL from "@/lib/api";
import { format } from "date-fns";

export default function AdminUsers() {
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");

    const { data: users = [], isLoading } = useQuery({
        queryKey: ["admin-users", sortOrder],
        queryFn: async () => {
            const userStr = localStorage.getItem('user');
            const token = userStr ? JSON.parse(userStr).token : '';
            const adminPin = localStorage.getItem('admin_pin') || '';
            const res = await fetch(`${API_BASE_URL}/api/admin/users?sortBy=${sortOrder}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "x-admin-pin": adminPin
                }
            });
            if (!res.ok) throw new Error("Failed to fetch users");
            return res.json();
        }
    });

    const filteredUsers = users.filter((u: any) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="font-display text-2xl font-bold">Customer Management</h1>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                        className="gap-2"
                    >
                        <ArrowDownUp className="w-4 h-4" />
                        {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
                    </Button>
                    <div className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-lg">
                        {users.length} Customers
                    </div>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name or email..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border text-left bg-muted/30">
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Joined Date</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Admin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-muted-foreground">Loading customers...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-muted-foreground">No customers found.</td>
                                </tr>
                            ) : (
                                filteredUsers.map((u: any) => (
                                    <tr key={u._id} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                                        <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                                            {format(new Date(u.createdAt), "MMM dd, yyyy")}
                                        </td>
                                        <td className="p-4 font-semibold text-foreground">{u.name}</td>
                                        <td className="p-4 text-sm text-muted-foreground">{u.email}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${u.isAdmin ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-muted text-muted-foreground'}`}>
                                                {u.isAdmin ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
