import React from 'react';
import { Button,Search, Header ,Card, Image,Label} from 'semantic-ui-react';
import $ from "jquery";
import {
Form,FormGroup,FormControl,Grid,Col,Well,PanelContainer,Panel,PanelHeader,PanelBody,Row
} from '@sketchpixy/rubix';
import './main.css'
import './App.css'
export default class App extends React.Component {

  constructor() {
    super();
  }
componentWillMount() {
  this.resetComponent()
}

resetComponent = () => this.setState({ isLoading: false, results: [], value: '',card:[""] })

handleResultSelect = (e, { result }) => {
this.setState((prevState) => {
  console.log(prevState.title);
  return {
  value: result.title
}});

}

handleSearchChange = (e, { value }) => {//ebrindisi@mvcc.edu
if(value.length>2)
{  this.setState({ isLoading: true, value })
  let ucmPromise = new Promise(
   (resolve, reject) => {
  $.ajax({
      url: "http://localhost:8080/ucmUser?email="+value,
      type: "GET",
      datatype:'JSON',
      success: function(data){
        console.log(data);
        resolve(data)
        },
      error:function(data){
        console.log(data,"ERR");
      }
  });
}
);
  $.ajax({
      url: "http://localhost:8080/lrnrUser?email="+value,
      type: "GET",
      datatype:'JSON',
      success: function(lrnrUser){
        // var ucm,lrnr;v
      var  results = lrnrUser;
        ucmPromise.then((ucmUser)=>{
          ucmUser.map((val)=>{
            var index = results.findIndex((element) => (element.email==val.email))
            if(index == -1)
             results.push(val)
            else
              {
                results[index].type = 'Lrnr/UCM';
                results[index].accountId = val.accountId;
            }
          })
          this.setState({results:results,
          isLoading : false})
        })
         }.bind(this),
      error:function(data){
        console.log(data,"ERR");
      }
  });}
  else {
    this.setState({value:value})
  }
}
  render() {
    const { isLoading, value, results,lrnrcard,ucmcard } = this.state
    const resultRenderer = ({ email,name,role,type }) => <div className="reactSearchResult">
    <div className="content">
    <div className="type">{type}</div>
    <div className="name">{name}</div>
    <div className="email">{email}</div>
    <div className="role">{role}</div>
    </div>
    </div>
    return (
      <div>
      <br/>
        <br/>
        <Grid >
            <Col md={2} xs={3}/>
            <Col md={8}  xs={12}>
            <Search
                   loading={isLoading}
                   onResultSelect={this.handleResultSelect}
                   onSearchChange={this.handleSearchChange}
                   results={results}
                   value={value} id="simSearch" fluid
                   resultRenderer={resultRenderer}
                 />
            </Col>
            <Col md={2}  xs={3}/>
        </Grid>
          <br/><br/>
         <br/>
         <Grid >
              <Col md={1}  xs={4}/>
             <Col  md={5} xs={12} >
              {ucmcard}
             </Col>
             <Col  md={5}  xs={12}  >
             {lrnrcard}
             </Col>
             <Col md={1}  xs={4}/>
         </Grid>
         </div>
    );
  }
}
