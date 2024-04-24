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

export const CREATE_TASK_GRAPH = gql`
    mutation createTaskGraph ($task: TaskGraphInput!) {
        createTaskGraph (task: $task) {
            id
            name
            description
            category
            taskType
            authorId
            isPublic
            isHiddenMistake
            rule {
                isColor
                isEdit
                isMove
                isDelete
            }
            condition {
                pluginId
                value
                mistakeText
                sign
                pluginType
            }
        }
    }
`

export const CREATE_TASK_IMPLEMENTATION = gql`
    mutation createTaskImplementation ($task: TaskImplementationInput!) {
        createTaskImplementation (task: $task) {
            id
            name
            description
            category
            taskType
            authorId
            isPublic
            pluginId
        }
    }
`

export const CREATE_PLUGIN = gql`
    mutation createPlugin ($plugin: PluginInput!) {
        createPlugin (plugin: $plugin) {
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

export const UPDATE_PLUGIN = gql`
    mutation updatePlugin ($plugin: PluginInput!) {
        updatePlugin (plugin: $plugin) {
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

export const DELETE_PLUGIN = gql`
    mutation deletePlugin ($id: ID!) {
        deletePlugin (id: $id)
    }
`

export const VALIDATE_PLUGIN = gql`
    mutation validatePlugin ($id: ID!) {
        validatePlugin (id: $id)
    }
`