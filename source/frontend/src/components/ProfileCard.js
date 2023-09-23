import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProfileImageWithDefault from '../components/ProfileImageWithDefault';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { useTranslation } from "react-i18next";
import Input from "../components/Input";
import { updateUser, deleteUser } from "../api/apiCalls";
import { useApiProgress } from "../shared/ApiProgress";
import ButtonWithProgress from "../components/ButtonWithProgress";
import { logoutSuccess, updateSuccess } from '../redux/AuthActions';
import Modal from "./Modal";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ProfileCard = props => {
    const [inEditMode, setInEditMode] = useState(false);
    const [updatedDisplayName, setUpdatedDisplayName] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const { username: loggedInUsername } = useSelector((store) => ({
        username: store.username
    }));
    const routeParams = useParams();
    const pathUsername = routeParams.username;
    const [user, setUser] = useState({});
    const [editable, setEditable] = useState(false);
    const [newImage, setNewImage] = useState();
    const [validationErrors, setValidationErrors] = useState({});
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        setUser(props.user)
    }, [props.user])

    useEffect(() => {
        setEditable(pathUsername === loggedInUsername);
    }, [pathUsername, loggedInUsername])

    useEffect(() => {
        setValidationErrors((previousValidationErrors) => ({
            ...previousValidationErrors,
            displayName: undefined
        }));
    }, [updatedDisplayName])

    useEffect(() => {
        setValidationErrors((previousValidationErrors) => ({
            ...previousValidationErrors,
            image: undefined
        }));
    }, [newImage])

    const { username, displayName, image } = user;

    const pendingApiCallDeleteUser = useApiProgress('delete', `/api/1.0/users/${username}`, true);

    const { t } = useTranslation();

    useEffect(() => {
        if (!inEditMode) {
            setUpdatedDisplayName(undefined);
            setNewImage(undefined);
        } else {
            setUpdatedDisplayName(displayName);
        }

    }, [inEditMode, displayName])

    const onClickSave = async () => {

        let image;
        if (newImage) {
            image = newImage.split(',')[1]
        }

        const body = {
            displayName: updatedDisplayName,
            image
        };
        try {
            const response = await updateUser(username, body);
            setInEditMode(false);
            setUser(response.data);
            dispatch(updateSuccess(response.data));
        } catch (error) {
            if (error.response.data.validationErrors) {
                setValidationErrors(error.response.data.validationErrors)
            }
        }
    }

    const onClickDeleteUser = async () => {
        await deleteUser(username);
        setModalVisible(false);
        dispatch(logoutSuccess());
        history.push('/');
    }

    const onClickCancel = () => {
        setModalVisible(false)
    }

    const onChangeFile = (event) => {
        if (event.target.files.length < 1) {
            return;
        }
        const file = event.target.files[0];
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            setNewImage(fileReader.result);
        }
        fileReader.readAsDataURL(file);
    }

    const pendingApiCall = useApiProgress('put', '/api/1.0/users/' + username)

    const { displayName: displayNameError, image: imageError } = validationErrors;

    return (
        <div className="card text-center">
            <div className="card-header">
                <ProfileImageWithDefault
                    className="rounded-circle shadow"
                    width={200}
                    height={200}
                    alt={`${username} profile`}
                    image={image}
                    tempimage={newImage}
                />
            </div>
            <div className="card-body">
                {!inEditMode &&
                    (<>
                        <h3>
                            {displayName}@{username}
                        </h3>
                        {editable && (
                            <>
                                <button className="btn btn-success d-inline-flex m-1" onClick={() => { setInEditMode(true); }}>
                                    <EditIcon sx={{ fontSize: 20 }} />
                                    {t('Edit')}
                                </button>
                                <button className="btn btn-danger d-inline-flex" onClick={() => { setModalVisible(true); }}>
                                    <PersonRemoveIcon sx={{ fontSize: 20, mr: 1 }} />
                                    {t('Delete My Account')}
                                </button>
                            </>
                        )}
                    </>
                    )
                }
                {inEditMode && (
                    <div>
                        <Input label={t("Change Display Name")} defaultValue={displayName} onChange={(e) => { setUpdatedDisplayName(e.target.value) }} error={displayNameError} />
                        <Input type="file" onChange={onChangeFile} error={imageError} />
                        <div>
                            <ButtonWithProgress
                                className="btn btn-primary d-inline-flex"
                                onClick={onClickSave}
                                disable={pendingApiCall}
                                pendingApiCall={pendingApiCall}
                                text={
                                    <>
                                        <SaveIcon sx={{ fontSize: 20 }} />
                                        {t('Save')}
                                    </>
                                }
                            />
                            <button
                                className="btn btn-secondary d-inline-flex"
                                onClick={() => setInEditMode(false)}
                                disabled={pendingApiCall}>
                                <CloseIcon sx={{ fontSize: 20 }} />
                                {t('Cancel')}
                            </button>
                        </div>
                    </div>
                )
                }
            </div>
            <Modal
                visible={modalVisible}
                title={t('Delete My Account')}
                okButton={t('Delete My Account')}
                onClickCancel={onClickCancel}
                message={t('Are you sure to delete your account?')}
                onClickOk={onClickDeleteUser}
                pendingApiCall={pendingApiCallDeleteUser}
            />
        </div>
    );
};

export default ProfileCard;