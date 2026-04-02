import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  Target, 
  Clock, 
  BookOpen, 
  Zap, 
  Hash, 
  Percent, 
  ChevronRight, 
  ChevronDown,
  AlertTriangle,
  Flame,
  Trophy,
  BarChart3,
  Shapes,
  Variable
} from 'lucide-react';

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Section: React.FC<SectionProps> = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-ink/5 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 group hover:bg-bg-primary/50 transition-all px-4 -mx-4 rounded-sm"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-sm transition-colors ${isOpen ? 'bg-ink text-white' : 'bg-bg-primary text-ink/40 group-hover:text-ink'}`}>
            {icon}
          </div>
          <h3 className={`text-xl font-serif font-bold transition-colors ${isOpen ? 'text-ink' : 'text-ink/60 group-hover:text-ink'}`}>
            {title}
          </h3>
        </div>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={20} className="text-ink/20" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-8 pt-2 space-y-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-4">
    <h4 className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] border-b border-ink/5 pb-2">{title}</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);

const FormulaCard: React.FC<{ label: string; formula: string; note?: string }> = ({ label, formula, note }) => (
  <div className="p-4 bg-bg-primary border border-ink/5 rounded-sm space-y-1 group hover:border-accent-gold transition-colors">
    <div className="flex justify-between items-start">
      <span className="text-[10px] font-sans font-bold text-ink/40 uppercase tracking-wider">{label}</span>
      {note && <span className="text-[8px] font-sans font-medium text-accent-gold italic">{note}</span>}
    </div>
    <p className="text-sm font-mono font-bold text-ink group-hover:text-accent-gold transition-colors break-all">{formula}</p>
  </div>
);

