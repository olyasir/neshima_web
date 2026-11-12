FROM caddy:2-alpine

# Static marketing site served by Caddy. Railway injects $PORT (see Caddyfile).
# Pages are listed one by one: a new .html/.js file must be added here or it
# silently 404s in production (Caddy's try_files falls back to index.html).
COPY Caddyfile /etc/caddy/Caddyfile
COPY index.html en.html quiz.html quiz-en.html quiz.js styles.css script.js README.md /srv/
COPY assets/ /srv/assets/

# Inlining styles.css saves first visits a render-blocking round trip (about 2.5 s on Slow 3G).
COPY inline-styles.sh /usr/local/bin/inline-styles
RUN cd /srv && sh /usr/local/bin/inline-styles styles.css index.html en.html quiz.html quiz-en.html

EXPOSE 8080
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
