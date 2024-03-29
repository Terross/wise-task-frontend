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

export const GET_GRAPH_LIBRARY = gql`
{
  getGraphLibrary {
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

export const GET_ALL_PLUGINS = gql`
{
  getAllPlugins {
    id
    name
    description
    category
    jarName
    jarFile
    authorId
    graphType
    isValid
    beanName
    pluginType
    isInternal
  }
}
`