function eligibleUserForGroupCreation(contacts, user) {
  if (!contacts || !user?._id) return [];
  const seenIds = new Set();
  return contacts
    .flatMap((contact) => contact.members || [])
    .filter(
      (member) =>
        member._id !== user._id &&
        !seenIds.has(member._id) &&
        seenIds.add(member._id)
    );
}

async function apiRequest(promise) {
  try {
    const res = await promise;
    return [res.data, null];
  } catch (err) {
    const message =
      err.response?.data?.message || err.message || "Something went wrong";
    return [null, message];
  }
}

export const buildInitialValues = (source, mapping) => {
  const values = {};

  Object.entries(mapping).forEach(([formField, sourcePath]) => {
    const value = sourcePath
      .split(".")
      .reduce((obj, key) => obj?.[key], source);
    values[formField] = value ?? mapping[formField].default;
  });

  return values;
};

export { eligibleUserForGroupCreation, apiRequest };
