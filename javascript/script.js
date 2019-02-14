calcApp = {}

calcApp.registry = "";

calcApp.displayString = "";

calcApp.displayToString = function() {
    const displayData = ($('.display > span'))
    calcApp.displayString = "";

    displayData.each(function (index, value) {
        calcApp.displayString += value.textContent;
    });
}

calcApp.updateDisplay = function(e) {
    // remove placeholder 0
    const displayContents = $('.display > span');
    if (displayContents.length >= 10 || (calcApp.displayString.match(/\./) && e.originalEvent.keyCode === 190)) return;
    $('.placeholder').remove();
    // End the function if there are 10 digits or a second decimal is entered.
    // if (calcApp.displayString.match(/\./).length > 0 && e.originalEvent.key === 190) return;
    // Insert a new span for each keypress with the value pressed
    $('.display').append(`<span>${e.originalEvent.key}</span>`)

    calcApp.displayToString();
    // console.log(e.originalEvent.keyCode);
}

calcApp.clearDisplay = function() {
    // Empty the display and replace the placeholder 0
    $('.display').empty().append(`<span class="placeholder">0</span>`);
    
}

calcApp.updateRegistry = function() {
    // clear the registry
    
    calcApp.displayToString();
    // convert the ouputted string to a number
    calcApp.registry = parseFloat(calcApp.displayString);

}

calcApp.keyPress = function() {
    $(document).on('keydown', function(e) {
        
        const $key = $(`.key[data-key="${e.keyCode}"]`);
        // If shift and the equals button is pressed simultaneously activate the plus key
        if (e.shiftKey === true && e.keyCode === 61) {
            // Add keypress styles to the plus key
            $('.key15').addClass('key-press');
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
        }
        
        // Lastly if the keypress is one of the operators (equals, plus, minus, etc.) do the following
        else {
            if ($key.length === 0) return;
            $key.addClass('key-press');
            calcApp.updateRegistry();
            calcApp.clearDisplay();
        }
    });
}

calcApp.removeTransition = function() {
    // Remove key-press class when the transition ends
    
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
