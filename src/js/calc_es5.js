//IIFE (Immediately Invoked Function Expression)
//The function will be immediately executed
//this will use the function's scope instead of the global scope
(function() {
    //Utility class that is responsible for the calculator view
    var calculatorView = {
        updateResultView: function(text) {
            resultElement.innerText = text;
        },
        showMessage: function(message) {
            globalMessageElement.innerText = message;
        }
    };
    
    /**
     * Used as a proxy for every click handler on the calculator buttons
     */
    function handleCalculatorKey(handler, event) {
        var key = event.target;
        if (key.matches('a')) {
            handler(key);
        }
    }

    /**
     * Handles each click on any of the calculator buttons
     * @param {Object} calculator the calculator instance
     * @param {Event} event the click event
     */
    function handleCalculatorButtonClick(calculator, key) {
        var action = key.dataset.action;
        if (action) {
            console.log("action: " + action);
            calculator.handleAction(action);
        } else {
            console.log("Number: " + key.innerText);
            calculator.appendNumber(key.innerText);
        }
    }
    /**
     * Claculator class that is responsible for the calculations and state
     * @param {Object} calculatorView The calculator view manager
     */
    function Calculator(calculatorView) {
        this.calculatorView = calculatorView;
        this.clearState();
    }

    Calculator.prototype.clearState = function() {
        this.firstNumber = "";
        this.secondNumber = "";
        this.operation = "";
    };

    Calculator.prototype.handleAction = function(action) {
        switch (action) {
            case "clear":
                this.clearState();
                this.calculatorView.updateResultView("0");
                this.calculatorView.showMessage("");
                break;
            case "sign":
            case "percent":
                this.notSupported(action);
                break;
            case "decimal":
                this.appendNumber(".");
                break;
            case "calc":
                this.calcResult();
                this.clearState();
                break;
            case "divide":
            case "multiply":
            case "add":
            case "subtract":
                this.operation = action;
                break;
            default:
                this.notSupported(action);
                break;
        }
    };
    Calculator.prototype.appendNumber = function(number) {
        if (this.operation) {
            this.secondNumber += number;
            this.calculatorView.updateResultView(this.secondNumber);
        } else {
            this.firstNumber += number;
            this.calculatorView.updateResultView(this.firstNumber);
        }
    };
    Calculator.prototype.notSupported = function(action) {
        var message = "Sorry the operation \"" + action + "\" is not supported";
        this.calculatorView.showMessage(message);
        console.log(message);
        this.secondNumber = "";
        this.operation = "";
    };
    Calculator.prototype.calcResult = function(action) {
        var n1 = parseFloat(this.firstNumber);
        var n2 = parseFloat(this.secondNumber);
        switch (this.operation) {
            case "divide":
                this.calculatorView.updateResultView(n1 / n2);
                break;
            case "multiply":
                this.calculatorView.updateResultView(n1 * n2);
                break;
            case "add":
                this.calculatorView.updateResultView(n1 + n2);
                break;
            case "subtract":
                this.calculatorView.updateResultView(n1 - n2);
                break;
        }
    };

    //create one listener on the parent
    var calculatorElement = document.querySelector('#calculator');
    var globalMessageElement = document.querySelector('#globalMessage');
    var resultElement = calculatorElement.querySelector("span.calc-result");

    //create Calculator instance
    var calculator = new Calculator(calculatorView);

    //add the click event listener on the calculator element
    calculatorElement.addEventListener("click", handleCalculatorKey.bind(this, handleCalculatorButtonClick.bind(this, calculator)));

    calculatorElement.addEventListener("mouseup", handleCalculatorKey.bind(this, function(key) {
        key.classList.remove('click-feedback');
    }));
    calculatorElement.addEventListener("mousedown", handleCalculatorKey.bind(this, function(key) {
        key.classList.add('click-feedback');
    }));

    // creates a listener per element
    // var buttonsList = document.querySelector('#calculator a');
    // for (var i = 0; i < buttonsList.length; i++) {
    //   buttonsList[i].addEventListener("click", handleCalculatorButtonClick.bind(this, calculator));
    // }
})();