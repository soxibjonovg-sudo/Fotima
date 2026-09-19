export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(Math.round((a * b) / gcd(a, b)));
}

export function gcdMultiple(nums: number[]): number {
  if (nums.length === 0) return 1;
  return nums.reduce((acc, curr) => gcd(acc, curr));
}

export function lcmMultiple(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((acc, curr) => lcm(acc, curr));
}

export function isPrime(n: number): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

export function getPrimeFactors(n: number): number[] {
  let temp = Math.abs(Math.round(n));
  const factors: number[] = [];
  if (temp <= 1) return [];

  while (temp % 2 === 0) {
    factors.push(2);
    temp = Math.floor(temp / 2);
  }

  for (let i = 3; i * i <= temp; i += 2) {
    while (temp % i === 0) {
      factors.push(i);
      temp = Math.floor(temp / i);
    }
  }

  if (temp > 2) {
    factors.push(temp);
  }

  return factors;
}

export interface FactorMap {
  [prime: number]: number;
}

export function getPrimeFactorCounts(n: number): FactorMap {
  const factors = getPrimeFactors(n);
  const map: FactorMap = {};
  factors.forEach((f) => {
    map[f] = (map[f] || 0) + 1;
  });
  return map;
}

export function getDivisors(n: number): number[] {
  const num = Math.abs(Math.round(n));
  if (num === 0) return [];
  const divisors: number[] = [];
  for (let i = 1; i * i <= num; i++) {
    if (num % i === 0) {
      divisors.push(i);
      if (i * i !== num) {
        divisors.push(num / i);
      }
    }
  }
  return divisors.sort((a, b) => a - b);
}

export function areCoprime(a: number, b: number): boolean {
  return gcd(a, b) === 1;
}

export interface EuclideanStep {
  step: number;
  a: number;
  b: number;
  quotient: number;
  remainder: number;
  equation: string;
}

export function getEuclideanSteps(numA: number, numB: number): EuclideanStep[] {
  let a = Math.max(numA, numB);
  let b = Math.min(numA, numB);
  const steps: EuclideanStep[] = [];
  let step = 1;

  if (b === 0) {
    return [{
      step: 1,
      a,
      b: 0,
      quotient: 0,
      remainder: a,
      equation: `${a} = 0 · 0 + ${a}`,
    }];
  }

  while (b > 0) {
    const quotient = Math.floor(a / b);
    const remainder = a % b;
    steps.push({
      step,
      a,
      b,
      quotient,
      remainder,
      equation: `${a} = ${b} · ${quotient} + ${remainder}`,
    });
    a = b;
    b = remainder;
    step++;
  }

  return steps;
}

export interface DynamicProblem {
  numA: number;
  numB: number;
  type: 'EKUB' | 'EKUK';
  correctAnswer: number;
  options: number[];
  promptUz: string;
}

export function generateDynamicProblem(level: 'easy' | 'medium' | 'hard' = 'medium'): DynamicProblem {
  let a = 12;
  let b = 18;

  if (level === 'easy') {
    const pairs = [
      [12, 18], [8, 12], [15, 20], [14, 21], [16, 24], [9, 15], [10, 25], [6, 9], [20, 30]
    ];
    const pick = pairs[Math.floor(Math.random() * pairs.length)];
    a = pick[0];
    b = pick[1];
  } else if (level === 'medium') {
    const pairs = [
      [24, 36], [48, 72], [45, 60], [35, 49], [28, 42], [54, 72], [32, 48], [40, 60], [36, 54]
    ];
    const pick = pairs[Math.floor(Math.random() * pairs.length)];
    a = pick[0];
    b = pick[1];
  } else {
    const pairs = [
      [72, 108], [84, 126], [90, 135], [120, 180], [144, 216], [96, 144], [105, 140], [168, 252]
    ];
    const pick = pairs[Math.floor(Math.random() * pairs.length)];
    a = pick[0];
    b = pick[1];
  }

  const isGcd = Math.random() > 0.45;
  const type = isGcd ? 'EKUB' : 'EKUK';
  const correctAnswer = isGcd ? gcd(a, b) : lcm(a, b);

  // Generate 3 clever distractors
  const optionsSet = new Set<number>([correctAnswer]);
  if (isGcd) {
    const lcmVal = lcm(a, b);
    if (lcmVal !== correctAnswer && optionsSet.size < 4 && lcmVal < 300) optionsSet.add(lcmVal);
    const divisors = getDivisors(correctAnswer);
    divisors.forEach((d) => {
      if (optionsSet.size < 4 && d !== correctAnswer) optionsSet.add(d);
    });
    while (optionsSet.size < 4) {
      const delta = Math.floor(Math.random() * 5) + 1;
      const fake = Math.max(1, correctAnswer + (Math.random() > 0.5 ? delta : -delta));
      optionsSet.add(fake);
    }
  } else {
    const gcdVal = gcd(a, b);
    if (gcdVal !== correctAnswer && optionsSet.size < 4) optionsSet.add(gcdVal);
    const half = Math.floor(correctAnswer / 2);
    if (half > 1) optionsSet.add(half);
    const double = correctAnswer * 2;
    if (optionsSet.size < 4) optionsSet.add(double);
    while (optionsSet.size < 4) {
      const mult = Math.floor(Math.random() * 4) + 2;
      optionsSet.add(gcd(a, b) * mult * 3);
    }
  }

  const options = Array.from(optionsSet).slice(0, 4).sort(() => Math.random() - 0.5);

  return {
    numA: a,
    numB: b,
    type,
    correctAnswer,
    options,
    promptUz: `${type}(${a}, ${b}) ning qiymatini toping:`,
  };
}
