import React, { useState } from 'react'
import { RouteComponentProps } from "react-router";
import { useLoginMutation, MeDocument, MeQuery } from '../generated/graphql';
import { setAccessToken } from '../accessToken';

export const Login: React.FC<RouteComponentProps> = ({history}) => {
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const [login]=useLoginMutation();

    return (
        <form  onSubmit={async e=>{
            e.preventDefault()
            console.log('user loged on');                    
          
           const response=await login({variables: {
                email: email,
                password: password
              },
            update:(store,{data})=>{
               if(!data){
                   return null;
               }
               store.writeQuery<MeQuery>({
                   query:MeDocument,
                   data:{
                       __typename:"Query",
                       me:data.login.user
                   }
                   
               });
        
            }
            });
              if (response && response.data) {
                setAccessToken(response.data.login.accessToken);
              }
              history.push("/")
             console.log(response)}}>
            <div>
                <input               
                value={email}
                placeholder="email"
                onChange={e=>{
                    setEmail(e.target.value);
                }}/>
            </div>
            <div>
                <input
                type="password"
                value={password}
                placeholder="password"
                onChange={e=>{
                    setPassword(e.target.value);
                }}/>
            </div>
            <button type="submit">login</button>
        </form>      
    );
}