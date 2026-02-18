const FeatureBlock = ({ title, description, buttonText, reverse }) => {
  return (
    <div className="max-w-7xl mx-auto px-6">

      <div
        className={`flex flex-col ${
          reverse ? "md:flex-row-reverse" : "md:flex-row"
        } items-center gap-12 md:gap-20 py-16 md:py-28`}
      >

        {/* Text */}
        <div className="max-w-xl text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
            {title}
          </h2>

          <p className="text-gray-600 mt-6 text-base md:text-lg leading-relaxed">
            {description}
          </p>

          <button className="mt-8 bg-primary hover:bg-softOrange transition text-white px-6 md:px-8 py-3 rounded-xl font-medium shadow-md">
            {buttonText} →
          </button>
        </div>

        {/* Circular Graphic */}
        <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] flex items-center justify-center">

          {/* Outer Dashed Circle */}
          <div className="absolute w-full h-full rounded-full border border-dashed border-blue-300"></div>

          {/* Inner Dashed Circle */}
          <div className="absolute w-[70%] h-[70%] rounded-full border border-dashed border-blue-300"></div>

          {/* Center Icon */}
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center z-10">
            <span className="text-2xl md:text-3xl text-blue-500">⌁</span>
          </div>

          {/* Floating Dots (auto scale) */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 md:w-12 md:h-12 bg-yellow-400 rounded-full"></div>
          <div className="absolute top-20 right-6 w-8 h-8 md:w-12 md:h-12 bg-blue-500 rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-8 h-8 md:w-12 md:h-12 bg-green-500 rounded-full"></div>
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-8 h-8 md:w-12 md:h-12 bg-orange-400 rounded-full"></div>
          <div className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-red-400 rounded-full"></div>

        </div>

      </div>

    </div>
  );
};

export default FeatureBlock;
