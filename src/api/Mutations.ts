import gql from 'graphql-tag'

export const SIGN_IN = gql`
    mutation signIn ($signInRequest: SignInRequest!) {
        signIn (signInRequest: $signInRequest) {
            token
        }
    }
`

export const SIGN_UP = gql`
    mutation signUp ($signUpRequest: SignUpRequest!) {
        signUp (signUpRequest: $signUpRequest) {
            token
        }
    }
`