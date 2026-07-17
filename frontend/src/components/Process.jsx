import React, { useState } from 'react';

export default function Process() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: '01 Discovery Call',
      desc: "In the first stage, we'll have a Discovery Call to discuss your goals, needs, and project requirements. This helps us align our vision and set the foundation for a successful collaboration."
    },
    {
      id: 2,
      title: '02 Design Sprint',
      desc: "We map user journeys, run low-fidelity wireframing exercises, and lock down structural styling parameters before writing a single line of production code."
    },
    {
      id: 3,
      title: '03 Code Architecture',
      desc: "Translating the layout to clean React hooks, configuring custom Tailwind extensions, and optimizing GPU composition layers for zero layout shifts."
    },
    {
      id: 4,
      title: '04 QA & Testing',
      desc: "Rigorous viewport audits across responsive screen thresholds, testing component accessibility patterns, and validating network controllers."
    },
    {
      id: 5,
      title: '05 Handover',
      desc: "Bundling source code, running lighthouse build optimization profiles, setting up hosting instances, and launching final deliverables."
    }
  ];

  const currentStep = steps.find(s => s.id === activeStep) || steps[0];

  return (
    <div className="lg:col-span-8 bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 md:p-10 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 min-h-[460px] flex flex-col justify-between bento-transition explode-level-1">
      <div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">How I work</span>
          <span className="text-xs font-mono text-brand-orange font-semibold" id="process-label">PROCESS ENGINE</span>
        </div>

        <div className="min-h-[140px] pt-4" id="step-content-box">
          <h3 id="step-title" className="font-syne font-bold text-2xl text-zinc-950 dark:text-white bento-transition">
            {currentStep.title}
          </h3>
          <p id="step-desc" className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mt-4 max-w-xl bento-transition">
            {currentStep.desc}
          </p>
        </div>
      </div>

      <div className="border-t border-zinc-100 dark:border-zinc-800/40 pt-6 mt-6">
        <div className="flex flex-wrap gap-2 md:gap-3">
          {steps.map(step => (
            <button 
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              id={`step-btn-${step.id}`}
              className={`step-btn px-4 py-2.5 rounded-full text-xs font-semibold bento-transition ${
                activeStep === step.id 
                  ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-sm' 
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'
              }`}
            >
              Step 0{step.id}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
