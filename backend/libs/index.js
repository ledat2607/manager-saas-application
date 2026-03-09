import ActivityLog from "../models/activity.js";

const recordActivity = async (
  userId,
  action,
  resourceType,
  resourceId,
  details,
) => {
  try {
    await ActivityLog.create({
      user: userId,
      action,

      details,
      resourceId,
      resourceType,
    });
  } catch (error) {
    console.log(error);
  }
};

export { recordActivity };
