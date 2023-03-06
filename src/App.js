import React, {  useEffect, useState } from "react";
import "./App.css";
import { TodoMainContainer } from "./components/TodoMainContainer/TodoMainContainer";

function App() {
  const [todoData, setTodoData] = useState([]);
  const [dataLength,setDataLength]=useState(false);
  const [completeTodoData,setCompleteTodoData]=useState([]);

  useEffect(() => {
    // callingIDBData()
    const request = indexedDB.open("TodoData", 2);
    request.onsuccess = () => {
      const db = request.result;
      let completeIDB = db.transaction(["todoItems"], "readwrite")
        .objectStore("todoItems")
        .getAll();
        completeIDB.onsuccess = (e) => {
          let completeIDBData = e.target.result
          setTodoData(completeIDBData);
         setCompleteTodoData(completeIDBData);
          if (completeIDBData.length < 1) {
            setDataLength(false)
          }
          else {
            setDataLength(true)
          }
          let totalData= db.transaction(["todoItems"], "readwrite")
          .objectStore("todoItems").getAll();
          totalData.onsuccess=(e)=>{
            let value = e.target.result
            setTodoData(value)
          }
        }
    };   
  },[]);

  return (
    <div className="todo-outer-main-container">
      <TodoMainContainer completeTodoData={completeTodoData} todoData={todoData} dataLength={dataLength} setDataLength={setDataLength} setTodoData={setTodoData} />
    </div>
  );
}

export default App;


