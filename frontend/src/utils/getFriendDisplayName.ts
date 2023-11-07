const getFriendDisplayName = ({ uid, login, name }: { uid: string; login?: string; name?: string }) => {
  if (name && name !== login) return `${name} (${login})`;

  if (login) return login;

  return uid;
};

export default getFriendDisplayName;
