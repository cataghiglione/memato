const restApiEndpoint = "http://localhost:4326"

const MySystem = {
    login: (credentials, okCallback, errorCallback) => {
        fetch(`${restApiEndpoint}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        }).then(resp => {
            if (resp.status === 201) {
                resp.json().then(body => okCallback(body))
            } else {
                errorCallback("Invalid user or password")
            }
        }).catch(e => errorCallback("Unable to connect to My System API"))
    },

    register: (user, okCallback, errorCallback) => {
        fetch('http://localhost:4326/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(resp => {
            if (resp.status === 201) {
                okCallback()
            } else {
                errorCallback()
            }
        })
    },


    listUsers: (token, okCallback, errorCallback) => {
        fetch('http://localhost:4326/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(resp => {
            if (resp.status === 200) {
                resp.json().then(users => okCallback(users))
            } else {
                errorCallback("Could not load users")
            }
        })
    },

    listTeams: (token, okCallback, errorCallback) => {
        fetch('http://localhost:4326/pickTeam', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(resp => {
            if (resp.status === 200) {
                resp.json().then(teams => okCallback(teams))
            } else {
                errorCallback("Could not load teams")
            }
        })
    },

    getUser: (token, okCallback, errorCallback) => {
        fetch(`${restApiEndpoint}/home`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(resp => {
            if (resp.status === 200) {
                // var mydata = JSON.parse(resp);
                // okCallback(mydata)
                resp.json().then(value => {
                    okCallback(JSON.parse(value));
                }).catch(err => {
                    console.log(err);
                });
            } else {
                errorCallback("no llegue")
                okCallback("")
            }
            return resp.body;
        })
    },

    newTeam: (token,user, okCallback, errorCallback) => {
        console.log("estoy en mysistem")
        fetch(`${restApiEndpoint}/newTeam`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token

            },
            body: JSON.stringify(user)
        }).then(resp => {
            if (resp.status === 201) {
                okCallback()
            } else {
                errorCallback()
            }
        })
    }
}

const useMySystem = () => MySystem

export {useMySystem};
