// *** HTML Calculator JavaScript *** //

// Set up local storage values
sessionStorage.setItem("summ1", 0);
sessionStorage.setItem("summ2", 0);

// We want all the page content to load before rendering to the screen and triggering scripts and styling
document.addEventListener('DOMContentLoaded', () => { 

});

// Set up default variable values
let str = '';
let displayString = '0';
let display = document.getElementById('display');
let activeCalculation = '';
let sumAray = ['', '', ''];
const calculator = document.querySelector('.calculator');
const operators = calculator.querySelector('.operator-keys');
const action = operators.dataset.action;
let modifier = 'inactive';
let regularButtons = document.querySelectorAll('.integers, .special, .float, .zero');

// Updates the calulator 'screen'
updateDisplay = () => {
  display.innerHTML = displayString;
}

regularButtons.forEach(occurence => {
  occurence.addEventListener('mousedown', (e) => {
    e.target.classList.add('hover-state')
  });
  occurence.addEventListener('mouseup', (e) => {
    e.target.classList.remove('hover-state')
  });
});

// Reset the 'active' operator key
resetOperators = () => {
  let operatorKeys = document.querySelectorAll('.operators');
  operatorKeys.forEach(operator => {
    operator.classList.remove('selected-operator');
  });
}

// Clear the display string, and any classes used for conditionals
clearDisplay = () => {
  if ((display.classList.contains('defaultValue')) && (String(displayString).indexOf('0.') != 0)) {
    displayString = '';
    updateDisplay();
    display.classList.remove('defaultValue');
  } else if ((modifier == 'active') || (display.classList.contains('hasResult'))) {
    displayString = '';
    updateDisplay();
    modifier = 'inactive';
    display.classList.remove('hasResult');
  }
}

// Build the number string
document.querySelectorAll('button').forEach(occurence => {
  occurence.addEventListener('click', (e) => {
    let elementClass = e.target.className;
    let elementId = e.target.id;
    console.log(`${elementId} ${elementClass}`)
    String(displayString);
    // Determine which key was clicked and carry out tasks accordingly
    switch (elementClass) {
      case 'integers':
        
          // We want to overwrite the default zero value, but only if it is not a decimal
          clearDisplay();
          resetOperators();
          // Update each subsequent key to the string
          str = elementId.match(/\d+/);
        break;
    
      case 'float':
        // We only want one decimal point in the string, and a decimal point by itself cannot overwrite the default zero value
        resetOperators();
        let dotTest = String(displayString).includes('.', 0);
        if (dotTest != true) {
          str = '.';
        } else {
          str = '';
        }
        break;

      case 'zero':
        resetOperators();
        // Only add an additional zero to the string if it is not the default value
        if ((String(displayString).indexOf('0') == 0) && (String(displayString).indexOf('0.') != 0)) {
          return false;
        } else {
          str = '0';
        }
       break;
      
      case 'operators':
        resetOperators();
        const action = e.target.dataset.action;
        if (
          action === 'division' ||
          action === 'multiplication' ||
          action === 'subtraction' ||
          action === 'addition'
        ) {
          activeCalculation = action;
          e.target.classList.add('selected-operator');
          // Add custom attribute
          if (modifier == 'inactive') {
            sessionStorage.setItem('firstValue', displayString);
            modifier = 'active';
          } else if (modifier == 'active') {
            console.log(modifier);
            sessionStorage.setItem('secondValue', displayString);
            modifier = 'inactive';
          }
        } else if ( action === 'equals') {
            if (activeCalculation == '') {
              return false;
            } else {
            sessionStorage.setItem('secondValue', displayString);
            console.log(`First value = ${sessionStorage.getItem('firstValue')}`); 
            console.log(`Second value = ${sessionStorage.getItem('secondValue')}`);
            let sum1 = parseFloat(sessionStorage.getItem('firstValue'));
            let sum2 = parseFloat(sessionStorage.getItem('secondValue'));
            if ((sum1 !== null) && (sum2 !== null)) {
              calculate(activeCalculation, sum1, sum2)
            } else if ((sum1 === null) || (sum2 === null)) {
              return false;
            }
          }
        }
           
      default:
        return false;
    }
    // Complete the string and update the display
    displayString += str;
    updateDisplay();
  });
});

// Clear the stored values and reset the calculaor display to zero
document.getElementById('clearAll').addEventListener('click', () => {
  sessionStorage.clear();
  display.classList.add('defaultValue');
  resetOperators();
  displayString = '0';
  updateDisplay();
});

// Plus/minus key functionality - toggles between positive and negative integers
document.getElementById('plusMinus').addEventListener('click', () => {
  let dotTest = String(displayString).includes('-');
  if (dotTest != true) {
    displayString = '-' + displayString;
    updateDisplay();
  } else {
    displayString = displayString.slice(1);
    updateDisplay();
  }
  console.log(displayString);
});

// Percentage key functionality - divides the sum in the display by 100
document.getElementById('percentage').addEventListener('click', () => {
  displayString = parseFloat(displayString)/100;
  display.classList.add('div100');
  updateDisplay();
});


// Pass in the type of caclulation and numbers to be operated on
// Carry out the selected calculation and log the result to the console
function calculate (activeCalculation, sum1, sum2) {
  let result = null;
  switch (activeCalculation) {
    case 'division':
      result = sum1 / sum2;
      console.log(`${sum1} divided by ${sum2} equals ${result}.`);
   
      break;

    case 'multiplication':
      result = sum1 * sum2;
      console.log(`${sum1} multipied by ${sum2} equals ${result}.`);

      break;

    case 'subtraction':
      result = sum1 - sum2;
      console.log(`${sum1} minus ${sum2} equals ${result}.`);
  
      break;

    case 'addition':
      result = sum1 + sum2;
      console.log(`${sum1} plus ${sum2} equals ${result}.`);
  
      break;

    default:
      break;
  }
  displayString = result;
  console.log(result);
  updateDisplay();
  modifier = 'inactive';
  display.classList.add('hasResult');
}