const QuantitativeNotes = () => {
  const squares = Array.from({ length: 15 }, (_, i) => ({ n: i + 11, sq: (i + 11) ** 2 }));
  const cubes = Array.from({ length: 10 }, (_, i) => ({ n: i + 1, cu: (i + 1) ** 3 }));

  return (
    <div className="space-y-16 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <header className="space-y-6 border-b border-ink/5 pb-12">
        <div className="space-y-4">
          <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.3em]">Mathematical Compendium</span>
          <h1 className="text-4xl md:text-7xl font-serif font-bold text-ink leading-none tracking-tight">
            Quantitative<br />Reasoning.
          </h1>
          <p className="text-base md:text-xl font-sans text-ink/60 leading-relaxed max-w-2xl italic">
            A comprehensive guide to mathematical mastery, from core arithmetic 
            to advanced data interpretation and strategic execution.
          </p>
        </div>
      </header>

      <div className="space-y-4">
        <Section title="1. Arithmetic & Number Properties" icon={<Hash size={20} />} defaultOpen={true}>
          <div className="space-y-8">
            <SubSection title="Fractions & Decimals">
              <FormulaCard label="Addition/Subtraction" formula="a/b ± c/d = (ad ± bc)/bd" />
              <FormulaCard label="Multiplying" formula="(a/b) × (c/d) = ac/bd" />
              <FormulaCard label="Bow Tie Method" formula="a/b > c/d if ad > bc" note="Comparison" />
              <FormulaCard label="Terminating Decimals" formula="Denominator prime factors: 2s or 5s only" />
              <FormulaCard label="Leading Zeroes" formula="1/x has k-1 zeros (k digits in x)" note="k-2 if power of 10" />
            </SubSection>

            <SubSection title="Divisibility Rules">
              <FormulaCard label="Divisible by 3 & 9" formula="Sum of digits divisible by 3 or 9" />
              <FormulaCard label="Divisible by 4" formula="Last two digits divisible by 4" />
              <FormulaCard label="Divisible by 6" formula="Divisible by both 2 and 3" />
              <FormulaCard label="Divisible by 8" formula="Last three digits divisible by 8" />
              <FormulaCard label="Divisible by 11" formula="(Odd Sum) - (Even Sum) divisible by 11" />
            </SubSection>

            <SubSection title="Factors & Multiples">
              <FormulaCard label="Total Factors" formula="Prime factorize, add 1 to exponents, multiply" />
              <FormulaCard label="LCM & GCF Relation" formula="xy = LCM(x,y) × GCF(x,y)" />
              <FormulaCard label="Trailing Zeroes" formula="Count (5 × 2) pairs in prime factorization" />
              <FormulaCard label="Factorials" formula="n! ends in 0 for n ≥ 5" />
            </SubSection>

            <SubSection title="Patterns & Digits">
              <FormulaCard label="Units Digit Cycle (7)" formula="7, 9, 3, 1 (Cycle of 4)" />
              <FormulaCard label="Units Digit Cycle (2)" formula="2, 4, 8, 6 (Cycle of 4)" />
              <FormulaCard label="Units Digit Cycle (3)" formula="3, 9, 7, 1 (Cycle of 4)" />
              <FormulaCard label="Units Digit Cycle (8)" formula="8, 4, 2, 6 (Cycle of 4)" />
            </SubSection>
          </div>
        </Section>

        <Section title="2. Algebra & Equations" icon={<Variable size={20} />}>
          <div className="space-y-8">
            <SubSection title="Quadratic Identities">
              <FormulaCard label="Square of Sum" formula="(x + y)² = x² + 2xy + y²" />
              <FormulaCard label="Square of Difference" formula="(x - y)² = x² - 2xy + y²" />
              <FormulaCard label="Difference of Squares" formula="(x + y)(x - y) = x² - y²" />
            </SubSection>

            <SubSection title="Exponents & Radicals">
              <FormulaCard label="Like Bases" formula="xᵃ · xᵇ = xᵃ⁺ᵇ, xᵃ / xᵇ = xᵃ⁻ᵇ" />
              <FormulaCard label="Power to a Power" formula="(xᵃ)ᵇ = xᵃᵇ" />
              <FormulaCard label="Negative Exponents" formula="x⁻ʸ = 1/xʸ" />
              <FormulaCard label="Special Addition" formula="2ⁿ + 2ⁿ = 2ⁿ⁺¹" />
              <FormulaCard label="Radical Product" formula="√a × √b = √(ab)" />
              <FormulaCard label="Exponential Form" formula="ᵇ√(xᵃ) = xᵃ/ᵇ" />
            </SubSection>

            <SubSection title="Absolute Value & Solving">
              <FormulaCard label="Absolute Value Cases" formula="|x| = a → x = a or x = -a" />
              <FormulaCard label="Triangle Inequality" formula="|a + b| ≤ |a| + |b|" />
              <FormulaCard label="FOIL Method" formula="First, Outside, Inside, Last" />
              <FormulaCard label="Factoring x² + bx + c" formula="Find p, q: p·q=c, p+q=b" />
            </SubSection>
          </div>
        </Section>

        <Section title="3. Word Problems & Rates" icon={<Calculator size={20} />}>
          <div className="space-y-8">
            <SubSection title="Finance & Percentages">
              <FormulaCard label="Profit" formula="Total Revenue - Total Cost" />
              <FormulaCard label="Simple Interest" formula="V = P × R × T" />
              <FormulaCard label="Compound Interest" formula="A = P(1 + r/n)ⁿᵗ" />
              <FormulaCard label="Percent Change" formula="((Final - Initial)/Initial) × 100" />
              <FormulaCard label="Translations" formula="is/was(=), of(×), more than(+)" />
            </SubSection>

            <SubSection title="Rate, Time & Distance">
              <FormulaCard label="Distance" formula="D = R × T" />
              <FormulaCard label="Average Rate" formula="Total Distance / Total Time" />
              <FormulaCard label="Work Rate" formula="Rate × Time = Work" />
              <FormulaCard label="Combined Work" formula="Work₁ + Work₂ = Workₜₒₜₐₗ" note="1/t₁ + 1/t₂ = 1/tₜₒₜ" />
            </SubSection>
          </div>
        </Section>

        <Section title="4. Statistics, Probability & Counting" icon={<BarChart3 size={20} />}>
          <div className="space-y-8">
            <SubSection title="Statistics">
              <FormulaCard label="Average (Mean)" formula="Sum of terms / Number of terms" />
              <FormulaCard label="Weighted Average" formula="Σ(value × freq) / Total Frequency" />
              <FormulaCard label="Median Position" formula="(n+1)/2 if n is odd" />
              <FormulaCard label="Standard Deviation" formula="SD changes by factor k if all terms × k" note="+/- const = no change" />
            </SubSection>

            <SubSection title="Counting & Probability">
              <FormulaCard label="Combinations (nCk)" formula="n! / ((n-k)!k!)" note="Order doesn't matter" />
              <FormulaCard label="Permutations (nPk)" formula="n! / (n-k)!" note="Order matters" />
              <FormulaCard label="Circular Arrangement" formula="(k-1)!" />
              <FormulaCard label="Basic Probability" formula="Favorable / Total" />
              <FormulaCard label="Independent Events" formula="P(A) × P(B)" />
              <FormulaCard label="At Least 1 Rule" formula="1 - P(None)" />
            </SubSection>

            <SubSection title="Venn Diagrams">
              <FormulaCard label="Two Groups" formula="n(A ∪ B) = n(A) + n(B) - n(A ∩ B)" />
              <FormulaCard label="Three Groups" formula="Total = [Onlys] + [Doubles] + [Triple] + [Neither]" />
            </SubSection>
          </div>
        </Section>

        <Section title="5. Geometry" icon={<Shapes size={20} />}>
          <div className="space-y-8">
            <SubSection title="Triangles & Polygons">
              <FormulaCard label="Triangle Area" formula="(1/2) × base × height" />
              <FormulaCard label="Triangle Inequality" formula="Sum of 2 sides > 3rd side" />
              <FormulaCard label="45-45-90 Ratio" formula="1 : 1 : √2" />
              <FormulaCard label="30-60-90 Ratio" formula="1 : √3 : 2" />
              <FormulaCard label="Equilateral Area" formula="(s²√3)/4" />
              <FormulaCard label="Interior Angle Sum" formula="(n-2) × 180" />
              <FormulaCard label="Regular Int. Angle" formula="180(n-2)/n" />
              <FormulaCard label="Exterior Angle Sum" formula="360°" note="Always" />
              <FormulaCard label="Trapezoid Area" formula="((b₁ + b₂)/2) × h" />
              <FormulaCard label="Altitude Rule" formula="(part hyp)/alt = alt/(other part hyp)" />
              <FormulaCard label="Leg Rule" formula="hyp/leg = leg/projection" />
            </SubSection>

            <SubSection title="Circles">
              <FormulaCard label="Area & Circumference" formula="A = πr², C = 2πr" />
              <FormulaCard label="Sector Area" formula="(angle/360) × πr²" />
              <FormulaCard label="Arc Length" formula="(angle/360) × 2πr" />
              <FormulaCard label="Central vs Inscribed" formula="Central = arc, Inscribed = 1/2 arc" />
              <FormulaCard label="Circle Equation" formula="(x-h)² + (y-k)² = r²" note="Center (h,k)" />
              <FormulaCard label="Intersecting Chords" formula="part1 · part2 = part3 · part4" />
              <FormulaCard label="Secant-Secant" formula="whole1 · ext1 = whole2 · ext2" />
              <FormulaCard label="Secant-Tangent" formula="whole · ext = tangent²" />
            </SubSection>

            <SubSection title="3-D Figures">
              <FormulaCard label="Cylinder" formula="V = πr²h, SA = 2πrh + 2πr²" />
              <FormulaCard label="Rectangular Solid" formula="V = LWH, Diag = √(L² + W² + H²)" />
              <FormulaCard label="Prism & Pyramid" formula="V_prism = Bh, V_pyramid = (1/3)Bh" />
              <FormulaCard label="Cone & Sphere" formula="V_cone = (1/3)πr²h, V_sphere = (4/3)πr³" />
              <FormulaCard label="Sphere SA" formula="SA = 4πr²" />
            </SubSection>
          </div>
        </Section>

        <Section title="6. Coordinate Geometry & Transformations" icon={<Target size={20} />}>
          <div className="space-y-8">
            <SubSection title="Lines & Points">
              <FormulaCard label="Slope (m)" formula="(y₂ - y₁) / (x₂ - x₁)" />
              <FormulaCard label="Slope-Intercept" formula="y = mx + b" />
              <FormulaCard label="Point-Slope" formula="y - y₁ = m(x - x₁)" />
              <FormulaCard label="Distance Formula" formula="d = √((x₂-x₁)² + (y₂-y₁)²)" />
              <FormulaCard label="Midpoint Formula" formula="((x₁+x₂)/2, (y₁+y₂)/2)" />
              <FormulaCard label="Perpendicular Slopes" formula="m₁ × m₂ = -1" note="Negative Reciprocals" />
            </SubSection>

            <SubSection title="Transformations">
              <FormulaCard label="Reflect x-axis" formula="(x, y) → (x, -y)" />
              <FormulaCard label="Reflect y-axis" formula="(x, y) → (-x, y)" />
              <FormulaCard label="Reflect y = x" formula="(x, y) → (y, x)" />
              <FormulaCard label="Reflect y = -x" formula="(x, y) → (-y, -x)" />
              <FormulaCard label="Reflect Origin" formula="(x, y) → (-x, -y)" />
              <FormulaCard label="Rotation 90°" formula="(x, y) → (-y, x)" />
              <FormulaCard label="Rotation 180°" formula="(x, y) → (-x, -y)" />
              <FormulaCard label="Rotation 270°" formula="(x, y) → (y, -x)" />
              <FormulaCard label="Dilation" formula="(x, y) → (kx, ky)" />
            </SubSection>
          </div>
        </Section>

        <Section title="7. Functions & Sequences" icon={<Zap size={20} />}>
          <div className="space-y-8">
            <SubSection title="Sequences">
              <FormulaCard label="Arithmetic n-th term" formula="aₙ = a₁ + (n-1)d" />
              <FormulaCard label="Arithmetic Sum" formula="Sₙ = n(a₁ + aₙ)/2" />
              <FormulaCard label="Geometric n-th term" formula="aₙ = a₁ × rⁿ⁻¹" />
            </SubSection>
          </div>
        </Section>

        <Section title="8. Essential Values to Memorize" icon={<Zap size={20} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Squares (11-25)</h4>
              <div className="grid grid-cols-3 gap-2">
                {squares.map(({ n, sq }) => (
                  <div key={n} className="p-3 bg-bg-primary border border-ink/5 rounded-sm text-center group hover:border-accent-gold transition-colors">
                    <span className="block text-[10px] font-sans font-bold text-ink/30 uppercase tracking-tighter mb-1">{n}²</span>
                    <span className="text-lg font-serif font-bold text-ink group-hover:text-accent-gold transition-colors">{sq}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Cubes (1-10)</h4>
              <div className="grid grid-cols-2 gap-2">
                {cubes.map(({ n, cu }) => (
                  <div key={n} className="p-3 bg-bg-primary border border-ink/5 rounded-sm flex justify-between items-center px-4 group hover:border-blue-500 transition-colors">
                    <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-tighter">{n}³</span>
                    <span className="text-lg font-serif font-bold text-ink group-hover:text-blue-500 transition-colors">{cu}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section title="9. Strategic Preparation" icon={<Target size={20} />}>
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { phase: "Phase 1", weeks: "Weeks 1-4", focus: "Accuracy", desc: "Building basic concepts and ensuring precision." },
                { phase: "Phase 2", weeks: "Weeks 5-6", focus: "Agility", desc: "Advanced concepts and mental flexibility between sections." },
                { phase: "Phase 3", weeks: "Weeks 7-8", focus: "Stamina", desc: "Time management through full-length practice tests." }
              ].map((p, i) => (
                <div key={i} className="p-6 bg-white border border-ink/5 rounded-sm space-y-4 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-accent-gold transform -translate-x-full group-hover:translate-x-0 transition-transform" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.2em]">{p.phase}</span>
                    <h5 className="text-xl font-serif font-bold text-ink">{p.focus}</h5>
                  </div>
                  <p className="text-xs font-sans text-ink/60 leading-relaxed">{p.desc}</p>
                  <span className="block text-[10px] font-sans font-bold text-ink/20 uppercase tracking-widest">{p.weeks}</span>
                </div>
              ))}
            </div>

            <div className="p-8 bg-bg-primary border border-ink/5 rounded-sm space-y-6">
              <h4 className="text-xs font-sans font-bold text-ink uppercase tracking-[0.2em] flex items-center gap-2">
                <Flame size={16} className="text-accent-gold" />
                Preparation Philosophy
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <h5 className="text-sm font-sans font-bold text-ink">Identify Your Starting Point</h5>
                  <p className="text-xs font-sans text-ink/60 leading-relaxed">Take a diagnostic test early to perform an in-depth analysis of your current grasp of the material.</p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-sm font-sans font-bold text-ink">Prioritize High-Yield Topics</h5>
                  <p className="text-xs font-sans text-ink/60 leading-relaxed">Categorize topics by difficulty and frequency. Invest time in topics that are difficult and frequently tested.</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section title="10. Essential Study Tactics" icon={<Calculator size={20} />}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border border-ink/5 rounded-sm space-y-4">
                <h4 className="text-sm font-sans font-bold text-ink uppercase tracking-widest border-b border-ink/5 pb-2">The Error Log</h4>
                <p className="text-xs font-sans text-ink/60 leading-relaxed italic">
                  "Maintain a detailed file of every question you get wrong. Note the specific traps you fell for."
                </p>
                <ul className="text-xs font-sans text-ink/60 space-y-2 list-disc list-inside marker:text-ink/20">
                  <li>Distinguish between conceptual gaps vs. application errors.</li>
                  <li>Analyze correct answers for time efficiency.</li>
                  <li>Identify "silly errors" vs. systematic mistakes.</li>
                </ul>
              </div>

              <div className="p-6 border border-ink/5 rounded-sm space-y-4">
                <h4 className="text-sm font-sans font-bold text-ink uppercase tracking-widest border-b border-ink/5 pb-2">Study Rhythm</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-bg-primary flex items-center justify-center text-ink font-serif font-bold text-xs">1.5h</div>
                    <p className="text-xs font-sans text-ink/60 leading-relaxed">Optimal study slots of 1.5 to 2 hours, 5-6 days a week.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-bg-primary flex items-center justify-center text-ink font-serif font-bold text-xs">5x</div>
                    <p className="text-xs font-sans text-ink/60 leading-relaxed">Spiral learning: Revisit basic ideas repeatedly until mastery.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section title="11. Test-Day Realities" icon={<Clock size={20} />}>
          <div className="p-8 bg-ink text-white rounded-sm space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
              <div className="space-y-6">
                <h4 className="text-xs font-sans font-bold text-accent-gold uppercase tracking-[0.2em]">Section Breakdown</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-sm font-serif">Section 1</span>
                    <span className="text-xs font-sans font-bold">12 Questions / 18 Mins</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-sm font-serif">Section 2</span>
                    <span className="text-xs font-sans font-bold">15 Questions / 23 Mins</span>
                  </div>
                </div>
                <p className="text-[10px] font-sans text-white/40 leading-relaxed italic">
                  * Performance on Section 1 determines the difficulty of Section 2.
                </p>
              </div>

              <div className="space-y-6">
                <h4 className="text-xs font-sans font-bold text-accent-gold uppercase tracking-[0.2em]">Quick Facts</h4>
                <ul className="text-xs font-sans text-white/60 space-y-3">
                  <li className="flex items-start gap-2">
                    <ChevronRight size={14} className="text-accent-gold shrink-0 mt-0.5" />
                    <span>No negative marking for incorrect answers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={14} className="text-accent-gold shrink-0 mt-0.5" />
                    <span>Question formats: QC, MC (one or more), and Numeric Entry.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={14} className="text-accent-gold shrink-0 mt-0.5" />
                    <span>Total exam duration: 1 hour and 58 minutes.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 flex items-center gap-4">
              <AlertTriangle size={20} className="text-accent-gold" />
              <p className="text-sm font-serif italic text-white/80">
                "The GRE is a test of endurance. Practice tests should be taken in a single sitting."
              </p>
            </div>
          </div>
        </Section>
      </div>

      <footer className="pt-12 border-t border-ink/5 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-bg-primary rounded-full border border-ink/5">
          <Trophy size={16} className="text-accent-gold" />
          <span className="text-[10px] font-sans font-bold text-ink/40 uppercase tracking-[0.2em]">Mastery is a marathon, not a sprint.</span>
        </div>
      </footer>
    </div>
  );
};

export default QuantitativeNotes;
