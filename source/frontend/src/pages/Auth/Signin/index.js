import { useState, useEffect } from 'react';
import Input from "../../../components/Input";
import ButtonWithProgress from "../../../components/ButtonWithProgress";
import { useDispatch } from "react-redux";
import { loginHandler } from "../../../redux/AuthActions";
import { useTranslation } from "react-i18next";
import { useApiProgress } from "../../../shared/ApiProgress";

const SignIn = (props) => {
    const [ username, setUsername ] = useState();
    const [ password, setPassword ] = useState();
    const [ error, setError] = useState();
    const dispatch = useDispatch();

    useEffect(() => {
        setError(undefined);
    },[username, password])

    const onClickSignin = async event => {
        event.preventDefault();

        const creds = {
            username,
            password
        };
        
        const { history } = props;
        const { push } = history;
        try {
            await dispatch(loginHandler(creds));
            push("/");
        } catch (apiError) {
            setError(apiError.response.data.message); 
        }
    };

    const { t } = useTranslation();
    const pendingApiCall = useApiProgress('post', '/api/1.0/auth');
    const buttonEnabled = username && password;

    return (
        <div className="container">
            <form>
                <h1 className='text-center'>{t('Sign In')}</h1>
                <Input label={t('Username')} error={error} onChange={(event) => setUsername(event.target.value)} />
                <Input label={t('Password')} error={error} onChange={(event) => setPassword(event.target.value)} type="password" />
                <div className='text-center'>
                    <ButtonWithProgress
                        onClick={onClickSignin}
                        disabled={!buttonEnabled || pendingApiCall}
                        pendingApiCall={pendingApiCall}
                        text={t('Login')}
                    />
                </div>
            </form>
        </div>
    );
}

export default SignIn;