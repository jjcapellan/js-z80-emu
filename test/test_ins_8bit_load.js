const test = require('ava');
const z80 = require('../src/z80_cpu');
const instr = require('../src/z80_instructions/ins_8bit_load');

const cpu = new z80();
const r8 = cpu.registers.regs8;
const r16 = cpu.registers.regs16;
const i8 = r8.idx;
const i16 = r16.idx;
const flags = cpu.registers.flags;

test('ld_r_r2(rIndex, r2Index)', t => {
    r8.set(i8.D, 0x15);
    r8.set(i8.B, 0xe6);
    instr.ld_r_r2(i8.B, i8.D); // LD B, D
    const b = r8.get(i8.B);
    t.is(b, 0x15);
});

test('ld_r_n(rIndex, n)', t => {
    instr.ld_r_n(i8.E, 0x3c); // LD E, n
    const e = r8.get(i8.E);
    t.is(e, 0x3c);
});

test('LD C, (HL)', t => {
    r16.set(i16.HL, 0x4546);
    cpu.memory[0x4546] = 0xb6;
    instr.ld_r_ptrXXplusd(i8.C, 0, i16.HL);
    const c = r8.get(i8.C);
    t.is(c, 0xb6);
});

test('LD A, (IX+d)', t => {
    r16.set(i16.IX, 0x2424);
    const ix = r16.get(i16.IX);
    const d = -0x19;
    cpu.memory[ix + d] = 0xa3;
    instr.ld_r_ptrXXplusd(i8.A, d, i16.IX);
    const a = r8.get(i8.A);
    t.is(a, 0xa3);
});

test('LD E, (IY+d)', t => {
    r16.set(i16.IY, 0x3434);
    const iy = r16.get(i16.IY);
    const d = -0x26;
    cpu.memory[iy + d] = 0xa9;
    instr.ld_r_ptrXXplusd(i8.E, d, i16.IY);
    const e = r8.get(i8.E);
    t.is(e, 0xa9);
});

test('LD (HL), B', t => {
    r16.set(i16.HL, 0x862f);
    r8.set(i8.B, 0xee);
    instr.ld_ptrXXplusd_r(i8.B, 0, i16.HL);
    const m = cpu.memory[0x862f];
    t.is(m, 0xee);
});

test('LD (IX+d), C', t => {
    r8.set(i8.C, 0xf4);
    r16.set(i16.IX, 0xaf21);
    const d = -0x5a;
    const ix = r16.get(i16.IX);
    const ptr = ix + d;
    instr.ld_ptrXXplusd_r(i8.C, d, i16.IX); // LD (IX+d), C
    const m = cpu.memory[ptr]
    t.is(m, 0xf4);
});

test('LD (IY+d), D', t => {
    r8.set(i8.D, 0xf8);
    r16.set(i16.IY, 0xef64);
    const d = 0x5a;
    const iy = r16.get(i16.IY);
    const ptr = iy + d;
    instr.ld_ptrXXplusd_r(i8.D, d, i16.IY);
    const m = cpu.memory[ptr]
    t.is(m, 0xf8);
});

test('LD (HL), n', t => {
    r16.set(i16.HL, 0x06a4);
    const n = 0xcf;
    instr.ld_ptrXXplusd_n(i16.HL, 0, n, 10);
    const m = cpu.memory[0x06a4];instr.ld_ptrXXplusd_n
    t.is(m, n);
});

test('LD (IX+d), n', t => {
    r16.set(i16.IX, 0x5555);
    const n = 0xa9;
    const d = 0x34;
    const ix = r16.get(i16.IX);
    const ptr = ix + d;
    instr.ld_ptrXXplusd_n(i16.IX, d, n, 19);
    const m = cpu.memory[ptr]
    t.is(m, n);
});

test('LD (IY+d), n', t => {
    r16.set(i16.IX, 0x2323);
    const n = 0x15;
    const d = 0x2f;
    const iy = r16.get(i16.IY);
    const ptr = iy + d;
    instr.ld_ptrXXplusd_n(i16.IY, d, n, 19);
    const m = cpu.memory[ptr]
    t.is(m, n);
});

test('ld_A_ptrBC()', t => {
    r16.set(i16.BC, 0x6136);
    cpu.memory[0x6136] = 0xb8;
    instr.ld_A_ptrBC(); // LD A, (BC)
    const a = r8.get(i8.A);
    t.is(a, 0xb8);
});

test('ld_A_ptrDE()', t => {
    r16.set(i16.DE, 0x628b);
    cpu.memory[0x628b] = 0xb1;
    instr.ld_A_ptrDE(); // LD A, (DE)
    const a = r8.get(i8.A);
    t.is(a, 0xb1);
});

test('ld_A_ptrnn(nn)', t => {
    const nn = 0x645b
    cpu.memory[nn] = 0xb3;
    instr.ld_A_ptrnn(nn); // LD A, (nn)
    const a = r8.get(i8.A);
    t.is(a, 0xb3);
});

test('ld_ptrBC_A()', t => {
    r16.set(i16.BC, 0x892c);
    r8.set(i8.A, 0x12);
    instr.ld_ptrBC_A(); // LD (BC), A
    t.is(cpu.memory[0x892c], 0x12);
});

test('ld_ptrDE_A()', t => {
    r16.set(i16.DE, 0x890c);
    r8.set(i8.A, 0x16);
    instr.ld_ptrDE_A(); // LD (DE), A
    t.is(cpu.memory[0x890c], 0x16);
});

test('ld_ptrnn_A(nn)', t => {
    r8.set(i8.A, 0xac);
    const nn = 0x5254;
    instr.ld_ptrnn_A(nn); // LD (nn), A
    const m = cpu.memory[nn];
    t.is(m, 0xac);
});

test('ld_A_I()', t => {
    r8.set(i8.I, -0x12);
    const i = r8.get(i8.I);
    instr.ld_A_I(); // LD A, I
    const a = r8.get(i8.A);
    t.is(a, i & 0xff, `Result: ${a} Expected: ${i}`);
    //Flags
    const flag_s = flags.get(flags.idx.S);
    const flag_z = flags.get(flags.idx.Z);
    const flag_h = flags.get(flags.idx.H);
    const flag_pv = flags.get(flags.idx.PV);
    const flag_n = flags.get(flags.idx.N);
    t.is(flag_s, true);
    t.is(flag_z, false);
    t.is(flag_h, false);
    t.is(flag_pv, false);
    t.is(flag_n, false);
});

test('ld_I_A()', t => {
    r8.set(i8.A, 0x24);
    instr.ld_I_A(); // LD I, A
    const a = r8.get(i8.A, false);
    const i = r8.get(i8.I);
    t.is(i, a);
});