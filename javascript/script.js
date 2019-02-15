// TODO FIGURE OUT HOW TO ONLY UPDATE OPERAND ONCE THE NUMBER IS CHOSEN


calcApp = {}

// This property will store the calculator registry, on which the operand will be applied to (ie. the first number the user enters, before the chosen operator)
calcApp.registry = "";

// This property will store the operand, which will be applied to the registry based on the chosen operator (eg. if the user selected addition this property will be added to the registry)
calcApp.operand = "";

// This property will store the operator the user has chosen
calcApp.currentOperator = "";

// This property will store a string of what is in the current display
calcApp.displayString = "";

calcApp.displayToString = function() {
    // Create JQUERY object with all of the spans inside the DIV with a class of display
    const displayData = ($('.display > span'))
    // Clear the previous displayString
    calcApp.displayString = "";

    // Create a string out of the value of each span contained within the displayData object
    displayData.each(function (index, value) {
        calcApp.displayString += value.textContent;
    });
}

// DEFINE ALL OF THE CALCULATOR OPERANDS
calcApp.operators = {
    // Addition
    "+" : function () {
        calcApp.registry = calcApp.registry + calcApp.operand;
        calcApp.displayAnswer();   
    },
    // Subtraction
    "-" : function () {
        calcApp.registry = calcApp.registry - calcApp.operand;
        calcApp.displayAnswer();
    },
    // Division
    "/" : function() {
        if (calcApp.operand === 0 || calcApp.operand === "") {
            $('.display').empty();
            $('.display').append(`<span>DIV BY 0</span>`);
        } else {
            calcApp.registry = calcApp.registry / calcApp.operand;
            calcApp.displayAnswer();
        }

    },
    // Multiplication
    "x" : function() {
        calcApp.registry = calcApp.registry * calcApp.operand;
        calcApp.displayAnswer();
    },

};

calcApp.clear = function() {
    // Clear the display and the registry
    calcApp.clearDisplay();
    calcApp.updateOperand('registry');
}

calcApp.displayAnswer = function() {

    // If the value is more than 10 digits or has more than 7 decimals use scientific notation
    const decimals = calcApp.countDecimals();

    if (calcApp.registry > 9999999999 || decimals >= 7) {
        calcApp.registry = calcApp.registry.toExponential(4);
    }

    $('.display').empty();
    $('.display').append(`<span>${calcApp.registry}</span>`);
};


calcApp.updateDisplay = function(arg) {
    // User is limited to entering numbers with 10 digits or less and only one decimal place, end the function if any digits above 10 are entered or a second decimal place is entered
    const displayContents = $('.display > span');
    if (displayContents.length >= 10 || (calcApp.displayString.match(/\./) && arg.originalEvent.keyCode === 190)) return;
    // remove placeholder 0
    $('.placeholder').remove();

    // If input was a keypress insert a new span for each keypress with a value equal to the key which is pressed
    if (arg.keyCode) {
        $('.display').append(`<span>${arg.originalEvent.key}</span>`)

    // If input was a click insert a new span with the content of the button that was clicked
    } else {
        $('.display').append(`<span>${arg}</span>`)
    }
    calcApp.displayToString();
}

calcApp.clearDisplay = function() {
    // Empty the display and replace the placeholder 0
    $('.display').empty().append(`<span class="placeholder">0</span>`);
    
}

calcApp.updateOperand = function(operand) {
    calcApp.displayToString();
    // convert the ouputted string to a number
    calcApp[operand] = parseFloat(calcApp.displayString);

}


// FUNCTION FROM https://stackoverflow.com/questions/10454518/javascript-how-to-retrieve-the-number-of-decimals-of-a-string-number, comments are my own
calcApp.countDecimals = function() { 
    // Regular expression to match either the decimals after the . or number after the E (this took forever to understand)
    const match = ('' + calcApp.registry).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) { return 0; }
    // Return the higher of 0 (if there are no numbers after the decimal) or the equation below. 
    // Match[1].length will be the length of the matched REGEX string which will be equal to the amount of digits after the decimal.    
    // Match[2] will match if the number is in scientific notation and will contain both the operator (+ or - depending on if the decimals are before or after the decimal) and the number of decimals.
    // We subtract match[1].length from match[2] because a positive number in scientific notation will decrease the number of decimals while a negative number will increase them.
    return Math.max(
        0,
        // Number of digits right of decimal point.
        (match[1] ? match[1].length : 0)
        // Adjust for scientific notation.
        - (match[2] ? +match[2] : 0));
}

