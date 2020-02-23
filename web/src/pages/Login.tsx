import React, { useState } from 'react'
import { RouteComponentProps } from "react-router";
import { useLoginMutation } from '../generated/graphql';

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
              }});
              if (response && response.data) {
              //  setAccessToken(response.data.login.accessToken);
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