import React, {useState} from 'react';
import style from '../styles/Main.module.css'
import {Link} from "react-router-dom";

const FIELDS = {
    NAME: 'username',
    ROOM: 'room'
}
const Main = () => {
    const { ROOM , NAME} = FIELDS
    const [values, setValues] = useState({[NAME]: '', [ROOM]: ''})

    const handleChange = (e) => {
        const {value, name} = e.target
        setValues((prev) => ({...prev, [name]: value}))
    }

    const handleClick = (e) => {
        const isDisabled = Object.values(values).some((value)=> !value.trim())
        if (isDisabled) e.preventDefault()
    }

    return (
        <div className={style.wrap}>
           <div className={style.container}>
               <h1 className={style.heading}>Join</h1>

               <form className={style.form}>
                   <div className={style.group}>
                       <input type="text" name={FIELDS.NAME} value={values[NAME]} className={style.input} onChange={handleChange} autoComplete={'off'} placeholder={'Your name...'}/>
                   </div>
                   <div className={style.group}>
                       <input type="text" name={FIELDS.ROOM} value={values[ROOM]} className={style.input} onChange={handleChange} autoComplete={'off'} placeholder={'Room'}/>
                   </div>

                   <Link to={`/chat?name=${values[NAME]}&room${values[ROOM]}`} className={style.group} onClick={handleClick}>
                       <button type={'submit'} className={style.button}>
                           Sign In
                       </button>
                   </Link>
               </form>
           </div>
        </div>
    );
};

export default Main;