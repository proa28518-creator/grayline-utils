inbox = false;
const requestLibraryInbox = () => {
  inbox = true;
};
const takeLibraryInbox = () => {
  const v = inbox;
  inbox = false;
  return v;
};
export {
  requestLibraryInbox as r,
  takeLibraryInbox as t
};
‰PNG