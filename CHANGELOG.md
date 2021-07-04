##v1.3.0-Alpha
* Added: **Z80.step()** . This function reads one byte from PC memory address and decodes it.
* Added: **Z80.tables** . This object contains some arrays of precalculated flags and other calcs.
The object is used internally by instruction functions.
* Added: implementation of 8bit arithmetic instructions.
* Fix: Decoder had multiple constant declarations.
* Fix: Wrong behavior of functions **ld_ptrBC_A(cpu, rIndex)** and **ld_r_ptrHL(cpu, rIndex)**.
* Fix: Wrong value of regs8.idx.E .

##v1.2.0-Alpha
* Added: Z80.load(src, pos). Loads an Uint8Array (src) into z80 memory at specific position (pos).
* Added: Z80.getByte(). Gets the memory byte pointed by PC and increments it by one.
* Added: Initial structure of the opcodes decoder. All documented load operations was added to the decoder.

##v1.1.0-Alpha
* Added: implementation of exchange, block transfer and search instructions.
* Fix: problem reading 16bit registers due to computer endianness.
##v1.0.0-Alpha
* Added: implementation of 16bit load instructions
* Changed: isAlt param is optional in registers getters.
* Changed: isAlt param is optional in registers setters. This param was moved to last position.

##v0.1.1-Alpha
* Added: implementation of 8bit load instructions

##v0.1.0-Alpha
* Added: memory (simple 64Kb typed array)
* Added: registers and flags