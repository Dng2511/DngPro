const app = require("../apps/app");



const server = app.listen(port = process.env.PORT, (req, res) => {
    console.log("Run in " + port);
});