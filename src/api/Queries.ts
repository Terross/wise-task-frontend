import gql from 'graphql-tag'

export const GET_ALL_PROFILES_QUERY = gql`
{
    getAllProfiles {
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

export const GET_PROFILE = gql`
query getProfile ($id: ID!) {
    getProfile(id: $id) {
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