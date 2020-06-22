CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    join_at timestamp without time zone NOT NULL,
    last_login_at timestamp with time zone
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    from_username text NOT NULL REFERENCES users,
    to_username text NOT NULL REFERENCES users,
    body text NOT NULL,
    sent_at timestamp with time zone NOT NULL,
    read_at timestamp with time zone
);


-- INSERT INTO users (username, password, first_name, last_name, phone, join_at)
--   VALUES ('marshall', 'baseball', 'marsh', 'mock', '2133'),
--          ('marsha', 'basel', 'marsha', 'mock', '2133'),
--          ('bobby', 'basel', 'bobby', 'mock', '2133');

-- INSERT INTO messages (from_username, to_username, body, sent_at)
--   VALUES ('marshall', 'bobby', 'ererr'),
--          ('marsha', 'bobby', 'fsfsfdfds'),
--          ('bobby', 'marsha', 'ererr32223'),
--          ('marshall', 'bobby', 'hey there');