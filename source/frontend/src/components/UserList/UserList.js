import { useState, useEffect } from 'react';
import { getUsers } from "../../api/apiCalls";
import { useTranslation } from 'react-i18next';
import UserListItem from '../UserListItem/UserListItem';
import styles from "./styles.module.css";
import { useApiProgress } from '../../shared/ApiProgress';
import Spinner from 'react-bootstrap/Spinner';

const UserList = () => {

  const [page, setPage] = useState({
    content: [],
    size: 3,
    number: 0,
  });

  const [loadFailure, setLoadFailure] = useState(false);

  const pendingApiCall = useApiProgress('get', '/api/1.0/users?page');

  useEffect(() => {
    loadUsers();
  }, [])

  const onClickNext = () => {
    const nextPage = page.number + 1;
    loadUsers(nextPage);
  };

  const onClickPrevious = () => {
    const prePage = page.number - 1;
    loadUsers(prePage);
  };

  const loadUsers = async (page) => {
    setLoadFailure(false);
    try {
      const response = await getUsers(page);
      setPage(response.data);
    } catch (error) {
      setLoadFailure(true);
    }
  }

  const { t } = useTranslation();
  const { content: users, last, first } = page;

  let actionDiv = (

    <div>
      {first === false && (
        <button className={styles.buttonPrevious} onClick={onClickPrevious}>
          {t('< Previous')}
        </button>
      )}
      {last === false && (
        <button className={styles.buttonNext} onClick={onClickNext}>
          {t('Next >')}
        </button>
      )}
    </div>
  )

  if (pendingApiCall) {
    actionDiv = (
      <div className={styles.spinner}>
        <Spinner animation="border" />
      </div>
    )
  }
  return (
    <div className={styles.card}>
      <h3 className={styles.h3}>
        {t('Users')}
      </h3>
      <div className="list-group-flush">
        {users.map(user => (
          <UserListItem key={user.username} user={user} />
        ))}
      </div>
      {actionDiv}
      {loadFailure && <div className={styles.failure}>{t('Load Failure')}</div>}
    </div>
  )
}

export default UserList;
