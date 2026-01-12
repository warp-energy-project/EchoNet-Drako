import socket
import struct
import time
import random
from rlc_core import gf_mul, gf_add

UDP_PORT = 9000
BLOCK_SIZE = 16
K = 8   # number of original blocks

class NoHaltBuffer:
    def __init__(self):
        self.rows = []
        self.values = []

    def add(self, coeffs, payload):
        self.rows.append(coeffs)
        self.values.append(payload)
        self.try_decode()

    def try_decode(self):
        if len(self.rows) < K:
            return

        rows = [list(r) for r in self.rows]
        vals = [list(v) for v in self.values]

        # Gaussian elimination over GF(256)
        for i in range(K):
            if rows[i][i] == 0:
                for j in range(i+1, len(rows)):
                    if rows[j][i] != 0:
                        rows[i], rows[j] = rows[j], rows[i]
                        vals[i], vals[j] = vals[j], vals[i]
                        break

            inv = rows[i][i]
            for c in range(i, K):
                rows[i][c] = gf_mul(rows[i][c], inv)
            vals[i] = [gf_mul(x, inv) for x in vals[i]]

            for r in range(len(rows)):
                if r != i and rows[r][i] != 0:
                    factor = rows[r][i]
                    for c in range(i, K):
                        rows[r][c] = gf_add(rows[r][c], gf_mul(factor, rows[i][c]))
                    vals[r] = [gf_add(a, gf_mul(factor, b)) for a, b in zip(vals[r], vals[i])]

        message = b''.join(bytes(v) for v in vals[:K])
        print("\n=== RECOVERED MESSAGE ===")
        print(message.decode(errors="ignore"))
        print("========================\n")
        self.rows.clear()
        self.values.clear()

def main():
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind(("", UDP_PORT))
    buffer = NoHaltBuffer()

    print("Receiver listening on UDP port", UDP_PORT)

    while True:
        data, _ = sock.recvfrom(4096)

        seed = struct.unpack(">I", data[:4])[0]
        random.seed(seed)

        coeffs = list(data[4:4+K])
        payload = list(data[4+K:4+K+BLOCK_SIZE])

        buffer.add(coeffs, payload)

if __name__ == "__main__":
    main()
