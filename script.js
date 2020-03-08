const display = document.querySelector(".display");
const decimalBtn = document.querySelector(".decimal");

let num1 = "";
let num2 = "";
let operator = "";
let displayValue = "";
function showOnDisplay(e) {
  if (e.target.textContent === ".") {
    if (displayValue === "") {
      displayValue = "0";
    }
    if (displayValue.indexOf(".") >= 0) {
      return;
    }
  }
  displayValue += e.target.textContent;
  display.textContent = displayValue;
}

function storeValues(e) {
  num1 = parseFloat(display.textContent);
  displayValue = "";
  operator = e.target.textContent;
}

function add(num1, num2) {
  return num1 + num2;
}
function subtract(num1, num2) {
  return num1 - num2;
}
function multiply(num1, num2) {
  return num1 * num2;
}
function divide(num1, num2) {
  return num1 / num2;
}
function operate(operator, num1, num2) {
  switch (operator) {
    case "+":
      return add(num1, num2);
      break;
    case "-":
      return subtract(num1, num2);
      break;
    case "*":
      return multiply(num1, num2);
      break;
    case "/":
      return divide(num1, num2);
      break;
  }
}
function clearAll() {
  num1 = "";
  num2 = "";
  operator = "";
  displayValue = "";
}

const numBtns = document.querySelectorAll(".number");
// const decimalBtn = document.querySelector(".decimal");
const opBtns = document.querySelectorAll(".operator");
const equalBtn = document.querySelector(".equal");
const clearBtn = document.querySelector(".clear");

numBtns.forEach(numBtn => {
  numBtn.addEventListener("click", showOnDisplay);
});
opBtns.forEach(opBtn => {
  opBtn.addEventListener("click", storeValues);
});
equalBtn.addEventListener("click", () => {
  num2 = parseFloat(display.textContent);
  display.textContent = operate(operator, num1, num2);
  clearAll();
});
clearBtn.addEventListener("click", () => {
  clearAll();
  display.textContent = "0";
});
