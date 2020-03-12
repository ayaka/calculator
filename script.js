const display = document.querySelector(".display");
const numBtns = document.querySelectorAll(".number");
const opBtns = document.querySelectorAll(".operator");
const equalBtn = document.querySelector(".equal");
const clearBtn = document.querySelector(".clear");

let num = ["", ""],
  op = [],
  displayValue = "",
  numAside = "",
  opAside = "",
  result = null,
  tempNum,
  tempOp;

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

function updateDisplay(value) {
  display.textContent = value;
}
function deselectOpBtn() {
  opBtns.forEach(opBtn => {
    if (opBtn.classList.contains("selected")) {
      opBtn.classList.remove("selected");
    }
  });
}

function clearValues() {
  num = ["", ""];
  op = [];
  displayValue = "";
  result = null;
  deselectOpBtn();
  numAside = "";
  opAside = "";
}

function storeValues(e, i) {
  num[i] = parseFloat(display.textContent);
  displayValue = "";
  op[i] = e.target.textContent;
}

function formatResult(num) {
  num = num.toFixed(8).split("");
  while (num[num.length - 1] === "0") {
    num.pop();
  }
  if (num[num.length - 1] === ".") {
    num.pop();
  }
  return num.join("");
}

function putLowPrecedenceAside() {
  numAside = num[0];
  opAside = op[0];
  num[0] = num[1];
  op[0] = op[1];
  num[1] = "";
  op[1] = "";
}

function slideValuesPositions() {
  num[0] = result;
  op[0] = op[1];
  num[1] = "";
  op[1] = "";
  result = null;
}

numBtns.forEach(numBtn => {
  numBtn.addEventListener("click", e => {
    deselectOpBtn();
    if (e.target.textContent === ".") {
      // handling decimal
      if (displayValue === "") {
        displayValue = "0";
      }
      if (displayValue.indexOf(".") >= 0) {
        return;
      }
    }

    displayValue += e.target.textContent;
    updateDisplay(displayValue);
    console.log(num, op, numAside, opAside, displayValue);

    // phase 2
    if (num[1]) {
      if (
        (op[0] === "+" || op[0] === "-") &&
        (op[1] === "*" || op[1] === "/")
      ) {
        // first operator - lower precedence, second operator - higher precedence
        putLowPrecedenceAside();
      } else if (
        (op[0] === "*" || op[0] === "/") &&
        (op[1] === "+" || op[1] === "-")
      ) {
        // first operator - higher precedence, second operator - lower precedence
        if (numAside) {
          result = operate(opAside, numAside, result);
          result = parseFloat(formatResult(result));
          opAside = "";
          numAside = "";
        }
        slideValuesPositions();
      } else {
        // first operator and lower operator - lower precedence
        // first operator and second operator - higher precedence
        slideValuesPositions();
      }
      console.log(num, op, numAside, opAside, displayValue);
    }
  });
});

opBtns.forEach(opBtn => {
  opBtn.addEventListener("click", e => {
    deselectOpBtn();
    e.target.classList.add("selected");
    if (num[0] === "") {
      // phase 1
      storeValues(e, 0);
    } else {
      //  phase 2
      if (displayValue !== "") {
        storeValues(e, 1);
      } else {
        // when operator is clicked twice or more in a row
        if (!num[1]) {
          op[0] = e.target.textContent;
          console.log(num, op, numAside, opAside, displayValue);
          return;
        } else {
          op[1] = e.target.textContent;
        }
        console.log(num, op, numAside, opAside, displayValue);
      }

      if (
        (op[0] === "+" || op[0] === "-") &&
        e.target.classList.contains("higher-precedence")
      ) {
        // first operator - lower precedence, second operator - higher precedence
        updateDisplay(num[1]);
      } else {
        // first operator and second operator - lower precedence
        // first operator -higher and second operator - lower precedence
        // first operator - lower precedence, second operator - higher precedence
        result = operate(op[0], num[0], num[1]);
        result = parseFloat(formatResult(result));
        updateDisplay(result);
      }

      console.log(num, op, numAside, opAside, displayValue);
    }
  });
});

equalBtn.addEventListener("click", () => {
  num[1] = parseFloat(display.textContent);

  result = operate(op[0], num[0], num[1]);
  if (numAside) {
    result = operate(opAside, numAside, result);
  }
  result = parseFloat(formatResult(result));

  updateDisplay(result);
  clearValues();
});

clearBtn.addEventListener("click", () => {
  clearValues();
  display.textContent = "0";
});
