import { Link } from "react-router-dom";

import FeatureBlock from "./FeatureBlock";

const Features = () => {
  return (
    <section className="bg-cream py-16">

      <FeatureBlock
        title="Log income and expenses."
        description="Track your income and expenses effortlessly in one place. Get a clear overview of your finances and make smarter financial decisions every day."
        buttonText="Get Started"
      />

      <FeatureBlock
        title="Categorize transactions and set budget limits."
        description="Automatically categorize transactions for smarter tracking. Create budget limits and monitor spending to manage money more effectively."
        buttonText="Try it now"
        reverse
      />

      <FeatureBlock
        title="Get regional tax estimates automatically"
        description="Receive tax estimates automatically according to your region. Avoid surprises and prepare better for upcoming tax payments."
        buttonText="Let's Go"
      />

      <FeatureBlock
        title="Monthly and quarterly financial summaries"
        description="Automatic monthly and quarterly financial summaries. Monitor performance and stay aligned with your financial goals effortlessly."
        buttonText="Let's Go"
        reverse
      />

    </section>
  );
};

export default Features;
