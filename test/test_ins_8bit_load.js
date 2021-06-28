const test = require('ava');
const z80 = require('../src/z80_cpu');
const instr = require('../src/z80_instrucctions/ins_8bit_load');

const cpu = new z80();
const regs8 = cpu.registers.regs8;
const regs16 = cpu.registers.regs16;
const regsSp = cpu.registers.regsSp;
const flags = cpu.registers.flags;

test('ld_r_r2(cpu, rIndex, r2Index)', t => {
    regs8.set(regs8.idx.D, 0x15);
    regs8.set(regs8.idx.B, 0xe6);    
    instr.ld_r_r2(cpu, regs8.idx.B, regs8.idx.D); // LD B, D
    const b = regs8.get(regs8.idx.B);
    t.is(b, 0x15);
});

test('ld_r_n(cpu, rIndex, n)', t => {   
    instr.ld_r_n(cpu, regs8.idx.E, 0x3c); // LD E, n
    const e = regs8.get(regs8.idx.E);
    t.is(e, 0x3c);
});

test('ld_r_ptrHL(cpu, rIndex)', t => {   
    regs16.set(regs16.idx.HL, 0x4546);
    cpu.memory[0x4546] = 0xb6;
    instr.ld_r_ptrHL(cpu, regs8.idx.C); // LD C, (HL)
    const c = regs8.get(regs8.idx.C);
    t.is(c, 0xb6);
});

test('ld_r_ptrIXd(cpu, rIndex, d)', t => {
    regsSp.IX = 0x2424;
    const ix = regsSp.IX;
    const d = -0x19;
    cpu.memory[ix+d] = 0xa3;
    instr.ld_r_ptrIXd(cpu, regs8.idx.A, d); // LD A, (IX+d)
    const a = regs8.get(regs8.idx.A);
    t.is(a, 0xa3);
});

test('ld_r_ptrIYd(cpu, rIndex, d)', t => {
    regsSp.IY = 0x3434;
    const iy = regsSp.IY;
    const d = -0x26;
    cpu.memory[iy+d] = 0xa9;
    instr.ld_r_ptrIYd(cpu, regs8.idx.E, d); // LD E, (IY+d)
    const e = regs8.get(regs8.idx.E);
    t.is(e, 0xa9);
});

test('ld_ptrHL_r(cpu, rIndex)', t => {   
    regs16.set(regs16.idx.HL, 0x862f);
    regs8.set(regs8.idx.B, 0xee);
    instr.ld_ptrHL_r(cpu, regs8.idx.B); // LD (HL), B
    const m = cpu.memory[0x862f]
    t.is(m, 0xee);
});

test('ld_ptrIXd_r(cpu, rIndex, d)', t => {   
    regs8.set(regs8.idx.C, 0xf4);
    regsSp.IX = 0xaf21;
    const d = -0x5a;
    const ix = regsSp.IX;
    const ptr = ix + d;
    instr.ld_ptrIXd_r(cpu, regs8.idx.C, d); // LD (IX+d), C
    const m = cpu.memory[ptr]
    t.is(m, 0xf4);
});

test('ld_ptrIYd_r(cpu, rIndex, d)', t => {   
    regs8.set(regs8.idx.D, 0xf8);
    regsSp.IY = 0xef64;
    const d = 0x5a;
    const iy = regsSp.IY;
    const ptr = iy + d;
    instr.ld_ptrIYd_r(cpu, regs8.idx.D, d); // LD (IY+d), D
    const m = cpu.memory[ptr]
    t.is(m, 0xf8);
});

test('ld_ptrHL_n(cpu, n)', t => {   
    regs16.set(regs16.idx.HL, 0x06a4);
    const n = 0xcf;
    instr.ld_ptrHL_n(cpu, n); // LD (HL), n
    const m = cpu.memory[0x06a4]
    t.is(m, n);
});

test('ld_ptrIXd_n(cpu, n, d)', t => {   
    regsSp.IX = 0x5555;
    const n = 0xa9;
    const d = 0x34;
    const ix = regsSp.IX;
    const ptr = ix + d;
    instr.ld_ptrIXd_n(cpu, n, d); // LD (IX+d), n
    const m = cpu.memory[ptr]
    t.is(m, n);
});

test('ld_ptrIYd_n(cpu, n, d)', t => {   
    regsSp.IX = 0x2323;
    const n = 0x15;
    const d = 0x2f;
    const iy = regsSp.IY;
    const ptr = iy + d;
    instr.ld_ptrIYd_n(cpu, n, d); // LD (IY+d), n
    const m = cpu.memory[ptr]
    t.is(m, n);
});

test('ld_A_ptrBC(cpu)', t => {   
    regs16.set(regs16.idx.BC, 0x6136);
    cpu.memory[0x6136] = 0xb8;
    instr.ld_A_ptrBC(cpu); // LD A, (BC)
    const a = regs8.get(regs8.idx.A);
    t.is(a, 0xb8);
});

test('ld_A_ptrDE(cpu)', t => {   
    regs16.set(regs16.idx.DE, 0x628b);
    cpu.memory[0x628b] = 0xb1;
    instr.ld_A_ptrDE(cpu); // LD A, (DE)
    const a = regs8.get(regs8.idx.A);
    t.is(a, 0xb1);
});

test('ld_A_ptrnn(cpu, nn)', t => {   
    const nn = 0x645b
    cpu.memory[nn] = 0xb3;
    instr.ld_A_ptrnn(cpu, nn); // LD A, (nn)
    const a = regs8.get(regs8.idx.A);
    t.is(a, 0xb3);
});

test('ld_ptrBC_A(cpu)', t => {   
    regs16.set(regs16.idx.BC, 0x892c);
    cpu.memory[0x892c] = 0x64;
    instr.ld_ptrBC_A(cpu); // LD (BC), A
    const a = regs8.get(regs8.idx.A);
    t.is(a, 0x64);
});

test('ld_ptrDE_A(cpu)', t => {   
    regs16.set(regs16.idx.DE, 0x890c);
    cpu.memory[0x890c] = 0x60;
    instr.ld_ptrDE_A(cpu); // LD (DE), A
    const a = regs8.get(regs8.idx.A);
    t.is(a, 0x60);
});

test('ld_ptrnn_A(cpu, nn)', t => {   
    regs8.set(regs8.idx.A, 0xac);
    const nn = 0x5254;
    instr.ld_ptrnn_A(cpu, nn); // LD (nn), A
    const m = cpu.memory[nn];
    t.is(m, 0xac);
}); 

test('ld_A_I(cpu)', t => {   
    regsSp.I = -0x12; // signed int8
    const i = regsSp.I;
    instr.ld_A_I(cpu); // LD A, I
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

test('ld_I_A(cpu)', t => {   
    regs8.set(regs8.idx.A, 0x24);
    instr.ld_I_A(cpu); // LD I, A
    const a = regs8.get(regs8.idx.A, false);
    t.is(regsSp.I, a);
});