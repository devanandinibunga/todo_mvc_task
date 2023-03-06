import React from 'react';
import { Checkbox,List} from 'antd';
import "./TodoItemsContainer.scss";
import {RxCross2} from "react-icons/rx";
// import { TodoFooter } from '../TodoFooter/TodoFooter';


export const TodoItemsContainer = ({setTodoData,setcheckStatus,Item,checkStatus}) => {

  const deleteTodoItem=()=>{
    const request = indexedDB.open("TodoData", 2);
    request.onsuccess = () => {
      const db = request.result;
      const txn = db.transaction(["todoItems"], "readwrite");
      const store = txn.objectStore("todoItems"); 
      store.delete(Item.index);
      let gettingTodoItemsFromDB = db
        .transaction(["todoItems"], "readwrite")
        .objectStore("todoItems")
        .getAll();
      gettingTodoItemsFromDB.onsuccess = function (event) {
        const todoItemsFromDB = event.target.result;
         setTodoData(todoItemsFromDB);
      };
      txn.oncomplete = function () {
          db.close();
        };
    };

  }

  const setCheckedTodoItem=(e)=>{
    const request = indexedDB.open("TodoData", 2);
    request.onsuccess = () => {
      const db = request.result;
      let todoList = db.transaction(["todoItems"], "readwrite").objectStore("todoItems");
      let todoListItem=todoList.get(Item.index);
      todoListItem.onsuccess = (event) => {
        let value = event.target.result;
        value.isChecked=(!checkStatus);
        todoList.put(value);
        setcheckStatus(!checkStatus);
        let totalData=todoList.getAll();
        totalData.onsuccess=(e)=>{
          let value = e.target.result
          setTodoData(value)
        }
      };
    }
  };

  return (
    <>
      <List.Item className='todo-list-item' key={Item.index}>
        <Checkbox  className="todo-list-item-checkbox" checked={Item.isChecked} onClick={(i,e)=>setCheckedTodoItem(i,e)} value={Item.index}>
        </Checkbox>
        <span value={Item.id} className={Item.isChecked ?'strike':'todo-list-item-span'}>{Item.todoItem}</span>
        <RxCross2 className='close-button' onClick={()=>deleteTodoItem()}/>
      </List.Item>
    </>
  )
}
