# MARZ Fullstack Web Developer Take-Home Interview

## Application break down

The application is comprised of 4 parts

1. webapp -> Frontend for the applicaiton (written in React and Typescript)
2. api.orders -> Backend for the applicaiton (written in flask)
3. nginx -> The proxy for the requests
4. db -> mariadb

## Requirements

1. Docker [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)
2. Docker Compose [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)
3. Node v17.9.1 [https://nodejs.org/fr/blog/release/v17.9.1/](https://nodejs.org/fr/blog/release/v17.9.1/)

## Setup

### webapp

The client side applicaiton uses node version 18.

build the docker image for the webapp container using the command below from the root of the `webapp` directory

```Bash
docker build -t webapp:latest .
```

### api.orders

To build the docker image for api-orders run the command below from the root of the `api.orders` directory

```Bash
docker build -t api-orders:latest .
```

### Starting the application

To start the application, add the provided `.env` file to the root directory of the project. This file contains the environment variables needed by the `docker-compose` file. Then, run the following command.

```Bash
docker compose up -d
```

To connect to the app go to [http://localhost:3000](http://localhost:3000)

NOTE: If you see an NGINX 502 wait a couple of seconds, then refresh the page. It just means node is not done compiling the application

## Storybook

[Storybook](https://storybook.js.org/) is a frontend workshop for building UI components and pages in isolation.
To start storybook run the following command from the root of the `webapp` directory

```Bash
npm run storybook
```

To view the component library, go to [http://localhost:6006](http://localhost:6006). This will show you all the pages and components that have been built for the application without needing to start the applicaiton.

NOTE: Storybook is configured to run locally

## Testing

Both webapp and api.orders have tests written, webapp uses jest and api.orders uses pytest.

### Testing webapp

To run the jest tests run the following command at the root of the `webapp` directory

```Bash
npm run test
```

### Testing api.orders

To run the pytests from the root directory run the following commands

```Bash
docker exec -it api-orders /bin/bash
-c "python -m pytest tests/" # from within the container
```

NOTE: Make sure the api-orders container is running before using the command above.

## Implementation

### Step 1: Webapp

Created a `Product` directory at `src/components/Product`, containing the files: `Product.tsx`, `Product.test.tsx`, `Product.style.tsx`, `Product.stories.tsx`, and `ProductImg.tsx`. The `Product.style.tsx` file includes styled-components for the `Product` component.

Developed the `Product` component to accept a product object as props and display the product image, name, and ID.

Implemented the `Product` component in `ProductsPage.tsx` at `webapp/src/pages/ProductsPage/ProductsPage.tsx`, where all active product data are mapped. The frontend is served with Nginx as configured in the `Dockerfile` and `nginx.conf` files.

### Step 2: api.products

I developed the endpoint `/api/products` to return JSON objects of all active products needed by the Product page. The base directory includes a `Dockerfile` to build the image for the backend application, allowing it to run as a container in a microservice development approach. The backend is served with Nginx as configured in the `nginx.conf` file. Additionally, `test_product.py` was created to test the `api/products/*` endpoints using pytest within the running container, utilizing the command mentioned above.

### Step 3: mariadb

- To ensure the backend connects to MariaDB when the application initializes, the `connect_to_db()` function provides five reconnection attempts and incorporates a delay between attempts in case the MariaDB container isn't ready for connection.

- To replace the placeholder 't' in the `ProductPhotoURL` column with actual image URLs, the `execute_image_url_injection(list_of_image_urls)` function is used, which takes a list of five image URLs as a parameter. This function runs during the backend service initialization, following the execution of the `execute_sql_file(data.sql)` function, which sets up the database table, schema, and mock data.

The database has the following schema:

```
Database marz -> Table Customer(
    Column CustomerID = IntegerField(primary_key=True) # Auto-generated
    Column CustomerFirstName = CharField(100, null=False)
    Column CustomerLastName = CharField(100, null=False)
)
```

```
Database marz -> Table Products(
    Column ProductID = IntegerField(primary_key=True) # Auto-generated
    Column ProductName = CharField(100, can_be_null=False)
    Column ProductPhotoURL = CharField(255, can_be_null=False)
    Column ProductStatus = EnumField({ 'Active', 'InActive' }, can_be_null=False)
)
```

```
Database marz -> Table Orders(
    Column OrderID = IntegerField(primary_key=True) # Auto-generated
    Column OrderStatus = EnumField(
        { 'Queued', 'InProgress', 'QA', 'Cancelled', 'Complete' },
        can_be_null=False
    )
    Column ProductID = ForeignKeyField(
        Table=Product, field='ProductID', can_be_null=False, column_name='ProductID'
    )
    Column CustomerID = ForeignKeyField(
        Table=Customer, field='CustomerID', can_be_null=False, column_name='CustomerID'
    )
)

MariaDB [marz]> select * from Product;
+-----------+-------------+-----------------+---------------+
| ProductID | ProductName | ProductPhotoURL | ProductStatus |
+-----------+-------------+-----------------+---------------+
|         1 | Hat         | t               | Active        |
|         2 | Shoes       | t               | Active        |
|         3 | Pants       | t               | Active        |
|         4 | Shirt       | t               | InActive      |
|         5 | Coat        | t               | InActive      |
+-----------+-------------+-----------------+---------------+
5 rows in set (0.00 sec)
```
