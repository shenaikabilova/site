create table users (
user_name varchar(20) primary key,
pass varchar(20),
email varchar(45),
gender varchar(6),
b_day date,
role set('admin','user')
);

create table books(
book_id varchar(20) primary key,
book_name varchar(20),
book_author varchar(45),
book_year int,
book_genre varchar(45),
book_publisher varchar(45),
book_cover longblob,
book_description varchar(1000)
);

create table userbooks(
user_name varchar(20) references users(user_name),
book_id varchar(20) references books(book_id)
);

alter table users 
add foreign key(user_name) references users(user_name);

alter table books
add foreign key(book_id) references books(book_id);

insert into users(user_name,pass,email,gender,b_day,role) values('Admin', 'admin', 'shenaikabilova@abv.bg','f', '1993-12-25', 'admin');

select * from userbooks;

delete from userbooks where user_name='soni';

select * from users;

select books.book_id, books.book_name,books.book_author, books.book_year,books.book_genre,books.book_publisher,books.book_cover,books.book_description
from userbooks
inner join books
on userbooks.book_id=books.book_id
where user_name='sheni';