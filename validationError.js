import {GraphQLError} from 'graphql';

class ValidationError extends GraphQLError{

    constructor(errors) {
        super('Request failed');
        this.ValidationErrors = {};

        errors.forEach(error => {
            if(this.ValidationErrors[error.key]) {
                this.ValidationErrors[error.key] = [error.message];
            }else{
                this.ValidationErrors[error.key].push(error.message);
            }
        })
    }    
}

export default ValidationError;