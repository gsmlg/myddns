# Cloudflare DDNS

Read public ip address from tplink cloud router then update public ip address in cloudflareddns

Settings environment:


- `CF_KEY`: cloudflare-api-key
- `CF_EMAIL`: cloudflare-email
- `ROUTER_ADDR`: router ip address
- `ROUTER_PASSWD`: router admin password
- `ZONE`: cloudflare dns zone
- `DDNS_NAME`: ddns recore name (fqdn)

Automate update dns record every 60 seconds.
