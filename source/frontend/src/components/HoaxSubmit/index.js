import React, { useState } from 'react';
import styles from "./styles.module.css";
import { useSelector } from 'react-redux';
import ProfileImageWithDefault from "../ProfileImageWithDefault";
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from 'react';
import { postHoax, postHoaxAttachment } from "../../api/apiCalls";
import ButtonWithProgess from "../ButtonWithProgress";
import { useApiProgress } from "../../shared/ApiProgress";
import AutoUploadImage from "../AutoUploadImage";
import Input from "../Input";


const HoaxSubmit = () => {

    const { image } = useSelector((store) => ({ image: store.image }));
    const [focused, setFocused] = useState(false);
    const [hoax, setHoax] = useState('');
    const [newImage, setNewImage] = useState();
    const [attachmentId, setAttachmentId] = useState();
    const [errors, setErrors] = useState({});

    const { t } = useTranslation();

    useEffect(() => {
        if (!focused) {
            setHoax('');
            setErrors({});
            setNewImage();
            setAttachmentId();
        }
    }, [focused]);

    useEffect(() => {
        setErrors({});
    }, [hoax]);

    const pendingApiCall = useApiProgress('post', '/api/1.0/hoaxes', true);
    const pendingFileUpload = useApiProgress('post', '/api/1.0/hoax-attachments', true);

    const onClickHoaxify = async () => {
        const body = {
            content: hoax,
            attachmentId: attachmentId,
        }

        try {
            await postHoax(body);
            setFocused(false);
        } catch (error) {
            if (error.response.data.validationErrors) {
                setErrors(error.response.data.validationErrors);
            }
        }
    };

    const onChangeFile = (event) => {
        if (event.target.files.length < 1) {
            return;
        }
        const file = event.target.files[0];
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            setNewImage(fileReader.result);
            uploadFile(file);
        }
        fileReader.readAsDataURL(file);
    }

    const uploadFile = async (file) => {
        const attachment = new FormData();
        attachment.append('file', file);

        const response = await postHoaxAttachment(attachment);
        setAttachmentId(response.data.id);
    }

    let textAreaClass = 'form-control';
    if (errors.content) {
        textAreaClass += ' is-invalid';
    }

    return (
        <div className='card p-1 flex-row'>
            <ProfileImageWithDefault className={styles.Photo} image={image} />
            <div className='flex-fill'>
                <textarea
                    className={textAreaClass}
                    rows={focused ? "3" : "1"}
                    onFocus={() => setFocused(true)}
                    onChange={(event) => setHoax(event.target.value)}
                    value={hoax}
                />
                <div className='invalid-feedback'>{errors.content}</div>
                {focused && (
                    <>
                        {!newImage && <Input type="file" onChange={onChangeFile} />}
                        {newImage && <AutoUploadImage image={newImage} uploading={pendingFileUpload} />}
                        <div className={styles.HoaxBtnArea}>
                            <ButtonWithProgess
                                className={styles.HoaxBtn}
                                onClick={onClickHoaxify}
                                text="Hoaxify"
                                pendingApiCall={pendingApiCall}
                                disable={pendingFileUpload || pendingApiCall}
                            />
                            <button
                                className={styles.HoaxBtnCancel}
                                onClick={() => setFocused(false)}
                                disabled={pendingApiCall || pendingFileUpload}
                            >
                                <CloseIcon sx={{ fontSize: 18 }} />
                                {t('Cancel')}
                            </button>
                        </div>
                    </>)}
            </div>
        </div>
    );
};

export default HoaxSubmit;

