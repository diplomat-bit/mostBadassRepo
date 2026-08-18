// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/plans/PlanList.tsx
================================================================================

import React from 'react';
import PlanCard from './PlanCard';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  ctaText: string;
}

interface PlanListProps {
  plans: Plan[];
}

const PlanList: React.FC<PlanListProps> = ({ plans }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          name={plan.name}
          price={plan.price}
          features={plan.features}
          ctaText={plan.ctaText}
        />
      ))}
    </div>
  );
};

export default PlanList;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/plans/PlanList.tsx
================================================================================

import React from 'react';
import PlanCard from './PlanCard';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  ctaText: string;
}

interface PlanListProps {
  plans: Plan[];
}

const PlanList: React.FC<PlanListProps> = ({ plans }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          name={plan.name}
          price={plan.price}
          features={plan.features}
          ctaText={plan.ctaText}
        />
      ))}
    </div>
  );
};

export default PlanList;

================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/plans/PlanList.tsx
================================================================================

import React from 'react';
import PlanCard from './PlanCard';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  ctaText: string;
}

interface PlanListProps {
  plans: Plan[];
}

const PlanList: React.FC<PlanListProps> = ({ plans }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          name={plan.name}
          price={plan.price}
          features={plan.features}
          ctaText={plan.ctaText}
        />
      ))}
    </div>
  );
};

export default PlanList;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/plans/PlanList.tsx
================================================================================

import React from 'react';
import PlanCard from './PlanCard';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  ctaText: string;
}

interface PlanListProps {
  plans: Plan[];
}

const PlanList: React.FC<PlanListProps> = ({ plans }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          name={plan.name}
          price={plan.price}
          features={plan.features}
          ctaText={plan.ctaText}
        />
      ))}
    </div>
  );
};

export default PlanList;