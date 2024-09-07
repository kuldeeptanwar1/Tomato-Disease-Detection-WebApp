import './App.css';
import React, { useRef, useState } from 'react';

function App() {

  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const [image, setImage] = useState();
  const [data, setData] = useState();
  const [isDragging, setIsDragging] = useState(false);
  
  
  const axios = require("axios").default;
  const sendFile = async () => {
    if (image) {
      let formData = new FormData();
      formData.append("file", image);
      let res = await axios({
        method: "post",
        url: "http://localhost:8000/predict",
        data: formData,
      });
      if (res.status === 200) {
        setData(res.data);
      }
      
    }
  }

  const handleClick = () => {
    inputRef.current.click();
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log(file)
    setImage(file);
    setData(undefined);
  }

  function DragAndDrop(){

    function selectFiles(){
      fileRef.current.click();
    }


  function onDragOver(event){
    event.preventDefault();
    setIsDragging(true);
    event.dataTransfer.dropEffect = "copy";
  }

  function onDragLeave(event){
    event.preventDefault();
    setIsDragging(false);
    
  }

  function onDrop(event){
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    console.log(file)
    setImage(file);
    setData(undefined);
 
  }

    return (
    <div className='card'>
      <div className="top">
        <p>Drag & Drop image uploading</p>
      </div>
      <div className="drag-area" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
        {isDragging ? (
          <span className="select">
          Drop images here
        </span>
        ):(<>
          Drag & Drop image here or {""}
      <span className='select' role="button" onClick={selectFiles}>
        Browse
        </span>
        </>
        )}
        
      <input name="file" type='file' className='file' ref={fileRef} onChange={handleImageChange}></input>
      </div>
      
    </div>)
  }

  return (
    
    <div className="App" >
    <header><h1>Tomato Leaf Disease Detection</h1></header>
      <div className='Main-Area'>
        {image ? (null) : (<DragAndDrop/>)}
        
        {image ? (
          <img src={URL.createObjectURL(image)} alt=''></img>
        ) : (
          null)}
        <input type="file" ref={inputRef} onChange={handleImageChange} style={{display: "none"}}></input>
        <button className="button" onClick={handleClick}>Upload</button>
        {image ? (<button onClick={sendFile}>Predict</button>) : null}
        
        <div>
          {data ? 
          (<><p>Class : {data.class}</p>
          <p>Confidence : {data.confidence}</p></>)
        : (null)}
        </div>
        </div>
    </div>
  );
}

export default App;
