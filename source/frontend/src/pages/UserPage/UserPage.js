import React, { useEffect, useState } from 'react';
import ProfileCard from "../../components/ProfileCard";
import { getUser } from "../../api/apiCalls";
import { useParams } from 'react-router-dom';
import { Alert, AlertIcon, AlertDescription } from "@chakra-ui/alert";
import { useTranslation } from 'react-i18next';
import { useApiProgress } from "../../shared/ApiProgress";
import Spinner from 'react-bootstrap/Spinner';
import styles from "./styles.module.css";
import HoaxFeed from "../../components/HoaxFeed";

const UserPage = () => {
  const [user, setUser] = useState({});
  const [notFound, setNotFound] = useState(false);

  const { username } = useParams();

  const { t } = useTranslation();

  const pendingApiCall = useApiProgress('get', '/api/1.0/users/' + username, true);

  useEffect(() => {
    setNotFound(false);
  }, [user])

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getUser(username)
        setUser(response.data)
      } catch (error) {
        setNotFound(true);
      }
    }
    loadUser();
  }, [username]);

  if (notFound) {
    return (
      <div className='container'>
        <Alert status='error' justifyContent="center">
          <AlertIcon w={30} mr={5} />
          <AlertDescription  >
            {t('User is not found')}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (pendingApiCall || user.username !== username) {
    return (
      <div className={styles.spinner}>
        <Spinner animation="border" />
      </div>
    )
  }



  return (
    <div className='container'>
      <div className='row'>
        <div className='col'>
          <ProfileCard user={user} />
        </div>
        <div className='col'>
          <HoaxFeed />
        </div>
      </div>
    </div>
  );
};

export default UserPage;