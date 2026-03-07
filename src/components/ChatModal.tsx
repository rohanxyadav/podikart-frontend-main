import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API_BASE_URL from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Loader2, X, MessageSquare } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: any;
    isAdmin?: boolean;
}

export default function ChatModal({ isOpen, onClose, order, isAdmin = false }: ChatModalProps) {
    const [content, setContent] = useState("");
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const scrollRef = useRef<HTMLDivElement>(null);

    const { data: messages = [], isLoading } = useQuery({
        queryKey: ["order-messages", order?._id],
        queryFn: async () => {
            const userStr = localStorage.getItem('user');
            const token = userStr ? JSON.parse(userStr).token : '';
            const adminPin = localStorage.getItem('admin_pin') || '';
            const res = await fetch(`${API_BASE_URL}/api/messages/${order._id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    ...(isAdmin && { "x-admin-pin": adminPin })
                }
            });
            if (!res.ok) throw new Error("Failed to fetch messages");
            return res.json();
        },
        enabled: !!order?._id && isOpen,
        refetchInterval: 5000 // Poll every 5 seconds
    });

    const sendMutation = useMutation({
        mutationFn: async (text: string) => {
            const userStr = localStorage.getItem('user');
            const token = userStr ? JSON.parse(userStr).token : '';
            const adminPin = localStorage.getItem('admin_pin') || '';
            const res = await fetch(`${API_BASE_URL}/api/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    ...(isAdmin && { "x-admin-pin": adminPin })
                },
                body: JSON.stringify({ orderId: order._id, content: text })
            });
            if (!res.ok) throw new Error("Failed to send message");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["order-messages", order?._id] });
            setContent("");
        }
    });

    const markReadMutation = useMutation({
        mutationFn: async () => {
            const userStr = localStorage.getItem('user');
            const token = userStr ? JSON.parse(userStr).token : '';
            const adminPin = localStorage.getItem('admin_pin') || '';
            await fetch(`${API_BASE_URL}/api/messages/${order._id}/read`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    ...(isAdmin && { "x-admin-pin": adminPin })
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-unread-messages"] });
        }
    });

    useEffect(() => {
        if (isOpen && order?._id) {
            markReadMutation.mutate();
        }
    }, [isOpen, order?._id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || sendMutation.isPending) return;
        sendMutation.mutate(content);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-2xl flex flex-col h-[600px] border-none shadow-2xl">
                <DialogHeader className="p-4 gold-gradient text-primary-foreground">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-display">Order #{order?._id.slice(-8).toUpperCase()}</DialogTitle>
                                <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Chat Support</p>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div
                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10 scrollbar-hide"
                    ref={scrollRef}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground flex flex-col items-center gap-2 h-full justify-center">
                            <MessageSquare className="w-12 h-12 opacity-10" />
                            <p className="text-sm font-medium">No messages yet. Ask a question!</p>
                        </div>
                    ) : (
                        messages.map((m: any) => {
                            const isMine = isAdmin ? m.isAdmin : !m.isAdmin;
                            return (
                                <div key={m._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${isMine
                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                        : "bg-card border border-border rounded-tl-none text-foreground"
                                        }`}>
                                        <p className="leading-relaxed">{m.content}</p>
                                        <p className={`text-[8px] mt-1 opacity-60 text-right ${isMine ? "text-primary-foreground" : "text-muted-foreground"}`}>
                                            {format(new Date(m.createdAt), "hh:mm a")}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="p-4 bg-background border-t border-border">
                    <form onSubmit={handleSend} className="flex gap-2">
                        <Input
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Ask a question..."
                            className="rounded-xl bg-muted/30 focus-visible:ring-primary border-none"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            className="gold-gradient shrink-0 rounded-xl"
                            disabled={!content.trim() || sendMutation.isPending}
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
