import React, { useState } from 'react';
import "./TodoMainContainer.scss";
import {v4 as uuidv4} from "uuid";
import {BsChevronCompactDown} from "react-icons/bs";
import { Card, ConfigProvider, Form,Input,List} from 'antd';
import { TodoItemsContainer } from '../TodoItemsContainer/TodoItemsContainer';
import { TodoFooter } from '../TodoFooter/TodoFooter';

export const TodoMainContainer = ({todoData,setTodoData, dataLength, setDataLength, completeTodoData}) => {

  const [todoForm]=Form.useForm();
  const [checkStatus,setcheckStatus]=useState(false);

  
  const addNewTodo=(values)=> {
      todoForm.resetFields();
      const request = indexedDB.open("TodoData", 2);
      request.onupgradeneeded=()=>{
          let db = request.result;
  
          console.log("db", db); // create the Contacts object store // with auto-increment id
      
          let store = db.createObjectStore("todoItems", {
              keyPath: "index",
              autoIncrement: true,
          });
          console.log(store); // create an index on the email property
      };
      request.onsuccess = () => {
          const db = request.result;
          let newTodointoDB = { id: uuidv4(), todoItem: `${values.todoListItem}`, isChecked:false };
          const txn = db.transaction(["todoItems"], "readwrite"); // get the Contacts object store
          const store = txn.objectStore("todoItems"); 
          store.add(newTodointoDB);
    
          let gettingTodoItemsFromDB = db
            .transaction(["todoItems"], "readwrite")
            .objectStore("todoItems")
            .getAll();
    
          gettingTodoItemsFromDB.onsuccess = function (event) {
            const todoItemsFromDB = event.target.result;
              // console.log(todoItemsFromDB); 
            setTodoData(todoItemsFromDB);
            if (todoItemsFromDB.length < 1) {
              setDataLength(false);
            } else {
              setDataLength(true);
            }
          };
          // txn.oncomplete = function () {
          //     db.close();
          //   };
        };
  }

  const AllTodoItems = () => {
    const request = indexedDB.open("TodoData", 2);

    request.onsuccess = () => {
      const db = request.result;

      const getAllTodoItems = db
        .transaction(["todoItems"], "readwrite")
        .objectStore("todoItems")
        .getAll();
        getAllTodoItems.onsuccess = (event) => {
        let getAllTodoItemsData = event.target.result;
        setDataLength(true);
        setTodoData(getAllTodoItemsData);
      };
    };
  };

  const ActiveTodoItems = () => {
    const request = indexedDB.open("TodoData", 2);

    request.onsuccess = () => {
      const db = request.result;

      const getActiveTodoItems = db
        .transaction(["todoItems"], "readwrite")
        .objectStore("todoItems")
        .getAll();
        getActiveTodoItems.onsuccess = (event) => {
        let getActiveTodoItemsData = event.target.result;
        let activeData = [];
        getActiveTodoItemsData.forEach((element) => {
          if (element.isChecked === false) {
            activeData.push(element);
          }
        });
        console.log(activeData);
        setTodoData(activeData);
        if (getActiveTodoItemsData.length === 0) {
          setDataLength(false);
        } else {
          setDataLength(true);
        }
      };
    };
  };

  const CompletedTodoItems = () => {
    const request = indexedDB.open("TodoData", 2);

    request.onsuccess = () => {
      const db = request.result;

      const getCompleteTodoItems = db
        .transaction(["todoItems"], "readwrite")
        .objectStore("todoItems")
        .getAll();
        getCompleteTodoItems.onsuccess = (event) => {
        let getCompleteTodoItemsData = event.target.result;
        let completedData = [];
        getCompleteTodoItemsData.forEach((element) => {
          if (element.isChecked === true) {
            completedData.push(element);
          }
        });
        console.log("completedData",completedData);
        setTodoData(completedData);
        if (completedData.length < 1) {
          setDataLength(false);
        } else {
          setDataLength(true);
        }
      };
    };
  };

  const ClearCompletedTodoItems = () => {
    const request = indexedDB.open("TodoData", 2);

    request.onsuccess = () => {
      const db = request.result;

      const getClearCompletedTodoItems = db
        .transaction(["todoItems"], "readwrite")
        .objectStore("todoItems")
        .getAll();
      getClearCompletedTodoItems.onsuccess = (event) => {
        let getClearCompletedTodoItemsData = event.target.result;
        getClearCompletedTodoItemsData.forEach((element) => {
          if (element.isChecked === true) {
            db.transaction(["todoItems"], "readwrite")
              .objectStore("todoItems")
              .delete(element.index);
          }
        });
        let finallIDB = db
          .transaction(["todoItems"], "readwrite")
          .objectStore("todoItems")
          .getAll();
        finallIDB.onsuccess = (e) => {
          let finallIDBData = e.target.result;
          setTodoData(finallIDBData);
          if (finallIDBData.length < 1) {
            setDataLength(false);
          } else {
            setDataLength(true);
          }
        };
      };
    };
  };

  const CheckedAllTodoItems = () => {
    const request = indexedDB.open("TodoData", 2);

    request.onsuccess = () => {
      const db = request.result;

      const getCheckedAllTodoItems = db
        .transaction(["todoItems"], "readwrite")
        .objectStore("todoItems")
        .getAll();
      
        getCheckedAllTodoItems.onsuccess = (e) => {
          let getCheckedAllTodoItemsData = e.target.result
          let allCheckedData = []
          getCheckedAllTodoItemsData.forEach(each => {
            each.isChecked = !checkStatus
            allCheckedData.push(each)
            setTodoData(allCheckedData)
            db.transaction(["todoItems"], "readwrite")
            .objectStore("todoItems")
            .put(each);
          })
          setcheckStatus(!checkStatus);
        }
    };
  };
  // let locale={
  //   // emptyText="Abc",
  // };


  return (
    <div className='todo-main-container'>
        <h1 className='todo-heading'>todos</h1>
        <Card>
        <Form className="todo-main-form-container" onFinish={(values)=>addNewTodo(values)} form={todoForm}>
            <Form.Item  name="todoListItem">
                <Input  prefix={
                dataLength ? (
                  <BsChevronCompactDown
                    className="down-angle"
                    onClick={CheckedAllTodoItems}
                  />
                ) : (
                  null
                )
              } className='todo-input' placeholder='What needs to be done?' type="text"></Input>
            </Form.Item>    
        </Form>
        <>
          <ConfigProvider renderEmpty={() => ""}>
            <List className='todo-list' dataSource={todoData} renderItem={(Item,i)=>(
                <TodoItemsContainer checkStatus={checkStatus} setcheckStatus={setcheckStatus} setTodoData={setTodoData} todoData={todoData} Item={Item} completeTodoData={completeTodoData}  AllTodoItems={AllTodoItems} ActiveTodoItems={ActiveTodoItems} CompletedTodoItems={CompletedTodoItems} ClearCompletedTodoItems={ClearCompletedTodoItems} i={i}/> 
              )}/>
          </ConfigProvider>
          <TodoFooter todoData={todoData}  AllTodoItems={AllTodoItems} ActiveTodoItems={ActiveTodoItems} CompletedTodoItems={CompletedTodoItems} ClearCompletedTodoItems={ClearCompletedTodoItems}/>
        </>
        </Card> 
    </div>
  )
}
