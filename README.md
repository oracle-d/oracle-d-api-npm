# Oracle-D API

If you want to use the Oracle-D API please apply for an API key at: [https://api.oracle-d.com/v1](https://api.oracle-d.com/v1)

## Installation

`npm i oracle-d-api --save`

## Usage

```js
const OracleD = require("oracle-d-api");

let api = new OracleD.AccountAPI.API({api_key: "MY_SECRET_API_KEY"});

// request a new account

let newAccount = new OracleD.AccountAPI.Account({username:"mynewusername",email:"user.email@provider.com"});

api.requestAccount(newAccount).then(account => {
    console.log(account);
}).catch(e => {
     console.log(e)
});

let account = new OracleD.AccountAPI.Account({_id: "accountID"});

// get the accounts' status

api.getAccountStatus(account.data).then(account => {
    console.log(account)
}).catch(e => {
    console.log(e)
});

// get all requested accounts
api.getAccountList().then(data => {
    console.log(data)
});
```