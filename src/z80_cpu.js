/**
 * This file defines the Z80 class
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

const registers = require('./z80_registers');
const memory = require('./z80_memory');
const ports = require('./z80_ports');
const decoder = require('./z80_decoder/z80_decoder');
const flagTables = require('./z80_flag_tables');
const i_8bit_arithm = require('./z80_instructions/ins_8bit_arithmetic');
const i_8bit_load = require('./z80_instructions/ins_8bit_load');
const i_16bit_arithm = require('./z80_instructions/ins_16bit_arithmetic');
const i_16bit_load = require('./z80_instructions/ins_16bit_load');
const i_exch_trans_search = require('./z80_instructions/ins_exch_trans_search');
const i_general_arithm = require('./z80_instructions/ins_general_arithm_cpu');
const i_rotate_shift = require('./z80_instructions/ins_rotate_shift');
const i_bitset = require('./z80_instructions/ins_bitset');
const i_jump = require('./z80_instructions/ins_jump');
const i_input_output = require('./z80_instructions/ins_input_output');
const i_data = require('./cpu.js');

const isNode = typeof process === 'object' &&
    typeof process.versions === 'object' &&
    typeof process.versions.node !== 'undefined';

let hrt0 = 0; // for use only in node by hrtime


const node_set_t0 = () => {
    hrt0 = process.hrtime(); // [seconds, nanoseconds]
}
const node_get_delta = () => {
    return process.hrtime(hrt0)[1] / 1000; // microseconds (us)
}
const browser_set_t0 = () => {
    hrt0 = performance.now(); // milliseconds (ms)
}
const browser_get_delta = () => {
    return (performance.now() - hrt0) * 1000; // microseconds (us)
};


class Z80 {
    /**
     * 
     * @param {number} clockSpeed Clock speed in Mhz
     */
    constructor(clockSpeed = 3.5) {
        this.clockSpeed = clockSpeed;
        this.cycleMicroseconds = 1 / clockSpeed;
        this.tCycles = 0; // Remaining T cycles for instruction use
        this.set_t0 = isNode ? node_set_t0 : browser_set_t0;
        this.get_delta = isNode ? node_get_delta : browser_get_delta;
        this.instructionTimer = 0;
        this.memory = memory;
        this.ports = ports;
        this.registers = registers;
        this.isHalt = false;
        this.interruptMode = 0;

        let addFlagsArray = flagTables.generateAddFlagsArray();
        let subFlagsArray = flagTables.generateSubFlagsArray();
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

        decoder.setCPU(i_data.z80);

        i_8bit_arithm.setCPU(i_data.z80);
        i_16bit_arithm.setCPU(i_data.z80);
        i_8bit_load.setCPU(i_data.z80);
        i_16bit_load.setCPU(i_data.z80);
        i_exch_trans_search.setCPU(i_data.z80);
        i_general_arithm.setCPU(i_data.z80);
        i_rotate_shift.setCPU(i_data.z80);
        i_bitset.setCPU(i_data.z80);
        i_jump.setCPU(i_data.z80);
        i_input_output.setCPU(i_data.z80);
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
    getByte() {
        const r16 = this.registers.regs16;
        let pc = r16.get(r16.idx.PC);
        pc++;
        r16.set(r16.idx.PC, pc);
        return this.memory[pc - 1];
    }

    exit() {
        clearTimeout(this.instructionTimer);
    }

    step() {
        let delta, waitTime;
        this.tCycles = 0;

        const byte = this.getByte();

        this.set_t0();
        decoder.decode(byte);

        delta = this.get_delta();
        waitTime = ((this.tCycles * this.cycleMicroseconds) - delta) / 1000; // (ms)
        waitTime = (waitTime < 0) ? 0 : waitTime;

        this.instructionTimer = setTimeout(this.step.bind(this), waitTime);
    }
}

module.exports = Z80;