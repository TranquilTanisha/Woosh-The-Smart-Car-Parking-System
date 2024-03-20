import pyqrcode
from fpdf import FPDF

# pip install pyqrcode fpdf

def generate_qr_code(link, filename):
    qr = pyqrcode.create(link)
    qr.png(filename, scale=10)

# Example usage
link = "https://www.google.com"
filename = "qrcode.png"
generate_qr_code(link, filename)
