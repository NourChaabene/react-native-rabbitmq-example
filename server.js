var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (err, conn) {

    conn.createChannel(function(err, ch){

        var ex = "direct_log";
        var msg = process.argv.slice(2).join(' ')|| "hello Joshua";
        var args = process.argv.slice(2);

        ch.assertExchange(ex, 'direct', {durable:false})
        ch.publish(ex, 'react', new Buffer(msg));
        console.log("message sent", 'info', msg);

        setTimeout(function() {conn.close(); process.exit(0) }, 500);

    });
});