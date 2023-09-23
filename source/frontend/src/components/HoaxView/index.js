import React, { useState } from 'react';
import ProfileImageWithDefault from "../ProfileImageWithDefault";
import { Link } from "react-router-dom";
import { format } from 'timeago.js';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { deleteHoax } from "../../api/apiCalls";
import Modal from "../Modal";
import { useApiProgress } from '../../shared/ApiProgress';

const HoaxView = (props) => {
  const loggedInUser = useSelector(store => store.username);
  const { hoax, onDeleteHoax } = props;
  const { userVMDto, content, timestamp, fileAttachment, id } = hoax;
  const { username, displayName, image } = userVMDto;
  const [modalVisible, setModalVisible] = useState(false);

  const pendingApiCall = useApiProgress('delete', `/api/1.0/hoaxes/${id}`, true);

  const { i18n, t } = useTranslation();

  const onClickDelete = async () => {
    await deleteHoax(id);
    onDeleteHoax(id);
  };

  const onClickCancel = () => {
    setModalVisible(false)
  }

  const formatted = format(timestamp, i18n.language);

  const ownedByLoggedInUser = loggedInUser === username;

  return (
    <>
      <div className='card p-1'>
        <div className='d-flex'>
          <ProfileImageWithDefault image={image} width="32" height="32" className="rounded-circle ms-1" />
          <div className='flex-fill m-auto ps-2'>
            <Link to={`/user/${username}`} style={{ textDecoration: 'none', color: 'black' }}>
              <h6 className='d-inline'>
                {displayName}@{username}
              </h6>
              <span> - </span>
              <span>
                {formatted}
              </span>
            </Link>
          </div>
          {ownedByLoggedInUser && (
            <button
              className='btn btn-delete-link btn-sm'
              onClick={() => setModalVisible(true)}>
              <DeleteIcon />
            </button>)}
        </div>
        <div className='ps-5'>
          {content}
        </div>
        {fileAttachment && (
          <div className='pl-5'>
            {fileAttachment.fileType.startsWith('image') && (
              <img style={{ marginTop: '5px', width: '100%', height: '100%' }} src={'images/attachments/' + fileAttachment.name} alt={content} />
            )}
            {!fileAttachment.fileType.startsWith('image') &&
              <strong>Hoax has unknown attachment</strong>
            }
          </div>
        )}
      </div>
      <Modal
        visible={modalVisible}
        onClickCancel={onClickCancel} 
        title={t('Delete Hoax')}
        okButton={t('Delete Hoax')}
        message={
          <div>
            <div>
            <strong>{t('Are you sure to delete hoax?')}</strong>
            </div>
            <span>{content}</span>
          </div>
        } 
        onClickOk={onClickDelete}
        pendingApiCall={pendingApiCall}
      />
    </>
  );
};

export default HoaxView;
