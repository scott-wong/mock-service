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

exports.save = function(req, res) {
    var tpl = Function('return ' + (req.query.tpl || req.body.tpl))()
    var key = Mock.Random.string('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 5)
    var val = {
        key: key,
        tpl: tpl,
        date: new Date()
    }
    client.get(key, function(err, reply) {
        if (reply !== null) return exports.save(req, res)
        client.set(key, JSON.stringify(val), function(err, reply) {
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
                    res.header("Access-Control-Allow-Origin", "*")
                    res.header("Access-Control-Allow-Headers", "X-Requested-With")
                    res.send(re)
                }
            })
        })

    })
}

exports.mock = function(req, res) {
    client.get(req.query.tpl, function(err, reply) {
        if (err) {
            console.log("Error: " + err)
            return
        }

        if (reply === null) {
            try {
                reply = JSON.parse(req.query.tpl)
            } catch (e) {
                reply = req.query.tpl
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