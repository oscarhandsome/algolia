'use strict'

const sentences = [
    {subject: 'Java1111Script', verb: 'is', object: 'great'},
    {subject: 'Eleph22222222ants', verb: 'are', object: 'large'}
];

function say({subject, verb, object}) {
    console.log('${subject} ${verb} ${object}')
}

for (let s of sentences){
    say(s);
}