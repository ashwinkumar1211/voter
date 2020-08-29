import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import PropTypes from 'prop-types'


const Login = ({ login, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { email, password } = formData;
    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });
    const onSubmit = async (e) => {
        e.preventDefault();
        login(email, password);
    };
    if (isAuthenticated) {
        return <Redirect to="/voters" />;
    }
    return (
        <Fragment>
            <img src="logo.png" alt="TopHacker Logo" />
            <form action="" className="form-container">
                <input type="text" placeholder="Email" />
                <br />
                <input type="password" placeholder="Password" />
                <br />
                <input type="submit" value="Login" />
                <br />
                <h2 class="account">
                    Don't have an account?
                </h2>
                <input type="button" value="Register" />
            </form>
        </Fragment>
    );
}

login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
};

const mapStatetoProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStatetoProps, { login })(Login);