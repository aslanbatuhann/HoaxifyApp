import { useState } from 'react';
import { useDispatch } from "react-redux";
import { signupHandler } from "../../../redux/AuthActions";
import Input from "../../../components/Input";
import { useApiProgress } from "../../../shared/ApiProgress";
import { useTranslation } from "react-i18next";
import ButtonWithProgress from "../../../components/ButtonWithProgress";

const SignUp = (props) => {
    const [form, setForm] = useState({
        username: null,
        displayName: null,
        password: null,
        passwordConfirm: null,
      });
    const [ error, setError] = useState({});
    const dispatch = useDispatch();

    const onChange = event => {
        const { name, value } = event.target;
        setError((previousError) => ({
            ...previousError, [name]: undefined
        }));
        setForm((previousForm) => ({ ...previousForm, [name]: value }));
    };

    const onClickSignup = async event => {
        event.preventDefault();
        const { history } = props;
        const { push } = history;

        const { username, displayName, password } = form;

        const body = {
            username,
            displayName,
            password,
        };

        try {
            await dispatch(signupHandler(body));
            push('/');
        } catch (error) {
            if (error.response.data.validationErrors) {
                setError(error.response.data.validationErrors) 
            }
        }
        
    };
    const { username: usernameError, displayName: displayNameError, password: passwordError } = error;
    const pendingApiCallSignup = useApiProgress('post', '/api/1.0/users');
    const pendingApiCallLogin = useApiProgress('post', '/api/1.0/auth');
    const pendingApiCall = pendingApiCallSignup || pendingApiCallLogin;
    const { t } = useTranslation();
  
    let passwordConfirmError;
    if (form.password !== form.passwordConfirm) {
        passwordConfirmError = t('Password mismatch');
    }    
        return (
            <div className="container">
                <form>
                    <h1 className='text-center'>{t('Sign Up')}</h1>
                    <Input name="username" label={t('Username')} error={usernameError} onChange={onChange} />
                    <Input name="displayName" label={t('Display Name')} error={displayNameError} onChange={onChange} />
                    <Input name="password" label={t('Password')} error={passwordError} onChange={onChange} type="password" />
                    <Input name="passwordConfirm" label={t('Password Confirm')} error={passwordConfirmError} onChange={onChange} type="password" />
                    <div className='text-center'>
                        <ButtonWithProgress
                            onClick={onClickSignup}
                            disabled={pendingApiCall || passwordConfirmError !== undefined}
                            pendingApiCall={pendingApiCall}
                            text={t('Sign Up')}
                        />
                    </div>
                </form>
            </div>
        );
}

export default SignUp;