import { useMemo, useState } from 'react';
import { usePlanState } from './state/usePlanState.js';
import { projectAllScenarios } from './lib/projection.js';
import { compareScenarios } from './lib/compare.js';
import DecisionTab from './components/tabs/DecisionTab.jsx';
import SituationTab from './components/tabs/SituationTab.jsx';
import ScenariosTab from './components/tabs/ScenariosTab.jsx';
import ProjectionTab from './components/tabs/ProjectionTab.jsx';
import DefaultsTab from './components/tabs/DefaultsTab.jsx';

const TABS = [
  { id: 'decision', label: 'Decision' },
  { id: 'situation', label: 'Your Situation' },
  { id: 'scenarios', label: 'Scenarios' },
  { id: 'projection', label: 'Projection' },
  { id: 'defaults', label: 'Defaults' },
];

export default function App() {
  const planState = usePlanState();
  const [activeTab, setActiveTab] = useState('decision');

  const results = useMemo(() => projectAllScenarios(planState.inputs), [planState.inputs]);
  const comparison = useMemo(() => compareScenarios(results), [results]);

  const setters = {
    setCareCosts: planState.setCareCosts,
    setCasita: planState.setCasita,
    setNewHome: planState.setNewHome,
    setRental: planState.setRental,
    setEconomics: planState.setEconomics,
    setHomeCareHours: planState.setHomeCareHours,
    setSellingCostPct: planState.setSellingCostPct,
    setScenario1Rental: planState.setScenario1Rental,
    setScenario2Rental: planState.setScenario2Rental,
    setScenario3Rental: planState.setScenario3Rental,
    setScenario3ManualDP: planState.setScenario3ManualDP,
  };

  return (
    <div className="min-h-screen bg-primary font-body">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="sticky top-0 z-50 -mx-4 -mt-4 bg-primary border-b border-[#C8BCA6]">
          <div className="px-4 pt-4 pb-2">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center justify-center gap-3 flex-1 min-w-0">
                <img
                  src="/assets/brand/badges/badge-color.png"
                  alt="Strong Roots"
                  className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 object-contain"
                />
                <div className="flex flex-col items-center justify-center flex-1 min-w-0">
                  <h1 className="font-display uppercase tracking-wide text-xl sm:text-2xl font-normal text-brandBlack leading-tight text-center">
                    All In Legacy
                  </h1>
                  <h2 className="text-sm sm:text-base text-secondary leading-tight text-center">
                    Elder Care Financial Planner
                  </h2>
                </div>
              </div>
              <img
                src="https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/file-uploads/themes/2161027940/settings_images/840367-2ba-6e3-507c-d715bbbed5d0_All_In_-_Logo_3.png"
                alt="All In"
                className="h-auto max-h-16 object-contain mx-auto md:mx-0"
              />
            </div>
          </div>

          <div className="bg-[#EDE7DB]">
            <div className="flex flex-nowrap gap-0.5 border-b-2 border-forest overflow-x-auto scrollbar-hide p-1.5">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 py-1.5 px-3 text-sm font-display uppercase tracking-wide font-normal rounded-t-lg border-2 transition-colors whitespace-nowrap ${
                      isActive
                        ? 'text-white border-forestDeep bg-forestDeep'
                        : 'text-forestDeep border-[#C8BCA6] bg-beigeLight hover:bg-primary'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {activeTab === 'decision' && <DecisionTab results={results} comparison={comparison} />}
        {activeTab === 'situation' && (
          <SituationTab plan={planState.plan} setGen1={planState.setGen1} setGen2={planState.setGen2} />
        )}
        {activeTab === 'scenarios' && <ScenariosTab plan={planState.plan} setters={setters} />}
        {activeTab === 'projection' && (
          <ProjectionTab results={results} sellingCostPct={planState.plan.sellingCostPct} />
        )}
        {activeTab === 'defaults' && (
          <DefaultsTab plan={planState.plan} setters={setters} onReset={planState.resetToDefaults} />
        )}
      </div>
    </div>
  );
}
