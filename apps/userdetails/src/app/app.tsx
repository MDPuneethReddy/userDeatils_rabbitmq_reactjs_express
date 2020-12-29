import React, { useState } from 'react';
import { Form, Input, Button,} from 'antd';
import axios from 'axios';
export function App() {
  const [username,setUsername]=useState<any>("")
  const [email,setEmail]=useState<any>("")
    const onFinish = () => {
      console.log(username,email)
      axios.post("http://localhost:3333/api/setUser",{
      username:username,
      email:email
    }).then(response=>{
      console.log("got",response)
    }).catch(err=>{
      console.log(err)
    })
    };
    
  return (
    <div>
      <span style={{textAlign: "center"}}>
      <Input type="text" placeholder="Enter username" value={username} onChange={(e)=>{
        setUsername(e.target.value)
      }}></Input><br />
      <Input type="text" placeholder="Enter email" value={email} onChange={(e)=>{
        setEmail(e.target.value)
      }}></Input>
      <Button onClick={onFinish}>submit</Button>
      
    </span>
    </div>
  );
}

export default App;
