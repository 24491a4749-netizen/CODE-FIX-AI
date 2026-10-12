
def get_number(prompt):
    while True:
        value = input(prompt).strip()

        if value.lower() == "q":
            return None

        try:
            return float(value)
        except ValueError:
            print("Invalid number! Please try again or type q to quit.")


def calculate(a, b, operator):
    if operator == "+":
        return a + b
    elif operator == "-":
        return a - b
    elif operator == "*":
        return a * b
    elif operator == "/":
        if b == 0:
            print("Error: Cannot divide by zero!")
            return None
        return a / b


def main():
    print("=== CodeFix AI Calculator ===")
    print("Type q to quit.\n")

    while True:
        a = get_number("Enter first number: ")
        if a is None:
            break

        operator = input("Enter operator (+, -, *, /): ").strip()

        if operator.lower() == "q":
            break

        if operator not in ["+", "-", "*", "/"]:
            print("Invalid operator! Try again.\n")
            continue

        b = get_number("Enter second number: ")
        if b is None:
            break

        result = calculate(a, b, operator)

        if result is not None:
            print(f"Result: {result}\n")
        else:
            print()

    print("Goodbye!")


if __name__ == "__main__":
    main()
