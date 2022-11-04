# #/bin/bash
# sleep 4

echo hello
psql -U initdb <<BASH_QUERY

INSERT INTO "user" (id, username, avatar_url, avatar_url_42intra)
VALUES (1, 'jfritz', 'https://cdn.intra.42.fr/users/cb7fb65f8df7eafcbb9047111da29cc8/jfritz.JPG', 'https://cdn.intra.42.fr/users/cb7fb65f8df7eafcbb9047111da29cc8/jfritz.JPG' );

INSERT INTO "user" (id, username, avatar_url, avatar_url_42intra)
VALUES (2, 'akurz', 'https://cdn.intra.42.fr/users/9f3ad9875c70026b63fd7d570fd81098/akurz.jpg', 'https://cdn.intra.42.fr/users/9f3ad9875c70026b63fd7d570fd81098/akurz.jpg' );

INSERT INTO "user" (id, username, avatar_url, avatar_url_42intra)
VALUES (111952, 'juhan', 'https://cdn.intra.42.fr/users/cb7fb65f8df7eafcbb9047111da29cc8/jfritz.JPG', 'https://cdn.intra.42.fr/users/cb7fb65f8df7eafcbb9047111da29cc8/jfritz.JPG' );

INSERT INTO "user" (id, username, avatar_url, avatar_url_42intra)
VALUES (88081, 'samuel', 'https://cdn.intra.42.fr/users/cb7fb65f8df7eafcbb9047111da29cc8/jfritz.JPG', 'https://cdn.intra.42.fr/users/cb7fb65f8df7eafcbb9047111da29cc8/jfritz.JPG' );


INSERT INTO "game" (id, "scoreLeft", "scoreRight")
VALUES (1, 10, 5);
INSERT INTO "user_games_game" (user_id, "gameId")
VALUES (111952, 1);

INSERT INTO "game" (id, "scoreLeft", "scoreRight")
VALUES (2, 10, 5);
INSERT INTO "user_games_game" (user_id, "gameId")
VALUES (88081, 1);

INSERT INTO "game" (id, "scoreLeft", "scoreRight")
VALUES (3, 10, 5);
INSERT INTO "user_games_game" (user_id, "gameId")
VALUES (88081, 2);

INSERT INTO "game" (id, "scoreLeft", "scoreRight")
VALUES (4, 10, 5);
INSERT INTO "user_games_game" (user_id, "gameId")
VALUES (111952, 2);





BASH_QUERY
echo ende
