/*
    Access-Control-Allow-Origin    
        http://john.sh/blog/2011/6/30/cross-domain-ajax-expressjs-and-access-control-allow-origin.html
    DEMO
        * http://localhost:3000/save?tpl={%22email|1-5%22:[%22@email%22],%22img%22:%22@IMG%22}
        * http://localhost:3000/list
        * http://localhost:3000/mock?tpl=uCweG
 */

var Mock = require('mockjs')
var redis = require('redis')
var client = redis.createClient()

console.table = require('node-print').pt

client.on("error", function(err) {
    console.log("Error " + err)
})

// client.flushall()

exports.index = function(req, res) {
    console.log(req);
    if (req.header('x-requested-with') === 'XMLHttpRequest') {
        exports.item(req, res)
        return
    }
    res.sendfile('public/editor.html')
    return
}

exports.save = function(req, res) {
    var tpl = Function('return ' + (req.query.tpl || req.body.tpl))()
    var id = Mock.Random.string('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 5)
    var val = {
        id: id,
        tpl: tpl,
        date: new Date()
    }
    client.get(id, function(err, reply) {
        if (reply !== null) return exports.save(req, res)
        client.set(id, JSON.stringify(val), function(err, reply) {
            res.header("Access-Control-Allow-Origin", "*")
            res.header("Access-Control-Allow-Headers", "X-Requested-With")
            res.send(val)
        })
    })

}

exports.list = function(req, res) {
    client.keys('*', function(err, reply) {
        if (err) {
            console.log("Error: " + err)
            return
        }

        var re = []
        reply.forEach(function(item, index) {
            client.get(item, function(err, val) {
                val = JSON.parse(val)
                val.tpl = JSON.stringify(val.tpl)
                re.push(val)
                if (index === reply.length - 1) {
                    re.sort(function(a, b) {
                        return new Date(a.date) - new Date(b.date)
                    })
                    res.header("Access-Control-Allow-Origin", "*")
                    res.header("Access-Control-Allow-Headers", "X-Requested-With")
                    res.send(re)
                }
            })
        })

    })
}

exports.item = function(req, res) {
    client.get(req.params.id, function(err, reply) {
        if (err) {
            console.log("Error: " + err)
            return
        }

        if (reply === null) {
            res.redirect('/editor.html')
            return
        }

        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Headers", "X-Requested-With")
        res.send(reply)
    })
}

exports.mock = function(req, res) {
    client.get(req.params.tpl, function(err, reply) {
        if (err) {
            console.log("Error: " + err)
            return
        }

        if (reply === null) {
            try {
                // reply = JSON.parse(req.params.tpl)
                reply = new Function('return ' + req.params.tpl)
                reply = reply()
            } catch (e) {
                reply = req.params.tpl
            }
            reply = {
                tpl: reply
            }
        } else {
            reply = JSON.parse(reply)
        }

        reply = Mock.mock(reply).tpl
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Headers", "X-Requested-With")
        res.send(reply)
    })
}