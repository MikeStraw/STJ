import apiSvc from '../services/api';
import store from '../store';
import tokenSvc from '../services/token';

class AuthenticationError extends Error {
    constructor(errorCode, message, statusText) {
        super(message);
        this.name = this.constructor.name;
        this.errorCode = errorCode;
        this.message = statusText + ': ... ' + message;
    }
}

const UserService = {
    /**
     * Login the user and store the access token to TokenService.
     *
     * @returns access token
     * @throws AuthenticationError
     **/
    login: async function(first, last, pin) {
        const userRequest = {
            firstName: first,
            lastName: last,
            pin: pin
        };

        try {
            const response = await apiSvc.login(userRequest);
            const token = response.data.token;
            const userResponse  = tokenSvc.decodeToken(token);

            tokenSvc.saveToken(token);
            apiSvc.addAuthHeader(token);
            store.dispatch('user/save', userResponse);

            return token;
        } catch (error) {
            throw new AuthenticationError(error.response.status, error.response.data.message, error.response.statusText);
        }
    },

    /**
     * Logout the current user by removing the token from storage.
     *
     * Will also remove `Authorization Bearer <token>` header from future requests.
     **/
    logout() {
        // Remove the token and remove Authorization header from Api Service as well
        tokenSvc.removeToken();
        apiSvc.removeAuthHeader();
        store.dispatch('user/remove');
    }
};

export { UserService, AuthenticationError };
