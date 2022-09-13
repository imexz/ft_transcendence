# #/bin/bash
# sleep 4

echo hello
psql -U initdb <<BASH_QUERY

INSERT INTO "user" (id, unique_name, avatar_url, avatar_url_42intra)
VALUES (1, 'tom', 'https://cdn.intra.42.fr/users/jfritz.JPG', 'https://cdn.intra.42.fr/users/jfritz.JPG' );

INSERT INTO "user" (id, unique_name, avatar_url, avatar_url_42intra)
VALUES (2, 'akurz', 'https://cdn.intra.42.fr/users/akurz.jpg', 'https://cdn.intra.42.fr/users/akurz.jpg' );

BASH_QUERY
echo ende
