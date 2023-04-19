'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
prompt(`To log in use these usernames
username: js  ___ password: 1111
username: jd ___ password: 2222
username: stw __ password: 3333
username: ss ____ password: 4444`);

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// displaying the movements of each account
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ``;

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? `deposit` : `withdrawal`;

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type} </div>
      <div class="movements__value">${mov}€</div>
  </div>`;
    containerMovements.insertAdjacentHTML(`afterbegin`, html);
  });
};

// calculating and printing Balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, cur) {
    return acc + cur;
  }, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

// Displaying the summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => mov + acc, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => int + acc, 0);
  labelSumInterest.textContent = `${Math.trunc(interest)}€`;
};

// creating a Username for each account
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(` `)
      .map(name => name[0])
      .join(``);
  });
};
/* The reason why this works is because Accounts in an array made of abject. Thus the createUsername iterates over each element of the array account. This array, in turn, is made out of objects. Thus, in this case, accs refers to the array (accounts) and the acc refers to the element inside the array (in this case account1, account2 etc). Finally, with acc.username we are creating a new key called username with the value acc.owner....*/
createUsernames(accounts);
// console.log(accounts);

const updateUI = function (acc) {
  //display movements
  displayMovements(acc.movements);
  // display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

// Event handler
let currentAccount;
btnLogin.addEventListener(`click`, function (e) {
  // prevent form from refreshing the page
  e.preventDefault();
  console.log(`login`);

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log(`LOGIN`);
    // display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(` `)[0]
    }`;
    containerApp.style.opacity = 100;

    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = ``;
    inputLoginPin.blur(); // this takes out the cursor from the form

    // update UI
    updateUI(currentAccount);
  }
});

// Transfering money function
btnTransfer.addEventListener(`click`, function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // console.log(amount, receiverAcc);

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // console.log(`Transfer valid`);

    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // update UI
    updateUI(currentAccount);
  }
});

btnClose.addEventListener(`click`, function (e) {
  e.preventDefault();
  // console.log(`delete`);

  inputTransferAmount.value = inputTransferTo.value = ``;
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // console.log(index);
    // delete account
    accounts.splice(index, 1);
    // Hide UI
    containerApp.style.opacity = 0;
  }
  // clearing input fields in the forms after deleting account
  inputCloseUsername.value = inputClosePin.value = ``;
});

// requesting a loan to the bank
btnLoan.addEventListener(`click`, function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // If true add movement
    currentAccount.movements.push(amount);

    // update UI
    updateUI(currentAccount);
    inputLoanAmount.value = ``;
  }
});

//calculating the overal Balance of all the accounts in the Bank
const overalBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);
// we can do the same with Flat Map
const overalBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance2);

