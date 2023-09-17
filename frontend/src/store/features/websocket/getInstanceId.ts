import { v4 } from 'uuid';

const instanceIdVarName = 'instanceId';

const getInstanceId = () => {
  const savedInstanceId = localStorage.getItem(instanceIdVarName);
  if (savedInstanceId) {
    return savedInstanceId;
  }
  const newInstanceId = v4().toUpperCase();
  localStorage.setItem(instanceIdVarName, newInstanceId);
  return newInstanceId;
};

export default getInstanceId;
