import React from 'react';
import ReactDOM from 'react-dom';

import Apolloclient from "apollo-boost";
import { ApolloProvider } from '@apollo/react-hooks';
import Routes from './Routes';
import { getAccessToken, setAccessToken } from './accessToken';
import { App } from './App';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable } from 'apollo-link';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import jwtDecode from 'jwt-decode';

const cache = new InMemoryCache({
});

const requestLink = new ApolloLink((operation, forward) =>
    new Observable(observer => {
        let handle: any;
        Promise.resolve(operation)
            .then((operation) => {
                const accessToken = getAccessToken();
                if (accessToken) {
                    operation.setContext({
                        headers: {
                            authorization: `bearer ${accessToken}`
                        }
                    });
                }
            })
            .then(() => {
                handle = forward(operation).subscribe({
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                });
            })
            .catch(observer.error.bind(observer));

        return () => {
            if (handle) handle.unsubscribe();
        };
    })
);

const client = new ApolloClient({
    link: ApolloLink.from([
        new TokenRefreshLink({
            accessTokenField:'accessToken',
            isTokenValidOrUndefined: () => {
                const token = getAccessToken()
                if (!token) {
                    return true;
                }
                try {
                    //get payload of the token
                    const { exp } = jwtDecode(token);
                    if(Date.now()>=exp*1000){
                        return false;
                    }else{
                        return true;
                    }
                } catch{
                    return false;
                }
            },
            fetchAccessToken: () => {
                return fetch("http://localhost:4000/graphql",{
                    method:"POST",
                    credentials: 'include'
                }
               );
            },
            handleFetch: accessToken => {             
                setAccessToken(accessToken);
               
            },
          
            handleError: err => {
                // full control over handling token fetch Error
                console.warn('Your refresh token is invalid. Try to relogin');
                console.error(err);            
            }
        }),

        onError(({ graphQLErrors, networkError }) => {
            console.log(graphQLErrors);
            console.log(networkError);

        }),
        requestLink,
        new HttpLink({
            uri: "http://localhost:4000/graphql",
            credentials: 'include'
        })
    ]),
    cache
});

// const client = new Apolloclient({
//     uri: "http://localhost:4000/graphql",
//     credentials:"include",
//     request:(operation)=>{
//         const accessToken=getAccessToken();
//         if(accessToken){
//         operation.setContext({
//             headers:{
//                 authorization: `bearer ${accessToken}`
//             }
//         });
//     }
//     }
// });

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
    , document.getElementById('root'));

