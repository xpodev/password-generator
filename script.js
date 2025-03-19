var lowerCase = "abcdefghijklmnopqrstuvwxyz";
var upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var numbers = "0123456789";
var symbols = "!@#$%^&*()_+-=";
var generatePassword = function (params) {
  params = params || {
    length: 16,
    lower: true,
    upper: true,
    numbers: true,
    symbols: false,
  };

  copy.innerText = "Copy";
  var chars = "";
  if (params.lower) chars += lowerCase;
  if (params.upper) chars += upperCase;
  if (params.numbers) chars += numbers;
  if (params.symbols) chars += symbols;
  return generatePasswordFrom(chars, params.length);
};
var generatePasswordFrom = function (chars, length) {
  var password = "";
  for (var i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};
var parse = function (value) {
  if (value === "true") return true;
  if (value === "false") return false;
  if (isNaN(parseInt(value))) return value;
  return parseInt(value);
};
var copyPassword = function () {
  password.select();
  document.execCommand("copy");
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
var level = document.getElementById("level");
var generate = document.getElementById("generate");
var password = document.getElementById("password");
var copy = document.getElementById("copy");
length.addEventListener("input", function () {
  params.length = parseInt(length.value);
  password.value = generatePassword(params);
});
level.addEventListener("input", function () {
  params.lower = level.value >= 1;
  params.upper = level.value >= 2;
  params.numbers = level.value >= 3;
  params.symbols = level.value >= 4;
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