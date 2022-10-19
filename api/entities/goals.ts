import ApiService from '../ApiService';
import { GoalData } from '../../components/pages/Goals/types';

const getGoalsApi = (apiService: ApiService) => ({
  list: (id: string) => apiService.get<{ goals: Record<string, GoalData>, order: string[] }>(`/api/goals`, { id }),
  create: (goal: GoalData) => apiService.post<GoalData[]>(`/api/goals/create`, goal),
  delete: (listId: string, ids: string[]) => apiService.post<GoalData[]>(`/api/goals/delete`, { ids, listId }),
  order: (data: { listId: string, goalIds: string[], destination: number }) => apiService.post<GoalData[]>(`/api/goals/order`, data),
  update: (data: { id: string, fields: Partial<GoalData> }) => apiService.put<GoalData[]>(`/api/goals`, data),
});

export default getGoalsApi;
