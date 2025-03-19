var lowerCase = "abcdefghijklmnopqrstuvwxyz";
var upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var numbers = "0123456789";
var symbols = "!@#$%^&*()_+-=";
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
function pickRandomChar(string) {
  return string.charAt(Math.floor(Math.random() * string.length));
};
function generatePassword(params) {
  params = params || {
    length: 16,
    lower: true,
    upper: true,
    numbers: true,
    symbols: false,
  };

  copy.innerText = "Copy";
  var chars = "";
  var generatedPassword = "";
  if (params.lower) {
    chars += lowerCase;
    generatedPassword += pickRandomChar(lowerCase);
  }
  if (params.upper) {
    chars += upperCase;
    generatedPassword += pickRandomChar(upperCase);
  }
  if (params.numbers) {
    chars += numbers;
    generatedPassword += pickRandomChar(numbers);
  }
  if (params.symbols) {
    chars += symbols;
    generatedPassword += pickRandomChar(symbols);
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
};
var length = document.getElementById("length");
var lowerCheckbox = document.getElementById("lower");
var upperCheckbox = document.getElementById("upper");
var digitsCheckbox = document.getElementById("digits");
var symbolsCheckbox = document.getElementById("symbols");
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
generate.addEventListener("click", function () {
  password.value = generatePassword(params);
});
password.addEventListener("click", function () {
  copyPassword();
});
copy.addEventListener("click", function () {
  copyPassword();
});
password.value = generatePassword();