export interface PasswordAnalysis {
  score: number;
  strength: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Very Strong';
  entropy: number;
  crackTime: string;
  poolSize: number;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    special: boolean;
    noRepeats: boolean;
    noSequential: boolean;
    noCommonPattern: boolean;
  };
  recommendations: string[];
}

const COMMON_PASSWORDS = new Set([
  'password', 'password123', '123456', '123456789', 'qwerty', 'admin', 'letmein',
  'welcome', 'sunshine', 'monkey', 'dragon', 'baseball', 'football', 'superman',
  '123123', '111111', 'password1234'
]);

export function analyzePassword(password: string): PasswordAnalysis {
  const analysis: PasswordAnalysis = {
    score: 0,
    strength: 'Very Weak',
    entropy: 0,
    crackTime: 'Instant',
    poolSize: 0,
    checks: {
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
      noRepeats: !/(.)\1{2,}/.test(password),
      noSequential: !/(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password),
      noCommonPattern: !COMMON_PASSWORDS.has(password.toLowerCase()) && !/^[a-zA-Z]+123$/.test(password) && !/^(qwe|asd|zxc)/i.test(password)
    },
    recommendations: []
  };

  if (!password) {
    return analysis;
  }

  // Calculate pool size
  let poolSize = 0;
  if (analysis.checks.lowercase) poolSize += 26;
  if (analysis.checks.uppercase) poolSize += 26;
  if (analysis.checks.numbers) poolSize += 10;
  if (analysis.checks.special) poolSize += 32;
  
  analysis.poolSize = poolSize;

  // Calculate entropy
  analysis.entropy = poolSize > 0 ? password.length * Math.log2(poolSize) : 0;

  // Calculate score (0-100)
  let score = 0;
  if (analysis.checks.length) score += 20;
  else score += Math.min(password.length * 1.5, 15);
  
  if (analysis.checks.uppercase) score += 15;
  if (analysis.checks.lowercase) score += 15;
  if (analysis.checks.numbers) score += 15;
  if (analysis.checks.special) score += 15;
  if (analysis.checks.noRepeats) score += 5;
  if (analysis.checks.noSequential) score += 5;
  if (analysis.checks.noCommonPattern) score += 10;
  
  // Penalties
  if (!analysis.checks.noCommonPattern) score = Math.min(score, 20); // Severely cap score for common patterns
  if (!analysis.checks.noRepeats) score -= 10;
  if (!analysis.checks.noSequential) score -= 10;

  analysis.score = Math.max(0, Math.min(100, score));

  // Determine strength label
  if (analysis.score < 20) analysis.strength = 'Very Weak';
  else if (analysis.score < 40) analysis.strength = 'Weak';
  else if (analysis.score < 60) analysis.strength = 'Moderate';
  else if (analysis.score < 80) analysis.strength = 'Strong';
  else analysis.strength = 'Very Strong';

  // Calculate crack time
  const crackGuessesPerSecond = 100e9; // Assuming 100 billion guesses per second (modern cracking rig)
  const combinations = Math.pow(poolSize, password.length);
  const seconds = combinations / crackGuessesPerSecond;

  if (seconds < 1) analysis.crackTime = 'Instant';
  else if (seconds < 60) analysis.crackTime = `${Math.round(seconds)} seconds`;
  else if (seconds < 3600) analysis.crackTime = `${Math.round(seconds / 60)} minutes`;
  else if (seconds < 86400) analysis.crackTime = `${Math.round(seconds / 3600)} hours`;
  else if (seconds < 31536000) analysis.crackTime = `${Math.round(seconds / 86400)} days`;
  else if (seconds < 3153600000) analysis.crackTime = `${Math.round(seconds / 31536000)} years`;
  else analysis.crackTime = 'Centuries';

  // Generate recommendations
  if (!analysis.checks.length) analysis.recommendations.push('Increase password length to at least 12 characters.');
  if (!analysis.checks.uppercase || !analysis.checks.lowercase) analysis.recommendations.push('Use both uppercase and lowercase letters.');
  if (!analysis.checks.numbers) analysis.recommendations.push('Add numbers for more character variety.');
  if (!analysis.checks.special) analysis.recommendations.push('Include special characters (e.g., !@#$%).');
  if (!analysis.checks.noRepeats) analysis.recommendations.push('Avoid repeating the same character excessively.');
  if (!analysis.checks.noSequential) analysis.recommendations.push('Avoid predictable sequential characters (like "abc" or "123").');
  if (!analysis.checks.noCommonPattern) analysis.recommendations.push('Avoid common words, keyboard patterns, and easily guessed structures.');

  return analysis;
}

export function generatePassword(options: {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}): string {
  const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowers = 'abcdefghijklmnopqrstuvwxyz';
  const nums = '0123456789';
  const syms = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

  let pool = '';
  if (options.uppercase) pool += uppers;
  if (options.lowercase) pool += lowers;
  if (options.numbers) pool += nums;
  if (options.symbols) pool += syms;

  if (pool.length === 0) return '';

  let password = '';
  const array = new Uint32Array(options.length);
  window.crypto.getRandomValues(array);

  for (let i = 0; i < options.length; i++) {
    password += pool[array[i] % pool.length];
  }

  // Ensure at least one of each selected type is included (if length permits)
  let guaranteed = '';
  if (options.uppercase) guaranteed += uppers[Math.floor(Math.random() * uppers.length)];
  if (options.lowercase) guaranteed += lowers[Math.floor(Math.random() * lowers.length)];
  if (options.numbers) guaranteed += nums[Math.floor(Math.random() * nums.length)];
  if (options.symbols) guaranteed += syms[Math.floor(Math.random() * syms.length)];

  if (guaranteed.length > 0 && options.length >= guaranteed.length) {
    const passwordArray = password.split('');
    for (let i = 0; i < guaranteed.length; i++) {
      passwordArray[i] = guaranteed[i];
    }
    // Shuffle
    for (let i = passwordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
    }
    password = passwordArray.join('');
  }

  return password;
}
