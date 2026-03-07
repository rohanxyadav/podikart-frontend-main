import { useQuery } from "@tanstack/react-query";
import { Handshake, Mail, Phone, MapPin, Building2, Calendar, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import * as XLSX from "xlsx";
import API_BASE_URL from "@/lib/api";
import { format } from "date-fns";

export default function AdminPartners() {
    const [search, setSearch] = useState("");

    const { data: requests = [], isLoading } = useQuery({
        queryKey: ["admin-partners"],
        queryFn: async () => {
            const userStr = localStorage.getItem('user');
            const token = userStr ? JSON.parse(userStr).token : '';
            const adminPin = localStorage.getItem('admin_pin') || '';
            const res = await fetch(`${API_BASE_URL}/api/partners`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "x-admin-pin": adminPin
                }
            });
            if (!res.ok) throw new Error("Failed to fetch");
            return res.json();
        }
    });

    const filteredRequests = requests.filter((r: any) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.business.toLowerCase().includes(search.toLowerCase()) ||
        r.city.toLowerCase().includes(search.toLowerCase())
    );

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(requests.map((r: any) => ({
            Date: format(new Date(r.createdAt), "PPP p"),
            Name: r.name,
            Email: r.email,
            Phone: r.phone,
            Business: r.business,
            City: r.city,
            Message: r.message
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "PartnerRequests");
        XLSX.writeFile(wb, "Podikart_Partner_Requests.xlsx");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Handshake className="w-8 h-8 text-primary" />
                    <h1 className="font-display text-2xl font-bold">Partner Requests</h1>
                </div>
                <Button onClick={exportToExcel} variant="outline" className="shrink-0 gap-2">
                    <Download className="w-4 h-4" /> Export to Excel
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name, business or city..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid gap-6">
                {isLoading ? (
                    <div className="text-center p-12 text-muted-foreground">Loading requests...</div>
                ) : filteredRequests.length === 0 ? (
                    <div className="text-center p-12 text-muted-foreground border-2 border-dashed rounded-xl">
                        No partner requests found.
                    </div>
                ) : filteredRequests.map((r: any) => (
                    <div key={r._id} className="bg-card border border-border rounded-xl p-6 shadow-sm border-l-4 border-l-primary">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div>
                                <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Applicant</div>
                                <h3 className="font-bold text-foreground">{r.name}</h3>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                                    <Calendar className="w-3 h-3" /> {format(new Date(r.createdAt), "MMM dd, yyyy p")}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Business</div>
                                <div className="flex items-center gap-1.5 font-medium text-foreground">
                                    <Building2 className="w-3.5 h-3.5" /> {r.business}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                                    <MapPin className="w-3 h-3" /> {r.city}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Contact Details</div>
                                <div className="flex items-center gap-1.5 text-sm text-foreground">
                                    <Mail className="w-3.5 h-3.5" /> {r.email}
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-foreground mt-1">
                                    <Phone className="w-3.5 h-3.5" /> {r.phone}
                                </div>
                            </div>
                        </div>
                        {r.message && (
                            <div className="mt-4 pt-4 border-t border-border">
                                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Message / Proposal</div>
                                <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                                    {r.message}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
