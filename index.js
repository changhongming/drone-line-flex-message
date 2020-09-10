(async function () {
    const axios = require('axios');
    const fs = require('fs').promises;
    const Handlebars = require('handlebars');

    // register template function
    Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });
    Handlebars.registerHelper('defaultVal', function (val, defaultVal) {
        return new Handlebars.SafeString(val || defaultVal);
    });
    Handlebars.registerHelper('ifOr', function (arg1, arg2, options) {
        if (arg1 || arg2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    // dump line auth option
    const { PLUGIN_TO, PLUGIN_ACCESS_TOKEN } = process.env;
    if (!(PLUGIN_ACCESS_TOKEN || PLUGIN_TO)) {
        return console.error("'ACCESS_TOKEN' or 'TO' not provide!");
    }

    try {
        // try complie template json
        const template = Handlebars.compile(await (await fs.readFile('./template.json.temp')).toString());
        const payload = template(process.env);

        // send line message
        await axios.post('https://api.line.me/v2/bot/message/push',
            {
                'to': PLUGIN_TO,
                'messages': JSON.parse(payload)
            },
            {
                headers:
                {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${PLUGIN_ACCESS_TOKEN}`
                }
            }
        )
        console.log('Send Finish');
    } catch (err) {
        console.log(err);
    }

})();



