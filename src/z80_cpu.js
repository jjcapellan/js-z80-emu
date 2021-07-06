/**
 * This file defines the Z80 class
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

const registers = require('./z80_registers');
const memory = require('./z80_memory');
const decode = require('./z80_decoder');
const flagTables = require('./z80_flag_tables');
const i_8bit_arithm = require('./z80_instructions/ins_8bit_arithmetic');
const i_8bit_load = require('./z80_instructions/ins_8bit_load');
const i_16bit_load = require('./z80_instructions/ins_16bit_load');
const i_exch_trans_search = require('./z80_instructions/ins_exch_trans_search');
const i_general_arithm = require('./z80_instructions/ins_general_arithm_cpu');
const i_data = require('./cpu.js');

class Z80 {
    constructor() {
        this.memory = memory;
        this.registers = registers;
        this.isHalt = false;
        this.interruptMode = 0;

        let addFlagsArray = flagTables.generateAddFlagsArray();
        let subFlagsArray =flagTables.generateSubFlagsArray();
        let parityArray = flagTables.generateParityArray();
        let andFlagsArray = flagTables.generateAndFlagsArray();
        let orFlagsArray = flagTables.generateOrFlagsArray();
        let xorFlagsArray = flagTables.generateXorFlagsArray();
        let daaArray = flagTables.generateDaaArray();
        this.tables = {
            addFlagsTable: addFlagsArray,
            subFlagsTable: subFlagsArray,
            andFlagsTable: andFlagsArray,
            orFlagsTable: orFlagsArray,
            xorFlagsTable: xorFlagsArray,
            daaTable: daaArray,
            parityTable: parityArray
        };

        i_data.setData(this);
        i_8bit_arithm.setCPU(i_data.z80);
        i_8bit_load.setCPU(i_data.z80);
        i_16bit_load.setCPU(i_data.z80);
        i_exch_trans_search.setCPU(i_data.z80);
        i_general_arithm.setCPU(i_data.z80);
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
        const r16 = this.registers.regs16;
        let pc = r16.get(r16.idx.PC);
        pc++;
        r16.set(r16.idx.PC, pc);
        return this.memory[pc - 1];
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