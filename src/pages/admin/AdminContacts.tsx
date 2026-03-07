import { useQuery } from "@tanstack/react-query";
import { Mail, Phone, Calendar, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import * as XLSX from "xlsx";
import API_BASE_URL from "@/lib/api";
import { format } from "date-fns";

export default function AdminContacts() {
    const [search, setSearch] = useState("");

    const { data: contacts = [], isLoading } = useQuery({
        queryKey: ["admin-contacts"],
        queryFn: async () => {
            const userStr = localStorage.getItem('user');
            const token = userStr ? JSON.parse(userStr).token : '';
            const adminPin = localStorage.getItem('admin_pin') || '';
            const res = await fetch(`${API_BASE_URL}/api/contacts`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "x-admin-pin": adminPin
                }
            });
            if (!res.ok) throw new Error("Failed to fetch");
            return res.json();
        }
    });

    const filteredContacts = contacts.filter((c: any) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.message.toLowerCase().includes(search.toLowerCase())
    );

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(contacts.map((c: any) => ({
            Date: format(new Date(c.createdAt), "PPP p"),
            Name: c.name,
            Email: c.email,
            Phone: c.phone || "N/A",
            Message: c.message
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Contacts");
        XLSX.writeFile(wb, "Podikart_Contacts.xlsx");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="font-display text-2xl font-bold">Contact Inquiries</h1>
                <Button onClick={exportToExcel} variant="outline" className="shrink-0">
                    <Download className="w-4 h-4 mr-2" /> Export to Excel
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name, email or message..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid gap-4">
                {isLoading ? (
                    <div className="text-center p-12 text-muted-foreground">Loading inquiries...</div>
                ) : filteredContacts.length === 0 ? (
                    <div className="text-center p-12 text-muted-foreground border-2 border-dashed rounded-xl">
                        No inquiries found.
                    </div>
                ) : filteredContacts.map((c: any) => (
                    <div key={c._id} className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-foreground">{c.name}</h3>
                                <div className="flex flex-wrap gap-4 mt-1">
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <Mail className="w-3.5 h-3.5" /> {c.email}
                                    </div>
                                    {c.phone && (
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <Phone className="w-3.5 h-3.5" /> {c.phone}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <Calendar className="w-3.5 h-3.5" /> {format(new Date(c.createdAt), "MMM dd, yyyy")}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-4 text-sm leading-relaxed text-foreground">
                            {c.message}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
