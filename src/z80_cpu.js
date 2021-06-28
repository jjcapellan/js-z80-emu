/**
 * This file defines the Z80 class
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

const registers = require('./z80_registers');
const memory = require('./z80_memory');

class Z80 {
    constructor() {
        this.memory = memory;
        this.registers = registers;
    }

    /**
     * Loads the bytes contained in a Uint8Array (src) into a specific address (pos) of the z80 memory.
     * @param {Uint8Array} src Data to copy in memory
     * @param {number}     pos Memory address where copy starts
     */
    load(src, pos) {
        for (let i = 0; i < src.length; i++) {
            this.memory[pos + i] = src[i];
        }
    }

    step() {
        // TODO
    }

    getPC() {
        // TODO
    }
}

module.exports = Z80;