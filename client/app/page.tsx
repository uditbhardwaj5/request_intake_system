import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          AI-Powered Request Intake
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Submit your requests and let our AI automatically categorize, summarize, and prioritize them for faster resolution.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/submit"
            className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
          >
            Submit a Request
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-colors inline-flex items-center gap-2"
          >
            View Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur">
            <h3 className="text-lg font-semibold mb-2">🤖 AI-Powered</h3>
            <p className="text-blue-100">Automatic categorization and analysis</p>
          </div>
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur">
            <h3 className="text-lg font-semibold mb-2">⚡ Real-time</h3>
            <p className="text-blue-100">Instant request processing and insights</p>
          </div>
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur">
            <h3 className="text-lg font-semibold mb-2">📊 Dashboard</h3>
            <p className="text-blue-100">Filter and manage all your requests</p>
          </div>
        </div>
      </div>
    </div>
  );
}
