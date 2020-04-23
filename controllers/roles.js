const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function() {
    ac.grant("user")
        .readAny("profile")
        .updateOwn("profile");

    ac.grant("admin")
        .extend("user")
        .updateAny("profile")
        .deleteAny("profile");

    return ac;
})();