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


export const GET_TASK = gql`
query getTask($id: ID!) {
  getTask(id: $id) {
    id
    name
    description
    category
    taskType
    authorId
    isPublic
    __typename
    ... on TaskGraph {
      isHiddenMistake
      condition {
        pluginId
        mistakeText
      }
    }
    ... on TaskImplementation {
      pluginId
    }
  }
}
`

export const GET_USER_SOLUTION_STATISTIC = gql`
query getUserSolutionStatistic($userId: ID!) {
  getUserSolutionStatistic(userId: $userId) {
    id
    taskId
    authorId
    isCorrect
    __typename
  }
}
`

export const GET_SOLUTION_WITH_TASK_DESCRIPTION = gql`
query getSolutionWithTaskDescription($taskId: ID!, $solutionId: ID!) {
  getTaskSolution(id: $solutionId) {
    id
    taskId
    authorId
    isCorrect
    __typename
    ... on SolutionGraph {
      graph {
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
      }
      pluginResults {
        pluginId
        isCorrect
        value
        trueValue
        pluginMessage
      }
    }
  }
  getTask(id: $taskId) {
    description
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

export const GET_ALL_TASKS = gql`
    {
        getAllTasks {
            id
            name
            description
            category
            taskType
            authorId
            isPublic
        }
    }
`

