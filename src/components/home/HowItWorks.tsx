"use client";

import { Globe, FileText, Bot, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
	{
		icon: Globe,
		title: "Enter Website URL",
		description:
			"Simply paste your website URL. Our Website crawler will automatically extract and index all your content with smart filtering.",
		color: "from-blue-500 to-cyan-500",
		bgColor: "bg-blue-500/10",
		borderColor: "border-blue-500/20",
		iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500"
	},
	{
		icon: FileText,
		title: "Or Upload Documents",
		description:
			"Upload PDFs, Word documents, or text files. We process and chunk your content using LangChain for optimal retrieval.",
		color: "from-purple-500 to-pink-500",
		bgColor: "bg-purple-500/10",
		borderColor: "border-purple-500/20",
		iconBg: "bg-gradient-to-br from-purple-500 to-pink-500"
	},
	{
		icon: Bot,
		title: "AI Processes & Embeds",
		description:
			"OpenAI generates embeddings and stores them in Qdrant vector database. Your knowledge base is now ready for intelligent retrieval.",
		color: "from-orange-500 to-red-500",
		bgColor: "bg-orange-500/10",
		borderColor: "border-orange-500/20",
		iconBg: "bg-gradient-to-br from-orange-500 to-red-500"
	},
	{
		icon: MessageSquare,
		title: "Chat with Your Data",
		description:
			"Ask questions and get accurate answers powered by RAG (Retrieval-Augmented Generation) with context-aware responses.",
		color: "from-green-500 to-emerald-500",
		bgColor: "bg-green-500/10",
		borderColor: "border-green-500/20",
		iconBg: "bg-gradient-to-br from-green-500 to-emerald-500"
	}
];

export default function HowItWorks() {
	return (
		<section id="how-it-works" className="py-24 relative overflow-hidden">
			{/* Background effects */}
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent" />
			<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
			<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="text-center max-w-3xl mx-auto mb-20"
				>
					<h2 className="text-4xl md:text-5xl font-bold mb-6">
						<span className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
							How It Works
						</span>
					</h2>
					<p className="text-xl text-gray-600 dark:text-gray-400">
						Transform your content into an intelligent AI assistant in minutes
					</p>
				</motion.div>

				{/* Steps Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
					{steps.map((step, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className="relative"
						>
							{/* Card */}
							<div
								className={`h-full ${step.bgColor} backdrop-blur-sm rounded-2xl p-6 border ${step.borderColor} hover:border-opacity-50 transition-all duration-300 hover:shadow-xl hover:scale-105 group`}
							>
								{/* Step number */}
								<div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white dark:border-gray-950">
									{index + 1}
								</div>

								{/* Icon */}
								<div
									className={`w-16 h-16 ${step.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
								>
									<step.icon className="w-8 h-8 text-white" />
								</div>

								{/* Content */}
								<h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
									{step.title}
								</h3>
								<p className="text-gray-600 dark:text-gray-400 leading-relaxed">
									{step.description}
								</p>

								{/* Hover effect glow */}
								<div
									className={`absolute inset-0 ${step.iconBg} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none`}
								/>
							</div>
						</motion.div>
					))}
				</div>

				{/* Tech Stack Badge */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className="mt-16 text-center"
				>
					<div className="inline-flex flex-wrap items-center justify-center gap-3 px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
						<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
							Powered by:
						</span>
						<span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
							Langchain
						</span>
						<span className="text-gray-400">•</span>
						<span className="text-sm font-semibold text-secondary-600 dark:text-secondary-400">
							OpenAI
						</span>
						<span className="text-gray-400">•</span>
						<span className="text-sm font-semibold text-accent-600 dark:text-accent-400">
							Qdrant
						</span>
						<span className="text-gray-400">•</span>
						<span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
							MongoDB
						</span>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
