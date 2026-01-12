import socket
import random
import time

LISTEN_IP = "0.0.0.0"
LISTEN_PORT = 9000      # sender sends here
FORWARD_IP = "127.0.0.1"
FORWARD_PORT = 9001    # receiver listens here

LOSS_PROBABILITY = 0.7     # 70% packets lost
MAX_DELAY = 0.3           # up to 300 ms jitter

def main():
    sock_in = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock_in.bind((LISTEN_IP, LISTEN_PORT))

    sock_out = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    print("Lossy proxy running")
    print("Loss:", int(LOSS_PROBABILITY * 100), "%")
    print("Listening on", LISTEN_PORT, "-> forwarding to", FORWARD_PORT)

    while True:
        data, addr = sock_in.recvfrom(4096)

        if random.random() < LOSS_PROBABILITY:
            print("DROP")
            continue

        delay = random.random() * MAX_DELAY
        time.sleep(delay)

        sock_out.sendto(data, (FORWARD_IP, FORWARD_PORT))
        print("FORWARD (delay %.0f ms)" % (delay * 1000))

if __name__ == "__main__":
    main()
