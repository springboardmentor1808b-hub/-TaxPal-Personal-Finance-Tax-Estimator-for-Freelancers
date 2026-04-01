import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { card, dashboard } from '../assets/assets';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navbar />
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        <div className="flex items-center px-8 lg:px-16 xl:px-24 py-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-200/30 to-transparent"></div>
          <div className="max-w-2xl relative z-10">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
              ✨ New: AI-Powered Tax Insights
            </div>
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 leading-[1.2] bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent py-2">
              Tax management for freelancers
            </h1>
            <p className="text-lg lg:text-xl text-gray-700 mb-8 leading-relaxed">
              Track income, manage expenses, and estimate quarterly taxes—all in one simple platform built for gig workers and freelancers.
            </p>
            <div className="flex flex-wrap gap-4 mb-6">
              <Link to="/signup" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-xl font-semibold inline-flex items-center gap-2 transform hover:scale-105 transition-all">
                Get started free
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link to="/login" className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-semibold">
                Sign in
              </Link>
            </div>
            <p className="text-sm text-gray-600">
              Free to use • No credit card required
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center p-8 relative">
          <div className="absolute top-20 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          <div className="w-3/4 h-3/4 rounded-2xl overflow-hidden shadow-2xl relative z-10 ring-4 ring-purple-200">
            <img 
              src={card} 
              alt="Freelancer" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-b from-white via-purple-50 to-pink-50 py-20 px-8 border-t border-purple-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent py-2">
              Everything you need to stay organized
            </h2>
            <p className="text-lg text-gray-700">
              Simple tools to manage your finances and stay on top of your taxes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-green-200 hover:shadow-2xl hover:scale-105 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Income & Expense Tracking</h3>
              <p className="text-gray-600">
                Categorize and log all your transactions manually. Keep your finances organized in one place.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-blue-200 hover:shadow-2xl hover:scale-105 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Quarterly Tax Estimates</h3>
              <p className="text-gray-600">
                Automatically calculate estimated quarterly taxes based on your income and expenses.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-purple-200 hover:shadow-2xl hover:scale-105 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Financial Reports</h3>
              <p className="text-gray-600">
                Download detailed reports for tax time or whenever you need a financial overview.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Three-Step Process Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent py-2">
              Simple three-step process
            </h2>
            <p className="text-lg text-gray-700">
              Get started in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Create your account</h3>
              <p className="text-gray-600">
                Sign up with your basic information and you're ready to go.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Log transactions</h3>
              <p className="text-gray-600">
                Manually enter your income and expenses with categories for easy tracking.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">View your dashboard</h3>
              <p className="text-gray-600">
                Monitor your finances and get quarterly tax estimates at a glance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Freelancer Features Section */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-20 px-8 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent py-2">
                Built specifically for freelancers and gig workers
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                TaxPal understands the unique financial challenges of freelance work. No complicated features you don't need—just the essentials.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 text-gray-900">Categorized transaction logging</h3>
                    <p className="text-gray-600">Organize income and expenses by category for better insights</p>
                  </div>
                </div>

                <div className="flex gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 text-gray-900">Budget tracking</h3>
                    <p className="text-gray-600">Stay on top of your spending and income goals</p>
                  </div>
                </div>

                <div className="flex gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 text-gray-900">Downloadable reports</h3>
                    <p className="text-gray-600">Export your financial data whenever you need it</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl ring-4 ring-teal-200">
                <img 
                  src={dashboard} 
                  alt="Financial dashboard on tablet" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 py-20 px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-yellow-300 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white drop-shadow-lg">
            Take control of your finances today
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Join freelancers who are staying organized and tax-ready with TaxPal
          </p>
          <Link 
            to="/signup" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-bold text-lg shadow-2xl hover:scale-105 transition-all"
          >
            Get started free
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-gray-300 py-12 px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">TaxPal</span>
              </div>
              <p className="text-sm text-gray-400">
                Financial management for freelancers and gig workers.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-purple-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p className="text-gray-400">&copy; 2026 TaxPal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
