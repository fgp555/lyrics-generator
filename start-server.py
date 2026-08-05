# python start-server.py

from http.server import HTTPServer, SimpleHTTPRequestHandler
from datetime import datetime

PORT = 5500

class ColorHandler(SimpleHTTPRequestHandler):

    def log_message(self, format, *args):
        time = datetime.now().strftime("%H:%M:%S")

        status = str(args[1])

        if status.startswith("2"):
            color = "\033[92m"  # verde
        elif status.startswith("4"):
            color = "\033[93m"  # amarillo
        elif status.startswith("5"):
            color = "\033[91m"  # rojo
        else:
            color = "\033[0m"

        reset = "\033[0m"

        print(
            f"{color}[{time}] {self.address_string()} "
            f"{args[0]} {status}{reset}"
        )


server = HTTPServer(("0.0.0.0", PORT), ColorHandler)

print("\033[94m=================================\033[0m")
print("\033[92m Python HTTP Server\033[0m")
print(f"\033[33m Port: {PORT}\033[0m")
print("\033[94m=================================\033[0m")

server.serve_forever()