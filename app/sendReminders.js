/**
 * Created by William on 1/24/2016.
 * This function will search for all users who have a scheduled time past the current minimum and then send them an email
 */
function master() {
    var mongoose = require('mongoose');  // mongoose for mongodb
    var twilio = require('twilio');
    var client = new twilio.RestClient('AC3e46165d0c7eaf567cf553ebf7fa563b', '4b011dadd9dcd4f278da18347242161c');

    mongoose.connect('process.env.MONGOLAB_URI', function (error) {
        if (error) {
            console.error(error)
        }
        else console.log('mongo connected');
    });
    var date = new Date();
    var Reminder = require('./models/Reminders.js');

    Reminder.find({alarms: {$lte: date}}, function (err, reminders) {
        if (err) {
            console.log(err)
        }
        else {
            console.log(reminders);
            reminders.forEach(function (r) {
                sendReminder(client, r);
            })
        }
    });
}
sendReminder = function(client, r){
    client.sms.messages.create({
        to: r.phone,
        from: '5122409065',
        body: 'Hello '+ r.firstName + " " + r.lastName
    }, function(error,message){
        if(!error){
            console.log("Success! ");
            console.log(message);
        }
        else{
            console.log("There was an error sending the message");
        }
    });
}

master();
