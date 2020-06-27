const CF_KEY = process.env.CF_KEY;
const CF_EMAIL = process.env.CF_EMAIL;

const ROUTER_ADDR = process.env.ROUTER_ADDR;
const PASSWD = process.env.ROUTER_PASSWD;

const ZONE = process.env.ZONE;
const DDNS_NAME = process.env.DDNS_NAME;

const { Router } = require('tplink-router-api-sdk');

const cf = require('cloudflare')({
    email: CF_EMAIL,
    key: CF_KEY,
});

const r = new Router({ address: ROUTER_ADDR, password: PASSWD });

const sleep = (time) => (new Promise((f, r) => {
    try {
        setTimeout(f, time);
    } catch(e) { r(e); }
}));


const main = async () => {
    try {
        const zones = await cf.zones.browse();

        const zone = zones.result.find((zone) => zone.name === ZONE);

        const rrs = await cf.dnsRecords.browse(zone.id, { per_page: 100 });

        let ddnsrr = rrs.result.find((rr) => rr.name === DDNS_NAME);

        /**
           RR:
           {
           id: '---',
           zone_id: '---',
           zone_name: 'my.zone',
           name: 'name.my.zone',
           type: 'A',
           content: '1.2.3.4',
           proxiable: true,
           proxied: false,
           ttl: 1,
           locked: false,
           }
        */
        if (ddnsrr == null) {
            const rr = { type: 'A', proxied: false, ttl: 1, name: DDNS_NAME, content: '1.1.1.1' };
            const { result } = await cf.dnsRecords.add(zone.id, rr);
            ddnsrr = result;
        }
        console.log(ddnsrr);

        while (true) {
            await r.getPublicKey();
            await r.login();
            const { ipaddr } = await r.wanStatus();

            const rr = { type: 'A', proxied: false, ttl: 1, name: DDNS_NAME, content: ipaddr };
            const { result } = await cf.dnsRecords.edit(zone.id, ddnsrr.id, rr);

            console.log(result);

            await sleep(6e4);
        }


    } catch(e) {
        console.error(e);
    }
};


main();
