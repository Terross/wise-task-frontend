
export interface StatisticRequestInput {
  type: 'SUCCESS_RATE' | 'SUM' | 'MEAN'
  scope: 'USER' | 'TASK' | 'SESSION' | 'GLOBAL'
  event_type: string
  task_id?: string
  user_id?: string
}

export interface StatisticResponse {
  type: 'SUCCESS_RATE' | 'SUM' | 'MEAN'
  scope: 'USER' | 'TASK' | 'SESSION' | 'GLOBAL'
  updated_at: string  
  task_id?: string | null
  user_id?: string | null
  value: number
  event_type: string
}

export interface GetStatisticResponse {
  getStatistic: StatisticResponse
}