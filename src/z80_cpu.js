/**
 * This file defines the Z80 class
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

const registers = require('./z80_registers');
const memory = require('./z80_memory');
const decode = require('./z80_decoder');
const flagTables = require('./z80_flag_tables');

class Z80 {
    constructor() {
        this.memory = memory;
        this.registers = registers;

        let addFlagsArray = flagTables.generateAddFlagsArray();
        let subFlagsArray =flagTables.generateSubFlagsArray();
        let parityArray = flagTables.generateParityArray();
        let andFlagsArray = flagTables.generateAndFlagsArray();
        let orFlagsArray = flagTables.generateOrFlagsArray();
        let xorFlagsArray = flagTables.generateXorFlagsArray();
        this.tables = {
            addFlagsTable: addFlagsArray,
            subFlagsTable: subFlagsArray,
            andFlagsTable: andFlagsArray,
            orFlagsTable: orFlagsArray,
            xorFlagsTable: xorFlagsArray,
            parityTable: parityArray
        };
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

    /**
     * Returns a byte from memory and increments PC by one.
     * @returns byte from memory address PC
     */
    getByte(){
        this.registers.regsSp.PC++;
        return this.memory[this.registers.regsSp.PC - 1];
    }

    step() {
        const byte = this.getByte();
        decode(this, byte);        
    }

    getPC() {
        // TODO
    }
}

module.exports = Z80;