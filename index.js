
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Connection, Exchange, Queue } from 'react-native-rabbitmq';
import PushNotification from 'react-native-push-notification';


const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
        'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

const config = {
    host:'192.168.1.128',
    port:5672,
    username:'nour',
    password:'nour',
    virtualhost:'/'
}
console.disableYellowBox=true;
let connection = new Connection(config);

type Props = {};
export default class App extends Component<Props> {

    constructor(props) {
        super(props)

    }
    componentDidMount(): void {

    }

    componentWillMount() {

        connection.connect()
        let queue;
        let exchange;

        connection.on('error', (event) => {
            console.log(event)
        });

        connection.on('connected', (event) => {
            console.log('connected')

            // Create new Queue in RabbitMQ
             queue = new Queue(connection, {
                name: '123',
                durable: true,
                autoDelete: false,
                exclusive: false,
                autoBufferAck:true,
                consumer_arguments: {
                    'x-priority': 1
                }
            });

            // Create new Exchange in RabbitMQ
             exchange = new Exchange(connection, {
                name: 'exchange1',
                type: 'fanout',
                durable: true,
                autoDelete: false,
                exclusive: false,
                internal: false,
                confirm: true
            });

            // Bind a queue to the exchange we created before
            queue.bind(exchange, '123');

            // properties example, expiration in 10 s
            let properties = {
                expiration: 10000,
            }

            // Listening on queue
            queue.on('message', (data) => {
                console.log(data);
                console.log('%c message + \n '+JSON.stringify(data),'background:pink;font-weight:1000');
                PushNotification.localNotification({
                    message: data.message
                });


            });


            //exchange.publish('hello ', '145', properties)

        })

        console.log(connection)
    }

    render() {

        return (

            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Welcome to React Native!
                </Text>
                <Text style={styles.instructions}>
                    To get started, edit App.js
                </Text>
                <Text style={styles.instructions}>
                    {instructions}
                </Text>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

AppRegistry.registerComponent(appName, () => App);
