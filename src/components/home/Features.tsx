'use client';

import { Brain, Database, Sparkles, Zap, Shield, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
	{
		icon: Brain,
		title: 'Advanced RAG Technology',
		description:
			'Retrieval-Augmented Generation ensures accurate, context-aware responses by combining AI with your specific knowledge base.',
	},
	{
		icon: Database,
		title: 'Vector Search with Qdrant',
		description:
			'Lightning-fast semantic search powered by Qdrant vector database for instant, relevant information retrieval.',
	},
	{
		icon: Sparkles,
		title: 'OpenAI Integration',
		description:
			'Powered by OpenAI with automatic model fallback for uninterrupted service and intelligent responses.',
	},
	{
		icon: Zap,
		title: 'Web Scraping',
		description:
			'Intelligent web content extraction with smart filtering, markdown conversion, and automatic content optimization.',
	},
	{
		icon: Layers,
		title: 'Document Processing',
		description:
			'Automatic processing of PDFs, Word documents, and text files with intelligent chunking for optimal retrieval.',
	},
	{
		icon: Shield,
		title: 'Secure & Scalable',
		description:
			'Enterprise-grade security with MongoDB, Clerk authentication, and scalable architecture for any workload.',
	},
];

export default function Features() {
	return (
		<section
			id="features"
			className="py-24 bg-gray-50/70 dark:bg-gray-950 relative overflow-hidden"
		>
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
						Powerful Features
					</h2>
					<p className="text-lg text-gray-600 dark:text-gray-400">
						An enterprise-grade AI stack, refined for elegant customer experiences.
					</p>
				</motion.div>

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
								<div className="h-full bg-white/90 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/60 dark:border-white/10 shadow-sm hover:shadow-lg transition-all duration-300">
									<div className="w-12 h-12 rounded-2xl bg-gray-900 dark:bg-white flex items-center justify-center mb-6 shadow-sm">
										<feature.icon className="w-6 h-6 text-white dark:text-gray-900" />
									</div>

									<h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
										{feature.title}
									</h3>
									<p className="text-gray-600 dark:text-gray-400 leading-relaxed">
										{feature.description}
									</p>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
