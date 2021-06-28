const test = require('ava');
const regs = require('../src/z80_registers');
const regs8 = regs.regs8;
const regs16 = regs.regs16;
const flags = regs.flags;

test('regs8 get/set', t => {
    regs8.set(regs8.idx.D, 0xe5);
    regs8.set(regs8.idx.D, 0x19, true);
    const d = regs8.get(regs8.idx.D);
    const d_ = regs8.get(regs8.idx.D, true);
    t.is(d, 0xe5);
    t.is(d_, 0x19);
});

test('regs16 get/set', t => {
    regs16.set(regs16.idx.BC, 0xe5a4);
    regs16.set(regs16.idx.BC, 0x19c6, true);
    const bc = regs16.get(regs16.idx.BC);
    const bc_ = regs16.get(regs16.idx.BC, true);
    t.is(bc, 0xe5a4);
    t.is(bc_, 0x19c6);
});

test('regs16.get from 2 regs8.set', t => {
    regs8.set(regs8.idx.H, 0xe5);
    regs8.set(regs8.idx.L, 0xcc);    
    const hl = regs16.get(regs16.idx.HL);
    t.is(hl, 0xe5cc);
});

test('flags.set/get', t => {
    flags.set(flags.idx.H, true);
    const f = regs8.get(regs8.idx.F);
    const h = flags.get(flags.idx.H);
    const s = flags.get(flags.idx.S);
    t.is(f, 0b00010000);
    t.is(h, true);
    t.is(s, false);
});