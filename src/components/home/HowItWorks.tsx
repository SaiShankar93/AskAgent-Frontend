"use client";

import { Globe, FileText, Bot, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
	{
		icon: Globe,
		title: "Enter Website URL",
		description:
			"Paste your website URL and we crawl, filter, and index your content automatically.",
	},
	{
		icon: FileText,
		title: "Or Upload Documents",
		description:
			"Upload PDFs or docs. We chunk and optimize content for precise retrieval.",
	},
	{
		icon: Bot,
		title: "AI Processes & Embeds",
		description:
			"Embeddings are generated and stored in a vector database for instant recall.",
	},
	{
		icon: MessageSquare,
		title: "Chat with Your Data",
		description:
			"Ask questions and receive fluent, contextual answers powered by RAG.",
	},
];

export default function HowItWorks() {
	return (
		<section id="how-it-works" className="py-24 relative overflow-hidden bg-white dark:bg-gray-950">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.05),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.08),_transparent_55%)]" />

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="text-center max-w-3xl mx-auto mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-semibold mb-6 text-gray-900 dark:text-white">
						How It Works
					</h2>
					<p className="text-lg text-gray-600 dark:text-gray-400">
						Transform your content into an intelligent AI assistant in minutes.
					</p>
				</motion.div>

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
							<div className="h-full bg-white/90 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 dark:border-white/10 shadow-sm hover:shadow-lg transition-all duration-300">
								<div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 font-semibold text-sm shadow-sm">
									{index + 1}
								</div>

								<div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
									<step.icon className="w-6 h-6 text-white dark:text-gray-900" />
								</div>

								<h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
									{step.title}
								</h3>
								<p className="text-gray-600 dark:text-gray-400 leading-relaxed">
									{step.description}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
