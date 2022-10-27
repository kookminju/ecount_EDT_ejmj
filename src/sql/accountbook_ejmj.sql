use accountbook_ejmj;

create table classification (
	classification_id int not null PRIMARY KEY,
    category char(1) not null,
    main_type nvarchar(15) not null,
    sub_type nvarchar(10) not null,
    
    check(category in ('I', 'O'))
);

create table content (
	content_id varchar(50) not null PRIMARY KEY,
    classification_id int not null,
    content_date datetime not null,
    memo nvarchar(100),
    amount int not null,
    
    FOREIGN KEY (classification_id) REFERENCES classification(classification_id)
);

insert into classification
values
(1, 'I', '급여', '급여'),
(2, 'I', '급여', '퇴직연금'),
(3, 'I', '비정기소득', '금융수입'),
(4, 'I', '비정기소득', '기타수입'),

(5, 'O', '고정생활비', '주거통신'),
(6, 'O', '고정생활비', '교육비'),
(7, 'O', '고정생활비', '의료/건강보험'),
(8, 'O', '고정생활비', '기타비용'),
(9, 'O', '유동생활비', '식비'),
(10, 'O', '유동생활비', '경조사비'),
(11, 'O', '유동생활비', '여행/여가'),
(12, 'O', '유동생활비', '교통'),
(13, 'O', '유동생활비', '생활'),
(14, 'O', '유동생활비', '문화'),
(15, 'O', '유동생활비', '쇼핑'),
(16, 'O', '유동생활비', '기타비용')
;
-- select * from classification;

insert into content
values
('test-uuid-01', 1, now(), '10월급여받은거', 3000000),
('test-uuid-02', 9, now(), '구내식당', 6500),
('test-uuid-03', 9, date_sub(now(), interval 1 month), '샤브샤브', 12000),
('test-uuid-04', 12, date_sub(now(), interval 1 month), '택시비', 6000)
;
-- select * from content;




select o.*, input
from
	(
		select date_format(content_date, "%Y-%m-%d") as "yyyymmdd", sum(amount) output
		from classification cf join content c on cf.classification_id = c.classification_id 
		where category = "O" and date_format(content_date, "%Y-%m") = ?
		group by date_format(content_date, "%Y-%m-%d")
	) o
    left join
	(
		select date_format(content_date, "%Y-%m-%d") as "yyyymmdd", sum(amount) input
		from classification cf join content c on cf.classification_id = c.classification_id 
		where category = "I" and date_format(content_date, "%Y-%m") = ?
		group by date_format(content_date, "%Y-%m-%d")
	) i
    on o.yyyymmdd = i.yyyymmdd
union
select o.*, 수입
from
	(
		select date_format(content_date, "%Y-%m-%d") as "yyyymmdd", sum(amount) output
		from classification cf join content c on cf.classification_id = c.classification_id 
		where category = "O" and date_format(content_date, "%Y-%m") = ?
		group by date_format(content_date, "%Y-%m-%d")
	) o
	right join
	(
		select date_format(content_date, "%Y-%m-%d") as "yyyymmdd", sum(amount) input
		from classification cf join content c on cf.classification_id = c.classification_id 
		where category = "I" and date_format(content_date, "%Y-%m") = ?
		group by date_format(content_date, "%Y-%m-%d")
	) i
    on o.yyyymmdd = i.yyyymmdd