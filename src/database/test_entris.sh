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


INSERT INTO "game" (id, "scoreWinner", "scoreLoser", "winnerId", "loserId")
VALUES (1, 10, 5, 111952, 88081);

INSERT INTO "game" (id, "scoreWinner", "scoreLoser", "winnerId", "loserId")
VALUES (2, 10, 8, 88081, 111952);

INSERT INTO "game" (id, "scoreWinner", "scoreLoser", "winnerId", "loserId")
VALUES (3, 10, 88081, 111952);

INSERT INTO "game" (id, "scoreWinner", "scoreLoser", "winnerId", "loserId")
VALUES (4, 10, 0, 88081, 138097);

INSERT INTO "game" (id, "scoreWinner", "scoreLoser", "winnerId", "loserId")
VALUES (5, 10, 2, 86324, 138097);

INSERT INTO "game" (id, "scoreWinner", "scoreLoser", "winnerId", "loserId")
VALUES (6, 10, 1, 111952, 138097);

INSERT INTO "game" (id, "scoreWinner", "scoreLoser", "winnerId", "loserId")
VALUES (7, 10, 0, 111953, 138097);

INSERT INTO "game" (id, "scoreWinner", "scoreLoser", "winnerId", "loserId")
VALUES (8, 10, 3, 86324, 138097);

INSERT INTO "game" (id, "scoreWinner", "scoreLoser", "winnerId", "loserId")
VALUES (9, 10, 0, 86324, 111952);


BASH_QUERY
echo ende
