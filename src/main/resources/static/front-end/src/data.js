import { useEffect, useState } from 'react';

const  setData = (data)=>{
        Data=data;
}

const fetchData = () => {
    const API = 'http://localhost:8080/home/all-holiday-plans';

    fetch(API)
    .then((res) => res.json())
    .then((res) => {
        setData(JSON.stringify(res));
    }).catch((err) => {
        alert(err.message);
    });
}

const Fetch =() => {
    const data = Data;
    useEffect(() =>{
        fetchData()
    }, [data]
    );
}
Fetch();
console.log(Data);
export default Data;

