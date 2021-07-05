/**
 * This file implements Z80 general purpose arithmetic and cpu control instructions group
 * Info on page 172 of [manual](http://www.zilog.com/docs/z80/um0080.pdf)
 * 
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

 let CPU = {};
 let r8, i8;
 const setCPU = (cpu) => {
     CPU = cpu;
     r8 = CPU.registers.regs8;
     i8 = r8.idx;
 }

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
function daa() {
    const f = r8.get(i8.F);
    const a = r8.get(i8.A);
    // Get adjustment and carry flag
    const nch = ((f & N) << 1) | ((f & C) << 1) | ((f & H) >> 4);
    const tableData = CPU.tables.daaTable[(nch << 8) | a];
    const adjustment = tableData & 0x00ff;
    const carryFlag = tableData >> 8;
    // Calc of flags
    const result = a + adjustment;
    let flags = 0;
    flags |= carryFlag;
    if (result & 0x80) flags |= S;
    if ((result & 0xff) == 0) flags |= Z;
    if ((a ^ result) & 0x10) flags |= H; // <-- Try in more test
    if (CPU.tables.parityTable[(result & 0xff)]) flags |= PV;
    flags |= (f & N);
    if (result & F3) flags |= F3;
    if (result & F5) flags |= F5;


    r8.set(i8.A, (result & 0xff));
    r8.set(i8.F, flags);
}

/**
* CPL
* 
* The contents of the Accumulator (Register A) are inverted (one’s complement).
* Clock: 4T
*/
function cpl() {
    const a = r8.get(i8.A);
    let f = r8.get(i8.F);
    const result = a ^ 0xff;

    f |= H | N;
    if (result & F3) f |= F3;
    if (result & F5) f |= F5;
    r8.set(i8.A, a ^ 0xff);
    r8.set(i8.F, f);
}



/**
* NEG
* 
* The contents of the Accumulator are negated (two’s complement). This method is the
* same as subtracting the contents of the Accumulator from zero. 
* Clock: 8T
*/
function neg() {
    const a = r8.get(i8.A);
    const result = (0 - a) & 0xff;

    let f = CPU.tables.subFlagsTable[0 | a];
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
    r8.set(i8.A, result);
    r8.set(i8.F, f);
}

/**
* CCF
* 
* The Carry flag in the F Register is inverted.
* Clock: 4T
*/
function ccf() {
    const a = r8.get(i8.A);
    let f = r8.get(i8.F);
    const hf = f & C;
    const cf = 1 - hf;
    f = (f & (~H)) | (H*hf); // set h value
    f = (f & (~C)) | (C*cf); // set c value
    f = (f & (~N));          // reset n
    f = (f & (~F3)) | (a & F3);
    f = (f & (~F5)) | (a & F5);    
    r8.set(i8.F, f);
}

/**
* SCF
* 
* The Carry flag in the F Register is set.
* Clock: 4T
*/
function scf() {
    const a = r8.get(i8.A);
    let f = r8.get(i8.F);
    f &= (~H);
    f |= C; 
    f &=(~N);
    f = (f & (~F3)) | (a & F3);
    f = (f & (~F5)) | (a & F5);    
    r8.set(i8.F, f);
}

/**
* HALT
* 
* The HALT instruction suspends CPU operation until a subsequent interrupt or reset is
* received. While in the HALT state, the processor executes NOPs to maintain memory
* refresh logic.
* Clock: 4T
*/
function halt() {
    CPU.isHalt = true;    
}

/**
* DI
* 
* DI disables the maskable interrupt by resetting the interrupt enable flip-flops (IFF1 and
* IFF2). 
* Clock: 4T
*/
function di() {
    CPU.registers.iff.IFF1 = false;    
    CPU.registers.iff.IFF2 = false;
}

/**
* EI
* 
* The enable interrupt instruction sets both interrupt enable flip flops (IFFI and IFF2) to a
* logic 1, allowing recognition of any maskable interrupt. 
* Clock: 4T
*/
function ei() {
    CPU.registers.iff.IFF1 = true;    
    CPU.registers.iff.IFF2 = true;
}

/**
* IM x
* 
* The IM 0 instruction sets Interrupt Mode 0. In this mode, the interrupting device can insert
* any instruction on the data bus for execution by the CPU. The first byte of a multi-byte
* instruction is read during the interrupt acknowledge cycle. Subsequent bytes are read in by
* a normal memory read sequence.

* The IM 1 instruction sets Interrupt Mode 1. In this mode, the processor responds to an
* interrupt by executing a restart at address 0038h.
*
* The IM 2 instruction sets the vectored Interrupt Mode 2. This mode allows an indirect call
* to any memory location by an 8-bit vector supplied from the peripheral device. This vector
* then becomes the least-significant eight bits of the indirect pointer, while the I Register in
* the CPU provides the most-significant eight bits. This address points to an address in a
* vector table that is the starting address for the interrupt service routine.
*
* Clock: 8T
*/
function im(interruptMode) {
    CPU.interruptMode = interruptMode;
}

module.exports = {
    daa,
    cpl,
    neg,
    ccf,
    scf,
    halt,
    di,
    ei,
    im,
    setCPU
}