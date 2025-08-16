CREATE TABLE users (
    id INTEGER NOT NULL,
    email VARCHAR(50) NOT NULL,
    hashed_password VARCHAR(255),
    PRIMARY KEY (id),
    UNIQUE (email)
);

CREATE TABLE categories (
    id INTEGER NOT NULL,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (name)
);

CREATE TABLE products (
    id INTEGER NOT NULL,
    name VARCHAR(100),
    description VARCHAR(255),
    price FLOAT,
    iva FLOAT,
    image_url VARCHAR(255),
    category_id INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY(category_id) REFERENCES categories (id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
    id INTEGER NOT NULL,
    user_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY(user_id) REFERENCES users (id),
    FOREIGN KEY(product_id) REFERENCES products (id)
);

CREATE TABLE orders (
    id INTEGER NOT NULL,
    user_id INTEGER,
    total_amount FLOAT,
    created_at DATETIME,
    PRIMARY KEY (id),
    FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE TABLE order_items (
    id INTEGER NOT NULL,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price FLOAT,
    PRIMARY KEY (id),
    FOREIGN KEY(order_id) REFERENCES orders (id),
    FOREIGN KEY(product_id) REFERENCES products (id)
);