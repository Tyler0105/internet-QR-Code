import qrcode
import sys

def create_qr_image(data, filename):
    try:
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(data)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        img.save(filename)
        print(f"\nSuccess! QR code saved successfully as '{filename}'.\n")
    except Exception as e:
        print(f"\nError generating QR code: {e}\n")

def menu():
    while True:
        print("=== Permanent QR Code Generator ===")
        print("1. Webpage URL")
        print("2. WiFi Login")
        print("3. Exit")
        
        choice = input("Select an option (1-3): ").strip()

        if choice == '1':
            url = input("Enter the webpage URL (e.g., https://example.com): ").strip()
            if not url:
                print("\nURL cannot be empty.\n")
                continue
            
            filename = input("Enter filename to save as (default: url_qr.png): ").strip() or "url_qr.png"
            create_qr_image(url, filename)

        elif choice == '2':
            ssid = input("Enter the WiFi Network Name (SSID): ").strip()
            if not ssid:
                print("\nNetwork Name (SSID) cannot be empty.\n")
                continue
                
            password = input("Enter the WiFi Password (leave blank if none): ").strip()
            
            print("Select Encryption Type:")
            print("1. WPA/WPA2/WPA3 (Most common)")
            print("2. WEP (Older, less secure)")
            print("3. None (Open network)")
            enc_choice = input("Choose (1-3, default 1): ").strip()
            
            encryption = "WPA"
            if enc_choice == '2':
                encryption = "WEP"
            elif enc_choice == '3' or not password:
                encryption = "nopass"

            hidden_choice = input("Is this a hidden network? (y/n, default n): ").strip().lower()
            hidden_str = "true" if hidden_choice == 'y' else "false"

            wifi_data = f"WIFI:T:{encryption};S:{ssid};P:{password};H:{hidden_str};;"
            
            filename = input("Enter filename to save as (default: wifi_qr.png): ").strip() or "wifi_qr.png"
            create_qr_image(wifi_data, filename)

        elif choice == '3':
            print("Exiting.")
            sys.exit(0)
            
        else:
            print("\nInvalid choice. Please enter 1, 2, or 3.\n")

if __name__ == "__main__":
    menu()