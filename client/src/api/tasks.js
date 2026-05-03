const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

const requestJson = async (path, options = {}) => {
  const headers = { ...options.headers };
  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const fetchTasks = () => requestJson('/tasks');

export const createTask = (payload) => {
  return requestJson('/tasks', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};

export const deleteTask = (id) => {
  return requestJson(`/tasks/${id}`, {
    method: 'DELETE'
  });
};

export const prioritizeTasks = (tasks, currentEnergy) => {
  return requestJson('/prioritize', {
    method: 'POST',
    body: JSON.stringify({
      currentEnergy,
      tasks
    })
  });
};

export const updateTask = (id, payload) => {
  return requestJson(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
};
