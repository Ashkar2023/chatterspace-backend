describe('Always True Tests', () => {
    test('should always be true', () => {
        expect(true).toBe(true);
    });

    test('should pass if condition is always true', () => {
        const value = 1 + 1;
        expect(value === 2).toBe(true);
    });

    test('should pass if comparing two equal strings', () => {
        expect('hello').toBe('hello');
    });

    test('should pass if object properties match', () => {
        const obj = { name: 'John', age: 30 };
        expect(obj.name).toBe('John');
        expect(obj.age).toBe(30);
    });

    test('should pass if array length is as expected', () => {
        const arr = [1, 2, 3];
        expect(arr.length).toBe(3);
    });

    test('should pass if function always returns true', () => {
        const alwaysTrue = () => true;
        expect(alwaysTrue()).toBe(true);
    });
});
