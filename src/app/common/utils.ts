export default class Utils {
    
  static validateVariable(val: any) {
    return typeof val !== 'undefined' && val !== null;
  }
}