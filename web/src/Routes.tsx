import React from 'react';
import { useHelloQuery } from './generated/graphql';
import { BrowserRouter, Switch ,Route} from 'react-router-dom';


export const Routes: React.FC=()=> {
   //const { data, loading, error } = useHelloQuery();
  // if(loading){
  //   return <div>loading</div>
  // }
// return <div>{data.hello}</div>;

  return (
    <BrowserRouter>
    <Switch>
      <Route exact path="/" render={()=><div>hii</div>}/>
    </Switch>
    </BrowserRouter>
    
  );
}

export default Routes;
