/**
 * Check is function .
 * @param item
 * @returns {boolean}
 */
export function isFunction(item: any): boolean {
  return item && typeof item === 'function' && !Array.isArray(item);
}

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 * From https://stackoverflow.com/a/34749873/772859
 */
export function isObject(item: any) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Check is object or function.
 * @param item
 * @returns {boolean}
 */
export function isObjectOrFunction(item: any): boolean {
  return isFunction(item) || isObject(item);
}

/**
 * Check is class instance.
 * @param item
 * @returns {boolean}
 */
export function isClassInstance(item: any): boolean {
  return isObject(item) && item.constructor.name !== 'Object';
}

/**
 * Check value empty.
 * @param item
 * @returns {boolean}
 */
export function isEmpty(item: any) {
  if (item instanceof Array) {
    item = item.filter((val) => !isEmpty(val));
    return item.length === 0;
  } else if (item && typeof item === 'object') {
    return Object.keys(item).length === 0;
  } else {
    return (
      !item ||
      (item + '').toLocaleLowerCase() === 'null' ||
      (item + '').toLocaleLowerCase() === 'undefined'
    );
  }
}

/**
 * Check value not empty.
 * @param item
 * @returns {boolean}
 */
export function isNotEmpty(item: any): boolean {
  return !isEmpty(item);
}

export function isJsObject(object: any) {
  return object !== null && object !== undefined && typeof object === 'object';
}

export function isNumeric(val: any): boolean {
  return !(val instanceof Array) && (val - parseFloat(val) + 1) >= 0;
}

export function instanceOf <T>(value: any, fieldName: string): value is T {
  return fieldName in value;
}
  
