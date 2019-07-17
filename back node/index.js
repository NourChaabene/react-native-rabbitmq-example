var amqp = require('amqp');

var connection = amqp.createConnection(
  {
    host: 'localhost'
    , port: 5672
    , login: 'nour'
    , password: 'nour'
    , virtualhost: '/'
  }
);

connection.on('error', function (e) {
  console.log("Error from amqp: ", e);
});

// Wait for connection to become established.
connection.on('ready', function () {
  console.log('connected')


  connection.exchange('exchange1', {
    name: 'exchange1',
    type: 'fanout',
    durable: true,
    autoDelete: false,
    exclusive: false,
    internal: false,
    confirm: true
  }, function (exchange) {
   

    exchange.publish('123', 'hello from node msg nour 1222' , { expiration: '1000' }, (err, msg) => {
      console.log(err, msg)
      
    })

  }

  )




  // exc.on('open', function (exchange) {
  //   console.log('open')
  //   exchange.publish('145', 'hello from node', { expiration: 100000 }, function (err, msg) {
  //     console.log(err, msg)
  //   })
  // })



})
