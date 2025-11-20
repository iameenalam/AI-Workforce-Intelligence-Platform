import React, { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { Send, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";

const PREDEFINED_QUESTIONS = [
	"Which functions or roles are falling behind industry trends and post a threat?",
	"Which JDs are outdated, missing, or misaligned—and how is that affecting performance or accountability?",
	"If a market shift or AI breakthrough happened tomorrow, where are we most exposed?",
	"Which teams or roles are most vulnerable to automation—and what’s the immediate upskilling plan?",
];

const TypingIndicator = () => (
	<motion.div
		initial={{ opacity: 0, y: 10 }}
		animate={{ opacity: 1, y: 0 }}
		className="flex items-start gap-3"
	>
		<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-200">
			<Bot className="h-4 w-4 text-slate-600" />
		</div>
		<div className="rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3">
			<div className="flex h-full items-center gap-1.5">
				<div
					className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
					style={{ animationDelay: "0ms" }}
				></div>
				<div
					className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
					style={{ animationDelay: "150ms" }}
				></div>
				<div
					className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
					style={{ animationDelay: "300ms" }}
				></div>
			</div>
		</div>
	</motion.div>
);

export default function Chatbot({ userId, userIdentity }) {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [remainingPrompts, setRemainingPrompts] = useState([...PREDEFINED_QUESTIONS]);
	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, loading]);

	const handleSendMessage = async (messageContent) => {
		if (!messageContent.trim() || loading) return;
		const userMsg = { role: "user", content: messageContent };
		setMessages((prev) => [...prev, userMsg]);
		setInput("");
		setLoading(true);
		if (PREDEFINED_QUESTIONS.includes(messageContent)) {
			setRemainingPrompts((prev) => prev.filter((q) => q !== messageContent));
		}
		try {
			const token = Cookies.get("token");
			if (!token) throw new Error("Authentication failed. Please log in.");
			const res = await fetch("/api/chatbotorg", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message: messageContent, userId, userIdentity, token }),
			});
			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.reply || "An error occurred.");
			}
			const data = await res.json();
			setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
		} catch (err) {
			setMessages((prev) => [...prev, { role: "assistant", content: err.message || "Sorry, something went wrong." }]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex h-full flex-col bg-slate-50 w-full max-w-[400px] mx-auto p-0 sm:p-0">
			<div className="flex-1 space-y-5 overflow-y-auto p-4">
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
					<div className="pb-8 pt-4 text-center">
						<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
							<Bot className="h-8 w-8 text-indigo-600" />
						</div>
						<h3 className="text-lg font-semibold text-slate-800">Hello! I'm ReeOrg AI.</h3>
						<p className="text-sm text-slate-500">Ask a question or start with a suggestion below.</p>
					</div>
					{remainingPrompts.length > 0 && (
						<div className="flex flex-col gap-2.5 px-2 pb-4">
							{remainingPrompts.map((q) => (
								<button
									key={q}
									onClick={() => handleSendMessage(q)}
									disabled={loading}
									className="rounded-full bg-white px-4 py-2 text-left text-sm font-medium text-indigo-800 ring-1 ring-slate-200 transition-all hover:bg-indigo-50 hover:shadow-sm disabled:opacity-50"
								>
									{q}
								</button>
							))}
						</div>
					)}
				</motion.div>

				<AnimatePresence>
					{messages.map((msg, idx) => (
						<motion.div
							key={idx}
							layout
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95 }}
							className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
						>
							<div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${msg.role === "user" ? "bg-indigo-600" : "bg-slate-200"}`}>
								{msg.role === "user" ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-slate-600" />}
							</div>
							<div className={`prose prose-sm prose-slate max-w-xs rounded-2xl px-4 py-2.5 prose-p:my-1 ${msg.role === "user" ? "rounded-br-md bg-indigo-600 text-white prose-invert" : "rounded-bl-md bg-slate-100 text-slate-800"}`}>
								<ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
							</div>
						</motion.div>
					))}
				</AnimatePresence>

				{loading && <TypingIndicator />}
				<div ref={messagesEndRef} />
			</div>

			<div className="border-t border-slate-200 bg-white p-3 shadow-[0_-2px_10px_-5px_rgba(0,0,0,0.05)]">
				<form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="flex items-center gap-3">
					<Input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Ask ReeOrg AI..."
						disabled={loading}
						className="flex-1 rounded-lg border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
						onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(input); } }}
					/>
					<button
						type="submit"
						disabled={loading || !input.trim()}
						className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
						aria-label="Send message"
					>
						<Send className="h-4 w-4" />
					</button>
				</form>
			</div>
		</div>
	);
}