FROM caddy:2-alpine

# Static marketing site served by Caddy. Railway injects $PORT (see Caddyfile).
COPY Caddyfile /etc/caddy/Caddyfile
COPY index.html styles.css script.js README.md /srv/
COPY assets/ /srv/assets/

EXPOSE 8080
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
