'use client';

import { Brain, Database, Sparkles, Zap, Shield, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
	{
		icon: Brain,
		title: 'Advanced RAG Technology',
		description:
			'Retrieval-Augmented Generation ensures accurate, context-aware responses by combining AI with your specific knowledge base.',
		gradient: 'from-blue-500 to-cyan-500',
		bgColor: 'bg-blue-500/10',
		iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
	},
	{
		icon: Database,
		title: 'Vector Search with Qdrant',
		description:
			'Lightning-fast semantic search powered by Qdrant vector database for instant, relevant information retrieval.',
		gradient: 'from-purple-500 to-pink-500',
		bgColor: 'bg-purple-500/10',
		iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500',
	},
	{
		icon: Sparkles,
		title: 'OpenAI Integration',
		description:
			'Powered by OpenaiAI with automatic model fallback for uninterrupted service and intelligent responses.',
		gradient: 'from-orange-500 to-red-500',
		bgColor: 'bg-orange-500/10',
		iconBg: 'bg-gradient-to-br from-orange-500 to-red-500',
	},
	{
		icon: Zap,
		title: 'Web Scraping',
		description:
			'Intelligent web content extraction with smart filtering, markdown conversion, and automatic content optimization.',
		gradient: 'from-green-500 to-emerald-500',
		bgColor: 'bg-green-500/10',
		iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500',
	},
	{
		icon: Layers,
		title: 'Document Processing',
		description:
			'Automatic processing of PDFs, Word documents, and text files with intelligent chunking for optimal retrieval.',
		gradient: 'from-yellow-500 to-orange-500',
		bgColor: 'bg-yellow-500/10',
		iconBg: 'bg-gradient-to-br from-yellow-500 to-orange-500',
	},
	{
		icon: Shield,
		title: 'Secure & Scalable',
		description:
			'Enterprise-grade security with MongoDB, Clerk authentication, and scalable architecture for any workload.',
		gradient: 'from-indigo-500 to-purple-500',
		bgColor: 'bg-indigo-500/10',
		iconBg: 'bg-gradient-to-br from-indigo-500 to-purple-500',
	},
];

export default function Features() {
	return (
		<section
			id="features"
			className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 relative overflow-hidden"
		>
			{/* Background effects */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-secondary-500/5 to-accent-500/5" />
			<div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
			<div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />

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
							Powerful Features
						</span>
					</h2>
					<p className="text-xl text-gray-600 dark:text-gray-400">
						Enterprise-grade AI technology stack for intelligent conversations
					</p>
				</motion.div>

				{/* Features Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<div className="h-full group relative">
								{/* Card */}
								<div className={`h-full ${feature.bgColor} backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-800 hover:border-opacity-50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2`}>
									{/* Icon */}
									<div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
										<feature.icon className="w-8 h-8 text-white" />
									</div>

									{/* Content */}
									<h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
										{feature.title}
									</h3>
									<p className="text-gray-600 dark:text-gray-400 leading-relaxed">
										{feature.description}
									</p>

									{/* Decorative corner */}
									<div className="absolute bottom-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
										<div className={`w-full h-full ${feature.iconBg} opacity-10 rounded-tl-3xl`} />
									</div>
								</div>

								{/* Hover glow effect */}
								<div className={`absolute inset-0 ${feature.iconBg} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300 blur-xl pointer-events-none`} />
							</div>
						</motion.div>
					))}
				</div>

				{/* Bottom CTA */}
				{/* <motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.6 }}
					className="mt-20 text-center"
				>
					<div className="inline-flex flex-col items-center gap-4 px-8 py-6 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-2xl border border-primary-500/20">
						<p className="text-lg font-semibold text-gray-900 dark:text-white">
							Ready to experience the power of AI?
						</p>
						<a href="/dashboard">
							<button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
								Start Building Now
							</button>
						</a>
					</div>
				</motion.div> */}
			</div>
		</section>
	);
}
