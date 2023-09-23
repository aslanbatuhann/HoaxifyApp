import React from 'react';
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import ProfileImageWithDefault from '../ProfileImageWithDefault';

const UserListItem = (props) => {
    const { user } = props;
    const { username, displayName, image } = user;

    return (
        <Link to={`/user/${username}`} className={styles.link} >
            <ProfileImageWithDefault className={styles.img}
                alt={`${username} profile`}
                image={image} />
            <span className={styles.span}>
                {displayName}@{username}
            </span>
        </Link>
    )
}

export default UserListItem;