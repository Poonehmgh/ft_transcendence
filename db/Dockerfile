FROM postgres:15

ENV POSTGRES_USER=swypf
ENV POSTGRES_PASSWORD=secret
ENV POSTGRES_DB=postgres_db

COPY init.sql /docker-entrypoint-initdb.d/init.sql

EXPOSE 5432
