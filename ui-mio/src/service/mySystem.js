import {PickTeamPage} from "../pages/PickTeamPage";
import {useHistory} from 'react-router-dom';

const restApiEndpoint = "http://localhost:4326"

/*
    POST
 */
export const login = (credentials, okCallback, errorCallback) => {
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
}
export const register = (user, okCallback, errorCallback) => {
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
}
export const newTeam = (token, user, okCallback, errorCallback) => {
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

export const updateTeam = (token, id, form, okCallback, errorCallback) => {
    fetch(`${restApiEndpoint}/updateTeam?id=${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({id, ...form})
    }).then(resp => {
        if (resp.status === 200) {
            okCallback()
        } else errorCallback()
    })

}
export const updateUser = (token, form, okCallback, errorCallback) => {
    fetch(`${restApiEndpoint}/updateUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({...form})
    }).then(resp => {
        if (resp.status === 200) {
            okCallback()
        } else errorCallback()
    })
}

export const deleteSearch=(token, searchId, okCallback, errorCallback)=>{
    fetch(`${restApiEndpoint}/deactivateSearch?id=${searchId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body:JSON.stringify(searchId)

    }).then(resp=>{
        if (resp.status===200){
            okCallback()
        }
        else errorCallback()
    })
}


export const findRival = (token, id, form, okCallback, errorCallback) => {
    fetch(`${restApiEndpoint}/newSearch?id=${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token

        },

        body: JSON.stringify({id, ...form})
    }).then(resp => {
        if (resp.status === 201 || resp.status === 200) {
            console.log(resp.body)
             return resp.json().then(response => okCallback(response))
            // okCallback(resp)
        } else {
            errorCallback()
        }

    })
}

export const newMatch = (token, form, okCallback, errorCallback) => {
    fetch(`${restApiEndpoint}/newMatch`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },

        body: JSON.stringify({...form})
    }).then(resp => {
        if (resp.status === 201 || resp.status === 200) {
            okCallback(resp)
        } else {
            errorCallback()
        }

    })
}
export const confirmMatch=(token, matchId, teamId, okCallback,  errorCallback)=>{
    fetch(`${restApiEndpoint}/confirmMatch?teamid=${teamId}&matchid=${matchId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    }).then(resp=>{
        if (resp.status===200){
            okCallback(resp)
        }

        else errorCallback()
    })
}
/*
    GET
 */

export const getTeam = (token, id, okCallback, errorCallback) => {
    //                                aca agregas al path del *back* el id
    fetch(`${restApiEndpoint}/getTeamById?id=${id}`, {
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
            errorCallback()
        }
        return resp.body;
    })
}

export const currentSearches = (token,team_id, okCallback, errorCallback) => {
    fetch(`${restApiEndpoint}/currentSearches?teamid=${team_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(resp => {
        if (resp.status === 200) {
            return resp.json().then(teams => okCallback(teams))
        } else {
            errorCallback("Not able to fetch searches")
        }
    })


}

export const teamById = (token, teamId, okCallback, errorCallback) => {
    fetch(`${restApiEndpoint}/getTeamByOwnId`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token

        },
        body: JSON.stringify(teamId)

    }).then(resp=>{
        if (resp.status ===200){
            resp.json().then(team => okCallback(team))
        }
        else errorCallback()

    })

}

export const listTeams = (token, okCallback, errorCallback) => {
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
            errorCallback()
        }
    })
}

export const getUser = (token, okCallback, errorCallback) => {
    fetch(`${restApiEndpoint}/user`, {
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
}
export const getPendingConfirmations=(token,teamId,okCallback,secondOkCallback,errorCallback)=>{
    fetch(`${restApiEndpoint}/getMatchesByTeamId?teamid=${teamId}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },

    }).then(resp =>{
        if (resp.status === 200){
            resp.json().then(matches => okCallback(matches))
        }
        if (resp.status ===202){
            resp.json().then(matches => secondOkCallback(matches))

        }
        if (resp.status ===201){
            resp.json().then(matches => secondOkCallback(matches))

        }
        else {
            errorCallback("Not able to fetch searches")
        }
    })
}
export const isTeamOneOrTeamTwo=(token,matchId,teamId,okCallback,errorCallback)=>{
    fetch(`${restApiEndpoint}/isTeamOneOrTwo?teamid=${teamId}&matchid=${matchId}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },

    }).then(resp =>{
        if (resp.status === 200){
            resp.json().then(team => okCallback(team))
        }
        else {
            errorCallback("Not able to fetch match")
        }
    })
}



/*
    DELETE
 */
export const signOut = (token, okCallback, errorCallback) => {
    fetch(`${restApiEndpoint}/auth`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(resp => {
        if (resp.status === 200) {
            okCallback();
        } else {
            errorCallback("Could not sign out")
        }
    })
}

export const deleteAccount = (token, okCallback, errorCallback) => {
    fetch(`${restApiEndpoint}/deleteAccount`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(resp => {
        if (resp.status === 200) {
            okCallback();
        } else {
            errorCallback("Could not delete the account")
        }
    })
}

export const deleteTeam = (token, id, okCallback, errorCallback) => {
    fetch(`${restApiEndpoint}/deleteTeam?id=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({id})
    }).then(resp => {
        if (resp.status === 203) {
            okCallback();

        } else if (resp.status === 200) {
            window.location.href = "/newTeam";
        } else errorCallback()
    })
}


