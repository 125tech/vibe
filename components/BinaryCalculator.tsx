'use client';

import { useState } from 'react';

type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | 'and' | 'or' | 'xor' | 'not';

export default function BinaryCalculator() {
  const [binary1, setBinary1] = useState('');
  const [binary2, setBinary2] = useState('');
  const [operation, setOperation] = useState<Operation>('add');
  const [result, setResult] = useState<string>('');
  const [decimal1, setDecimal1] = useState<number>(0);
  const [decimal2, setDecimal2] = useState<number>(0);
  const [resultDecimal, setResultDecimal] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const validateBinary = (value: string): boolean => {
    return /^[01]+$/.test(value) || value === '';
  };

  const binaryToDecimal = (binary: string): number => {
    if (!binary) return 0;
    return parseInt(binary, 2);
  };

  const decimalToBinary = (decimal: number): string => {
    if (decimal < 0) {
      return '-' + Math.abs(decimal).toString(2);
    }
    return decimal.toString(2);
  };

  const handleBinary1Change = (value: string) => {
    if (validateBinary(value) || value === '') {
      setBinary1(value);
      setDecimal1(binaryToDecimal(value));
      setError('');
    } else {
      setError('Please enter only 0s and 1s');
    }
  };

  const handleBinary2Change = (value: string) => {
    if (validateBinary(value) || value === '') {
      setBinary2(value);
      setDecimal2(binaryToDecimal(value));
      setError('');
    } else {
      setError('Please enter only 0s and 1s');
    }
  };

  const calculate = () => {
    setError('');
    
    if (!binary1 && operation !== 'not') {
      setError('Please enter the first binary number');
      return;
    }
    
    if (!binary2 && operation !== 'not') {
      setError('Please enter the second binary number');
      return;
    }

    const num1 = binaryToDecimal(binary1);
    const num2 = binaryToDecimal(binary2);
    let resultValue: number;

    try {
      switch (operation) {
        case 'add':
          resultValue = num1 + num2;
          break;
        case 'subtract':
          resultValue = num1 - num2;
          break;
        case 'multiply':
          resultValue = num1 * num2;
          break;
        case 'divide':
          if (num2 === 0) {
            setError('Cannot divide by zero');
            return;
          }
          resultValue = Math.floor(num1 / num2);
          break;
        case 'and':
          resultValue = num1 & num2;
          break;
        case 'or':
          resultValue = num1 | num2;
          break;
        case 'xor':
          resultValue = num1 ^ num2;
          break;
        case 'not':
          resultValue = ~num1;
          break;
        default:
          resultValue = 0;
      }

      setResultDecimal(resultValue);
      setResult(decimalToBinary(resultValue));
    } catch {
      setError('Calculation error occurred');
    }
  };

  const clear = () => {
    setBinary1('');
    setBinary2('');
    setDecimal1(0);
    setDecimal2(0);
    setResult('');
    setResultDecimal(0);
    setError('');
  };

  const appendBit = (bit: '0' | '1', target: 1 | 2) => {
    if (target === 1) {
      const newValue = binary1 + bit;
      setBinary1(newValue);
      setDecimal1(binaryToDecimal(newValue));
    } else {
      const newValue = binary2 + bit;
      setBinary2(newValue);
      setDecimal2(binaryToDecimal(newValue));
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
        Binary Calculator
      </h2>

      <div className="space-y-4">
        {/* First Binary Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Binary Number 1
          </label>
          <div className="space-y-2">
            <input
              type="text"
              value={binary1}
              onChange={(e) => handleBinary1Change(e.target.value)}
              placeholder="Enter binary (e.g., 1010)"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-lg"
            />
            <div className="flex gap-2">
              <button
                onClick={() => appendBit('0', 1)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md font-mono text-lg"
              >
                0
              </button>
              <button
                onClick={() => appendBit('1', 1)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md font-mono text-lg"
              >
                1
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Decimal: <span className="font-semibold">{decimal1}</span>
            </p>
          </div>
        </div>

        {/* Operation Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Operation
          </label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value as Operation)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <optgroup label="Arithmetic">
              <option value="add">Add (+)</option>
              <option value="subtract">Subtract (-)</option>
              <option value="multiply">Multiply (×)</option>
              <option value="divide">Divide (÷)</option>
            </optgroup>
            <optgroup label="Bitwise">
              <option value="and">AND (&)</option>
              <option value="or">OR (|)</option>
              <option value="xor">XOR (^)</option>
              <option value="not">NOT (~)</option>
            </optgroup>
          </select>
        </div>

        {/* Second Binary Input */}
        {operation !== 'not' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Binary Number 2
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={binary2}
                onChange={(e) => handleBinary2Change(e.target.value)}
                placeholder="Enter binary (e.g., 1100)"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-lg"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => appendBit('0', 2)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md font-mono text-lg"
                >
                  0
                </button>
                <button
                  onClick={() => appendBit('1', 2)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md font-mono text-lg"
                >
                  1
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Decimal: <span className="font-semibold">{decimal2}</span>
              </p>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={calculate}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors text-lg"
          >
            Calculate
          </button>
          <button
            onClick={clear}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white transition-colors"
          >
            Clear
          </button>
        </div>

        {/* Result Display */}
        {result && (
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Result:
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Binary:</span>
                <span className="font-mono text-xl font-bold text-blue-600 dark:text-blue-400">
                  {result}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Decimal:</span>
                <span className="font-mono text-xl font-bold text-blue-600 dark:text-blue-400">
                  {resultDecimal}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Reference */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Quick Reference
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div>• Binary uses only 0 and 1</div>
            <div>• AND: Both bits must be 1</div>
            <div>• OR: At least one bit is 1</div>
            <div>• XOR: Bits are different</div>
            <div>• NOT: Inverts all bits</div>
            <div>• Example: 1010 = 10 in decimal</div>
          </div>
        </div>
      </div>
    </div>
  );
}
