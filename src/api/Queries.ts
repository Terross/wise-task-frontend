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