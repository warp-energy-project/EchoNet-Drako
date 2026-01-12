import socket
import struct
import time
import random
from rlc_core import encode_block

UDP_IP = "127.0.0.1"
UDP_PORT = 5005

BLOCK_SIZE = 32     # bytes per block
K = 8               # number of original blocks
PACKETS = 40        # how many encoded packets to send


def chunk(data, size):
    return [list(data[i:i+size]) for i in range(0, len(data), size)]


def pad(block, size):
    return block + [0] * (size - len(block))


def main():
    msg = b"NAVI RECOVERY ENGINE – PROTOCOL 0050 – SEED TEST"
    blocks = chunk(msg, BLOCK_SIZE)

    # pad to K blocks
    while len(blocks) < K:
        blocks.append([0] * BLOCK_SIZE)

    blocks = [pad(b, BLOCK_SIZE) for b in blocks]

    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    print("Sending packets...")
    for i in range(PACKETS):
        seed = random.randint(0, 2**32-1)
        random.seed(seed)

        coeffs, payload = encode_block(blocks)

        header = struct.pack(">I", seed)
        data = header + bytes(coeffs) + bytes(payload)

        sock.sendto(data, (UDP_IP, UDP_PORT))
        print(f"Packet {i+1}/{PACKETS} seed={seed}")

        time.sleep(0.05)


if __name__ == "__main__":
    main()
