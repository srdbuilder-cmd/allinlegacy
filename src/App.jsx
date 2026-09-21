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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-5 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-5">
              <img
                src="https://i.imgur.com/jwCLJx2.png"
                alt="Strong Roots"
                className="h-auto max-h-20 object-contain"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Elder Care Financial Planner</h1>
                <p className="text-indigo-100">Should you build a casita, or choose professional care?</p>
              </div>
            </div>
            <img
              src="https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/file-uploads/themes/2161027940/settings_images/840367-2ba-6e3-507c-d715bbbed5d0_All_In_-_Logo_3.png"
              alt="All In"
              className="h-auto max-h-20 object-contain"
            />
          </div>
        </div>

        <div className="flex flex-nowrap gap-1 overflow-x-auto scrollbar-hide border-b-2 border-indigo-800 mb-6">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-2.5 text-sm font-semibold uppercase tracking-wide rounded-t-lg border-2 transition-colors ${
                  isActive
                    ? 'bg-indigo-800 text-white border-indigo-800'
                    : 'bg-white text-indigo-900 border-indigo-200 hover:bg-indigo-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
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
