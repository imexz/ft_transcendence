FROM postgres:latest


# RUN mkdir -p /tmp/psql_data/

# COPY db/test_entris.sql /tmp/psql_data/

# COPY ./test_entris.sh /docker-entrypoint-initdb.d/

# RUN chmod 777 /docker-entrypoint-initdb.d/test_entris.sh//geht nicht weil data dir si not emty
COPY ./test_entris.sh ./
# RUN chmod 777 ./test_entris.sh
# RUN ls -la

# RUN ./test_entris.sh

# CMD ["/bin/bash", "./test_entris.sh"]
