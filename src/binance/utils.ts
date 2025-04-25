export function downRoundToFixed(num, precision) {
    const factor = Math.pow(10, precision);
    return (Math.floor(num * factor) / factor).toFixed(precision);
}