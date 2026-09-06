import React from 'react';
import {
  HelpCircle,
  Mic,
  Clock,
  CheckCircle2,
  Award,
  BookOpen,
  BarChart2,
  ShieldCheck
} from 'lucide-react';

interface FeatureCard {
  icon: React.ElementType;
  title: string;
  description: string;
}

const features: FeatureCard[] = [
  {
    icon: HelpCircle,
    title: 'AI-Powered Practice',
    description:
      'Practice with realistic AI mock interview practice sessions designed around real hiring workflows, not generic scripts.'
  },
  {
    icon: Mic,
    title: 'Speech Analysis',
    description:
      'Get detailed feedback on clarity, pacing, filler words, and confidence so every mock interview AI session leads to measurable improvement.'
  },
  {
    icon: Clock,
    title: '24/7 Access',
    description:
      'Practice anytime, anywhere with AI interview practice free options and instant feedback whenever you need it.'
  },
  {
    icon: CheckCircle2,
    title: 'Real Interview Questions',
    description:
      'Train with role-specific questions pulled from real interviews, making your AI interview preparation relevant and practical.'
  },
  {
    icon: Award,
    title: 'Personalized Coaching',
    description:
      'Receive a customized coaching path targeting your specific areas of improvement after every practice round.'
  },
  {
    icon: BookOpen,
    title: 'Learning Resources',
    description:
      'Access expert-led guides and structured content that support both technical and behavioral interview readiness.'
  },
  {
    icon: BarChart2,
    title: 'Progress Tracking',
    description:
      'Track growth across every AI mock session with detailed score analytics, structural breakdowns, and streak stats.'
  },
  {
    icon: ShieldCheck,
    title: 'SOC 2 Certified Security',
    description:
      'Your interview responses and user data are protected with enterprise-grade SOC 2 certified security standards.'
  }
];

const WhyChooseSection: React.FC = () => {
  return (
    <section className="bg-white rounded-3xl p-8 sm:p-12 border-0 shadow-2xs space-y-10 text-slate-900 w-full">
      {/* ── Section Header ── */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Why Interview Coach Beats Other AI Interview Platforms
        </h2>
        <p className="text-sm sm:text-base text-slate-500 font-normal leading-relaxed">
          Everything you need to practice smarter, improve faster, and walk into every interview with real confidence.
        </p>
      </div>

      {/* ── Feature Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {features.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.title}
              className="bg-slate-50/80 rounded-2xl p-6 border-0 hover:bg-slate-100/90 transition-colors flex flex-col items-start justify-between min-h-[250px]"
            >
              <div>
                {/* Icon Circle */}
                <div className="w-12 h-12 rounded-full bg-white shadow-2xs flex items-center justify-center mb-6 text-slate-800">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 mb-2.5 leading-snug">
                  {feat.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};


export default WhyChooseSection;

