const inquirer = require('inquirer');
require('colors');

const questions = [
    {   
        type: 'list',
        name: 'option',
        message: 'What do you want to do?',
        choices: [
            {
                value: 1,
                name: `${'1.'.cyan} Find a place`
            },
            {
                value: 2,
                name: `${'2.'.cyan} History`
            },
            {
                value: 0,
                name: `${'3.'.cyan} Exit`
            }
        ]
    }
]




const inquirerMenu = async() => {

    console.clear();
    console.log('============================'.cyan);
    console.log('      Choose an option '.white);
    console.log('============================\n'.cyan);

    const { option } = await inquirer.prompt(questions);

    return option;

}

const pause = async() => {

    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Press ${'ENTER'.cyan} to continue!`
        }
    ];

    console.log('\n');
    await inquirer.prompt(question);
 
}

const readInput = async( message ) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ) {
                if (value.length === 0) {
                    return 'Please enter a value';
                }
                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt( question );
    return desc;
}


const listPlaces = async( places = []) => {


    const choices = places.map( (place, i) => {

        const index = `${i + 1}.`.cyan;
        return {
            value: place.id,
            name: `${ index} ${ place.name}`
        }
    });

    choices.unshift({
        value: '0',
        name: '0.'.cyan + ' Cancel'
    })

    const question =  [
        {
            type: 'list',
            name: 'id',
            message: 'Select place',
            choices
        }
    ]

    const { id } = await inquirer.prompt(question);
    
    return id;
}

const confirm = async( message ) => {

    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ];

    const { ok } = await inquirer.prompt(question);
    
    return ok;

}


const showCheckList = async( tasks = []) => {


    const choices = tasks.map( (task, i) => {

        const index = `${i + 1}.`.cyan;
        return {
            value: task.id,
            name: `${ index} ${ task.desc}`,
            checked: (task.completedIn) ? true : false
        }
    });

    const question =  [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'selections',
            choices
        }
    ]

    const { ids } = await inquirer.prompt(question);
    
    return ids;
}

module.exports = {
    inquirerMenu,
    pause,
    readInput,
    listPlaces,
    confirm,
    showCheckList
}