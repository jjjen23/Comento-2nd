const display_res = document.getElementById("display_res");
const display_his = document.getElementById("display_his");
const MAX_LENGTH = 10;

// 초기값은 빈 문자열로
let currentHis = "";
// 초기값은 0으로 설정
let currentInput = "0";
// 초기 연산자는 null
let operator = null;
// 이전에 입력된 값 저장
let previousInput = null;

let operatorStack = []; // 연산자 스택
let outputQueue = []; // 후위 표기법 큐

// display_res변수에에 업데이트
function updateDisplay(value) {
  display_res.textContent = value;
}

function updateHistory(value) {
  display_his.textContent = value;
}

// AC 기능
function clearAll() {
  currentInput = "0";
  operator = null;
  previousInput = null;
  updateDisplay(currentInput);
  currentHis = ""
  updateHistory(currentHis);
}
// 부호변경 기능
function toggleSign() {
  currentInput = String(parseFloat(currentInput) * -1);
  updateDisplay(currentInput);
}
// % 변환 기능
function applyPercent() {
  currentInput = String(parseFloat(currentInput) / 100);
  updateDisplay(currentInput);
}


// 입력값에 값 추가(문자형식으로 추가됨 1+3 = 13)
function handleNumber(value) {
  // 최대 10글자까지만 계산 가능 하도록 제한
  if (currentInput.length < MAX_LENGTH) {
    if (currentInput === "0") {
      currentInput = value;
    } else {
      currentInput += value;
    }
  }
  updateDisplay(currentInput);

  //계산 현황에 숫자 추가가
  currentHis += value;
  updateHistory(currentHis);
}

// 연산자 우선순위 반환(숫자가 클 수록 높은 우선순위)
function getPrecedence(op) {
  if (op === "+" || op === "-") return 1;
  if (op === "*" || op === "/") return 2;
  return 0;
}

// 후위 표기법 큐에 추가
function handleOperator(op) {
  if (currentInput !== "") {
    outputQueue.push(currentInput); // 현재 입력값을 출력 큐에 추가
    currentInput = "";
  }
  
  // 스택에 연산자가 있고, 현재 연산자의 우선순위가 스택의 맨 위 연산자보다 낮거나 같을 경우
  while (
    operatorStack.length > 0 &&
    // 우선순위 계산
    getPrecedence(op) <= getPrecedence(operatorStack[operatorStack.length - 1])
  ) {
    // 스택의 연산자를 꺼내서, 출력 큐에 추가
    outputQueue.push(operatorStack.pop());
  }
  operatorStack.push(op); // 현재 연산자를 스택에 추가

  currentHis += `${op}`;
  updateHistory(currentHis);
}

// 연산자 우선순위에 따라 계산 수행
function calculatePostfix() {
  const stack = [];
  outputQueue.forEach((token) => {
    // 숫자일경우 -> True
    if (!isNaN(token)) {
      stack.push(parseFloat(token));
    } else {
      const b = stack.pop();
      const a = stack.pop();
      switch (token) {
        case "+":
          stack.push(a + b);
          break;
        case "-":
          stack.push(a - b);
          break;
        case "*":
          stack.push(a * b);
          break;
        case "/":
          stack.push(a / b);
          break;
      }
    }
  });
  return stack[0];
}

// = 버튼 동작 처리
function handleCalculate() {
  if (currentInput !== "") {
    outputQueue.push(currentInput);
    currentInput = "";
  }

  while (operatorStack.length > 0) {
    outputQueue.push(operatorStack.pop());
  }

  const result = calculatePostfix();
  updateDisplay(result);

  // 계산 후 상태 초기화
  currentHis = "";
  updateHistory(currentHis);
  operatorStack = [];
  outputQueue = [];
  currentInput = String(result);
}

// numGroup에 클릭 리스너 등록록
document.querySelector(".numGroup").addEventListener("click", (e) => {
  // num 클래스를 가진 부모요소를 가져온다.
  const target = e.target.closest(".num");
  if (!target) return; //num클래스가 아니면 종료 

  // 버튼의 data-value 가져옴
  const value = target.dataset.value;
  // 버튼의 data-action을 가져옴
  const action = target.dataset.action;

  // 액션에 따라 동작 처리
  if (action === "clear") {
    clearAll();
  } else if (action === "toggle-sign") {
    toggleSign();
  } else if (action === "percent") {
    applyPercent();
  } else if (action === "operator") {
    handleOperator(target.dataset.value);
  } else if (action === "calculate") {
    handleCalculate();
  } else if (value) {
    handleNumber(value);
  }
});
