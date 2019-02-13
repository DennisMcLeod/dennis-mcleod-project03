$(function() {
    let register = [];
     
    // DETERMINE WHICH KEY THE USER HAS PRESSED
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
        } else if (e.keyCode >= 48 && e.keyCode <= 57) {
            // Add key-press styles to the key which was pressed
            $key.addClass('key-press');

        // Lastly if the keypress is one of the operators (equals, plus, minus, etc.) do the following
        } else {
            if ($key.length === 0) return;
            console.log($key);
            $key.addClass('key-press');
        }

    });

    // Remove key-press class when the transition ends
    const $keys = $('.key');
    $keys.on('transitionend', function(e) {
        if (e.originalEvent.propertyName !== 'transform') return;
        const $key = $(e.originalEvent.target);
        $key.removeClass('key-press');
    });
    // 

    



});
