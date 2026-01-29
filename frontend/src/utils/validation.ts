/**
 * Validates vehicle number format (Indian Standard: XX00XX0000 or XX00X0000)
 * Allows: State Code (2 chars) + District (2 ints) + Series (1-2 chars) + Unique (4 ints)
 * Example: TN01AB1234 or TN01A1234
 */
export const validateVehicleNumber = (number: string): { isValid: boolean; error?: string } => {
    // 1. Basic formatting checks
    if (!number) return { isValid: false, error: "Vehicle number is required" };

    const cleanNumber = number.toUpperCase().replace(/\s/g, '');

    // 2. Length check (Min 9, Max 10)
    if (cleanNumber.length < 9 || cleanNumber.length > 10) {
        return { isValid: false, error: "Invalid length (Format: TN01AB1234)" };
    }

    // 3. Regex Pattern: ^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$
    // Explain: 2 Letters (State) + 2 Numbers (District) + 1-2 Letters (Series) + 4 Numbers
    const vehicleRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;

    if (!vehicleRegex.test(cleanNumber)) {
        return { isValid: false, error: "Invalid format. Use standard format (e.g., TN01AB1234)" };
    }

    return { isValid: true };
};
