const Footer = () => {
  return (
    <footer className="relative bg-cream text-gray-800 pt-20 md:pt-28 pb-12 md:pb-16 overflow-hidden">

      {/* Left Soft Orange Background Design */}
      <div className="absolute left-0 top-0 w-96 h-96 bg-softOrange opacity-10 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/4"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* CTA Section */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Downloadable reports for{" "}
            <span className="relative inline-block">
              <span className="relative z-10">tax filing</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-gold opacity-40 -z-10 rounded"></span>
            </span>
          </h2>

          <p className="mt-6 text-base md:text-lg text-gray-600 leading-relaxed">
            Generate detailed financial reports ready for tax filing.
            Download and share organized reports anytime for easy documentation.
          </p>
        </div>

        {/* Links Section */}
        <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16">

          <div>
            <h3 className="font-semibold text-lg text-gray-900">TaxPal</h3>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              TaxPal helps freelancers and gig workers manage income,
              track expenses, and estimate quarterly taxes.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Product</h4>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li className="hover:text-primary cursor-pointer transition">Overview</li>
              <li className="hover:text-primary cursor-pointer transition">Pricing</li>
              <li className="hover:text-primary cursor-pointer transition">Customer stories</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Resources</h4>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li className="hover:text-primary cursor-pointer transition">Blog</li>
              <li className="hover:text-primary cursor-pointer transition">Guides & tutorials</li>
              <li className="hover:text-primary cursor-pointer transition">Help center</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Company</h4>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li className="hover:text-primary cursor-pointer transition">About us</li>
              <li className="hover:text-primary cursor-pointer transition">Careers</li>
              <li className="hover:text-primary cursor-pointer transition">Media kit</li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-peach mt-16 md:mt-20 pt-6 md:pt-8 flex flex-col md:flex-row justify-between text-sm text-gray-600">
          <p>© 2026 TaxPal LLC.</p>

          <div className="flex gap-6 md:gap-8 mt-4 md:mt-0">
            <span className="hover:text-primary cursor-pointer transition">Terms & privacy</span>
            <span className="hover:text-primary cursor-pointer transition">Security</span>
            <span className="hover:text-primary cursor-pointer transition">Status</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
