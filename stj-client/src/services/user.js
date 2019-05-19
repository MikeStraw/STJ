import apiSvc from '../services/api';
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
        const user = {
            firstName: first,
            lastName: last,
            pin: pin
        };

        try {
            const response = await apiSvc.login(user);
            tokenSvc.saveToken(response.data.token);
            apiSvc.addAuthHeader(response.data.token);

            return response.data.token;
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
    }
};

export { UserService, AuthenticationError };