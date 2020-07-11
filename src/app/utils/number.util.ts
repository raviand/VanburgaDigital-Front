
export class NumberUtils {
    static leftPad(num, targetLength) {
        let output = num + '';
        while (output.length < targetLength) {
            output = '0' + output;
        }
        return output;
    }
}