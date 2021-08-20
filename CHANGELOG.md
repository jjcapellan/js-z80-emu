## v2.2.0-Alpha
* Added: **Z80.clockSpeed**. Clock speed in Mhz (default = 3.5). This value is passed to the Z80 constructor.
* Added: **Z80.cycleMicroseconds**. Duration in microseconds of 1 cycle. Is calculated using clockSpeed.
* Added: **Z80.tCycles** Remaining T cycles for to use by current instruction.
* Added: Timing implementation in processor loop.
* Added: **Z80.exit()**
* Added: Implementation of almost all undocumented instructions.
* Change: New decoder structure.
* Change: Major refactoring of instruction functions. New param tCycles. 

## v2.1.0-Alpha
* Added: Implementation of jump instructions.
* Added: Implementation of call, return instructions
* Added: Implementation of in, out instructions.
* Added: **Z80.ports**. Is an array of bytes which is representing the address space of the ports.
* Completed milestone: **Implementation of all documented instructions**.

## v2.0.0-Alpha
* Added: **Z80.isHalt**. True when is on halt state.
* Added: **Z80.interrupMode**. 
* Added: Implementation of general-purpose arithmetic and CPU control instructions.
* Added: Implementation of 16bit arithmetic instructions.
* Added: Implementation of rotate and shift instructions.
* Added: Implementation of bit, set and res instructions.
* Fix: **ld_A_R()**. Flag S allways false.
* Change: Special registers are included now in **registers.regs16** and **registers.regs8**.
Example:
```javascript
// Get special register IX
const r16 = z80.registers.regs16;
const i16 = r16.idx;
let ix = r16.get(i16.IX);
```
## v1.3.0-Alpha
* Added: **Z80.step()** . This function reads one byte from PC memory address and decodes it.
* Added: **Z80.tables** . This object contains some arrays of precalculated flags and other calcs.
The object is used internally by instruction functions.
* Added: implementation of 8bit arithmetic instructions.
* Fix: Decoder had multiple constant declarations.
* Fix: Wrong behavior of functions **ld_ptrBC_A(cpu, rIndex)** and **ld_r_ptrHL(cpu, rIndex)**.
* Fix: Wrong value of regs8.idx.E .

## v1.2.0-Alpha
* Added: Z80.load(src, pos). Loads an Uint8Array (src) into z80 memory at specific position (pos).
* Added: Z80.getByte(). Gets the memory byte pointed by PC and increments it by one.
* Added: Initial structure of the opcodes decoder. All documented load operations was added to the decoder.

## v1.1.0-Alpha
* Added: implementation of exchange, block transfer and search instructions.
* Fix: problem reading 16bit registers due to computer endianness.

## v1.0.0-Alpha
* Added: implementation of 16bit load instructions
* Changed: isAlt param is optional in registers getters.
* Changed: isAlt param is optional in registers setters. This param was moved to last position.

## v0.1.1-Alpha
* Added: implementation of 8bit load instructions

## v0.1.0-Alpha
* Added: memory (simple 64Kb typed array)
* Added: registers and flags