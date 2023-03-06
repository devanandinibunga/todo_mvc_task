import React from 'react'
import "./TodoFooter.scss";
import { Button } from 'antd';

export const TodoFooter = ({todoData,AllTodoItems,ActiveTodoItems,CompletedTodoItems,ClearCompletedTodoItems}) => {
//  console.log(datalength);
  // let [count,setCount]=useState(0);
  let count=0;
  return (
   <div className='todo-footer-container'>
    {todoData.forEach((element) => {
        if (element.isChecked === false) {
          count=count+1;
          console.log(count);
        }
      })}
    <p className='todo-footer-counter'>{count} Items left</p>
    <div className='todo-footer-middle-container'>
     <Button className='todo-footer-button' onClick={AllTodoItems}>All</Button>
     <Button className='todo-footer-button' onClick={ActiveTodoItems}>Active</Button>
     <Button className='todo-footer-button' onClick={CompletedTodoItems}>Completed</Button>
    </div>
    <div>
      {/* {todoData.forEach((item)=>{
        if (item.isChecked===true){
          
        } 
      })}   */}
      <Button className='todo-footer-right-button' onClick={ClearCompletedTodoItems}>
            Clear completed
          </Button>
    </div>
   </div>
    
  );
}
