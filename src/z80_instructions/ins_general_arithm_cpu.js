/**
 * This file implements Z80 general purpose arithmetic and cpu control instructions group
 * Info on page 172 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * 
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

//Flag masks
const S = 0b10000000;
const Z = 0b01000000;
const F5 = 0b00100000;
const H = 0b00010000;
const F3 = 0b00001000;
const PV = 0b00000100;
const N = 0b00000010;
const C = 0b00000001;

/**
* DAA
* 
* This instruction conditionally adjusts the Accumulator for BCD addition and subtraction
* operations. For addition (ADD, ADC, INC) or subtraction (SUB, SBC, DEC, NEG).
* Clock: 4T
*/
function daa(cpu) {
    const regs = cpu.registers.regs8;
    const f = regs.get(regs.idx.F);
    const a = regs.get(regs.idx.A);
    // Get adjustment and carry flag
    const nch = ((f & N) << 1) | ((f & C) << 1) | ((f & H) >> 4);
    const tableData = cpu.tables.daaTable[(nch << 8) | a];
    const adjustment = tableData & 0x00ff;
    const carryFlag = tableData >> 8;
    // Calc of flags
    const result = a + adjustment;
    let flags = 0;
    flags |= carryFlag;
    if (result & 0x80) flags |= S;
    if ((result & 0xff) == 0) flags |= Z;
    //if ((a & 0x0f) > (result & 0x0f)) flags |= H; <-- fail in tests, try next method in other functions
    if ((a ^ result) & 0x10) flags |= H;
    if (cpu.tables.parityTable[(result & 0xff)]) flags |= PV;
    flags |= (f & N);
    if (result & F3) flags |= F3;
    if (result & F5) flags |= F5;


    regs.set(regs.idx.A, (result & 0xff));
    regs.set(regs.idx.F, flags);
}

/**
* CPL
* 
* The contents of the Accumulator (Register A) are inverted (one’s complement).
* Clock: 4T
*/
function cpl(cpu) {
    const regs = cpu.registers.regs8;
    const a = regs.get(regs.idx.A);
    let f = regs.get(regs.idx.F);
    const result = a ^ 0xff;

    f |= H | N;
    if (result & F3) f |= F3;
    if (result & F5) f |= F5;
    regs.set(regs.idx.A, a ^ 0xff);
    regs.set(regs.idx.F, f);
}



/**
* NEG
* 
* The contents of the Accumulator are negated (two’s complement). This method is the
* same as subtracting the contents of the Accumulator from zero. 
* Clock: 8T
*/
function neg(cpu) {
    const regs = cpu.registers.regs8;
    const a = regs.get(regs.idx.A);
    const result = (0 - a) & 0xff;

    let f = cpu.tables.subFlagsTable[0 | a];
    if(a == 0x80) {
        f |= PV;
    } else {
        f &= (PV ^ 0xff);
    }
    if (a != 0){
        f |= C;
    } else {
        f &= (C ^ 0xff);
    }
    regs.set(regs.idx.A, result);
    regs.set(regs.idx.F, f);
}

/**
* CCF
* 
* The Carry flag in the F Register is inverted.
* Clock: 4T
*/
function ccf(cpu) {
    const regs = cpu.registers.regs8;
    const a = regs.get(regs.idx.A);
    let f = regs.get(regs.idx.F);
    const hf = f & C;
    const cf = 1 - hf;
    f = (f & (~H)) | (H*hf); // set h value
    f = (f & (~C)) | (C*cf); // set c value
    f = (f & (~N));          // reset n
    f = (f & (~F3)) | (a & F3);
    f = (f & (~F5)) | (a & F5);    
    regs.set(regs.idx.F, f);
}

/**
* SCF
* 
* The Carry flag in the F Register is set.
* Clock: 4T
*/
function scf(cpu) {
    const regs = cpu.registers.regs8;
    const a = regs.get(regs.idx.A);
    let f = regs.get(regs.idx.F);
    f &= (~H);
    f |= C; 
    f &=(~N);
    f = (f & (~F3)) | (a & F3);
    f = (f & (~F5)) | (a & F5);    
    regs.set(regs.idx.F, f);
}

/**
* HALT
* 
* The HALT instruction suspends CPU operation until a subsequent interrupt or reset is
* received. While in the HALT state, the processor executes NOPs to maintain memory
* refresh logic.
* Clock: 4T
*/
function halt(cpu) {
    cpu.isHalt = true;    
}

module.exports = {
    daa,
    cpl,
    neg,
    ccf,
    scf
}