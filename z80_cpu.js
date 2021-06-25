/**
 * This file defines the Z80 class
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

const registers = require('./z80_registers');
const memory = require('./z80_memory');

class Z80 {
    constructor(){
        this.memory = memory;
        this.registers = registers;
    }

    step(){
        // TODO
    }

    getPC(){
        // TODO
    }
}