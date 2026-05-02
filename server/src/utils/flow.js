const energyModifierFor = (energy) => {
  if (energy < 4) {
    return 0.5;
  }

  if (energy > 8) {
    return 2.5;
  }

  return 1.0;
};

export const calculateFlowScore = (task, energy) => {
  const modifier = energyModifierFor(energy);
  return task.difficulty * modifier - task.estimatedTime * 0.1;
};

export const sortTasksByFlow = (tasks, energy) => {
  return [...tasks].sort((left, right) => {
    const scoreDifference = calculateFlowScore(right, energy) - calculateFlowScore(left, energy);

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
  });
};
