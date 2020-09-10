(async function () {
    const axios = require('axios');
    const fs = require('fs').promises;
    const path = require('path');
    const Handlebars = require('handlebars');

    // register template function
    Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });
    Handlebars.registerHelper('defaultVal', function (val, defaultVal) {
        return new Handlebars.SafeString((val || defaultVal).replace(/\r?\n/, ""));
    });
    Handlebars.registerHelper('ifOr', function (arg1, arg2, options) {
        if (arg1 || arg2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    // dump line auth option
    const { PLUGIN_TO, PLUGIN_CHANNEL_TOKEN } = process.env;
    if (!(PLUGIN_CHANNEL_TOKEN || PLUGIN_TO)) {
        console.error("'PLUGIN_CHANNEL_TOKEN' or 'TO' not provide!");
        process.exit(1);
    }

    try {
        // try complie template json
        const template = Handlebars.compile(await (await fs.readFile(path.join(__dirname, 'template.json.temp'))).toString());
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
                    'Authorization': `Bearer ${PLUGIN_CHANNEL_TOKEN}`
                }
            }
        )
        console.log('Send Finish');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }

})();



