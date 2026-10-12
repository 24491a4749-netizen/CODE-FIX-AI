def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        return "Error: Cannot divide by zero"
    return a / b

print("=== CodeFix AI Calculator ===")
print("Operations: +, -, *, /")

try:
    a = float(input("Enter first number: "))
    operator = input("Enter operator (+, -, *, /): ").strip()
    b = float(input("Enter second number: "))

    if operator == "+":
        result = add(a, b)
    elif operator == "-":
        result = subtract(a, b)
    elif operator == "*":
        result = multiply(a, b)
    elif operator == "/":
        result = divide(a, b)
    else:
        result = "Invalid operator"

    print("Result:", result)

except ValueError:
    print("Error: Please enter valid numbers.")
