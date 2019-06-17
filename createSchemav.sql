create database Newspaper;
use Newspaper;

create table Posts(
	id int primary key,
    authorId int,
    title varchar(255),
    category int,
    sub_category int,
    publishDate date,
    postExcerpt text,
    content text,
    views int,
    imgLink varchar(255),
    tags varchar(255),
    approval int,
    timeToUpload datetime
);
/*
approval - xét duyệt
1 - Đã được duyệt & chờ xuất bản
2 - Đã xuất bản
3 - Bị từ chối
4 - Chưa được duyệt
*/
create table Categories(
	id int primary key,
    categoryName varchar(255)
);

create table SubCategories(
	id int,
    categoryId int,
    subcategoryName varchar(255),
    primary key (id, categoryId)
);

create table Tags(
	postId int,
    tagName varchar(255),
    primary key (postId, tagName)
);

create table Users(
	id int primary key,
    username char(255) unique,
    passwordString char(20),
    userClass int,
    fullname char(100),
    pseudonym char(50),
    dabirthday date,
    email char(50),
    categoryEditor int
);
/*
 user class
 1 - đọc giả - subscriber
 2 - phóng viên - writer
 3 - biên tập viên - editor
 4 - quản trị viên - administrator
*/

create table Comments(
	postId int,
    userId int,
    commentId int,
    commentContent text,
    primary key (postId, userId, commentId)
);
alter table SubCategories add constraint FK_SubCategories_Categories foreign key (categoryId) references Categories(id);
alter table Posts add constraint FK_Posts_SubCategories foreign key (sub_category, category) references SubCategories(id, categoryId);
alter table Posts add constraint FK_Posts_Tags foreign key (id) references Tags(postId);
alter table Posts add constraint FK_Posts_Users foreign key (authorId) references Users(id);
alter table Comments add constraint FK_Comments_Posts foreign key (postId) references Posts(id);

insert into Categories values("1","Thời sự");
insert into Categories values("2","Kinh doanh");
insert into Categories values("3","Giải trí");
insert into Categories values("4","Thể thao");
insert into Categories values("5","Du lịch");

insert into SubCategories values("1","1","Trong nước");
insert into SubCategories values("2","1","Ngoài nước");
insert into SubCategories values("1","2","Nông sản");
insert into SubCategories values("2","2","Hải sản");
insert into SubCategories values("1","3","Phim truyện");
insert into SubCategories values("2","3","Âm nhạc");
insert into SubCategories values("1","4","Bóng đá");
insert into SubCategories values("2","4","Tennis");
insert into SubCategories values("1","5","Việt Nam");
insert into SubCategories values("2","5","Thế giới");

