CREATE TABLE employee(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    fname VARCHAR(255) NOT NULL,
    sname VARCHAR(255) NOT NULL,
    birthday DATE NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(13) NOT NULL,
    job_id BIGINT REFERENCES job(id)
);

CREATE TABLE job(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

create table department(
    id bigserial not null primary key,
    name varchar(255) not null,
    code varchar(255) not null
)
