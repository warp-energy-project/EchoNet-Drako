import random

# Simple GF(256) arithmetic using precomputed tables (primitive polynomial 0x11b)

GF_POLY = 0x11b

def gf_add(a, b):
    return a ^ b

def gf_mul(a, b):
    p = 0
    while b:
        if b & 1:
            p ^= a
        a <<= 1
        if a & 0x100:
            a ^= GF_POLY
        b >>= 1
    return p & 0xFF

def vec_mul_scalar(vec, scalar):
    return [gf_mul(x, scalar) for x in vec]

def vec_add(a, b):
    return [gf_add(x, y) for x, y in zip(a, b)]

def random_coeffs(n):
    return [random.randint(1, 255) for _ in range(n)]

def encode_block(blocks):
    coeffs = random_coeffs(len(blocks))
    out = [0] * len(blocks[0])
    for c, b in zip(coeffs, blocks):
        out = vec_add(out, vec_mul_scalar(b, c))
    return coeffs, out
