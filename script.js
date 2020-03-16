const display = document.querySelector(".display");
const numBtns = document.querySelectorAll(".number");
const opBtns = document.querySelectorAll(".operator");
const equalBtn = document.querySelector(".equal");
const clearBtn = document.querySelector(".clear");
const backspaceBtn = document.querySelector(".backspace");

let num = ["", ""],
  op = [],
  displayValue = "",
  numAside = "",
  opAside = "",
  result = null,
  tempNum,
  value;

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

function showKeyDown(element, selectedClass) {
  element.classList.add(selectedClass);
  setTimeout(() => {
    element.classList.remove(selectedClass);
  }, 300);
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
  tempNum = "";
}

function storeValues(element, i) {
  num[i] = parseFloat(display.textContent);
  displayValue = "";
  op[i] = element.textContent;
}

function formatResult(num) {
  // num = num.toFixed(15).split("");
  num = num.toString().split("");

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

function selectOperator(element) {
  deselectOpBtn();
  element.classList.add("selected");
  if (num[0] === "") {
    // phase 1
    storeValues(element, 0);
  } else {
    //  phase 2
    if (displayValue !== "") {
      storeValues(element, 1);
    } else {
      // when operator is selected twice or more in a row
      if (!num[1]) {
        op[0] = element.textContent;
        return;
      } else {
        op[1] = element.textContent;
      }
    }

    if (
      (op[0] === "+" || op[0] === "-") &&
      element.classList.contains("higher-precedence")
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
  }
}

function getNumber(value) {
  deselectOpBtn();
  if (value === ".") {
    // handling decimal
    if (displayValue === "") {
      displayValue = "0";
    }
    if (displayValue.indexOf(".") >= 0) {
      return;
    }
  }
  if (displayValue.length === 18) {
    return;
  }
  displayValue += value;
  updateDisplay(displayValue);

  // phase 2
  if (num[1]) {
    if ((op[0] === "+" || op[0] === "-") && (op[1] === "*" || op[1] === "/")) {
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
  }
}

function eraseLastNum() {
  displayValue = displayValue.slice(0, displayValue.length - 1);
  if (displayValue === "") {
    updateDisplay(0);
    return;
  }
  updateDisplay(displayValue);
}

function getAnswer() {
  deselectOpBtn();
  if (!num[0]) {
    return;
  }

  if (op[1]) {
    // take the display number to calculate if equal pressed right after operator.
    tempNum = parseFloat(display.textContent);
    result = operate(op[0], num[0], num[1]);
    result = operate(op[1], result, tempNum);
  } else {
    num[1] = parseFloat(display.textContent);
    if (op[0] === "/" && num[1] === 0) {
      updateDisplay("ERR0000000000000R");
      return;
    }
    result = operate(op[0], num[0], num[1]);
  }
  if (numAside) {
    result = operate(opAside, numAside, result);
  }

  if (result.toString().charAt(".") >= 0 && result.toString().length > 18) {
    result = result.toString().slice(0, 18);
  }

  // result = parseFloat(formatResult(result));
  if (result.toString().length > 18) {
    result = "Too Large Number";
  }
  updateDisplay(result);
  clearValues();
}

window.addEventListener("keydown", e => {
  e.preventDefault();

  if (!isNaN(e.key) || e.key === ".") {
    getNumber(e.key);
    const numSelected = [...numBtns].find(btn => btn.textContent === e.key);
    showKeyDown(numSelected, "changeNumBackground");
  } else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
    const opSelected = [...opBtns].find(btn => btn.textContent === e.key);
    selectOperator(opSelected);
  } else if (e.keyCode === 13 || e.key === 61) {
    getAnswer();
    showKeyDown(equalBtn, "changeBtnBackground");
  } else if (e.keyCode === 46) {
    clearValues();
    showKeyDown(clearBtn, "changeBtnBackground");
    display.textContent = "0";
  } else if (e.keyCode === 8) {
    eraseLastNum();
    showKeyDown(backspaceBtn, "changeBtnBackground");
  }
});

numBtns.forEach(numBtn => {
  numBtn.addEventListener("click", e => {
    getNumber(e.target.textContent);
  });
});

opBtns.forEach(opBtn => {
  opBtn.addEventListener("click", e => {
    selectOperator(e.target);
  });
});

equalBtn.addEventListener("click", getAnswer);

clearBtn.addEventListener("click", () => {
  clearValues();
  display.textContent = "0";
});

backspaceBtn.addEventListener("click", eraseLastNum);
