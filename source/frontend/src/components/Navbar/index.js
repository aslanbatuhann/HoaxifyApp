import React, { useEffect, useRef, useState } from 'react';
import logo from "../../assets/hoaxify.png";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { logoutSuccess } from "../../redux/AuthActions";
import ProfileImageWithDefault from "../ProfileImageWithDefault";
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = (props) => {
    const { t } = useTranslation();

    const { username, isLoggedIn, displayName, image } = useSelector((store) => ({
        isLoggedIn: store.isLoggedIn,
        username: store.username,
        displayName: store.displayName,
        image: store.image
    }));

    const [menuVisible, setMenuVisible] = useState(false);
    const menuArea = useRef(null);

    useEffect(() => {
        document.addEventListener('click', menuClickTracker);
        return () => {
            document.removeEventListener('click', menuClickTracker);
        };
    }, [isLoggedIn]);

    const menuClickTracker = (event) => {
        if (menuArea.current === null || !menuArea.current.contains(event.target)) {
            setMenuVisible(false);
        }
    }

    const dispatch = useDispatch();

    const onLogoutSuccess = () => {
        dispatch(logoutSuccess());
    }

    let links = (
        <div className={styles.right}>
            <ul className={styles.menu}>
                <li>
                    <Link to="/login">{t('Sign In')}</Link>
                </li>
                <li>
                    <Link to="/signup">{t('Sign Up')}</Link>
                </li>
            </ul>
        </div>
    );
    if (isLoggedIn) {
        let dropdownClass = "dropdown-menu";

        if (menuVisible) {
            dropdownClass += " show"; 
        }
        links = (
            <div className={styles.right} ref={menuArea}>
                <ul className={styles.menu} >
                    <li className="dropdown ">
                        <div onClick={() => {setMenuVisible(true)}}>
                            <button type="button"  className="btn  dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <ProfileImageWithDefault image={image} className={styles.image} />
                            <span>{displayName}</span>
                            </button >
                        </div>
                        <div className={dropdownClass}>
                            <Link className="dropdown-item" to={`/user/${username}`} onClick={() => {setMenuVisible(false)}}><PersonIcon className='text-info'/>{t('My Profile')}</Link>
                            <a className="dropdown-item" onClick={onLogoutSuccess} style={{ cursor: 'pointer' }}>
                            <LogoutIcon className='text-danger'/>{t('Logout')}
                            </a>
                        </div>
                    </li>
                </ul>
            </div>
        )
    }

    return (
        <div className="container">

            <nav className={styles.nav}>
                <div className={styles.left}>
                    <Link className='navbar-brand' to="/" >
                        <img src={logo} width="90" alt="Hoaxify Logo" />
                        Hoaxify
                    </Link>
                </div>
                {
                    links
                }
            </nav>
        </div>
    )
}

export default Navbar;