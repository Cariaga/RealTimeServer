const helmet = require('helmet');
const { app } = require("../app");
module.exports = {
    TestAccess: function() {
       console.log("test");
        }
}
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'"]
    }
}));
app.disable('x-powered-by');
app.use(helmet.noCache());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));

