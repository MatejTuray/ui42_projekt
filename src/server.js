const express = require("express")
const path = require("path")
const app = new express()
const publicPath = path.join(__dirname, "..", "/build")
console.log(publicPath)
const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(publicPath))
app.use(require('prerender-node').set('prerenderToken', 'Yjb8DTXJwn9EQx7jFvEz'));
app.get("*", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"))
})
app.listen(port, () => { console.log("server is up") })