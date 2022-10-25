# #/bin/bash
# sleep 4

echo hello
psql -U initdb <<BASH_QUERY

INSERT INTO "user" (_id, username, avatar_url, avatar_url_42intra)
VALUES (1, 'jfritz', 'https://cdn.intra.42.fr/users/cb7fb65f8df7eafcbb9047111da29cc8/jfritz.JPG', 'https://cdn.intra.42.fr/users/cb7fb65f8df7eafcbb9047111da29cc8/jfritz.JPG' );

INSERT INTO "user" (_id, username, avatar_url, avatar_url_42intra)
VALUES (2, 'akurz', 'https://cdn.intra.42.fr/users/9f3ad9875c70026b63fd7d570fd81098/akurz.jpg', 'https://cdn.intra.42.fr/users/9f3ad9875c70026b63fd7d570fd81098/akurz.jpg' );

BASH_QUERY
echo ende
