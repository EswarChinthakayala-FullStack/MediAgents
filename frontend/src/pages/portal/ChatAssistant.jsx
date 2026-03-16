import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
    MessageSquare,
    Send,
    Mic,
    BrainCircuit,
    Activity,
    Paperclip,
    User,
    Sparkles,
    ShieldCheck
} from 'lucide-react';

const ChatAssistant = () => {
    const [messages, setMessages] = useState([
        { id: 1, role: 'assistant', text: "Hello! I'm Sarah's dedicated Health Assistant. I have access to your recent records. How can I help you today?", time: '12:45 PM' },
    ]);
    const [input, setInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const newUserMessage = { id: messages.length + 1, role: 'user', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages([...messages, newUserMessage]);
        setInput('');

        // Simulate Agent 08 Response
        setTimeout(() => {
            const assistantResponse = {
                id: messages.length + 2,
                role: 'assistant',
                text: "I've analyzed your question relative to your Post-Op recovery data. Based on your surgery on Oct 10th, the mild discomfort you're describing is within normal parameters. However, I've flagged this for Dr. Chen to review.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, assistantResponse]);
        }, 1500);
    };

    return (
        <div className="max-w-5xl mx-auto h-[calc(100vh-160px)] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between pb-2 border-b border-border/10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group hover:scale-110 transition-transform relative">
                        <BrainCircuit size={24} />
                        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background animate-pulse"></div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase mb-0.5">Health Assistant</h1>
                        <p className="text-muted-foreground text-sm italic flex items-center gap-2">
                            Agent-08 Live Interface
                            <Badge variant="outline" className="text-[8px] h-4 border-primary/20 bg-primary/5 text-primary">SECURE CHANNEL</Badge>
                        </p>
                    </div>
                </div>
                <div className="hidden md:flex gap-3">
                    <Badge variant="outline" className="bg-secondary/30 text-muted-foreground border-border/50 font-bold text-[9px] uppercase tracking-widest h-8 px-3 flex items-center gap-2">
                        <Sparkles size={12} className="text-primary" /> Multi-Modal Active
                    </Badge>
                    <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 font-bold text-[9px] uppercase tracking-widest h-8 px-3 flex items-center gap-2">
                        <ShieldCheck size={12} /> HIPAA Encrypted
                    </Badge>
                </div>
            </div>

            <div className="flex-1 min-h-0 bg-card/60 backdrop-blur-xl border border-border/40 rounded-3xl flex flex-col shadow-2xl overflow-hidden relative">
                {/* Background Decor */}
                <div className="absolute inset-0 -z-10 opacity-[0.03] select-none pointer-events-none flex items-center justify-center">
                    <BrainCircuit size={400} />
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll-container">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                            <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold border ${msg.role === 'user' ? 'bg-secondary border-border' : 'bg-primary border-primary text-primary-foreground'}`}>
                                    {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                                </div>
                                <div className="space-y-1">
                                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none shadow-lg shadow-primary/10 font-medium' : 'bg-secondary/40 border border-border/50 text-foreground rounded-tl-none italic font-medium'}`}>
                                        {msg.text}
                                    </div>
                                    <p className={`text-[9px] font-bold text-muted-foreground uppercase tracking-widest ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>{msg.time}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-background/50 border-t border-border/10 flex gap-3 items-end">
                    <div className="flex-1 relative flex items-center bg-secondary/30 rounded-2xl border border-border/50 focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/40 transition-all p-2 pr-4 overflow-hidden group">
                        <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 text-muted-foreground hover:text-primary rounded-xl">
                            <Paperclip size={18} />
                        </Button>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                            placeholder="Type health question or surgery concern..."
                            className="bg-transparent border-none focus:ring-0 text-sm font-medium w-full min-h-[44px] max-h-32 py-3 px-2 resize-none outline-none leading-relaxed italic placeholder:opacity-50"
                            rows={1}
                        />
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsRecording(!isRecording)}
                                className={`h-10 w-10 shrink-0 rounded-xl relative transition-all ${isRecording ? 'text-destructive scale-110 bg-destructive/10' : 'text-muted-foreground hover:text-emerald-500'}`}
                            >
                                <Mic size={18} className={isRecording ? 'animate-pulse' : ''} />
                                {isRecording && <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive animate-ping"></div>}
                            </Button>
                        </div>
                    </div>
                    <Button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="h-[52px] w-[52px] rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 text-primary-foreground flex-shrink-0 flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                    >
                        <Send size={20} className="-mr-1" />
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-center gap-8 text-[9px] font-black tracking-[0.2em] text-muted-foreground opacity-30 mt-2 uppercase">
                <span className="flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-emerald-500"></div> End-to-End Encrypted</span>
                <span>•</span>
                <span className="flex items-center gap-2">AI-Human Hybrid Protocol Active</span>
                <span>•</span>
                <span>Whisper STT v3 Ready</span>
            </div>
        </div>
    );
};

export default ChatAssistant;
