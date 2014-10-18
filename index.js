import EventEmitter from '../EventEmitter/index';

/**
 * @class Prompt
 * @extends EventEmitter
 *
 * @event 'focus' fired when input has gained focussed
 * @event 'input' fired with the keycode of the input
 * @event 'execute' fired on an input finish with the value of the input
 * @event 'delete' specific delete event for backspace
 * @event 'navigate' fired when arrow keys are pressed
 */
export default class Prompt extends EventEmitter  {

    /**
     * @constructs
     * @param el {HTMLElement} the element to attach to
     */
    constructor( el ) {

        this.parent = el;
        this.input = this.createInput();

        /**
         * Events
         */
        this.input.addEventListener( 'keypress', function( event ) {
            this.emit( 'input', String.fromCharCode( event.keyCode ) );
        }.bind( this ));


        this.input.addEventListener( 'keydown', function( event ) {
            // Handle enter
            if ( event.keyCode === 13 ) {
                event.preventDefault();
                this.emit( 'execute', this.input.value );
                this.input.value = '';
                return;
            }

            // Handle backspace
            if ( event.keyCode === 8 ) {
                this.emit( 'delete' );
            }

            // Handle arrow keys
            if ( event.keyCode >= 37 && event.keyCode <= 40 ) {
                this.emit( 'navigate', event.keyCode );
            }
        }.bind( this ));


        this.input.addEventListener( 'blur', function( event ) {
            this.emit( 'focus', false );
        }.bind( this ));
    }

    /**
     * Creates the input element and styles it
     *
     * @returns {HTMLInputElement}
     */
    createInput() {
        // Style for prompt
        var style = document.head.querySelector( '#tatty' );
        style.innerHTML = style.innerHTML.concat(`
            .tatty input {
                position: absolute;
                top: 0px;
                left: 0px;
                width: 1px;
                z-index: -1;
                opacity: 0;
            }
        `);

        // Create and append hidden input
        var input = document.createElement( 'input' );
        input.setAttribute( 'id', 'prompt' );
        this.parent.appendChild( input );

        return input;
    }

    /**
     * Focusses the input element. Additionally fires a convenience event.
     */
    focus() {
        this.input.focus();
        this.emit( 'focus', true );
    }
}
