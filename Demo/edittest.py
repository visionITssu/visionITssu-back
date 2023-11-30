# 파일명: print_base64.py
import sys

def main():
    if len(sys.argv) != 2:
        print("Usage: python print_base64.py [base64_string]")
        sys.exit(1)

    file_path = sys.argv[1]
    with open(file_path, 'r') as file:
        base64_string = file.read()
    print(base64_string)

if __name__ == "__main__":
    main()
