import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Timer, CheckCircle2, X, ArrowRight, Brain } from 'lucide-react';
import { recordQuizResult, playSound, fireConfetti, awardXP, getStorage, STORAGE_KEYS, XP_REWARDS } from '../utils';
import { Mistake } from '../types';
import { GameAnalysis } from './GameAnalysis';

interface MentalMathProps {
  onXpChange: (xp: number) => void;
  onClose: () => void;
}

type Question = {
  text: string;
  answer: string | string[];
  explanation: string;
};

const MentalMath: React.FC<MentalMathProps> = ({ onXpChange, onClose }) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const timerRef = useRef<any>(null);
  const soundEnabled = getStorage(STORAGE_KEYS.settings, { soundEnabled: true }).soundEnabled;

  const generateQuestion = (): Question => {
    const types = [
      'exponent_laws',
      'exponent_addition',
      'square',
      'cube',
      'root',
      'cube_root',
      'percent',
      'percent_change',
      'fraction_convert',
      'ratios_distribute',
      'ratios_simplify',
      'algebra_linear',
      'algebra_diff_squares',
      'divisibility_remainder',
      'prime_check',
      'prime_factors',
      'stats_average',
      'stats_missing_avg',
      'stats_median',
      'prob_dice',
      'prob_coins',
      'prob_combinatorics',
      'geom_triangle_angles',
      'geom_pythagorean',
      'geom_perimeter_area',
      'geom_interior_angles',
      'seq_arithmetic',
      'seq_geometric',
      'seq_sum_integers'
    ];
    const type = types[Math.floor(Math.random() * types.length)];

    switch (type) {
      case 'exponent_laws': {
        const base = [2, 3, 5][Math.floor(Math.random() * 3)];
        const subType = Math.floor(Math.random() * 4);
        if (subType === 0) {
          const a = Math.floor(Math.random() * 4) + 2;
          const b = Math.floor(Math.random() * 3) + 2;
          return {
            text: `Find k: (${base}^${a})^${b} = ${base}^k`,
            answer: (a * b).toString(),
            explanation: `Using the power rule of exponents, (x^a)^b = x^(a*b). Therefore, k = ${a} * ${b} = ${a * b}.`
          };
        } else if (subType === 1) {
          const a = Math.floor(Math.random() * 5) + 2;
          const b = Math.floor(Math.random() * 5) + 2;
          return {
            text: `Find k: ${base}^${a} × ${base}^${b} = ${base}^k`,
            answer: (a + b).toString(),
            explanation: `Using the product rule of exponents, x^a * x^b = x^(a+b). Therefore, k = ${a} + ${b} = ${a + b}.`
          };
        } else if (subType === 2) {
          const a = Math.floor(Math.random() * 5) + 6;
          const b = Math.floor(Math.random() * 4) + 2;
          return {
            text: `Find k: ${base}^${a} / ${base}^${b} = ${base}^k`,
            answer: (a - b).toString(),
            explanation: `Using the quotient rule of exponents, x^a / x^b = x^(a-b). Therefore, k = ${a} - ${b} = ${a - b}.`
          };
        } else {
          const a = Math.floor(Math.random() * 4) + 2;
          const secondBase = base === 2 ? 5 : 2;
          const combinedBase = secondBase * base;
          return {
            text: `Find k: ${base}^${a} × ${secondBase}^${a} = ${combinedBase}^k`,
            answer: a.toString(),
            explanation: `Using the power of a product rule, x^a * y^a = (x*y)^a. Therefore, k = ${a}.`
          };
        }
      }
      case 'exponent_addition': {
        const base = [2, 3, 5][Math.floor(Math.random() * 3)];
        const n = Math.floor(Math.random() * 5) + 2;
        const count = base;
        const text = Array(count).fill(`${base}^${n}`).join(' + ');
        const numericalValue = Math.pow(base, n + 1);
        return {
          text: `Evaluate: ${text}`,
          answer: [`${base}^${n + 1}`, numericalValue.toString()],
          explanation: `When you add ${count} terms of ${base}^${n}, it's ${count} * (${base}^${n}), which is ${base}^1 * ${base}^n = ${base}^(n+1). ${base}^${n+1} = ${numericalValue}.`
        };
      }
      case 'square': {
        const n = Math.floor(Math.random() * 20) + 11; // 11 to 30
        return {
          text: `What is ${n}²?`,
          answer: (n * n).toString(),
          explanation: `The square of ${n} is ${n * n}. Memorizing squares up to 30 is highly recommended for the GRE.`
        };
      }
      case 'cube': {
        const n = Math.floor(Math.random() * 11) + 2; // 2 to 12
        return {
          text: `What is ${n}³?`,
          answer: (n * n * n).toString(),
          explanation: `The cube of ${n} is ${n * n * n}. Memorizing cubes up to 12 is beneficial for GRE speed.`
        };
      }
      case 'root': {
        const n = Math.floor(Math.random() * 20) + 11; // 11 to 30
        const square = n * n;
        return {
          text: `What is √${square}?`,
          answer: n.toString(),
          explanation: `The square root of ${square} is ${n}.`
        };
      }
      case 'cube_root': {
        const n = Math.floor(Math.random() * 9) + 2; // 2 to 10
        const cube = n * n * n;
        return {
          text: `What is ³√${cube}?`,
          answer: n.toString(),
          explanation: `The cube root of ${cube} is ${n}.`
        };
      }
      case 'percent': {
        const percents = [10, 15, 20, 25, 30, 40, 50, 60, 75, 80, 90];
        const p = percents[Math.floor(Math.random() * percents.length)];
        const val = (Math.floor(Math.random() * 12) + 1) * 20;
        const ans = (p / 100) * val;
        return {
          text: `What is ${p}% of ${val}?`,
          answer: ans.toString(),
          explanation: `${p}% of ${val} is (${p}/100) * ${val} = ${ans}.`
        };
      }
      case 'percent_change': {
        const isIncrease = Math.random() > 0.5;
        if (isIncrease) {
          const pairs = [
            { a: 40, b: 50, ans: 25 },
            { a: 80, b: 100, ans: 25 },
            { a: 20, b: 30, ans: 50 },
            { a: 50, b: 60, ans: 20 },
            { a: 50, b: 75, ans: 50 },
            { a: 25, b: 30, ans: 20 },
            { a: 100, b: 150, ans: 50 }
          ];
          const pair = pairs[Math.floor(Math.random() * pairs.length)];
          return {
            text: `Value increases from ${pair.a} to ${pair.b}. What is the % increase?`,
            answer: pair.ans.toString(),
            explanation: `Percentage increase is (Change / Original) * 100 = ((${pair.b} - ${pair.a}) / ${pair.a}) * 100 = (${pair.b - pair.a} / ${pair.a}) * 100 = ${pair.ans}%.`
          };
        } else {
          const pairs = [
            { a: 50, b: 40, ans: 20 },
            { a: 100, b: 80, ans: 20 },
            { a: 40, b: 30, ans: 25 },
            { a: 80, b: 60, ans: 25 },
            { a: 120, b: 90, ans: 25 },
            { a: 50, b: 30, ans: 40 },
            { a: 200, b: 150, ans: 25 }
          ];
          const pair = pairs[Math.floor(Math.random() * pairs.length)];
          return {
            text: `Value decreases from ${pair.a} to ${pair.b}. What is the % decrease?`,
            answer: pair.ans.toString(),
            explanation: `Percentage decrease is (Change / Original) * 100 = ((${pair.a} - ${pair.b}) / ${pair.a}) * 100 = (${pair.a - pair.b} / ${pair.a}) * 100 = ${pair.ans}%.`
          };
        }
      }
      case 'fraction_convert': {
        const pairs = [
          { text: '3/8 as a percentage (exclude %)', ans: '37.5', exp: '3/8 = 3 * 0.125 = 0.375 = 37.5%' },
          { text: '5/8 as a percentage (exclude %)', ans: '62.5', exp: '5/8 = 5 * 0.125 = 0.625 = 62.5%' },
          { text: '7/8 as a percentage (exclude %)', ans: '87.5', exp: '7/8 = 7 * 0.125 = 0.875 = 87.5%' },
          { text: '1/6 as a percentage to 2 decimal places (exclude %)', ans: '16.67', exp: '1/6 is approximately 0.1667, which is 16.67%' },
          { text: '3/5 as a decimal', ans: '0.6', exp: '3/5 = 6/10 = 0.6' },
          { text: '4/5 as a decimal', ans: '0.8', exp: '4/5 = 8/10 = 0.8' },
          { text: '5/8 as a decimal', ans: '0.625', exp: '5/8 = 0.625 (since 1/8 = 0.125)' },
          { text: '7/8 as a decimal', ans: '0.875', exp: '7/8 = 0.875 (since 1/8 = 0.125)' },
          { text: '1/40 as a decimal', ans: '0.025', exp: '1/40 = 2.5 / 100 = 0.025' }
        ];
        const pair = pairs[Math.floor(Math.random() * pairs.length)];
        return {
          text: `What is ${pair.text}?`,
          answer: pair.ans,
          explanation: pair.exp
        };
      }
      case 'ratios_distribute': {
        const configurations = [
          { r1: 2, r2: 3, total: 50, smaller: 20, larger: 30 },
          { r1: 3, r2: 4, total: 70, smaller: 30, larger: 40 },
          { r1: 1, r2: 5, total: 120, smaller: 20, larger: 100 },
          { r1: 5, r2: 7, total: 60, smaller: 25, larger: 35 },
          { r1: 2, r2: 7, total: 90, smaller: 20, larger: 70 },
          { r1: 3, r2: 5, total: 80, smaller: 30, larger: 50 }
        ];
        const config = configurations[Math.floor(Math.random() * configurations.length)];
        const askLarger = Math.random() > 0.5;
        return {
          text: `Divide ${config.total} in ratio ${config.r1}:${config.r2}. What is the ${askLarger ? 'larger' : 'smaller'} part?`,
          answer: (askLarger ? config.larger : config.smaller).toString(),
          explanation: `Total parts = ${config.r1} + ${config.r2} = ${config.r1 + config.r2}. Each part is ${config.total} / ${config.r1 + config.r2} = ${config.total / (config.r1 + config.r2)}. ` +
                       `The ${askLarger ? 'larger' : 'smaller'} part is ${askLarger ? config.r2 : config.r1} * ${config.total / (config.r1 + config.r2)} = ${askLarger ? config.larger : config.smaller}.`
        };
      }
      case 'ratios_simplify': {
        const pairs = [
          { a: 15, b: 25, ans: '3:5' },
          { a: 24, b: 36, ans: '2:3' },
          { a: 40, b: 75, ans: '8:15' },
          { a: 18, b: 45, ans: '2:5' },
          { a: 28, b: 42, ans: '2:3' },
          { a: 35, b: 56, ans: '5:8' }
        ];
        const pair = pairs[Math.floor(Math.random() * pairs.length)];
        return {
          text: `Simplify the ratio ${pair.a}:${pair.b} (write as X:Y)`,
          answer: pair.ans,
          explanation: `The greatest common divisor of ${pair.a} and ${pair.b} is ${pair.a / parseInt(pair.ans.split(':')[0])}. Dividing both by this GCD yields ${pair.ans}.`
        };
      }
      case 'algebra_linear': {
        const a = Math.floor(Math.random() * 8) + 2; // 2 to 9
        const x = Math.floor(Math.random() * 11) + 2; // 2 to 12
        const isPlus = Math.random() > 0.5;
        const b = Math.floor(Math.random() * 15) + 1;
        const c = isPlus ? (a * x + b) : (a * x - b);
        return {
          text: `Solve for x: ${a}x ${isPlus ? '+' : '-'} ${b} = ${c}`,
          answer: x.toString(),
          explanation: `First, ${isPlus ? 'subtract' : 'add'} ${b} from both sides to get ${a}x = ${a * x}. Then divide both sides by ${a} to get x = ${x}.`
        };
      }
      case 'algebra_diff_squares': {
        const isRoot = Math.random() > 0.5;
        const a = Math.floor(Math.random() * 11) + 4; // 4 to 14
        if (isRoot) {
          return {
            text: `Find the positive solution for x: x² - ${a * a} = 0`,
            answer: a.toString(),
            explanation: `We can factor this difference of squares as (x - ${a})(x + ${a}) = 0. The positive solution is x = ${a}.`
          };
        } else {
          const b = a + Math.floor(Math.random() * 5) + 2; // ensure b > a
          return {
            text: `Evaluate (x - ${a})(x + ${a}) for x = ${b}`,
            answer: (b * b - a * a).toString(),
            explanation: `Using the difference of squares identity, (x - ${a})(x + ${a}) = x² - ${a}². Substituting x = ${b}, we get ${b}² - ${a}² = ${b * b} - ${a * a} = ${b * b - a * a}.`
          };
        }
      }
      case 'divisibility_remainder': {
        const b = Math.floor(Math.random() * 9) + 4; // 4 to 12
        const quotient = Math.floor(Math.random() * 10) + 5;
        const r = Math.floor(Math.random() * b);
        const a = b * quotient + r;
        return {
          text: `What is the remainder when ${a} is divided by ${b}?`,
          answer: r.toString(),
          explanation: `${a} = ${b} × ${quotient} + ${r}. Therefore, the remainder is ${r}.`
        };
      }
      case 'prime_check': {
        const primes = [53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113];
        const composites = [51, 57, 63, 69, 77, 81, 87, 91, 93, 111, 117, 119];
        const isPrimeSelected = Math.random() > 0.5;
        const val = isPrimeSelected 
          ? primes[Math.floor(Math.random() * primes.length)]
          : composites[Math.floor(Math.random() * composites.length)];
        return {
          text: `Is ${val} a prime number? (yes/no)`,
          answer: isPrimeSelected ? 'yes' : 'no',
          explanation: isPrimeSelected 
            ? `${val} has no positive divisors other than 1 and itself, making it prime.`
            : `${val} is composite. For example, ` + 
              (val === 51 ? '51 = 3 × 17.' :
               val === 57 ? '57 = 3 × 19.' :
               val === 87 ? '87 = 3 × 29.' :
               val === 91 ? '91 = 7 × 13.' :
               val === 111 ? '111 = 3 × 37.' :
               val === 119 ? '119 = 7 × 17.' : `it is divisible by factors other than 1 and itself.`)
        };
      }
      case 'prime_factors': {
        const configurations = [
          { n: 30, ans: 5, exp: '30 = 2 * 3 * 5' },
          { n: 42, ans: 7, exp: '42 = 2 * 3 * 7' },
          { n: 60, ans: 5, exp: '60 = 2² * 3 * 5' },
          { n: 77, ans: 11, exp: '77 = 7 * 11' },
          { n: 39, ans: 13, exp: '39 = 3 * 13' },
          { n: 45, ans: 5, exp: '45 = 3² * 5' },
          { n: 55, ans: 11, exp: '55 = 5 * 11' },
          { n: 51, ans: 17, exp: '51 = 3 * 17' },
          { n: 34, ans: 17, exp: '34 = 2 * 17' },
          { n: 46, ans: 23, exp: '46 = 2 * 23' }
        ];
        const config = configurations[Math.floor(Math.random() * configurations.length)];
        return {
          text: `What is the largest prime factor of ${config.n}?`,
          answer: config.ans.toString(),
          explanation: `The prime factorization is ${config.exp}. The largest prime among these is ${config.ans}.`
        };
      }
      case 'stats_average': {
        const avg = Math.floor(Math.random() * 41) + 10; // 10 to 50
        const d1 = Math.floor(Math.random() * 8) + 2;
        const d2 = Math.floor(Math.random() * 5) + 1;
        const n1 = avg - d1;
        const n2 = avg + d2;
        const n3 = avg + d1 - d2; // Sum = 3 * avg
        return {
          text: `What is the average (arithmetic mean) of ${n1}, ${n2}, and ${n3}?`,
          answer: avg.toString(),
          explanation: `Sum = ${n1} + ${n2} + ${n3} = ${n1 + n2 + n3}. Average = ${n1 + n2 + n3} / 3 = ${avg}.`
        };
      }
      case 'stats_missing_avg': {
        const avg = Math.floor(Math.random() * 31) + 10; // 10 to 40
        const a = avg - Math.floor(Math.random() * 6) - 2;
        const b = avg + Math.floor(Math.random() * 5) + 1;
        const x = 3 * avg - a - b;
        return {
          text: `If the average of ${a}, ${b}, and x is ${avg}, what is the value of x?`,
          answer: x.toString(),
          explanation: `For the average to be ${avg}, the sum of the three values must be 3 × ${avg} = ${3 * avg}. x = ${3 * avg} - ${a} - ${b} = ${x}.`
        };
      }
      case 'stats_median': {
        const nums: number[] = [];
        while (nums.length < 5) {
          const r = Math.floor(Math.random() * 60) + 5;
          if (!nums.includes(r)) nums.push(r);
        }
        const sorted = [...nums].sort((x, y) => x - y);
        const median = sorted[2];
        return {
          text: `What is the median of {${nums.join(', ')}}?`,
          answer: median.toString(),
          explanation: `Sorting the set gives: {${sorted.join(', ')}}. The middle (3rd) value is ${median}.`
        };
      }
      case 'prob_dice': {
        const subType = Math.floor(Math.random() * 3);
        if (subType === 0) {
          return {
            text: `Probability of rolling a prime number on a fair 6-sided die? (as simplified fraction)`,
            answer: '1/2',
            explanation: `The prime outcomes on a 6-sided die are 2, 3, and 5 (3 favorable outcomes). Total outcomes = 6. Probability = 3/6 = 1/2.`
          };
        } else if (subType === 1) {
          return {
            text: `Probability of rolling a sum of 7 with two fair 6-sided dice? (as simplified fraction)`,
            answer: '1/6',
            explanation: `Favorable combinations for a sum of 7 are (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 combinations. Total combinations = 36. Probability = 6/36 = 1/6.`
          };
        } else {
          return {
            text: `Probability of rolling a sum of 11 with two fair 6-sided dice? (as simplified fraction)`,
            answer: '1/18',
            explanation: `Favorable combinations for a sum of 11 are (5,6) and (6,5) -> 2 combinations. Total combinations = 36. Probability = 2/36 = 1/18.`
          };
        }
      }
      case 'prob_coins': {
        const subType = Math.floor(Math.random() * 3);
        if (subType === 0) {
          return {
            text: `Probability of getting exactly 2 heads in 3 fair coin tosses? (as simplified fraction)`,
            answer: '3/8',
            explanation: `Possibilities for exactly 2 heads: HHT, HTH, THH (3 outcomes). Total possible outcomes = 2³ = 8. Probability = 3/8.`
          };
        } else if (subType === 1) {
          return {
            text: `Probability of getting all heads in 4 fair coin tosses? (as simplified fraction)`,
            answer: '1/16',
            explanation: `Only 1 outcome (HHHH) has all heads. Total possible outcomes = 2⁴ = 16. Probability = 1/16.`
          };
        } else {
          return {
            text: `Probability of getting at least one tail in 3 fair coin tosses? (as simplified fraction)`,
            answer: '7/8',
            explanation: `The complement is getting all heads (probability 1/8). Thus, probability of at least one tail is 1 - 1/8 = 7/8.`
          };
        }
      }
      case 'prob_combinatorics': {
        const subType = Math.floor(Math.random() * 2);
        if (subType === 0) {
          const n = Math.floor(Math.random() * 3) + 3; // 3 to 5
          let fact = 1;
          for (let i = 2; i <= n; i++) fact *= i;
          return {
            text: `In how many unique ways can ${n} distinct books be arranged on a shelf?`,
            answer: fact.toString(),
            explanation: `The number of permutations of ${n} distinct objects is ${n}! = ${fact}.`
          };
        } else {
          const options = [
            { n: 5, ans: 10 },
            { n: 6, ans: 15 },
            { n: 7, ans: 21 },
            { n: 8, ans: 28 },
            { n: 10, ans: 45 }
          ];
          const opt = options[Math.floor(Math.random() * options.length)];
          return {
            text: `How many unique groups of 2 people can be chosen from a pool of ${opt.n} people?`,
            answer: opt.ans.toString(),
            explanation: `Using combinations: nCr = n! / (r!(n-r)!). For n=${opt.n}, r=2, we have ${opt.n}C2 = (${opt.n} × ${opt.n - 1}) / 2 = ${opt.ans}.`
          };
        }
      }
      case 'geom_triangle_angles': {
        const a = Math.floor(Math.random() * 51) + 30; // 30 to 80
        const b = Math.floor(Math.random() * 51) + 30; // 30 to 80
        const c = 180 - a - b;
        return {
          text: `Two interior angles of a triangle are ${a}° and ${b}°. What is the third angle in degrees?`,
          answer: c.toString(),
          explanation: `The sum of interior angles in a triangle is 180°. Third angle = 180° - ${a}° - ${b}° = ${c}°.`
        };
      }
      case 'geom_pythagorean': {
        const triples = [
          { a: 3, b: 4, c: 5 },
          { a: 5, b: 12, c: 13 },
          { a: 6, b: 8, c: 10 },
          { a: 8, b: 15, c: 17 },
          { a: 9, b: 12, c: 15 }
        ];
        const triple = triples[Math.floor(Math.random() * triples.length)];
        const findHypotenuse = Math.random() > 0.5;
        if (findHypotenuse) {
          return {
            text: `In a right triangle, the legs are of lengths ${triple.a} and ${triple.b}. Find the hypotenuse.`,
            answer: triple.c.toString(),
            explanation: `According to the Pythagorean theorem, a² + b² = c². So ${triple.a}² + ${triple.b}² = ${triple.a * triple.a} + ${triple.b * triple.b} = ${triple.c * triple.c}, √${triple.c * triple.c} = ${triple.c}.`
          };
        } else {
          return {
            text: `In a right triangle, one leg is ${triple.a} and the hypotenuse is ${triple.c}. Find the other leg.`,
            answer: triple.b.toString(),
            explanation: `According to the Pythagorean theorem, a² + b² = c², so b² = c² - a². Thus, other leg = √(${triple.c}² - ${triple.a}²) = √(${triple.c * triple.c - triple.a * triple.a}) = √${triple.b * triple.b} = ${triple.b}.`
          };
        }
      }
      case 'geom_perimeter_area': {
        const L = Math.floor(Math.random() * 10) + 5; // 5 to 14
        const W = Math.floor(Math.random() * 4) + 2; // 2 to 5
        const isAreaQuestion = Math.random() > 0.5;
        if (isAreaQuestion) {
          const P = 2 * (L + W);
          return {
            text: `A rectangle has perimeter ${P} and width ${W}. What is its area?`,
            answer: (L * W).toString(),
            explanation: `Perimeter P = 2(Length + Width). Thus, ${P} = 2(L + ${W}) => L + ${W} = ${P / 2} => L = ${L}. Area = L × W = ${L} × ${W} = ${L * W}.`
          };
        } else {
          const A = L * W;
          return {
            text: `A rectangle has area ${A} and width ${W}. What is its perimeter?`,
            answer: (2 * (L + W)).toString(),
            explanation: `Area A = Length × Width, so ${A} = L × ${W} => L = ${L}. Perimeter = 2(Length + Width) = 2(${L} + ${W}) = ${2 * (L + W)}.`
          };
        }
      }
      case 'geom_interior_angles': {
        const polys = [
          { name: 'pentagon', sides: 5, ans: 540 },
          { name: 'hexagon', sides: 6, ans: 720 },
          { name: 'octagon', sides: 8, ans: 1080 }
        ];
        const poly = polys[Math.floor(Math.random() * polys.length)];
        return {
          text: `What is the sum of the interior angles of a regular ${poly.name} (${poly.sides}-sided polygon) in degrees?`,
          answer: poly.ans.toString(),
          explanation: `The formula is (n - 2) * 180°. For a ${poly.name}, n = ${poly.sides}. Therefore, (${poly.sides} - 2) * 180° = ${poly.sides - 2} * 180° = ${poly.ans}°.`
        };
      }
      case 'seq_arithmetic': {
        const a = Math.floor(Math.random() * 15) + 1; // 1 to 15
        const d = Math.floor(Math.random() * 8) + 2; // 2 to 9
        return {
          text: `What is the next term in the arithmetic sequence: ${a}, ${a + d}, ${a + 2 * d}, ${a + 3 * d}, ...?`,
          answer: (a + 4 * d).toString(),
          explanation: `The sequence has a common difference of ${d}. The next term is ${a + 3 * d} + ${d} = ${a + 4 * d}.`
        };
      }
      case 'seq_geometric': {
        const a = Math.floor(Math.random() * 4) + 2; // 2 to 5
        const r = Math.floor(Math.random() * 2) + 2; // 2 to 3
        return {
          text: `What is the next term in the geometric sequence: ${a}, ${a * r}, ${a * r * r}, ${a * r * r * r}, ...?`,
          answer: (a * r * r * r * r).toString(),
          explanation: `The sequence has a common ratio of ${r}. The next term is ${a * r * r * r} × ${r} = ${a * r * r * r * r}.`
        };
      }
      case 'seq_sum_integers': {
        const options = [
          { n: 10, ans: 55 },
          { n: 12, ans: 78 },
          { n: 15, ans: 120 },
          { n: 20, ans: 210 },
          { n: 30, ans: 465 },
          { n: 50, ans: 1275 }
        ];
        const opt = options[Math.floor(Math.random() * options.length)];
        return {
          text: `What is the sum of all integers from 1 to ${opt.n} inclusive?`,
          answer: opt.ans.toString(),
          explanation: `The sum of first n positive integers is n(n + 1)/2. For n = ${opt.n}, sum = (${opt.n} × ${opt.n + 1}) / 2 = ${opt.ans}.`
        };
      }
      default:
        return { text: '2 + 2', answer: '4', explanation: 'Basic addition.' };
    }
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(60);
    setMistakes([]);
    setCurrentQuestion(generateQuestion());
    setUserInput('');
    setIsCorrect(null);
    setShowFeedback(false);
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameState('over');
      clearInterval(timerRef.current);
      const newXp = recordQuizResult('Mental Math', score, score + mistakes.length, mistakes);
      onXpChange(newXp);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, timeLeft]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion || showFeedback) return;

    const answers = Array.isArray(currentQuestion.answer) ? currentQuestion.answer : [currentQuestion.answer];
    const correct = answers.some(a => userInput.trim().toLowerCase() === a.toLowerCase());
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(s => s + 1);
      playSound('correct', soundEnabled);
      awardXP(XP_REWARDS.correctQuant);
    } else {
      playSound('wrong', soundEnabled);
      setMistakes(prev => [...prev, {
        question: currentQuestion.text,
        userAnswer: userInput,
        correctAnswer: answers[0], // Show the preferred exponent form
        explanation: currentQuestion.explanation
      }]);
    }

    setTimeout(() => {
      setShowFeedback(false);
      setIsCorrect(null);
      setUserInput('');
      setCurrentQuestion(generateQuestion());
    }, 1000);
  };

  if (gameState === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in fade-in">
        <div className="space-y-6">
          <div className="w-24 h-24 bg-bg-primary rounded-sm border border-ink/5 flex items-center justify-center text-accent-gold mx-auto shadow-xl">
            <Zap size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-5xl font-serif font-bold text-ink">Mental Math Blitz.</h2>
            <p className="text-sm font-sans text-ink/60 tracking-wide max-w-md mx-auto">
              Test your speed and pattern recognition. 60 seconds to solve as many as you can.
            </p>
          </div>
        </div>
        <button 
          onClick={startGame}
          className="px-16 py-6 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.3em] hover:bg-ink/90 transition-all shadow-2xl flex items-center gap-4 group"
        >
          Initiate Blitz <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  if (gameState === 'over') {
    return (
      <div className="space-y-12 py-12 text-center animate-in fade-in max-w-4xl mx-auto">
        <div className="space-y-4">
          <span className="text-[10px] font-sans font-bold text-accent-gold uppercase tracking-[0.3em]">Session Terminated</span>
          <h2 className="text-6xl font-serif font-bold text-ink leading-tight">Blitz<br />Result.</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="p-6 sm:p-12 bg-white rounded-sm border border-ink/5 shadow-xl space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Score</span>
              <p className="text-7xl font-serif font-bold text-ink tracking-tighter">{score}</p>
            </div>
            <div className="flex justify-between items-center border-t border-ink/5 pt-8">
              <div className="text-left">
                <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Mistakes</span>
                <p className="text-2xl font-serif font-bold text-red-500">{mistakes.length}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Accuracy</span>
                <p className="text-2xl font-serif font-bold text-ink">
                  {score + mistakes.length > 0 ? Math.round((score / (score + mistakes.length)) * 100) : 0}%
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <button 
                onClick={startGame}
                className="w-full px-12 py-6 bg-ink text-white rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all shadow-xl"
              >
                Retry Blitz
              </button>
              <button 
                onClick={onClose}
                className="w-full px-12 py-6 bg-bg-primary text-ink/60 rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-ink/5 transition-all"
              >
                Exit Game
              </button>
            </div>
          </div>

          <div className="text-left">
            <GameAnalysis mistakes={mistakes} onClose={() => {}} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-12 py-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-ink/5 pb-8 gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-12 h-12 bg-bg-primary rounded-sm border border-ink/5 flex items-center justify-center text-accent-gold">
            <Brain size={24} />
          </div>
          <div>
            <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Mental Math</span>
            <h3 className="text-xl font-serif font-bold text-ink">Blitz Mode</h3>
          </div>
        </div>
        <div className="flex items-center gap-4 sm:gap-8 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-left sm:text-right">
            <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Time</span>
            <p className={`text-2xl font-serif font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-ink'}`}>
              {timeLeft}s
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Score</span>
            <p className="text-2xl font-serif font-bold text-ink">{score}</p>
          </div>
        </div>
      </div>

      {/* Stress Meter (Timer Progress Bar) */}
      <div className="w-full h-2 bg-ink/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: '100%' }}
          animate={{ width: `${Math.max(0, Math.min((timeLeft / 60) * 100, 100))}%` }}
          transition={{ duration: 1, ease: "linear" }}
          className={`h-full ${timeLeft < 10 ? 'bg-red-500' : 'bg-accent-gold'}`}
        />
      </div>

      <div className="p-6 sm:p-12 bg-white rounded-sm border border-ink/5 shadow-2xl relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQuestion?.text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12 text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-ink leading-tight min-h-[80px] flex items-center justify-center">
              {currentQuestion?.text}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="relative">
                <input 
                  autoFocus
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="ANSWER..."
                  className={`w-full p-4 sm:p-8 bg-bg-primary border-2 rounded-sm font-serif font-bold text-2xl sm:text-4xl text-center transition-all outline-none
                    ${showFeedback ? (isCorrect ? 'border-teal-500 bg-teal-50' : 'border-red-500 bg-red-50') : 'border-ink/5 focus:border-accent-gold'}
                  `}
                />
                {showFeedback && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-4 -right-4"
                  >
                    {isCorrect ? (
                      <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-lg">
                        <CheckCircle2 size={24} />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg">
                        <X size={24} />
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
              <p className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em]">Press Enter to Submit</p>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={() => setGameState('over')}
          className="text-[10px] font-sans font-bold text-ink/30 uppercase tracking-[0.2em] hover:text-red-500 transition-colors"
        >
          End Session
        </button>
      </div>
    </div>
  );
};

export default MentalMath;
