// ===============================
// VARIABLES
// ===============================

let display =
    document.getElementById("display");

let firstNumber = null;

let operator = null;

let waitingForSecondNumber = false;


// ===============================
// THEME
// ===============================

let savedTheme =
    localStorage.getItem("calculatorTheme");


if (savedTheme === "light") {

    document.body.classList.add(
        "light-mode"
    );

    document.getElementById(
        "themeButton"
    ).innerText = "☀️";
}


// ===============================
// TOGGLE THEME
// ===============================

function toggleTheme() {

    document.body.classList.toggle(
        "light-mode"
    );

    let isLight =
        document.body.classList.contains(
            "light-mode"
        );


    if (isLight) {

        document.getElementById(
            "themeButton"
        ).innerText = "☀️";

        localStorage.setItem(
            "calculatorTheme",
            "light"
        );

    } else {

        document.getElementById(
            "themeButton"
        ).innerText = "🌙";

        localStorage.setItem(
            "calculatorTheme",
            "dark"
        );

    }

}


// ===============================
// LOAD HISTORY FROM DATABASE
// ===============================

async function showHistory() {

    try {

        let response =
            await fetch("/history");


        let history =
            await response.json();


        let historyList =
            document.getElementById(
                "history-list"
            );


        // No history
        if (history.length === 0) {

            historyList.innerHTML =
                '<p class="no-history">No calculations yet</p>';

            return;
        }


        // Clear old HTML
        historyList.innerHTML = "";


        // Display database history
        history.forEach(function(item) {

            let historyItem =
                document.createElement("div");


            historyItem.className =
                "history-item";


            historyItem.innerText =
                `${item.expression} = ${item.result}`;


            historyList.appendChild(
                historyItem
            );

        });

    } catch (error) {

        console.log(
            "History Error:",
            error
        );

    }

}


// ===============================
// CLEAR DATABASE HISTORY
// ===============================

async function clearHistory() {

    try {

        let response =
            await fetch(
                "/clear-history", {
                    method: "DELETE"
                }
            );


        let data =
            await response.json();


        console.log(data.message);


        // Refresh history
        showHistory();

    } catch (error) {

        console.log(
            "Clear History Error:",
            error
        );

    }

}


// ===============================
// LOAD HISTORY WHEN PAGE OPENS
// ===============================

showHistory();


// ===============================
// ADD NUMBER
// ===============================

function addNumber(number) {

    if (display.value === "Error") {

        display.value = "0";

    }


    if (display.value === "0") {

        display.value = number;

    } else if (waitingForSecondNumber) {

        display.value +=
            " " + number;

        waitingForSecondNumber =
            false;

    } else {

        display.value += number;

    }

}


// ===============================
// SET OPERATOR
// ===============================

function setOperator(selectedOperator) {

    if (
        firstNumber !== null &&
        operator !== null
    ) {

        return;

    }


    firstNumber =
        parseFloat(display.value);


    operator =
        selectedOperator;


    display.value =
        firstNumber +
        " " +
        selectedOperator;


    waitingForSecondNumber =
        true;

}


// ===============================
// CALCULATE
// ===============================

async function calculate() {

    let parts =
        display.value.split(" ");


    let secondNumber =
        parseFloat(
            parts[parts.length - 1]
        );


    if (isNaN(secondNumber)) {

        display.value = "Error";

        return;

    }


    if (
        firstNumber === null ||
        operator === null
    ) {

        return;

    }


    try {

        let response =
            await fetch(
                "/calculate", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        num1: firstNumber,

                        num2: secondNumber,

                        operator: operator

                    })

                }
            );


        let data =
            await response.json();


        if (data.error) {

            display.value =
                data.error;

        } else {

            display.value =
                data.result;


            // Database se fresh history load
            showHistory();

        }


        firstNumber = null;

        operator = null;

        waitingForSecondNumber =
            false;

    } catch (error) {

        display.value =
            "Server Error";

        console.log(error);

    }

}


// ===============================
// CLEAR DISPLAY
// ===============================

function clearDisplay() {

    display.value = "0";

    firstNumber = null;

    operator = null;

    waitingForSecondNumber =
        false;

}


// ===============================
// DELETE NUMBER
// ===============================

function deleteNumber() {

    if (waitingForSecondNumber) {

        return;

    }


    if (
        display.value.length > 1
    ) {

        display.value =
            display.value.slice(
                0, -1
            );

    } else {

        display.value = "0";

    }

}


// ===============================
// PERCENTAGE
// ===============================

function percentage() {

    let number =
        parseFloat(
            display.value
        );


    if (!isNaN(number)) {

        let result =
            number / 100;


        display.value =
            result;

    }

}


// ===============================
// SQUARE
// ===============================

function square() {

    let number =
        parseFloat(
            display.value
        );


    if (!isNaN(number)) {

        let result =
            number * number;


        display.value =
            result;

    }

}


// ===============================
// SQUARE ROOT
// ===============================

function squareRoot() {

    let number =
        parseFloat(
            display.value
        );


    if (!isNaN(number)) {

        let result =
            Math.sqrt(number);


        display.value =
            result;

    }

}


// ===============================
// POWER
// ===============================

function power() {

    if (firstNumber !== null) {

        return;

    }


    firstNumber =
        parseFloat(
            display.value
        );


    operator = "^";


    display.value =
        firstNumber + " ^";


    waitingForSecondNumber =
        true;

}


// ===============================
// MODULUS
// ===============================

function modulus() {

    if (firstNumber !== null) {

        return;

    }


    firstNumber =
        parseFloat(
            display.value
        );


    operator = "%";


    display.value =
        firstNumber + " %";


    waitingForSecondNumber =
        true;

}


// ===============================
// SIN
// ===============================

function sinValue() {

    let number =
        parseFloat(
            display.value
        );


    if (!isNaN(number)) {

        let result =
            Math.sin(
                number *
                Math.PI /
                180
            );


        display.value =
            result;

    }

}


// ===============================
// COS
// ===============================

function cosValue() {

    let number =
        parseFloat(
            display.value
        );


    if (!isNaN(number)) {

        let result =
            Math.cos(
                number *
                Math.PI /
                180
            );


        display.value =
            result;

    }

}


// ===============================
// TAN
// ===============================

function tanValue() {

    let number =
        parseFloat(
            display.value
        );


    if (!isNaN(number)) {

        let result =
            Math.tan(
                number *
                Math.PI /
                180
            );


        display.value =
            result;

    }

}


// ===============================
// LOG
// ===============================

function logValue() {

    let number =
        parseFloat(
            display.value
        );


    if (!isNaN(number) &&
        number > 0
    ) {

        let result =
            Math.log10(number);


        display.value =
            result;

    } else {

        display.value =
            "Error";

    }

}


// =================================================
// KEYBOARD SUPPORT
// =================================================

document.addEventListener(
    "keydown",
    function(event) {


        if (
            event.key >= "0" &&
            event.key <= "9"
        ) {

            addNumber(event.key);

        } else if (
            event.key === "."
        ) {

            addNumber(".");

        } else if (
            event.key === "+"
        ) {

            setOperator("+");

        } else if (
            event.key === "-"
        ) {

            setOperator("-");

        } else if (
            event.key === "*"
        ) {

            setOperator("*");

        } else if (
            event.key === "/"
        ) {

            event.preventDefault();

            setOperator("/");

        } else if (
            event.key === "Enter"
        ) {

            calculate();

        } else if (
            event.key === "Backspace"
        ) {

            deleteNumber();

        } else if (
            event.key === "Escape"
        ) {

            clearDisplay();

        }

    }
);