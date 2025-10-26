
# Review Board

##### A Test Case

## Setup

#### 1. Clone Repository
```
git clone https://github.com/MustafaTheEngineer/review-board.git
```
#### 2. [Install Golang](https://go.dev/dl)
#### 3. [Install Node 22.2x.x](https://nodejs.org/en/download)
#### 4. [Install PostgreSQL17](https://www.postgresql.org/download)
#### 5. Check if Golang and Node.js were installed properly.
  Open command line and check if they were installed
  ```
  go version
  ```
  and
  ```
  node --version
  ```
  and also
  ```
  npm --version
  ```
#### 6. Install PNPM
  ```
  npm install -g pnpm@latest-10
  ```
#### 7. Create database
Database name should be: review_board \
Open pgAdmin, create a database with user: postgres (password should be 1234)
#### 8. Navigate to backend_go
```
cd backend_go
```
Install database migration tool
```
go install github.com/pressly/goose/v3/cmd/goose@latest
```
Navigate to schema folder.
```
cd sql/schema
```
And migrate database:
```
goose postgres "postgres://postgres:1234@localhost:5432/review_board?sslmode=disable" up
```
Go back to backend root
```
cd ../..
```
And then install all packages:
```
go mod tidy
```
```
go mod vendor
```
Build backend
```
go build
```
And run backend
```
./review_board
```
You should see **2025/10/26 17:58:08 connect to http://localhost:8080/ for GraphQL playground** \
We will continue with another command line for frontend
#### 8. Navigate to backend_ng
Install packages
```
pnpm i
```
And run app
```
pnpm run start
```
#### 9. Info
There are two user registered whose passwords: **123456789** \
user@mail.com \
admin@mail.com

Only admin can change the item status and only item owner can edit item.
