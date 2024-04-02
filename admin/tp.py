import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_verification_email(old_email):
    try:
        # Set up SMTP connection
        smtp_server = 'smtp.example.com'  # Update with your SMTP server
        port = 587  # Update with your SMTP server port (587 is typical for TLS)
        sender_email = 'your@example.com'  # Update with your sender email
        password = 'your_password'  # Update with your email password

        # Create a message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = old_email
        msg['Subject'] = 'Verify your email'

        # Add HTML content to the email body
        body = """
        <html>
          <body>
            <p>Please verify your email to proceed with the change.</p>
          </body>
        </html>
        """
        msg.attach(MIMEText(body, 'html'))

        # Connect to SMTP server and send email
        with smtplib.SMTP(smtp_server, port) as server:
            server.starttls()  # Enable encryption (TLS)
            server.login(sender_email, password)
            server.sendmail(sender_email, old_email, msg.as_string())
        
        print("Email sent successfully.")
        return True
    except Exception as e:
        print("Error sending email:", e)
        return False

# Example usage
old_email = "old@example.com"
send_verification_email(old_email)
