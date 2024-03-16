/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export enum AdditionPayloadType {
  Graph = 'GRAPH',
  String = 'STRING'
}

export type AdditionalPayload = {
  discriminator: AdditionPayloadType;
  handwrittenAnswer?: InputMaybe<Scalars['String']['input']>;
  otherGraph?: InputMaybe<GraphInput>;
};

export type Answer = {
  __typename?: 'Answer';
  id: Scalars['ID']['output'];
  pluginType: PluginType;
  value: Scalars['String']['output'];
};

export type AnswerInput = {
  id: Scalars['ID']['input'];
  pluginType: PluginType;
  value: Scalars['String']['input'];
};

export enum Category {
  Basic = 'BASIC'
}

export enum Color {
  Blue = 'BLUE',
  Gray = 'GRAY',
  Green = 'GREEN',
  Red = 'RED'
}

export type Condition = {
  __typename?: 'Condition';
  answer: Answer;
  id: Scalars['ID']['output'];
  pluginId: Scalars['ID']['output'];
  taskId: Scalars['ID']['output'];
};

export type ConditionInput = {
  answer: AnswerInput;
  id: Scalars['ID']['input'];
  pluginId: Scalars['ID']['input'];
  taskId: Scalars['ID']['input'];
};

export type CreateGraphRequest = {
  graph: GraphInput;
};

export type Edge = {
  __typename?: 'Edge';
  color: Color;
  label: Scalars['String']['output'];
  source: Scalars['Int']['output'];
  target: Scalars['Int']['output'];
  weight: Scalars['Int']['output'];
};

export type EdgeInput = {
  color: Color;
  label: Scalars['String']['input'];
  source: Scalars['Int']['input'];
  target: Scalars['Int']['input'];
  weight: Scalars['Int']['input'];
};

export type GenerateGraphRequest = {
  edgeCount: Scalars['Int']['input'];
  isDirect: Scalars['Boolean']['input'];
  isSaved: Scalars['Boolean']['input'];
  vertexCount: Scalars['Int']['input'];
};

export type Graph = {
  __typename?: 'Graph';
  edgeCount: Scalars['Int']['output'];
  edgeList: Array<Maybe<Edge>>;
  id: Scalars['String']['output'];
  isDirect: Scalars['Boolean']['output'];
  isNamed: Scalars['Boolean']['output'];
  name?: Maybe<Scalars['String']['output']>;
  vertexCount: Scalars['Int']['output'];
  vertexList: Array<Maybe<Vertex>>;
};

export type GraphInput = {
  edgeCount: Scalars['Int']['input'];
  edgeList: Array<InputMaybe<EdgeInput>>;
  id: Scalars['ID']['input'];
  isDirect: Scalars['Boolean']['input'];
  isNamed: Scalars['Boolean']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  vertexCount: Scalars['Int']['input'];
  vertexList: Array<InputMaybe<VertexInput>>;
};

export type GraphTestResult = {
  __typename?: 'GraphTestResult';
  graphId: Scalars['ID']['output'];
  originalResult: Scalars['String']['output'];
  originalTimeResult: Scalars['Int']['output'];
  result: Scalars['String']['output'];
  timeResult: Scalars['Int']['output'];
};

export enum GraphType {
  Any = 'ANY',
  Direct = 'DIRECT',
  Undirect = 'UNDIRECT'
}

export type ImplementationResult = {
  __typename?: 'ImplementationResult';
  graphTestResults: Array<Maybe<GraphTestResult>>;
  result: Scalars['Boolean']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  checkPluginImplementation: ImplementationResult;
  checkPluginSolution: Scalars['String']['output'];
  /** graph */
  createGraph: Graph;
  /** plugin */
  createPlugin?: Maybe<Plugin>;
  createTask: Task;
  deleteGraph: Scalars['String']['output'];
  deletePlugin: Scalars['String']['output'];
  deleteProfile: Scalars['String']['output'];
  /** task */
  deleteTask: Scalars['String']['output'];
  generateGraph?: Maybe<Graph>;
  signIn: Token;
  /** profile */
  signUp: Token;
  solveTask: TaskSolution;
  updatePlugin?: Maybe<Plugin>;
  updateProfile: Profile;
  updateTask: Task;
  validatePlugin: Scalars['String']['output'];
};


export type MutationCheckPluginImplementationArgs = {
  file: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};


export type MutationCheckPluginSolutionArgs = {
  solution: SolutionInput;
};


export type MutationCreateGraphArgs = {
  graph: GraphInput;
};


export type MutationCreatePluginArgs = {
  plugin: PluginInput;
};


export type MutationCreateTaskArgs = {
  task: TaskInput;
};


export type MutationDeleteGraphArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePluginArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProfileArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTaskArgs = {
  id: Scalars['ID']['input'];
};


export type MutationGenerateGraphArgs = {
  generateGraphRequest: GenerateGraphRequest;
};


export type MutationSignInArgs = {
  signInRequest: SignInRequest;
};


export type MutationSignUpArgs = {
  signUpRequest: SignUpRequest;
};


export type MutationSolveTaskArgs = {
  solution: TaskSolutionInput;
};


export type MutationUpdatePluginArgs = {
  plugin: PluginInput;
};


export type MutationUpdateProfileArgs = {
  profile?: InputMaybe<ProfileInput>;
};


export type MutationUpdateTaskArgs = {
  task: TaskInput;
};


