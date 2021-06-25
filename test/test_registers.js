const test = require('ava');
const regs = require('../z80_registers');
const regs8 = regs.regs8;
const regs16 = regs.regs16;
const flags = regs.flags;

test('regs8 get/set', t => {
    regs8.set(regs8.idx.D, false, 0xe5);
    regs8.set(regs8.idx.D, true, 0x19);
    const d = regs8.get(regs8.idx.D, false);
    const d_ = regs8.get(regs8.idx.D, true);
    t.is(d, 0xe5);
    t.is(d_, 0x19);
});

test('regs16 get/set', t => {
    regs16.set(regs16.idx.BC, false, 0xe5a4);
    regs16.set(regs16.idx.BC, true, 0x19c6);
    const bc = regs16.get(regs16.idx.BC, false);
    const bc_ = regs16.get(regs16.idx.BC, true);
    t.is(bc, 0xe5a4);
    t.is(bc_, 0x19c6);
});

test('regs16.get from 2 regs8.set', t => {
    regs8.set(regs8.idx.H, false, 0xe5);
    regs8.set(regs8.idx.L, false, 0xcc);    
    const hl = regs16.get(regs16.idx.HL, false);
    t.is(hl, 0xcce5); // little-endian
});

test('flags.set/get', t => {
    flags.set(flags.idx.H, false, true);
    const f = regs8.get(regs8.idx.F, false);
    const h = flags.get(flags.idx.H, false);
    const s = flags.get(flags.idx.S, false);
    t.is(f, 0b00010000);
    t.is(h, true);
    t.is(s, false);
});