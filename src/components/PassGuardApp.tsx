"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ShieldCheck, ShieldAlert, Key, RefreshCw, Copy, Check } from "lucide-react";
import { analyzePassword, generatePassword, PasswordAnalysis } from "../utils/password-analyzer";

export default function PassGuardApp() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null);
  
  // Generator states
  const [genLength, setGenLength] = useState(16);
  const [genUpper, setGenUpper] = useState(true);
  const [genLower, setGenLower] = useState(true);
  const [genNumbers, setGenNumbers] = useState(true);
  const [genSymbols, setGenSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (password) {
      setAnalysis(analyzePassword(password));
    } else {
      setAnalysis(null);
    }
  }, [password]);

  const handleGenerate = () => {
    const newPassword = generatePassword({
      length: genLength,
      uppercase: genUpper,
      lowercase: genLower,
      numbers: genNumbers,
      symbols: genSymbols,
    });
    setPassword(newPassword);
  };

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getStrengthColor = (score: number) => {
    if (score < 20) return "bg-red-500";
    if (score < 40) return "bg-orange-500";
    if (score < 60) return "bg-yellow-500";
    if (score < 80) return "bg-lime-500";
    return "bg-green-500";
  };

  const getStrengthText = (score: number) => {
    if (score < 20) return "text-red-400";
    if (score < 40) return "text-orange-400";
    if (score < 60) return "text-yellow-400";
    if (score < 80) return "text-lime-400";
    return "text-green-400";
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 font-sans">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center items-center space-x-3 text-emerald-400">
          <ShieldCheck size={48} />
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">PassGuard</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Privacy-first password strength analyzer.
        </p>
        
        {/* Privacy Indicator */}
        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full mt-4">
          <ShieldCheck size={18} className="text-emerald-400" />
          <span className="text-sm font-medium text-emerald-300">
            Your password never leaves this device.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Interface */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300">Enter a password to analyze:</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-emerald-400 transition-colors">
                  <Key size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-4 bg-gray-950 border border-gray-700 rounded-xl text-lg text-white placeholder-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="Type your password here..."
                  autoComplete="off"
                  spellCheck="false"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Strength Meter */}
            {analysis && (
              <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-gray-400">Password Strength</span>
                  <span className={`text-xl font-bold ${getStrengthText(analysis.score)}`}>
                    {analysis.strength}
                  </span>
                </div>
                
                <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden flex">
                  <div 
                    className={`h-full transition-all duration-700 ease-out ${getStrengthColor(analysis.score)}`}
                    style={{ width: `${Math.max(5, analysis.score)}%` }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800/50">
                  <div className="bg-gray-950/50 rounded-lg p-3 border border-gray-800">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Estimated Crack Time</div>
                    <div className="text-lg font-semibold text-gray-200">{analysis.crackTime}</div>
                  </div>
                  <div className="bg-gray-950/50 rounded-lg p-3 border border-gray-800">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Estimated Entropy</div>
                    <div className="text-lg font-semibold text-gray-200">{Math.round(analysis.entropy)} bits</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Analysis & Recommendations */}
          {analysis && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm animate-in fade-in duration-500">
              <h3 className="text-lg font-semibold text-white mb-4">Security Analysis</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  { label: "Good length (12+)", passed: analysis.checks.length },
                  { label: "Uppercase letters", passed: analysis.checks.uppercase },
                  { label: "Lowercase letters", passed: analysis.checks.lowercase },
                  { label: "Numbers", passed: analysis.checks.numbers },
                  { label: "Special characters", passed: analysis.checks.special },
                  { label: "No common patterns", passed: analysis.checks.noCommonPattern },
                ].map((check, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    {check.passed ? (
                      <ShieldCheck size={18} className="text-emerald-500 flex-shrink-0" />
                    ) : (
                      <ShieldAlert size={18} className="text-gray-600 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${check.passed ? 'text-gray-300' : 'text-gray-500'}`}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>

              {analysis.recommendations.length > 0 && (
                <div className="mt-6 p-4 bg-orange-950/20 border border-orange-500/20 rounded-xl">
                  <h4 className="text-sm font-semibold text-orange-400 mb-2 flex items-center">
                    <ShieldAlert size={16} className="mr-2" />
                    Recommendations
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                    {analysis.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar: Generator & Education */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Password Generator */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <RefreshCw size={18} className="mr-2 text-emerald-400" />
              Secure Generator
            </h3>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-gray-400">Length</label>
                  <span className="text-sm font-medium text-emerald-400">{genLength}</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="64"
                  value={genLength}
                  onChange={(e) => setGenLength(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "upper", label: "Uppercase", state: genUpper, setter: setGenUpper },
                  { id: "lower", label: "Lowercase", state: genLower, setter: setGenLower },
                  { id: "nums", label: "Numbers", state: genNumbers, setter: setGenNumbers },
                  { id: "syms", label: "Symbols", state: genSymbols, setter: setGenSymbols },
                ].map((opt) => (
                  <label key={opt.id} className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={opt.state}
                        onChange={(e) => opt.setter(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 bg-gray-800 border border-gray-700 rounded transition-colors peer-checked:bg-emerald-500 peer-checked:border-emerald-500 group-hover:border-gray-500"></div>
                      <Check size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{opt.label}</span>
                  </label>
                ))}
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handleGenerate}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Generate
                </button>
                <button
                  onClick={handleCopy}
                  disabled={!password}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center border border-gray-700"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="mr-2 text-emerald-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="mr-2" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4">What makes a strong password?</h3>
            <div className="space-y-4 text-sm text-gray-400">
              <p>
                <strong className="text-gray-200">Length is crucial.</strong> A 16-character password with just lowercase letters is generally much stronger than an 8-character password with every symbol.
              </p>
              <p>
                <strong className="text-gray-200">Unpredictability.</strong> Avoid dictionary words, names, or sequences like "123456" or "qwerty".
              </p>
              <p>
                <strong className="text-gray-200">Unique passwords.</strong> Never reuse passwords across different sites. If one site is breached, attackers will try that password everywhere else.
              </p>
              <p>
                <strong className="text-gray-200">Use a password manager.</strong> It's impossible to remember dozens of strong, unique passwords. Use a trusted password manager.
              </p>
              <div className="p-3 bg-gray-950 rounded-lg border border-gray-800 mt-2">
                <span className="text-xs text-gray-500 uppercase font-semibold block mb-1">Disclaimer on Crack Times</span>
                <p className="text-xs">
                  Crack time estimates are approximate and based on blind brute-force guessing against fast modern hardware. Real-world cracking uses dictionaries, rules, and breached databases which are vastly faster. Never treat an estimate as a guarantee.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
