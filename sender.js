var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (err, conn) {

    conn.createChannel(function(err, ch){

        var ex = "direct_log";
        var msg = "bye felicia";

        ch.assertExchange(ex, 'direct', {durable:true})
        ch.publish(ex, 'react', new Buffer(msg));
        console.log("message sent", 'react', msg);

        setTimeout(function() {conn.close(); process.exit(0) }, 500);

    });
});