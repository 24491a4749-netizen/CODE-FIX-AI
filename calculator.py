def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        return "Cannot divide by zero"
    return a / b

a = float(input("Enter first number: "))
op = input("Enter operator (+, -, *, /): ")
b = float(input("Enter second number: "))

if op == "+":
    result = add(a, b)
elif op == "-":
    result = subtract(a, b)
elif op == "*":
    result = multiply(a, b)
elif op == "/":
    result = divide(a, b)
else:
    result = "Invalid operator"

print("Result:", result)
