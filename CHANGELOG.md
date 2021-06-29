##v1.2.0-Alpha
Added: Z80.load(src, pos). Loads an Uint8Array (src) into z80 memory at specific position (pos).
Added: Z80.getByte(). Gets the memory byte pointed by PC and increments it by one.
Added: Initial structure of the opcodes decoder. All documented load operations was added to the decoder.

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