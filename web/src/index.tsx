import React from 'react';
import ReactDOM from 'react-dom';

import Apolloclient from "apollo-boost";
import { ApolloProvider } from '@apollo/react-hooks';
import Routes from './Routes';
const client = new Apolloclient({
    uri: "http://localhost:4000/graphql"
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <Routes />
    </ApolloProvider>
    , document.getElementById('root'));

