var UserProfile = (function() {
  var username = "";
  var userUniqueID = '';

  var getName = function() {
    return username;    // Or pull this from cookie/localStorage
  };

  var setName = function(name) {
    username = name;
    // Also set this in cookie/localStorage
  };

  var getUniqueID = function() {
    return userUniqueID;    // Or pull this from cookie/localStorage
  };

  var setUniqueID = function(id) {
    userUniqueID = id;
    // Also set this in cookie/localStorage
  };

  return {
    getName: getName,
    setName: setName,
    getUniqueID: getUniqueID,
    setUniqueID: setUniqueID
  }

})();

export default UserProfile;
