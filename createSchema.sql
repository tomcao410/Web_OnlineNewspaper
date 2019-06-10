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
    imgLink varchar(255)
);

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
    userClass int
);

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

insert into Categories values(1,'THỜI SỰ');
insert into Categories values(2,'KINH DOANH');
insert into Categories values(3,'THỂ THAO');
insert into Categories values(4,'GIẢI TRÍ');
insert into Categories values(5,'DU LỊCH');

insert into SubCategories values(1, 1, 'TRONG NƯỚC');
insert into SubCategories values(2, 1, 'NGOÀI NƯỚC');
insert into SubCategories values(3, 2, 'NÔNG SẢN');
insert into SubCategories values(4, 2, 'HẢI SẢN');
insert into SubCategories values(5, 3, 'PHIM TRUYỆN');
insert into SubCategories values(6, 3, 'ÂM NHẠC');
insert into SubCategories values(7, 4, 'BÓNG ĐÁ');
insert into SubCategories values(8, 4, 'TENNIS');
insert into SubCategories values(9, 5, 'VIỆT NAM');
insert into SubCategories values(10, 5, 'THẾ GIỚI');

insert into users values(1,'1','1',1);

insert into posts values(1,1,'Sài Gòn sắp vào mùa mưa',1,1,'2019-04-29','Những ngày tới TP HCM có mưa dông buổi chiều, gia tăng trên diện rộng báo hiệu bước vào mùa mưa.','<p>Dịp lễ 30/4 và 1/5, nắng nóng tại TP HCM và khu vực Nam bộ chỉ xảy ra cục bộ, nền nhiệt phổ biến 33-35 độ C.</p><p>Đài khí tượng thuỷ văn khu vực cho biết, mưa dông đang có xu hướng gia tăng vào chiều tối kèm nguy cơ xảy ra lốc, sét, mưa đá và gió giật mạnh. Riêng TP HCM ban ngày có mưa rào và dông. Đây cũng là kiểu thời tiết đặc trưng trong những ngày đầu tháng 5 đánh dấu Nam bộ vào giai đoạn chuyển mùa mưa.</p><p>Thời gian qua, TP HCM trải qua đợt nắng nóng kéo dài. Nền nhiệt cao nhất duy trì ở mức 37-39 độ C. Do bức xạ, đô thị hoá, nhiệt độ ngoài trời cao hơn lều khí tượng 3-4 độ C khiến người dân luôn mệt mỏi vì oi bức.</p><p>Đến ngày 27 và 28/4, Sài Gòn và Nam bộ đón liên tiếp mưa \’giải nhiệt\’. Lưu lượng mưa ghi nhận đến 89 mm ở Bình Phước, 86 mm ở Bình Dương còn Cà Mau là 36 mm. Tại TP HCM lưu lượng cao nhất đo được ở huyện Hóc Môn là 44,6 mm.</p><p>Nguyên nhân xuất hiện mưa do rãnh thấp xích đạo hoạt động khá mạnh. Ngoài ra, trên cao có áp cao cận nhiệt đới gây nên những nhiễu động, hình thành mây dông gây mưa.</p><p>Dự báo sau đợt nghỉ lễ dài ngày, mưa dông gia tăng, thường kèm lốc, gió giật mạnh và sét nên người dân cần đề phòng khi ra đường.</p><p><strong>Duy Trần</strong></p>','https://i-vnexpress.vnecdn.net/2019/04/29/muangap11536404098680x0-155652-1334-3060-1556520742_500x300.jpg');
insert into posts values(2,1,'Biển Cửa Lò ken đặc người trong dịp nghỉ lễ',1,1,'2019-04-29','Trong ba ngày, hơn 200.000 người đã đến bãi biển Cửa Lò \(Nghệ An\), khách sạn đều kín phòng.','<p>Dịp lễ 30/4 và 1/5, nắng nóng tại TP HCM và khu vực Nam bộ chỉ xảy ra cục bộ, nền nhiệt phổ biến 33-35 độ C.</p><p>Đài khí tượng thuỷ văn khu vực cho biết, mưa dông đang có xu hướng gia tăng vào chiều tối kèm nguy cơ xảy ra lốc, sét, mưa đá và gió giật mạnh. Riêng TP HCM ban ngày có mưa rào và dông. Đây cũng là kiểu thời tiết đặc trưng trong những ngày đầu tháng 5 đánh dấu Nam bộ vào giai đoạn chuyển mùa mưa.</p><p>Thời gian qua, TP HCM trải qua đợt nắng nóng kéo dài. Nền nhiệt cao nhất duy trì ở mức 37-39 độ C. Do bức xạ, đô thị hoá, nhiệt độ ngoài trời cao hơn lều khí tượng 3-4 độ C khiến người dân luôn mệt mỏi vì oi bức.</p><p>Đến ngày 27 và 28/4, Sài Gòn và Nam bộ đón liên tiếp mưa \’giải nhiệt\’. Lưu lượng mưa ghi nhận đến 89 mm ở Bình Phước, 86 mm ở Bình Dương còn Cà Mau là 36 mm. Tại TP HCM lưu lượng cao nhất đo được ở huyện Hóc Môn là 44,6 mm.</p><p>Nguyên nhân xuất hiện mưa do rãnh thấp xích đạo hoạt động khá mạnh. Ngoài ra, trên cao có áp cao cận nhiệt đới gây nên những nhiễu động, hình thành mây dông gây mưa.</p><p>Dự báo sau đợt nghỉ lễ dài ngày, mưa dông gia tăng, thường kèm lốc, gió giật mạnh và sét nên người dân cần đề phòng khi ra đường.</p><p><strong>Duy Trần</strong></p>','https://i-dulich.vnecdn.net/2019/04/28/cua-lo-2-1556467395_680x0.jpg');
insert into posts values(3,1,'Scarlett Johansson khổ luyện để diện đồ bó của Black Widow',5,3,'2019-04-30','Người đẹp tập từ ba đến sáu tuần và duy trì chế độ ăn nghiêm ngặt để vào vai điệp viên gợi cảm của Marvel.','<p>Khi Avengers: Endgame công chiếu, tên tuổi Scarlett Johansson lại được hâm nóng với vai Black Widow. Cô là một trong các diễn viên gắn bó lâu nhất với Vũ trụ Điện ảnh Marvel, từ Iron Man 2 (2010). Trên Hollywood Reporter, người đẹp kể chế độ tập luyện đế hóa nữ điệp viên nóng bỏng, thường xuyên xuất hiện trong trang phục bó sát.</p><p>Scarlett chưa từng tập gym trước lúc đóng Black Widow. Khi chuẩn bị quay Iron Man 2, cô làm việc cùng chuyên gia Eric Johnson - người từng huấn luyện Ryan Gosling và Sebastian Stan. Diễn viên quan tâm đến khả năng vận động và mặc vừa trang phục nhiều hơn cân nặng.</p><p>Quá trình tập của Scarlett thường từ ba đến sáu tuần, được chia làm ba giai đoạn. Lúc đầu, cô tập các bài chuyển động để có sự gắn kết giữa tâm trí và cơ thể. Giai đoạn hai nhằm nâng cao sức mạnh, chủ yếu là các bài với tạ. Eric cho biết muốn Scarlett có sức khỏe gần giống nhân vật cô đóng. \’Black Widow có thể nâng 226 kg. Chúng tôi cố tái tạo hình tượng nhân vật đó với một người bình thường\’. Scarlett Johansson - cao 1,6 m -  hiện có thể nâng 111kg và chống đẩy với tạ 20kg trên lưng.</p><p>Ở chặng cuối, Scarlett tập để có cơ thể săn chắc khi lên hình. Người đẹp không thích các bài cardio (tập làm tăng nhịp tim) truyền thống. Cô chạy tăng tốc, tập với dây và tạ chuông (kettlebell). Scarlett chọn các bài này còn vì tư thế đẹp, tao nhã khi tập. \’Nhiều người hay nhăn nhó khi tập nhưng cô ấy không có khuôn mặt đó, trừ khi gặp thử thách mới hoặc bài quá khó\’, huấn luyện viên Johnson nói. Một số môn khác được đưa vào chương trình là thể dục dụng cụ, yoga và pilates (môn gồm chuỗi các bài tập cơ thể).</p><p>Với Avengers: Endgame, Scarlett cho biết gặp khó khăn về tuổi tác và gia đình. Người đẹp đã 34 tuổi khi chuẩn bị quay bom tấn, đồng thời đang chăm sóc con gái 5 tuổi. \’Thật khó để cân bằng giữa việc làm mẹ, tập luyện và công việc\’, cô nói. Cô tập bốn hoặc năm ngày một tuần, mỗi buổi từ 45 phút đến một giờ, bắt đầu từ sáu giờ sáng, trước khi con gái thức giấc.</p><p>Scarlett Johansson còn tuân thủ chế độ ăn nghiêm ngặt để giữ dáng và duy trì năng lượng. Nếu bữa ăn cuối cùng trong ngày lúc chín giờ tối, cô sẽ không ăn tiếp trước chín giờ sáng hôm sau. Trước buổi tập, cô ăn trứng, rau xanh và có thể thêm một số chất khác.</p><p>Trong vài ngày trước khi ghi hình, cô giảm lượng carbohydrate để có đường cong đẹp hơn. Ở những ngày tiêu thụ ít carbohydrate (low-carb), người đẹp nạp chính xác 115 gram protein, 75 gram carbohydrate và 50 gram chất béo. Ở những ngày khác, con số này là 105 gram protein, 125 gram carbohydrate và 35 gram chất béo.</p><p>Nhìn lại quá trình tập luyện, Scarlett Johansson hài lòng với tiến bộ bản thân: \’Tôi mạnh hơn và có khả năng vận động tốt hơn 10 năm trước. Điều đó thật tuyệt vời. Sự khỏe mạnh là môt trong những thứ tuyệt nhất khi làm việc cho Marvel\’. Sắp tới, sao nữ hóa thân Black Widow trong tác phẩm kể về quá khứ nhân vật.</p><p><strong>Ân Nguyễn</strong></p>','https://i-giaitri.vnecdn.net/2019/04/29/Scarlett-Johansson-trong-The-A-3864-7366-1556547901.jpg');
insert into posts values(4,1,'Đạo diễn \’2 Fast 2 Furious\’ hôn mê sau cơn đột quỵ',5,3,'2019-04-26','Gia đình John Singleton thông báo đạo diễn từng hai lần được đề cử giải Oscar đang nằm viện.','<p>Theo Hollywood Reporter, đạo diễn 51 tuổi đang được điều trị tại khoa cấp cứu của một bệnh viện bang California, Mỹ. Gia đình John chia sẻ ông hôn mê sâu sau cơn đột quỵ cuối tuần trước. Các bác sĩ chưa đưa ra kết luận về tình trạng sức khỏe của đạo diễn.</p><p>Ngày 17/4, John Singleton tới bệnh viện khám chân. Tại đây, ông bị đột quỵ và lập tức được đưa vào phòng cấp cứu. Nguyên nhân dẫn đến vụ việc được gia đình John chia sẻ là \’một sự cố y tế\’.</p><p >Mẹ John - Sheila Ward - chăm sóc ông trong thời gian hôn mê. Gia đình đạo diễn đã đệ đơn xin tòa trao quyền quyết định về tài sản và sức khỏe ông cho Sheila và mới được thông qua. Bà sẽ giúp triển khai các hợp đồng dang dở của đạo diễn để tránh tổn thất về kinh tế.</p><p >Khi biết tin, hãng phim FX - nơi đạo diễn làm việc - chia sẻ: \’John là một chiến binh và chúng tôi biết anh ấy sẽ vượt qua tai nạn này\’. Nhiều ngôi sao như rapper Snoop Dogg, đạo diễn Guillermo del Toro, nhà sản xuất Brian Koppelman gửi lời động viên gia đình John. </p><p>John Singleton sinh năm 1968, là một đạo diễn, nhà sản xuất phim nổi tiếng người Mỹ với những bộ phim như 2 Fast 2 Furious, Boyz n the Hood, Baby Boy... Ông có hai đề cử Oscar cho \’Đạo diễn xuất sắc\’ và \’Kịch bản xuất sắc\’. John đang đồng sản xuất series truyền hình tội phạm Snowfall của kênh FX.</p><p><strong>Đạt Phan</strong></p>','https://i-giaitri.vnecdn.net/2019/04/26/john-singleton-getty-h-2019-5563-1556254165.jpg');








