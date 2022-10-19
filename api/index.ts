import ApiService from './ApiService';
import getUserApi from './entities/user';
import getTasksApi from './entities/tasks';
import getTagsApi from './entities/tags';
import getGoalsApi from './entities/goals';
import getDescriptionsApi from './entities/descriptions';
import getFocusConfigurationsApi from './entities/focusConfigurations';

export const getAPI = (apiService: ApiService) => ({
  user: getUserApi(apiService),
  tasks: getTasksApi(apiService),
  goals: getGoalsApi(apiService),
  tags: getTagsApi(apiService),
  descriptions: getDescriptionsApi(apiService),
  focusConfigurations: getFocusConfigurationsApi(apiService),
})
