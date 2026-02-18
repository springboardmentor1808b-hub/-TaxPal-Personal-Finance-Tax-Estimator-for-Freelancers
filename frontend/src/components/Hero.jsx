import HeroCards from "./HeroCards";

const Hero = () => {
  return (
    <section className="bg-cream py-20">
      
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16">

        {/* Left Content */}
        <div className="max-w-xl text-center md:text-left">
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
            Personal Finance & Tax Estimator for Freelancers
          </h1>

          <p className="text-gray-600 mt-6 text-base md:text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
            TaxPal helps freelancers and gig workers manage income, track expenses,
            and estimate quarterly taxes.
          </p>

          <button className="bg-primary hover:bg-softOrange text-white px-6 py-3 rounded-lg transition shadow-md">
            Try TaxPal →
          </button>

        </div>

        {/* Right Cards */}
        <div className="mt-12 md:mt-0 w-full flex justify-center">
          <HeroCards />
        </div>

      </div>

    </section>
  );
};

export default Hero;
