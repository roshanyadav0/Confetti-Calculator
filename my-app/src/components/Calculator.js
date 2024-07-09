import React, { useState } from "react";
import Display from "./Display";
import Button from "./Button";
import ConfettiExplosion from 'react-confetti-explosion'; // Importing the confetti library

const Calculator = () => {
  const [displayValue, setDisplayValue] = useState("0");
  const [operator, setOperator] = useState(null);
  const [firstOperand, setFirstOperand] = useState(null);
  const [isWaitingForSecondOperand, setIsWaitingForSecondOperand] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [history, setHistory] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const handleButtonClick = (label) => {
    if (["+", "-", "*", "÷"].includes(label)) { 
      handleOperatorClick(label);
      return;
    }

    switch (label) {
      case "C":
        clearDisplay();
        break;
      case "=":
        handleEqualClick();
        break;
      case "+/-":
        toggleSign();
        break;
      case ".":
        appendDecimal();
        break;
      case "x!":
        handleFactorial();
        break;
      case "sin":
      case "cos":
      case "tan":
      case "sinh":
      case "cosh":
      case "tanh":
      case "ln":
      case "log10":
      case "x^2":
      case "x^3":
      case "x^y":
      case "e^x":
      case "10^x":
      case "2√x":
      case "3√x":
      case "y√x":
      case "π":
        handleSpecialFunctionClick(label);
        break;
      default:
        appendDigitOrSymbol(label);
        break;
    }
  };

  const handleOperatorClick = (nextOperator) => {
    const currentInput = parseFloat(displayValue);

    switch (nextOperator) {
      case "+":
      case "-":
      case "*":
      case "÷": // Included division in common handling
        if (operator && isWaitingForSecondOperand) {
          setOperator(nextOperator);
          return;
        }

        if (firstOperand === null) {
          setFirstOperand(currentInput);
        } else if (operator) {
          const result = performCalculation(operator, firstOperand, currentInput);
          setDisplayValue(result.toString());
          setFirstOperand(result);
        }

        setOperator(nextOperator);
        setIsWaitingForSecondOperand(true);
        break;

      default:
        break;
    }
  };

  const handleEqualClick = () => {
    if (operator && firstOperand !== null) {
      const secondOperand = parseFloat(displayValue);
      const result = performCalculation(operator, firstOperand, secondOperand);
      setDisplayValue(result.toString());
      setFirstOperand(result);
      setOperator(null);
      setIsWaitingForSecondOperand(false);
      
      // Save the operation to history
      const operation = `${firstOperand} ${operator} ${secondOperand} = ${result}`;
      setHistory([...history, operation]);
    }
  };

  const performCalculation = (op, num1, num2) => {
    // Check for confetti trigger condition
    if ((num1 === 2 && num2 === 6) || (num1 === 6 && num2 === 2)) {
      triggerConfetti();
    }

    switch (op) {
      case "+":
        return num1 + num2;
      case "-":
        return num1 - num2;
      case "*":
        return num1 * num2;
      case "÷":
        return num1 / num2;
      default:
        return num2;
    }
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000); // Hide confetti after 3 seconds
  };

  const clearDisplay = () => {
    setDisplayValue("0");
    setOperator(null);
    setFirstOperand(null);
    setIsWaitingForSecondOperand(false);
  };

  const toggleSign = () => {
    setDisplayValue((prev) => (prev.charAt(0) === "-" ? prev.slice(1) : `-${prev}`));
  };

  const appendDecimal = () => {
    if (!displayValue.includes(".")) {
      setDisplayValue(displayValue + ".");
    }
  };

  const handleFactorial = () => {
    const number = parseFloat(displayValue);
    if (number < 0) {
      setDisplayValue("Error");
      return;
    }
    let result = 1;
    for (let i = 2; i <= number; i++) {
      result *= i;
    }
    setDisplayValue(result.toString());
    setIsWaitingForSecondOperand(true);
    
    // Save the operation to history
    const operation = `${number}! = ${result}`;
    setHistory([...history, operation]);
  };

  const handleSpecialFunctionClick = (label) => {
    const currentInput = parseFloat(displayValue);
    let result;

    switch (label) {
      case "sin":
        result = Math.sin((currentInput * Math.PI) / 180).toFixed(8); 
        break;
      case "cos":
        result = Math.cos((currentInput * Math.PI) / 180).toFixed(8); 
        break;
      case "tan":
        result = Math.tan((currentInput * Math.PI) / 180).toFixed(8); 
        break;
      case "sinh":
        result = Math.sinh(currentInput).toString(); 
        break;
      case "cosh":
        result = Math.cosh(currentInput).toString(); 
        break;
      case "tanh":
        result = Math.tanh(currentInput).toString(); 
        break;
      case "ln":
        result = Math.log(currentInput).toString(); 
        break;
      case "log10":
        result = Math.log10(currentInput).toString(); 
        break;
      case "x^2":
        result = Math.pow(currentInput, 2).toString(); 
        break;
      case "x^3":
        result = Math.pow(currentInput, 3).toString(); 
        break;
      case "x^y":
        return; 
      case "e^x":
        result = Math.exp(currentInput).toString(); 
        break;
      case "10^x":
        result = Math.pow(10, currentInput).toString(); 
        break;
      case "2√x":
        result = Math.sqrt(currentInput).toString(); 
        break;
      case "3√x":
        result = Math.cbrt(currentInput).toString(); 
        break;
      case "y√x":
        return; 
      case "π":
        result = Math.PI.toString(); 
        break;
      default:
        return;
    }

    setDisplayValue(result);
    setIsWaitingForSecondOperand(true);

    // Save the operation to history
    const operation = `${label}(${currentInput}) = ${result}`;
    setHistory([...history, operation]);
  };

  const appendDigitOrSymbol = (label) => {
    if (isWaitingForSecondOperand) {
      setDisplayValue(label);
      setIsWaitingForSecondOperand(false);
    } else {
      setDisplayValue((prev) => (prev === "0" ? label : prev + label));
    }
  };

  const buttons = [
    '(', ')', 'mc', 'm+', 'm-', 'mr', 'C', '+/-', '%', '÷', 
    '2nd', 'x^2', 'x^3', 'x^y', 'e^x', '10^x', '7', '8', '9', '*',
    '1/x', '2√x', '3√x', 'y√x', 'ln', 'log10', '4', '5', '6', '-',
    'x!', 'sin', 'cos', 'tan', 'e', 'EE', '1', '2', '3', '+',
    'Rad', 'sinh', 'cosh', 'tanh', 'π', 'Rand', '0', '.', '='
  ];

  const getButtonClassName = (label) => {
    switch (label) {
      case "C":
        return "clear";
      case "+/-":
        return "plus-minus";
      case "0":
        return "zero number";
      case "Rad":
        return "rad-btm-lgt";
      case "=":
        return "eql-btm-rgt yellow operator";
      case "+":
      case "-":
      case "*":
      case "÷": 
        return "yellow operator";
      default:
        return !isNaN(label) || label === "." ? "number" : "";
    }
  };

  return (
    <div className={`calculator ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <div className="theme-toggle">
        <button onClick={toggleTheme}>
          {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
      </div>
      <div className="dots">
        <div className="dot red"></div>
        <div className="dot yellow"></div>
        <div className="dot green"></div>
      </div>
      <Display value={displayValue} />
      <div className="buttons">
        {buttons.map((label, index) => (
          <Button
            key={index}
            label={label}
            className={getButtonClassName(label)}
            onClick={() => handleButtonClick(label)}
          />
        ))}
      </div>
      {showConfetti && (
        <ConfettiExplosion
          force={0.6}
          duration={3000}
          particleCount={200}
          width={1600}
        />
      )}
      <div className="history">
        <h3>History</h3>
        <ul>
          {history.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Calculator;
