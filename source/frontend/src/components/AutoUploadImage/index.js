import { position } from '@chakra-ui/react';
import React from 'react'
import styles from "./styles.module.css";
import Spinner from 'react-bootstrap/Spinner';

const AutoUploadImage = ({ image, uploading }) => {
  return (
    <div style={{ position: 'relative' }}>
      <img className='img-thumbnail' src={image} alt='hoax-attachment' />
      <div className={styles.overlay} style={{opacity: uploading ? 1 : 0}}>
        <div className={styles.spinner} >
          <Spinner animation="border" />
        </div>
      </div>
    </div>
  )
}

export default AutoUploadImage;