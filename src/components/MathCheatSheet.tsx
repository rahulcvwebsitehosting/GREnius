import React from 'react';
import { motion } from 'motion/react';
import { Book, Zap, Hash, Percent, ArrowRight, X } from 'lucide-react';

interface MathCheatSheetProps {
  onClose: () => void;
}

const MathCheatSheet: React.FC<MathCheatSheetProps> = ({ onClose }) => {
  const sections = [
    {
      title: "Exponent Laws",
      icon: <Zap className="text-accent-gold" size={20} />,
      content: [
        { label: "Product Rule", formula: "xᵃ · xᵇ = xᵃ⁺ᵇ", example: "2³ · 2⁴ = 2⁷" },
        { label: "Quotient Rule", formula: "xᵃ / xᵇ = xᵃ⁻ᵇ", example: "5⁹ / 5³ = 5⁶" },
        { label: "Power of Power", formula: "(xᵃ)ᵇ = xᵃᵇ", example: "(3²)⁴ = 3⁸" },
        { label: "Zero Power", formula: "x⁰ = 1", example: "99⁰ = 1" },
        { label: "Negative Power", formula: "x⁻ᵃ = 1/xᵃ", example: "2⁻³ = 1/8" },
      ]
    },
    {
      title: "Powers of Two",
      icon: <Hash className="text-blue-500" size={20} />,
      description: "Essential for binary logic, doubling problems, and exponential growth.",
      content: [
        { label: "2¹", formula: "2", example: "2¹ = 2" },
        { label: "2²", formula: "4", example: "2² = 4" },
        { label: "2³", formula: "8", example: "2³ = 8" },
        { label: "2⁴", formula: "16", example: "2⁴ = 16" },
        { label: "2⁵", formula: "32", example: "2⁵ = 32" },
        { label: "2⁶", formula: "64", example: "2⁶ = 64" },
        { label: "2⁷", formula: "128", example: "2⁷ = 128" },
        { label: "2⁸", formula: "256", example: "2⁸ = 256" },
        { label: "2⁹", formula: "512", example: "2⁹ = 512" },
        { label: "2¹⁰", formula: "1,024", example: "2¹⁰ = 1,024" },
      ]
    },
    {
      title: "Units Digit Cycles",
      icon: <Book className="text-purple-500" size={20} />,
      content: [
        { label: "Base 2", formula: "2, 4, 8, 6", example: "Repeats every 4" },
        { label: "Base 3", formula: "3, 9, 7, 1", example: "Repeats every 4" },
        { label: "Base 7", formula: "7, 9, 3, 1", example: "Repeats every 4" },
        { label: "Base 8", formula: "8, 4, 2, 6", example: "Repeats every 4" },
      ]
    },
    {
      title: "Common Fractions",
      icon: <Percent className="text-teal-500" size={20} />,
      content: [
        { label: "1/8", formula: "0.125", example: "12.5%" },
        { label: "1/6", formula: "0.166...", example: "16.67%" },
        { label: "3/8", formula: "0.375", example: "37.5%" },
        { label: "5/8", formula: "0.625", example: "62.5%" },
        { label: "7/8", formula: "0.875", example: "87.5%" },
      ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-sm border border-ink/5 shadow-2xl overflow-hidden max-w-4xl mx-auto"
    >
      <div className="p-6 border-b border-ink/5 flex items-center justify-between bg-bg-primary">
        <div className="flex items-center gap-3">
          <Book className="text-accent-gold" size={24} />
          <h2 className="text-xl font-serif font-bold text-ink tracking-tight">Quantitative Cheat Sheet</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-ink/5 rounded-full transition-colors">
          <X size={20} className="text-ink/40" />
        </button>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-6">
            <div className="flex flex-col border-b border-ink/5 pb-2">
              <div className="flex items-center gap-2">
                {section.icon}
                <h3 className="text-sm font-sans font-bold text-ink uppercase tracking-[0.2em]">{section.title}</h3>
              </div>
              {'description' in section && (
                <p className="text-[10px] font-sans font-medium text-ink/40 mt-1 italic leading-relaxed">
                  {section.description as string}
                </p>
              )}
            </div>
            <div className="space-y-4">
              {section.content.map((item, i) => (
                <div key={i} className="flex flex-col gap-1 group">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-sans font-bold text-ink/40 uppercase tracking-wider">{item.label}</span>
                    <span className="text-[10px] font-sans font-medium text-accent-gold italic opacity-0 group-hover:opacity-100 transition-opacity">e.g. {item.example}</span>
                  </div>
                  <p className="text-lg font-serif font-bold text-ink">{item.formula}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-bg-primary border-t border-ink/5 text-center">
        <p className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">
          Pro Tip: Look for patterns, not calculations.
        </p>
      </div>
    </motion.div>
  );
};

export default MathCheatSheet;
