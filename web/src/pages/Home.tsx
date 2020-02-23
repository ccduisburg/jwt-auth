import React from 'react'
import { Link } from 'react-router-dom';
import { useUsersQuery } from '../generated/graphql';

interface Props {

}
export const Home: React.FC<Props> = () => {
    const { data, loading, error } = useUsersQuery({
           variables: {
           },
           fetchPolicy:"network-only"});
           if(!data){
               return <div>loading ....</div>;
           }
    return (
        <div>
        <div>users:</div>
        <ul>
            {data.users.map(x=>{
                return <li key={x.id}>
                    {x.email},{x.id}
                </li>
            })}
        </ul>
        </div>

    );
};