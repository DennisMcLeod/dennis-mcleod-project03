// TODO FIGURE OUT HOW TO ONLY UPDATE OPERAND ONCE THE NUMBER IS CHOSEN


calcApp = {}

calcApp.registry = "";

calcApp.operand = "";

calcApp.currentOperator = "";

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
    "+" : function () {
        calcApp.registry = calcApp.registry + calcApp.operand;
        calcApp.displayAnswer();   
    },
    "-" : function () {
        calcApp.registry = calcApp.registry - calcApp.operand;
        calcApp.displayAnswer();
    },
    "/" : function() {
        if (calcApp.operand === 0 || calcApp.operand === "") {
            $('.placeholder').remove();
            $('.display').append(`<span>DIV BY 0</span>`);
        } else {
            calcApp.registry = calcApp.registry / calcApp.operand;
            calcApp.displayAnswer();
        }

    },
    "x" : function() {
        calcApp.registry = calcApp.registry * calcApp.operand;
        calcApp.displayAnswer();
    },

};

calcApp.displayAnswer = function() {
    $('.display').empty();
    $('.display').append(`<span>${calcApp.registry}</span>`);
};


calcApp.updateDisplay = function(e) {
    // End the function if there are 10 digits or a second decimal is entered.
    const displayContents = $('.display > span');
    if (displayContents.length >= 10 || (calcApp.displayString.match(/\./) && e.originalEvent.keyCode === 190)) return;
    // remove placeholder 0
    $('.placeholder').remove();
    // Insert a new span for each keypress with a value equal to the key which is pressed
    $('.display').append(`<span>${e.originalEvent.key}</span>`)

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

calcApp.keyPress = function() {
    $(document).on('keydown', function(e) {
        
        const $key = $(`.key[data-key="${e.keyCode}"]`);

        // If shift and the equals button is pressed simultaneously activate the plus key
        if (e.shiftKey === true && e.keyCode === 61) {
            // Add keypress styles to the plus key
            $('.key15').addClass('key-press');
            calcApp.updateOperand('registry');
            calcApp.clearDisplay();
    
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
            calcApp.clearDisplay();
            calcApp.updateOperand('registry');
            calc

        // If equals is pressed
        }else if (e.keyCode === 61) {
            $key.addClass('key-press');
            calcApp.updateOperand('operand');     
            calcApp.operators[calcApp.currentOperator]();
            
        }
        // If the keypress is one of the operators (plus, minus, etc.) do the following
        else {
            // If there is no div with a data-key that corresponds to the key pressed end the function
            if ($key.length === 0) return;
            
            $key.addClass('key-press');
            calcApp.updateOperand('registry');
            calcApp.clearDisplay();
            
            calcApp.currentOperator = e.key;
            

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
}

$(function() {
    calcApp.init();

});