calcApp.keyPress = function() {
    $(document).on('keydown', function(e) {
        
        const $key = $(`.key[data-key="${e.keyCode}"]`);

        // If shift and the equals button is pressed simultaneously activate the plus key
        if (e.shiftKey === true && e.keyCode === 61) {
            // Add keypress styles to the plus key
            $('.key15').addClass('key-press');
            // Update the registry with the digits in the display
            calcApp.updateOperand('registry');
            // Clear the display
            calcApp.clearDisplay();
            calcApp.operand = "";
            calcApp.currentOperator = '+';
    
        // If shift and any other key is pressed end the function
        } else if (e.shiftKey === true && e.keyCode !== 61) {
            return;

        // If the keypress is a number between 0-9 do the following
        } else if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode === 190) {
            // Add key-press styles to the key which was pressed
            $key.addClass('key-press');
            calcApp.updateDisplay(e);

        // If escape or "c" is pressed clear the display and registry
        } else if (e.keyCode === 27 || e.keyCode === 67){
            $('.clear').addClass('key-press');
            calcApp.clear();
        // If equals or enter is pressed
        }else if (e.keyCode === 61 || e.keyCode === 13) {
            $key.addClass('key-press');
            if (calcApp.operand === "") calcApp.updateOperand('operand');

             
            
            // call the operator function that corresponds to the current operator
            calcApp.operators[calcApp.currentOperator]();
            
        }
        // If the keypress is one of the operators (plus, minus, etc.) do the following
        else {
            // If there is no div with a data-key that corresponds to the key pressed end the function
            if ($key.length === 0) return;
            $key.addClass('key-press');
            // Update the registry with the digits in the display
            calcApp.updateOperand('registry');
            // Clear the display
            calcApp.clearDisplay();
            calcApp.operand = "";
            // Store the current operator to whichever key was pressed so that it can be used when the equals key is pressed
            calcApp.currentOperator = e.key;
            

        }
    });
}


calcApp.keyClick = function () {
    $('.key').on('click', function(e) {
        
        const $clickedKey = $(this).data('content');

        // If the button clicked is a number between 0-9 do the following
        if (parseInt($clickedKey) >= 0 || parseInt($clickedKey) <= 9) {
            
            calcApp.updateDisplay($clickedKey);
        }
        // If the clear button is clicked
        else if ($clickedKey === "c") {

            calcApp.clearDisplay();
            calcApp.updateOperand('registry');
              
        // If equals is clicked
        } else if ($clickedKey === "=") {

            if (calcApp.operand === "") calcApp.updateOperand('operand');
            // call the operator function that corresponds to the current operator
            calcApp.operators[calcApp.currentOperator]();

        }
        // If the keypress is one of the operators (plus, minus, etc.) do the following
        else {
            
            calcApp.updateOperand('registry');
            calcApp.clearDisplay();

            calcApp.operand = "";

            // Store the current operator to whichever key was pressed so that it can be used when the equals key is pressed
            calcApp.currentOperator = $clickedKey;   
        }
        
    });
}


calcApp.removeTransition = function() {
    // Add an event listener to every key that waits until the "transform" transition ends and removes the "key-press" class
    const $keys = $('.key');
    $keys.on('transitionend', function(e) {
        if (e.originalEvent.propertyName !== 'transform') return;
        const $key = $(e.originalEvent.target);
        $key.removeClass('key-press');
    });
}

calcApp.init = function() {
    calcApp.keyPress();
    calcApp.removeTransition();
    calcApp.keyClick();
}

$(function() {
    calcApp.init();
    
});
