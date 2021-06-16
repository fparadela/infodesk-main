import React, {useState, useEffect} from 'react';
import {Form} from '../../GlobalStyle'
import {DialogForm, DivAbsolute} from './styled'
import {useForm} from '../../hooks/useForm'
import Button from '../../components/Button/Button'
import { IconButton } from '@material-ui/core'
import { CloseOutlined } from '@material-ui/icons'
import { usePostData } from '../../hooks/usePostData'
import {maskMoney} from '../../constants/maskMoney'
function SimpleDialog({onClose, open, update}) {
  const [postData, snack, loading, success]= usePostData('/post/create')

  const formInitial = {
    text: "",
    accommodation: "Room",
    price: ""
  }
useEffect(() => {
  if(!loading && success === 1){
      update();
      resetForm(formInitial);
      onClose();
  }
}, [loading])

const [form, onChange, resetForm] = useForm(formInitial)
  
  const newPost = (e) =>{
    e.preventDefault();
    postData(form)
  }
  return (
    <DialogForm onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
        {snack}
        <DivAbsolute>
      <IconButton onClick={onClose}>
        <CloseOutlined />
      </IconButton>
    </DivAbsolute>
        <Form onSubmit={newPost}>
        <h1>Crete Post</h1>
      <label>
        <h3>Type of accommodation</h3>
        <select name="accommodation" value={form['accommodation']} onChange={onChange}>
        <option>Room</option>
        <option>Studio</option>
        <option>Apartment</option>
        </select>
      </label>
      <label>
        <h3>Price</h3>
        <input name="price" value={form['price']} onChange={(e) => onChange(e, maskMoney)}/>
      </label>
      <label>
        <h3>Place(City, neighbourhood)</h3>
        <input name="address" value={form['address']} onChange={onChange} />
      </label>

      <label>
        <h3>Description</h3>
        <textarea name="description" value={form['description']} onChange={onChange} />
      </label>
      <Button type="submit">
          Post
      </Button>
    </Form>

    </DialogForm>
  );
}

export default function SimpleDialogDemo({open, setOpen, update}) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <SimpleDialog open={open} onClose={handleClose} update={update} />
    </div>
  );
}