const test = require('ava');
const z80 = require('../src/z80_cpu');
const instr = require('../src/z80_instructions/ins_8bit_load');

const cpu = new z80();
const regs8 = cpu.registers.regs8;
const regs16 = cpu.registers.regs16;
const regsSp = cpu.registers.regsSp;
const flags = cpu.registers.flags;

test('ld_r_r2(rIndex, r2Index)', t => {
    regs8.set(regs8.idx.D, 0x15);
    regs8.set(regs8.idx.B, 0xe6);    
    instr.ld_r_r2(regs8.idx.B, regs8.idx.D); // LD B, D
    const b = regs8.get(regs8.idx.B);
    t.is(b, 0x15);
});

test('ld_r_n(rIndex, n)', t => {   
    instr.ld_r_n(regs8.idx.E, 0x3c); // LD E, n
    const e = regs8.get(regs8.idx.E);
    t.is(e, 0x3c);
});

test('ld_r_ptrHL(rIndex)', t => {   
    regs16.set(regs16.idx.HL, 0x4546);
    cpu.memory[0x4546] = 0xb6;
    instr.ld_r_ptrHL(regs8.idx.C); // LD C, (HL)
    const c = regs8.get(regs8.idx.C);
    t.is(c, 0xb6);
});

test('ld_r_ptrIXd(rIndex, d)', t => {
    regsSp.IX = 0x2424;
    const ix = regsSp.IX;
    const d = -0x19;
    cpu.memory[ix+d] = 0xa3;
    instr.ld_r_ptrIXd(regs8.idx.A, d); // LD A, (IX+d)
    const a = regs8.get(regs8.idx.A);
    t.is(a, 0xa3);
});

test('ld_r_ptrIYd(rIndex, d)', t => {
    regsSp.IY = 0x3434;
    const iy = regsSp.IY;
    const d = -0x26;
    cpu.memory[iy+d] = 0xa9;
    instr.ld_r_ptrIYd(regs8.idx.E, d); // LD E, (IY+d)
    const e = regs8.get(regs8.idx.E);
    t.is(e, 0xa9);
});

test('ld_ptrHL_r(rIndex)', t => {   
    regs16.set(regs16.idx.HL, 0x862f);
    regs8.set(regs8.idx.B, 0xee);
    instr.ld_ptrHL_r(regs8.idx.B); // LD (HL), B
    const m = cpu.memory[0x862f]
    t.is(m, 0xee);
});

test('ld_ptrIXd_r(rIndex, d)', t => {   
    regs8.set(regs8.idx.C, 0xf4);
    regsSp.IX = 0xaf21;
    const d = -0x5a;
    const ix = regsSp.IX;
    const ptr = ix + d;
    instr.ld_ptrIXd_r(regs8.idx.C, d); // LD (IX+d), C
    const m = cpu.memory[ptr]
    t.is(m, 0xf4);
});

test('ld_ptrIYd_r(rIndex, d)', t => {   
    regs8.set(regs8.idx.D, 0xf8);
    regsSp.IY = 0xef64;
    const d = 0x5a;
    const iy = regsSp.IY;
    const ptr = iy + d;
    instr.ld_ptrIYd_r(regs8.idx.D, d); // LD (IY+d), D
    const m = cpu.memory[ptr]
    t.is(m, 0xf8);
});

test('ld_ptrHL_n(n)', t => {   
    regs16.set(regs16.idx.HL, 0x06a4);
    const n = 0xcf;
    instr.ld_ptrHL_n(n); // LD (HL), n
    const m = cpu.memory[0x06a4]
    t.is(m, n);
});

test('ld_ptrIXd_n(n, d)', t => {   
    regsSp.IX = 0x5555;
    const n = 0xa9;
    const d = 0x34;
    const ix = regsSp.IX;
    const ptr = ix + d;
    instr.ld_ptrIXd_n(n, d); // LD (IX+d), n
    const m = cpu.memory[ptr]
    t.is(m, n);
});

test('ld_ptrIYd_n(n, d)', t => {   
    regsSp.IX = 0x2323;
    const n = 0x15;
    const d = 0x2f;
    const iy = regsSp.IY;
    const ptr = iy + d;
    instr.ld_ptrIYd_n(n, d); // LD (IY+d), n
    const m = cpu.memory[ptr]
    t.is(m, n);
});

test('ld_A_ptrBC()', t => {   
    regs16.set(regs16.idx.BC, 0x6136);
    cpu.memory[0x6136] = 0xb8;
    instr.ld_A_ptrBC(); // LD A, (BC)
    const a = regs8.get(regs8.idx.A);
    t.is(a, 0xb8);
});

test('ld_A_ptrDE()', t => {   
    regs16.set(regs16.idx.DE, 0x628b);
    cpu.memory[0x628b] = 0xb1;
    instr.ld_A_ptrDE(); // LD A, (DE)
    const a = regs8.get(regs8.idx.A);
    t.is(a, 0xb1);
});

test('ld_A_ptrnn(nn)', t => {   
    const nn = 0x645b
    cpu.memory[nn] = 0xb3;
    instr.ld_A_ptrnn(nn); // LD A, (nn)
    const a = regs8.get(regs8.idx.A);
    t.is(a, 0xb3);
});

test('ld_ptrBC_A()', t => {   
    regs16.set(regs16.idx.BC, 0x892c);
    regs8.set(regs8.idx.A, 0x12);
    instr.ld_ptrBC_A(); // LD (BC), A
    t.is(cpu.memory[0x892c], 0x12);
});

test('ld_ptrDE_A()', t => {   
    regs16.set(regs16.idx.DE, 0x890c);
    regs8.set(regs8.idx.A, 0x16);
    instr.ld_ptrDE_A(); // LD (DE), A
    t.is(cpu.memory[0x890c], 0x16);
});

test('ld_ptrnn_A(nn)', t => {   
    regs8.set(regs8.idx.A, 0xac);
    const nn = 0x5254;
    instr.ld_ptrnn_A(nn); // LD (nn), A
    const m = cpu.memory[nn];
    t.is(m, 0xac);
}); 

test('ld_A_I()', t => {   
    regsSp.I = -0x12; // signed int8
    const i = regsSp.I;
    instr.ld_A_I(); // LD A, I
    const a = regs8.get(regs8.idx.A);
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
    regs8.set(regs8.idx.A, 0x24);
    instr.ld_I_A(); // LD I, A
    const a = regs8.get(regs8.idx.A, false);
    t.is(regsSp.I, a);
});