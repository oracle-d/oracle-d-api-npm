const fetch = require("node-fetch");

OracleD = {
    AccountAPI: {
        API: class {
            constructor(config) {
                this.baseURL = 'https://api.oracle-d.com/v1';
                this.api_key = config.api_key;
                this.STATUS_PENDING = "pending";
                this.STATUS_CREATED = "created";
                this.STATUS_FAILED = "failed"
            }

            async getDappStatus() {
                return new Promise((resolve, reject) => {
                    fetch(this.baseURL + '/dapp/status', {
                        method: 'get',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': this.api_key,
                        },
                    })
                        .then(res => res.json())
                        .then(json => {
                            resolve(json);
                        }).catch(e => {
                            reject(e)

                    })
                })
            }

            async getAccountStatus(account) {
                return new Promise((resolve, reject) => {
                    if (account.constructor.name !== "Account") {
                        throw new Error("account must be an instance of Account()")
                    } else if (!account.hasOwnProperty("_id")) {
                        throw new Error("account needs to be requested first")
                    } else {
                        fetch(this.baseURL + '/accounts/' + account._id, {
                            method: 'get',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-api-key': this.api_key,
                            },
                        })
                            .then(res => res.json())
                            .then(json => {
                                if (json.code === 200) {
                                    json.data = account.extend(json.data)
                                    resolve(json);
                                } else if (json.code >= 400) {
                                    reject(json.errors[0])
                                } else {
                                    reject(json.message !== undefined ? json.message : "An unknown error occured. Please contact support@oracle-d.com")
                                }
                            }).catch(e => {
                            reject(e);
                        });
                    }
                })
            }

            async getAccountList() {
                return new Promise((resolve, reject) => {
                    fetch(this.baseURL + '/accounts', {
                        method: 'get',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': this.api_key,
                        },
                    })
                        .then(res => res.json())
                        .then(json => {
                            if (json.code === 200) {
                                let accounts = [];
                                json.data.forEach(a => {
                                    let account = new OracleD.AccountAPI.Account(a);
                                    accounts.push(account);
                                });
                                json.data = accounts;
                                resolve(json);
                            } else if (json.code >= 400) {
                                reject(json.errors[0])
                            } else {
                                reject(json.message !== undefined ? json.message : "An unknown error occured. Please contact support@oracle-d.com")
                            }
                        }).catch(e => {
                        reject(e);
                    });
                })
            }

            async requestAccount(account) {
                return new Promise((resolve, reject) => {
                    if (account.constructor.name !== "Account") {
                        throw new Error("account must be an instance of Account()")
                    } else if (account.hasOwnProperty("_id")) {
                        throw new Error("account has already been requested")
                    } else {
                        fetch(this.baseURL + '/accounts/create', {
                            method: 'post',
                            body: JSON.stringify(account.toJSON()),
                            headers: {
                                'Content-Type': 'application/json',
                                'x-api-key': this.api_key,
                            },
                        })
                            .then(res => res.json())
                            .then(json => {
                                if (json.code === 200) {
                                    json.data = account.extend(json.data)
                                    resolve(json);
                                } else if (json.code >= 400) {
                                    reject(json.errors[0])
                                } else {
                                    reject(json.message !== undefined ? json.message : "An unknown error occured. Please contact support@oracle-d.com")
                                }
                            }).catch(e => {
                            reject(e);
                        });
                    }
                })
            }
        },
        Account: class {
            constructor(config) {
                Object.keys(config).forEach(key => {
                    this[key] = config[key];
                });
            }

            extend(data) {
                Object.keys(data).forEach(key => {
                    this[key] = data[key];
                });
                return this;
            }

            toJSON() {
                let {username, email} = this;
                return {username, email}
            }
        }
    }
};

module.exports = OracleD;