// sorting the movement in ascebding order
let sorted = false;
btnSort.addEventListener(`click`, function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Practice code that can be useful for the app.

/*const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]); */

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/* let arr = [`a`, `b`, `c`, `d`, `e`];
const newArr = arr.slice(2);
console.log(newArr);
console.log(arr.slice(2, 4));
console.log([...arr]);

// splice method it is a destructive method
// Splice takes part of an array and creates a new one with what it takes.
//console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);

// REVERSE it is a destructive method
arr = [`a`, `b`, `c`, `d`, `e`];
const arr2 = [`j`, `i`, `h`, `g`, `f`];
console.log(arr2.reverse());
console.log(arr2);

// CONCAT method
const letters = arr.concat(arr2);
console.log(letters);
// same as doing:
console.log([...arr, ...arr2]);

// JOIN method - returns a string
console.log(letters.join(`-`)); */

// AT method
/* const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(1));

// traditional way of getting the last element
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
//Now using AT methods
console.log(arr.at(-1));
console.log(`ricardo`.at(-2)); */

// For each iteration
/* const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const movement of movements) {
  if (movement > 0) {
    console.log(`You deposited ${movement}`);
  } else {
    console.log(`You withdrew ${Math.abs(movement)}`);
  }
}

console.log(`---------FOREACH----------`);

movements.forEach(function (movement, index, arr) {
  if (movement > 0) {
    console.log(`Movement ${index + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${index + 1}: You withdrew ${Math.abs(movement)}`);
  }
});

console.log(`-------------------------------------------------`);

// FOREACH with maps and sets
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key} - ${value}`);
});

const currenciesUnique = new Set([`USD`, `GBP`, `USD`, `EUR`, `EUR`]);
console.log(currenciesUnique);

currenciesUnique.forEach(function (value, _, map) {
  console.log(`${_} - ${value}`);
}); */

// Coding challenge #1
/* const dogsJulia = [3, 5, 2, 12, 7].slice(1, -2);
// console.log(correctedDogs);
const dogsKate = [4, 1, 15, 8, 3];
const checkDogs = function (dogsJulia, dogsKate) {
  // const array = dogsJulia.concat(dogsKate);
  const array = [...dogsJulia, ...dogsKate];
  array.forEach(function (value, key, map) {
    if (value > 3) {
      console.log(
        `Dog number ${key + 1} is an adult, and is ${value} years old`
      );
    } else {
      console.log(`Dog number ${key + 1} is still a puppy`);
    }
  });
};
checkDogs(dogsJulia, dogsKate); */

// Data transformation with map, filter and reduce
/*
// MAP
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const euroToUS = 1.1;
const movementsUSD = movements.map(mov => Math.trunc(mov * euroToUS));
console.log(movementsUSD);
console.log(movements);

const movementsDescriptions = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? `deposited` : `withdrew`} ${Math.abs(
      mov
    )}`
);
console.log(movementsDescriptions); */

/*
//FILTER method
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposits);

// With a for of loop
const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);
console.log(depositsFor);

const withdrawals = movements.filter(function (mov) {
  return mov < 0;
});
console.log(withdrawals);
 */
// REDUCE method
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const balance = movements.reduce(function (acc, curr) {
  // console.log(`iteration number ${i}: ${acc}`);
  return acc + curr;
}, 0);
console.log(balance);

//with a for of loop
let balanceFor = 0;
for (const mov of movements) balanceFor = balanceFor + mov;
console.log(balanceFor);
*/

// maximum value of an array using reduce
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const max = movements.reduce(
  (acc, cur, i, arr) => (acc > cur ? acc : cur),
  movements[0]
);
console.log(max);
*/
// coding challenge 2
/*
const data1 = [5, 2, 4, 1, 15, 8, 3];
const data2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = function (ages) {
  // task number 1
  const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  // task number 2
  const adultDogs = humanAges.filter(age => age >= 18);
  console.log(humanAges);
  console.log(adultDogs);
  // task number 3
  const average =
    adultDogs.reduce((acc, age) => acc + age, 0) / adultDogs.length;
  return average;
};
const avg1 = calcAverageHumanAge(data1);
const avg2 = calcAverageHumanAge(data2);
console.log(avg1);
console.log(avg2);
*/

// chaining methods

/* const euroToUS = 1.1;
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const totalDepositsUSD = Math.trunc(
  movements
    .filter(mov => mov > 0)
    .map(mov => mov * euroToUS)
    .reduce((acc, mov) => acc + mov, 0)
);

console.log(totalDepositsUSD); */

//Coding challenge 3
/*
const data1 = [5, 2, 4, 1, 15, 8, 3];
const data2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = ages =>
  ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

calcAverageHumanAge(data1); */

// FIND method
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

console.log(accounts);
const account = accounts.find(acc => acc.owner === `Jessica Davis`);
console.log(account);
*/

// FIND method with a for of loop
/*
const accountt = [];
for (const acc of accounts)
  if (acc.owner === `Jessica Davis`) accountt.push(acc);
console.log(accountt);
*/

// findIndex Method
/*
console.log(movements);
console.log(movements.includes(-130));
*/

// SOME and EVERY methods
/*
const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);

console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));
*/

// separate the callback functions
/*
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
*/

// flat and flat map Methods
/*
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));
*/

// sorting values, this is a destructive method.
/*
const owners = [`Jonas`, `Zack`, `Adam`, `Martha`];
console.log(owners.sort());
console.log(owners);
// this  method does not work for numbers so we have to use something else like:

console.log(movements);
// return < 0 -> a,b (keeps the order)
// return > 0 -> B,A (Switches the order)
//ascending order
movements.sort((a, b) => a - b);
console.log(movements);
*/

// descending order
/*
movements.sort((a, b) => b - a);
console.log(movements);
*/

// creating Arrays programatically
/*
const x = new Array(7);
console.log(x);
*/

//FILL method
// x.fill(1);
/*
console.log(x);
x.fill(2, 3, 5);
console.log(x);
x.fill(5, 5, 8);
console.log(x); */

// array.from function
/*
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (cur, i) => i + 1);
console.log(z);

const movementsUI = Array.from(document.querySelectorAll(`.movements__value`));
console.log(movementsUI);

labelBalance.addEventListener(`click`, function () {
  const movementsUI = Array.from(
    document.querySelectorAll(`.movements__value`),
    el => Number(el.textContent.replace(`€`, ``))
  );
  console.log(movementsUI);
});
*/

// Practice for array methods in Javascript
// 1. calculate how much has been deposited in total in the bank
/*
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);
console.log(bankDepositSum);
*/
// 2. Count how many deposit there have been with at least 1000 $
/*
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 1000).length;
console.log(numDeposits1000);

// 3. doing the same with Reduce
const numDeposits10002 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
console.log(numDeposits10002);
*/
// 4. create an object that has the sum of the deposit and withdrawals
/*
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      //cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? `deposits` : `withdrawals`] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);
*/

// 5. create a function to convert a string to a title case
/*
const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = [`a`, `an`, `the`, `but`, `or`, `on`, `in`, `with`];
  const titleCase = title
    .toLowerCase()
    .split(` `)
    .map(word =>
      exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(` `);

  return capitalize(titleCase);
};
console.log(convertTitleCase(`this is a nice title`)); 
*/
// Coding Challenge 4
// Data for challenge
/*
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.
dogs.forEach(
  dog => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
);

// 2.
//console.log(dogs.filter());
const sarahDog = dogs.find(dog => dog.owners.includes(`Sarah`));
console.log(
  `Sarah´s dog is eating too ${
    sarahDog.curFood > sarahDog.recommendedFood * 1.1 ? `much` : `litle`
  }`
);

// 3.
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood * 1.1)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood * 1.1)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

// 4.

console.log(`${ownersEatTooMuch.join(` and `)}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(` and `)}'s dogs eat too little!`);

// 5.
console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

// 6.
const checkEatingOkay = dog =>
  dog.curFood > dog.recommendedFood * 0.9 &&
  dog.curFood < dog.recommendedFood * 1.1;

console.log(dogs.some(dog => checkEatingOkay));
// 7.
console.log(dogs.filter(checkEatingOkay));

// 8
const dogsSorted = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(dogsSorted);
*/
