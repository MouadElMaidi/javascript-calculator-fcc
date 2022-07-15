import './App.css';
import React from 'react'

function App() {
  const [bottomDisplay, setBottomDisplay] = React.useState("0")
  const [statement, setstatement] = React.useState("0")
  const [answer, setAnswer] = React.useState("");
  const [upperDisplay, setUpperDisplay] = React.useState("")


  React.useEffect(() => {
    if(answer !== ""){
      setUpperDisplay(statement + "=" + answer);
    }
    else
      setUpperDisplay(statement)
  }, [statement, answer])

  function endWithOperator(prev) {
    const endsWithOperatorRegex = /([/]|[+]|-|x)$/
    return endsWithOperatorRegex.test(prev)
  }


  function calculate(arr) {
    const operatorRegex = /([+]|x|[/]|-)/
    const modified = arr.replace("--", "+")
    //transform the string to an array of numbers and operators
    const newarr = modified.split(operatorRegex).filter(el => el !== "")
    //dealing with negative numbers
    for (let i = 0; i < newarr.length; i++) {
      if (newarr[i - 1] === "-") {
        newarr.splice(i - 1, 2, "-" + newarr[i])
      }
    }
    const operatorRegex2 = /([+]|x|[/])/
    const turnTonums = newarr.map(element =>
      operatorRegex2.test(element) ? element : parseFloat(element)
    )

    for (let i = 0; i < turnTonums.length; i++) {
      if (turnTonums[i] === "x") {
        const mult = turnTonums[i - 1] * turnTonums[i + 1]
        turnTonums.splice(i - 1, 3, mult)
      }
      if (turnTonums[i] === "/") {
        const divide = turnTonums[i - 1] / turnTonums[i + 1]
        turnTonums.splice(i - 1, 3, divide)
      }
    }
    const removePlus = turnTonums.filter(el => el !== "+")
    const resultBeforeRounding = removePlus.reduce((acc, elem) => acc + elem, 0)
    return Math.round(resultBeforeRounding * 100000) / 100000
  }


  function handleNumClick(event) {
    const numClicked = event.target.innerHTML;
    if(answer !== "") {
      setstatement("0")
      setAnswer("")
    }
    setstatement(prev => {
      if (prev === "0") {
        if (numClicked === ".") {
          return prev + numClicked
        }
        return numClicked;
      }
      if (numClicked === ".") {
        if (endWithOperator(prev)) {
          return prev + "0."
        }
        if (prev.endsWith(".")) {
          return prev;
        }
      }
      return prev + numClicked;
    })
  }


  function reset() {
    setstatement("0")
    setAnswer("")
    setBottomDisplay("0");
    setstatement("0");
  }

  function handleOperatorClick(event) {
    const operator = event.target.innerHTML;
    if(answer !== "") {
      setstatement(answer);
      setAnswer("");
    }
    setstatement(prev => {
      if (prev.endsWith("-") && endWithOperator(prev.substring(0, prev.length - 1))) {
        if (operator !== "-")
          return prev.substring(0, prev.length - 2) + operator
        else
          return prev
      }
      if (operator !== "-") {
        if (endWithOperator(prev)) {
          return prev.substring(0, prev.length - 1) + operator;
        }
      }


      return prev + operator;
    })
  }
  function handleEqualClick() {
    const endWithOpRegex = /(-|[+]|[/]|x)$/
    const endsWithOp = endWithOpRegex.test(statement);
    const endsWithTwoOps = endWithOpRegex.test(statement.substring(0, statement.length));
    let finalResult = "";
    if (endsWithOp) {
      finalResult = (calculate(statement.substring(0, statement.length - 1)))
      setstatement(prev => prev.substring(0, prev.length - 1));
      setAnswer(finalResult.toString())
      return
    }
    if (endsWithTwoOps) {
      finalResult = (calculate(statement.substring(0, statement.length - 2)))
      setstatement(prev => prev.substring(0, prev.length - 2));
      setAnswer(finalResult.toString())
      return
    }
    else {
      finalResult = calculate(statement);
      setAnswer(finalResult.toString())
      return
    }
  }

  const numArr = [];
  for (let i = 1; i < 10; i++) {
    numArr.push(<button key={i} className="calculator--number--button"
      onClick={(event) => handleNumClick(event)} id={i}>
      {i}
    </button>)
  }

  console.log("rendered")
  return (
    <div className="calculator">
      <div className='calculator--display'>
        <div className="calculator--display--above">{upperDisplay}</div>
        <div className="calculator--display--below">{bottomDisplay
        }</div>
      </div>
      <div className='calculator--buttons'>
        <button className='calculator--ac--button'
          onClick={reset}>AC</button>
        <button className="calculator--operator--button"
          onClick={(event) => handleOperatorClick(event)}>/</button>
        <button className="calculator--operator--button"
          onClick={(event) => handleOperatorClick(event)}>x</button>
        {numArr}
        <button className="calculator--operator--button subtract"
          onClick={(event) => handleOperatorClick(event)}>-</button>
        <button className="calculator--operator--button add"
          onClick={(event) => handleOperatorClick(event)}>
          +
        </button>
        <button className="calculator--number--button zero"
          onClick={(event) => handleNumClick(event)} id="zero" value={0}>0</button>
        <button className="calculator--number--button dot"
          onClick={(event) => handleNumClick(event)} id="dot" value={"."}>.</button>
        <button className="calculator--equal--button"
          onClick={handleEqualClick}>=</button>
      </div>
    </div>
  );
}

export default App;
