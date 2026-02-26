var lowerCase = "abcdefghijklmnopqrstuvwxyz";
var upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var numbers = "0123456789";
var symbols = "!@#$%^&*()_+-=";
var ambiguousChars = "0Oo1lI";
function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function () {
    console.log('Async: Copying to clipboard was successful!');
  }, function (err) {
    console.error('Async: Could not copy text: ', err);
  });
}
function generatePassword(params) {
  params = params || {
    length: 16,
    lower: true,
    upper: true,
    numbers: true,
    symbols: false,
    nonAmbiguous: false,
    mode: "standard",
  };

  copy.innerText = "Copy";
  
  // Handle different generation modes
  if (params.mode === "hex") {
    return generateHexString(params.length);
  }
  
  if (params.mode === "base64") {
    return generateBase64String(params.length);
  }
  
  // Standard password generation
  var filterAmbiguous = function(chars) {
    if (!params.nonAmbiguous) return chars;
    return chars.split("").filter(function(c) { return ambiguousChars.indexOf(c) === -1; }).join("");
  };
  var chars = "";
  var generatedPassword = "";
  if (params.lower) {
    var lower = filterAmbiguous(lowerCase);
    chars += lower;
    generatedPassword += generatePasswordFrom(lower, Math.min(1, params.length - generatedPassword.length));
  }
  if (params.upper) {
    var upper = filterAmbiguous(upperCase);
    chars += upper;
    generatedPassword += generatePasswordFrom(upper, Math.min(1, params.length - generatedPassword.length));
  }
  if (params.numbers) {
    var nums = filterAmbiguous(numbers);
    chars += nums;
    generatedPassword += generatePasswordFrom(nums, Math.min(1, params.length - generatedPassword.length));
  }
  if (params.symbols) {
    var syms = filterAmbiguous(symbols);
    chars += syms;
    generatedPassword += generatePasswordFrom(syms, Math.min(1, params.length - generatedPassword.length));
  }
  generatedPassword += generatePasswordFrom(chars, params.length - generatedPassword.length);
  return generatedPassword.split("").sort(() => Math.random() - 0.5).join("");
};
function generatePasswordFrom(chars, length) {
  var password = "";
  for (var i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};
function generateHexString(length) {
  var hexChars = "0123456789abcdef";
  var bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  var result = "";
  for (var i = 0; i < length; i++) {
    result += hexChars.charAt(bytes[i] % 16);
  }
  return result;
};
function generateBase64String(length) {
  // Base64 encoding produces 4 characters for every 3 bytes
  // Generate enough bytes to ensure we get at least 'length' base64 characters
  var numBytes = Math.ceil(length / 4) * 3;
  var bytes = new Uint8Array(numBytes);
  crypto.getRandomValues(bytes);
  
  // Convert bytes to base64, handling large arrays safely
  var binary = '';
  for (var i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  var base64 = btoa(binary);
  
  // Trim to requested length
  return base64.substring(0, length);
};
function parse(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  if (isNaN(parseInt(value))) return value;
  return parseInt(value);
};
function copyPassword() {
  copyTextToClipboard(password.value);
  copy.innerText = "Copied!";
};
var params = {
  length: 16,
  lower: true,
  upper: true,
  numbers: true,
  symbols: false,
  nonAmbiguous: false,
  mode: "standard",
};
var length = document.getElementById("length");
var lowerCheckbox = document.getElementById("lower");
var upperCheckbox = document.getElementById("upper");
var digitsCheckbox = document.getElementById("digits");
var symbolsCheckbox = document.getElementById("symbols");
var nonAmbiguousCheckbox = document.getElementById("non-ambiguous");
var modeStandard = document.getElementById("mode-standard");
var modeHex = document.getElementById("mode-hex");
var modeBase64 = document.getElementById("mode-base64");
var characterOptions = document.getElementById("character-options");
var generate = document.getElementById("generate");
var password = document.getElementById("password");
var copy = document.getElementById("copy");
length.addEventListener("input", function () {
  params.length = parseInt(length.value);
  password.value = generatePassword(params);
});
lowerCheckbox.addEventListener("input", function () {
  params.lower = lowerCheckbox.checked;
  password.value = generatePassword(params);
});
upperCheckbox.addEventListener("input", function () {
  params.upper = upperCheckbox.checked;
  password.value = generatePassword(params);
});
digitsCheckbox.addEventListener("input", function () {
  params.numbers = digitsCheckbox.checked;
  password.value = generatePassword(params);
});
symbolsCheckbox.addEventListener("input", function () {
  params.symbols = symbolsCheckbox.checked;
  password.value = generatePassword(params);
});
nonAmbiguousCheckbox.addEventListener("input", function () {
  params.nonAmbiguous = nonAmbiguousCheckbox.checked;
  password.value = generatePassword(params);
});
generate.addEventListener("click", function () {
  password.value = generatePassword(params);
});
password.addEventListener("click", function () {
  copyPassword();
});
copy.addEventListener("click", function () {
  copyPassword();
});
modeStandard.addEventListener("change", function () {
  params.mode = "standard";
  characterOptions.style.display = "block";
  password.value = generatePassword(params);
});
modeHex.addEventListener("change", function () {
  params.mode = "hex";
  characterOptions.style.display = "none";
  password.value = generatePassword(params);
});
modeBase64.addEventListener("change", function () {
  params.mode = "base64";
  characterOptions.style.display = "none";
  password.value = generatePassword(params);
});
password.value = generatePassword();