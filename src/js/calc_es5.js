//IIFE (Immediately Invoked Function Expression)
//The function will be immediately executed
//this way we create a "Module" that encapsulated with it's own scope instead of using the Global scope

(function() {
    //A utility class that is responsible for managing the calculator view
    var calculatorView = {
        updateResultView: function(text) {
            resultElement.innerText = text;
        },
        showButtonFeedback: function(key) {
            key.classList.add('click-feedback');
        },
        hideButtonFeedback: function(key) {
            key.classList.remove('click-feedback');
        },
        showMessage: function(message) {
            //Using a 3rd party library that displays notifications
            iziToast.show({
                position: 'topRight',
                color: 'yellow',
                message: message
            });
        }
    };

    /**
     * Used as a proxy for every click handler on the calculator buttons
     */
    function applyToCalculatorKey(handler, event) {
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
    function calculatorButtonClickHandler(calculator, key) {
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
        this.total_1 = null; // holds the result for + and -
        this.total_2 = null; // holds the result for * and /
        this.op_1 = null; // holds the last + or -
        this.op_2 = null; // holds the last * or /
        this.number = null;
    };

    Calculator.prototype.handleAction = function(action) {
        switch (action) {
            case "clear":
                this.clearState();
                this.calculatorView.updateResultView("0");
                break;
            case "sign":
            case "percent":
                this.notSupported(action);
                break;
            case "decimal":
                this.appendNumber(".");
                break;
            case "calc":
            case "add":
            case "subtract":
                this.calc_1(action);
                if (action === "calc") {
                    this.calculatorView.updateResultView(this.total_1);
                    var tmp = this.total_1;
                    this.clearState();
                    this.number = tmp;
                }
                break;
            case "divide":
            case "multiply":
                this.calc_2(action);
                break;
            default:
                this.notSupported(action);
                break;
        }
    };

    Calculator.prototype.appendNumber = function(number) {
        if (this.number) {
            this.number += number;
        } else {
            this.number = number;
        }
        this.calculatorView.updateResultView(this.number);
    };

    Calculator.prototype.calc_1 = function(action) {
        var n = parseFloat(this.number);
        if (this.op_2) {
            this.total_2 = this.op_2 === "multiply" ? this.total_2 * n : this.total_2 / n;
            this.op_2 = null;
            n = this.total_2;
            this.total_2 = null;
        }
        if (this.op_1) {
            this.total_1 = this.op_1 === "add" ? this.total_1 + n : this.total_1 - n;
        } else {
            this.total_1 = n;
        }
        this.op_1 = action;
        this.number = null;
    };

    Calculator.prototype.calc_2 = function(action) {
        //1- if op_2 is null
        //1.1 total_2 = number
        //2- else
        //2.1- total_2 = total_2 op_2 number
        //3- number = null
        //4- op_2 = input
        var n = parseFloat(this.number);
        if (this.op_2) {
            this.total_2 = this.op_2 === "multiply" ? this.total_2 * n : this.total_2 / n;
        } else {
            this.total_2 = n;
        }
        this.number = null;
        this.op_2 = action;
    };

    Calculator.prototype.notSupported = function(action) {
        var message = "Sorry, the \"" + action + "\" operation is not yet supported";
        this.calculatorView.showMessage(message);
    };

    /**
     * wraps the handler with a function that applys the handler only on the calculator keys
     * @param {function} handler 
     */
    function handlerWrapper(handler) {
        return applyToCalculatorKey.bind({}, handler);
    }

    //create one listener on the parent
    var calculatorElement = document.querySelector('#calculator');
    var resultElement = calculatorElement.querySelector("span.calc-result");

    //create Calculator instance
    var calculator = new Calculator(calculatorView);
    var calculatorClickHandler = handlerWrapper(calculatorButtonClickHandler.bind({}, calculator));
    var calculatorShowClickFeedbackClickHandler = handlerWrapper(calculatorView.showButtonFeedback);
    var calculatorHideClickFeedbackClickHandler = handlerWrapper(calculatorView.hideButtonFeedback);

    //add the click event listener on the calculator element
    calculatorElement.addEventListener("click", calculatorClickHandler);
    calculatorElement.addEventListener("mouseup", calculatorHideClickFeedbackClickHandler);
    calculatorElement.addEventListener("mousedown", calculatorShowClickFeedbackClickHandler);

    // creates a listener per element
    // var buttonsList = document.querySelector('#calculator a');
    // for (var i = 0; i < buttonsList.length; i++) {
    //   buttonsList[i].addEventListener("click", handleCalculatorButtonClick.bind(this, calculator));
    // }
})();