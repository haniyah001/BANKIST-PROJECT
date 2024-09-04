///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
const INTERESTRATE = 1.5;

const accounts = [
  {
    fullName: "Musa Abdulkabir Ayomide",
    transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    pin: 1111,
  },

  {
    fullName: "Ayodeji Amina Ayomide",
    transactions: [5000, -3400, -150, 300, 30],
    pin: 2222,
  },

  {
    fullName: "Desmond Solomon Abuchi",
    transactions: [100, 400, 20000],
    pin: 3333,
  },

  {
    fullName: "Bola Olaniyi Blessing",
    transactions: [2000, 3400, -150, 100000],
    pin: 4444,
  },

  {
    fullName: "Mr Akeem Olarenwaju",
    transactions: [900, 300, -1000, 300000],
    pin: 5555,
  },

  {
    fullName: "Akpobasa Samuel Victor",
    transactions: [300, -100],
    pin: 6666,
  },

  {
    fullName: "Adeyemi Testimony Adebola",
    transactions: [300, 50000000],
    pin: 7777,
  },
];

// const formatMovementDate = function (date, locale) {
//   console.log(date, locale);

//   const calcDaysPassed = (date1, date2) => {
//     Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
//   };

//   const daysPassed = calcDaysPassed(new Date(), date);
//   console.log(daysPassed);

//   if (daysPassed === 0) return "Today";
//   if (daysPassed === 1) return "Yesterday";
//   if (daysPassed <= 7) return `${daysPassed} days ago`;

//   // const day = `${date.getDate()}`.padStart(2, 0);
//   // const month = `${date.getMonth() + 1}`.padStart(2, 0);
//   // const year = date.getFullYear();
//   // return `${day}/${month}/${year}`;
//   return new Intl.DateTimeFormat(locale).format(date);
// };

// formatMovementDate(new Date("2019-11-01T13:15:33.035Z"), "en-US");

const labelBalance = document.querySelector(".balance__value");

// 1)
// first create username property on each user in the array
function genUsername() {
  accounts.forEach(function (user) {
    // Usename
    const splitted = user.fullName.split(" ");
    // console.log("Musa-Abdulkabir".split("-").join(" "));
    const finalResult = splitted.map((name) => {
      return name[0].toLowerCase(); // name.at(0) or charAt(0)
    });

    user["username"] = finalResult.join(""); // user.username = finalResult.join("")
  });
}
genUsername();

// calc balance for all users
function calcBalance() {
  accounts.forEach((acc) => {
    const balance = acc.transactions.reduce(function (acc, cur) {
      return acc + cur;
    }, 0);

    acc.balance = balance;
  });
}
calcBalance();

// Login Event
const btnLogin = document.querySelector(".login__btn");
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const containerApp = document.querySelector(".app");
const labelWelcome = document.querySelector(".welcome");
const labelTimer = document.querySelector(".timer");

let currentUser;
let initial = 300;
let interval;

function timer() {
  interval = setInterval(() => {
    if (!initial) {
      clearInterval(interval);
      initial = 300;
      containerApp.style.opacity = 0;

      return;
    }

    initial = initial - 1;

    const minutes = `${Math.floor(initial / 60)}`.padStart(2, 0);
    const seconds = `${initial % 60}`.padStart(2, 0);

    labelTimer.textContent = `${minutes}:${seconds}`;
  }, 1000);
}

btnLogin.addEventListener("click", function (event) {
  event.preventDefault();

  const username = inputLoginUsername.value;
  const pin = inputLoginPin.value;

  // blocking request when one of the input is empty
  if (!username || !pin) return;

  // get user
  currentUser = accounts.find((user) => {
    return user.username === username.toLowerCase();
  });

  // if user does not exist
  if (!currentUser) {
    console.log("There is no user with that username :D");
    return;
  }

  // check for user's pin
  if (currentUser.pin !== Number(pin)) {
    return console.log("Incorrect Pin :D");
  }

  containerApp.style.opacity = 1;
  labelWelcome.textContent = `Welcome back, ${currentUser.username.toUpperCase()}`;
  inputLoginUsername.value = "";
  inputLoginPin.value = "";

  labelBalance.textContent = `#${currentUser.balance}`;

  displayTransactionHistory(currentUser.transactions);
  displaySummary(currentUser.transactions);
  timer();
});

const containerMovements = document.querySelector(".movements");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");

function displayTransactionHistory(transactions, sort = false) {
  containerMovements.innerHTML = "";

  let trans;
  if (sort) {
    trans = transactions.slice().sort((a, b) => b - a);
  } else {
    trans = transactions.slice().sort((a, b) => a - b);
  }

  trans.forEach(function (transaction, index) {
    const type = transaction > 0 ? "deposit" : "withdrawal";

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${index + 1} ${type}
          </div>
          <div class="movements__date">24/01/2037</div>
          <div class="movements__value">${Math.abs(transaction)}€</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

function displaySummary(transactions) {
  const income = transactions
    .filter((transaction) => transaction > 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumIn.textContent = income;

  // outgoing
  const outgoing = transactions
    .filter((transaction) => transaction < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = Math.abs(outgoing);

  // interest
  const interest = (income * 30 * INTERESTRATE) / 100;
  labelSumInterest.textContent = interest;
}

// Transfer
const btnTransfer = document.querySelector(".form__btn--transfer");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const transferTo = inputTransferTo.value;
  const amount = Number(inputTransferAmount.value);

  if (!transferTo || !amount) return;

  // find receiver
  const receiver = accounts.find((acc) => {
    return acc.username === transferTo;
  });

  if (!receiver) {
    return console.log("Account does not exist :)");
  }

  // check current user balance
  if (amount > currentUser.balance - 100) {
    return console.log("Insufficient balance :)");
  }

  inputTransferTo.value = "";
  inputTransferAmount.value = "";

  receiver.transactions.push(Math.abs(amount));
  currentUser.transactions.push(-Math.abs(amount));

  calcBalance();
  labelBalance.textContent = `#${currentUser.balance}`;

  displayTransactionHistory(currentUser.transactions);
  displaySummary(currentUser.transactions);
});

// Request Loan
const btnLoan = document.querySelector(".form__btn--loan");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (!amount) return;

  const targetAmount = Math.floor(Math.max(currentUser.transactions) / 2);

  // if amount is greater than the targetAmount
  if (amount > targetAmount) {
    return console.log(`You dey do pass your yourself: ${amount} 👿😡`);
  }

  inputLoanAmount.value = "";
  currentUser.transactions.push(amount);

  displaySummary(currentUser.transactions);
  displayTransactionHistory(currentUser.transactions);
  calcBalance();
  labelBalance.textContent = `#${currentUser.balance}`;
});

// Close Account
const btnClose = document.querySelector(".form__btn--close");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  const username = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);

  if (!pin || !username) return;

  if (username !== currentUser.username)
    return console.log("You are not the active logged in user :)");

  if (pin !== currentUser.pin) return console.log("Incorrect Pin :)");

  const index = accounts.findIndex(
    (acc) => acc.username === currentUser.username
  );

  accounts.splice(index, 1);

  containerApp.style.opacity = 0;

  console.log(accounts);
});

// Sort Event
const btnSort = document.querySelector(".btn--sort");

let sort = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  sort = !sort;
  displayTransactionHistory(currentUser.transactions, sort);
});

const labelDate = document.querySelector(".date");
const now = new Date();

const year = now.getFullYear();
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const day = `${now.getDate()}`.padStart(2, 0);

labelDate.textContent = `${day}/${month}/${year}`;
