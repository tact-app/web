import ApiService from './ApiService';
import getUserApi from './entities/user';
import getTasksApi from './entities/tasks';

export const getAPI = (apiService: ApiService) => ({
  user: getUserApi(apiService),
  tasks: getTasksApi(apiService),
})