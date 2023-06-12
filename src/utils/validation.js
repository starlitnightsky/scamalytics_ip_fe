/**
 * DHTML phone number validation script. Courtesy of SmartWebby.com (http://www.smartwebby.com/dhtml/)
 */

// Declaring required variables
// const digits = "0123456789";
// non-digit characters which are allowed in phone numbers
var phoneNumberDelimiters = '()- '
// characters which are allowed in international phone numbers
// (a leading + is OK)
var validWorldPhoneChars = phoneNumberDelimiters + '+'
// Minimum no of digits in an international phone no without the country code.
var minDigitsInIPhoneNumber = 7

function isInteger(s) {
  let i
  for (i = 0; i < s.length; i++) {
    // Check that current character is number.
    const c = s.charAt(i)
    if (c < '0' || c > '9') {
      return false
    }
  }
  // All characters are numbers.
  return true
}

function trim(s) {
  let i
  let returnString = ''
  // Search through string's characters one by one.
  // If character is not a whitespace, append to returnString.
  for (i = 0; i < s.length; i++) {
    // Check that current character isn't whitespace.
    const c = s.charAt(i)
    if (c !== ' ') {
      returnString += c
    }
  }
  return returnString
}

function stripCharsInBag(s, bag) {
  let i
  let returnString = ''
  // Search through string's characters one by one.
  // If character is not in bag, append to returnString.
  for (i = 0; i < s.length; i++) {
    // Check that current character isn't whitespace.
    const c = s.charAt(i)
    if (bag.indexOf(c) === -1) {
      returnString += c
    }
  }
  return returnString
}

export function checkInternationalPhone(strPhone) {
  let bracket = 3

  strPhone = trim(strPhone)

  if (strPhone.indexOf('+') > 1) {
    return false
  }

  if (strPhone.indexOf('-') !== -1) {
    bracket = bracket + 1
  }

  if (strPhone.indexOf('(') !== -1 && strPhone.indexOf('(') > bracket) {
    return false
  }

  const brchr = strPhone.indexOf('(')

  if (strPhone.indexOf('(') !== -1 && strPhone.charAt(brchr + 2) !== ')') {
    return false
  }

  if (strPhone.indexOf('(') === -1 && strPhone.indexOf(')') !== -1) {
    return false
  }

  const s = stripCharsInBag(strPhone, validWorldPhoneChars)
  return isInteger(s) && s.length >= minDigitsInIPhoneNumber
}

export function ValidateForm(phoneValue) {
  if (!phoneValue) {
    alert('Please Enter your Phone Number')
    return false
  }

  if (!checkInternationalPhone(phoneValue)) {
    alert('Please Enter a Valid Phone Number')
    return false
  }
  return true
}