export type MutationValidatePluginArgs = {
  id: Scalars['ID']['input'];
};

export type Payload = {
  discriminator: PayloadType;
  graph?: InputMaybe<GraphInput>;
};

export enum PayloadType {
  Graph = 'GRAPH'
}

export type Plugin = {
  __typename?: 'Plugin';
  authorId: Scalars['ID']['output'];
  beanName?: Maybe<Scalars['String']['output']>;
  category: Scalars['String']['output'];
  description: Scalars['String']['output'];
  graphType: GraphType;
  id: Scalars['ID']['output'];
  isInternal: Scalars['Boolean']['output'];
  isValid: Scalars['Boolean']['output'];
  jarFile?: Maybe<Scalars['String']['output']>;
  jarName?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  pluginType: PluginType;
};

export type PluginInput = {
  authorId: Scalars['ID']['input'];
  beanName?: InputMaybe<Scalars['String']['input']>;
  category: Scalars['String']['input'];
  description: Scalars['String']['input'];
  graphType: GraphType;
  id: Scalars['ID']['input'];
  isInternal: Scalars['Boolean']['input'];
  isValid: Scalars['Boolean']['input'];
  jarFile?: InputMaybe<Scalars['String']['input']>;
  jarName?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  pluginType: PluginType;
};

export type PluginResult = {
  __typename?: 'PluginResult';
  answer: Answer;
  exceptedAnswer: Answer;
  id: Scalars['ID']['output'];
  isCorrect: Scalars['Boolean']['output'];
  pluginId: Scalars['ID']['output'];
};

export enum PluginType {
  GraphCharacteristic = 'GRAPH_CHARACTERISTIC',
  GraphNewGraph = 'GRAPH_NEW_GRAPH',
  GraphProperty = 'GRAPH_PROPERTY',
  GraphString = 'GRAPH_STRING'
}

export type Profile = {
  __typename?: 'Profile';
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  patronymic?: Maybe<Scalars['String']['output']>;
  profilePassword: Scalars['String']['output'];
  profileRole: Role;
  studentGroup?: Maybe<Scalars['String']['output']>;
};

export type ProfileInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  lastName: Scalars['String']['input'];
  patronymic?: InputMaybe<Scalars['String']['input']>;
  profilePassword: Scalars['String']['input'];
  profileRole: Role;
  studentGroup?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  /** plugin */
  getAllPlugins: Array<Maybe<Plugin>>;
  /** profile */
  getAllProfiles: Array<Maybe<Profile>>;
  getAllTaskSolutions: Array<Maybe<TaskSolution>>;
  getAllTasks: Array<Maybe<Task>>;
  /** graph */
  getGraphById: Graph;
  getGraphLibrary: Array<Maybe<Graph>>;
  getPlugin: Plugin;
  getProfile: Profile;
  /** task */
  getTask: Task;
  getTaskSolution: TaskSolution;
  getUserSolutionStatistic: Array<Maybe<TaskSolution>>;
};


export type QueryGetAllTaskSolutionsArgs = {
  taskId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type QueryGetGraphByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPluginArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetProfileArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetTaskArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetTaskSolutionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUserSolutionStatisticArgs = {
  userId: Scalars['ID']['input'];
};

export enum Role {
  Admin = 'ADMIN',
  Captain = 'CAPTAIN',
  Student = 'STUDENT',
  Teacher = 'TEACHER'
}

export type SignInRequest = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignUpRequest = {
  profile: ProfileInput;
};

export type SolutionInput = {
  additionalPayload?: InputMaybe<AdditionalPayload>;
  payload: Payload;
  pluginId: Scalars['ID']['input'];
  pluginType: PluginType;
};

export type Task = {
  __typename?: 'Task';
  authorId: Scalars['ID']['output'];
  category: Category;
  conditionList?: Maybe<Array<Maybe<Condition>>>;
  description: Scalars['String']['output'];
  graph?: Maybe<Graph>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type TaskInput = {
  authorId: Scalars['ID']['input'];
  category: Category;
  conditionList: Array<InputMaybe<ConditionInput>>;
  description: Scalars['String']['input'];
  graph?: InputMaybe<GraphInput>;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type TaskSolution = {
  __typename?: 'TaskSolution';
  authorId: Scalars['ID']['output'];
  graph?: Maybe<Graph>;
  id: Scalars['ID']['output'];
  isCorrect: Scalars['Boolean']['output'];
  pluginResultList?: Maybe<Array<Maybe<PluginResult>>>;
  taskId: Scalars['ID']['output'];
};

export type TaskSolutionInput = {
  authorId: Scalars['ID']['input'];
  graph: GraphInput;
  id: Scalars['ID']['input'];
  taskId: Scalars['ID']['input'];
};

export type Token = {
  __typename?: 'Token';
  token: Scalars['String']['output'];
};

export type Vertex = {
  __typename?: 'Vertex';
  color: Color;
  id: Scalars['Int']['output'];
  label: Scalars['String']['output'];
  weight: Scalars['Int']['output'];
  xCoordinate: Scalars['Int']['output'];
  yCoordinate: Scalars['Int']['output'];
};

export type VertexInput = {
  color: Color;
  id: Scalars['Int']['input'];
  label: Scalars['String']['input'];
  weight: Scalars['Int']['input'];
  xCoordinate: Scalars['Int']['input'];
  yCoordinate: Scalars['Int']['input'];
};
