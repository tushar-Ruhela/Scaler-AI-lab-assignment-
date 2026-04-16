function getIdentifier(req) {
  return req.user 
    ? { field: 'user_id', value: parseInt(req.user.id) } 
    : { field: 'session_id', value: req.headers['x-session-id'] || 'guest' };
}

module.exports = {
  getIdentifier
};
