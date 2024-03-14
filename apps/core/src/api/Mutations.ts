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

export const UPDATE_PROFILE = gql`
    mutation updateProfile ($profile: ProfileInput!) {
        updateProfile (profile: $profile) {
            id
            email
            profilePassword
            firstName
            lastName
            patronymic
            profileRole
            studentGroup
        }
    }
`

export const CREATE_GRAPH = gql`
    mutation createGraph ($graph: GraphInput!) {
        createGraph (graph: $graph) {
            id
            vertexCount
            edgeCount
            isDirect
            vertexList {
                id
                weight
                label
                xCoordinate
                yCoordinate
                color
            }
            edgeList {
                source
                target
                weight
                label
                color
            }
            isNamed
            name
        }
    }
`

export const DELETE_GRAPH = gql`
    mutation deleteGraph ($id: ID!) {
        deleteGraph (id: $id)
    }
`