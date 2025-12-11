# Binary Calculator

A fully-functional binary calculator built with React and TypeScript, integrated into the Next.js application.

## Features

### Arithmetic Operations
- **Addition (+)**: Add two binary numbers
- **Subtraction (-)**: Subtract one binary number from another
- **Multiplication (×)**: Multiply two binary numbers
- **Division (÷)**: Divide one binary number by another (integer division)

### Bitwise Operations
- **AND (&)**: Performs bitwise AND operation
- **OR (|)**: Performs bitwise OR operation
- **XOR (^)**: Performs bitwise XOR operation
- **NOT (~)**: Performs bitwise NOT operation (unary)

## How to Use

### Input Methods

1. **Type Directly**: Enter binary numbers (only 0 and 1) in the input fields
2. **Click Buttons**: Use the "0" and "1" buttons to append bits to your numbers

### Calculate

1. Enter your first binary number
2. Select an operation from the dropdown
3. Enter your second binary number (not needed for NOT operation)
4. Click "Calculate" to see the result
5. Results are shown in both binary and decimal formats

### Examples

#### Addition
```
Binary 1: 1010 (10 in decimal)
Operation: Add (+)
Binary 2: 1100 (12 in decimal)
Result: 10110 (22 in decimal)
```

#### Bitwise AND
```
Binary 1: 1010
Operation: AND (&)
Binary 2: 1100
Result: 1000 (both bits must be 1)
```

#### Bitwise NOT
```
Binary 1: 1010
Operation: NOT (~)
Result: -1011 (inverts all bits)
```

## Features

✅ **Real-time Validation**: Only accepts 0s and 1s
✅ **Decimal Conversion**: Shows decimal equivalents
✅ **Multiple Operations**: 8 different operations
✅ **Error Handling**: Clear error messages
✅ **Dark Mode Support**: Works in light and dark themes
✅ **Quick Reference**: Built-in help guide
✅ **Responsive Design**: Works on all screen sizes

## Understanding Binary Operations

### Arithmetic Operations

- **Addition**: Same as decimal, but when you get 2, it becomes 10 (binary)
  - Example: 1 + 1 = 10 (binary)
  
- **Subtraction**: Borrow from the next bit when needed
  - Example: 10 - 1 = 1 (binary)

- **Multiplication**: Repeated addition or shift-and-add
  - Example: 10 × 11 = 110 (binary)

- **Division**: Integer division, remainder is discarded
  - Example: 1100 ÷ 10 = 110 (binary)

### Bitwise Operations

- **AND (&)**: Returns 1 only if both bits are 1
  ```
  1010 & 1100 = 1000
  ```

- **OR (|)**: Returns 1 if at least one bit is 1
  ```
  1010 | 1100 = 1110
  ```

- **XOR (^)**: Returns 1 if bits are different
  ```
  1010 ^ 1100 = 0110
  ```

- **NOT (~)**: Inverts all bits (two's complement)
  ```
  ~1010 = -1011
  ```

## Technical Details

### Component Structure

```typescript
- State Management: React useState hooks
- Validation: Regex pattern /^[01]+$/
- Conversion: parseInt(binary, 2) and toString(2)
- Error Handling: Try-catch with user-friendly messages
```

### Supported Range

- Input: Any valid binary number (limited by JavaScript Number precision)
- Output: Automatically formatted in binary and decimal
- Division by zero: Handled with error message

## Accessing the Calculator

The binary calculator is available at the top of the home page:

```
http://localhost:3000
```

Just scroll to the top to see the calculator prominently displayed.

## Future Enhancements

Potential features that could be added:
- Binary to hexadecimal conversion
- Support for floating-point binary numbers
- Step-by-step calculation visualization
- History of previous calculations
- Keyboard shortcuts
- Copy result to clipboard
- Binary complement operations (1's and 2's complement)

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Error: "Please enter only 0s and 1s"
- Solution: Make sure you're only entering 0 and 1 characters

### Error: "Cannot divide by zero"
- Solution: The second number cannot be 0 when using division

### Result shows negative number
- This is expected for NOT operation due to two's complement representation

## Integration

The binary calculator is integrated into the main application at:
- **Component**: `/components/BinaryCalculator.tsx`
- **Page**: `/app/page.tsx`

You can easily move it to a separate route if needed or embed it in other pages.
