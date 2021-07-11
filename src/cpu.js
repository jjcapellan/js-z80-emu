/**
 * This file share cpu data
 * @author Juan Jose Capellan <soycape@hotmail.com>
 */

 let z80 = {};
 const setData = (cpu) => {
     z80.CPU = cpu;
     z80.mem = cpu.memory;
     z80.ports = cpu.ports;
     z80.r8 = cpu.registers.regs8;
     z80.i8 = cpu.registers.regs8.idx;
     z80.r16 = cpu.registers.regs16;
     z80.i16 = cpu.registers.regs16.idx;;
     z80.flags = cpu.registers.flags;
     z80.fi = cpu.registers.flags.idx;
 }

 module.exports = { z80, setData };