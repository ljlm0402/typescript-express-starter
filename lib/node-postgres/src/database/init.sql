-- TABLE 존재할 경우 삭제
DROP TABLE IF EXISTS teachers cascade;
DROP TABLE IF EXISTS classes cascade;
DROP TABLE IF EXISTS students cascade;
DROP TABLE IF EXISTS classes_category cascade;
DROP TABLE IF EXISTS enrolment cascade;

-- ============
--   강사 테이블
-- ============
-- 강사 테이블 생성
CREATE TABLE teachers(
    "teacherId" SERIAL PRIMARY KEY,
    -- 강사 ID
    "teacherName" VARCHAR(32) NOT NULL,
    -- 강사명
    "teacherAbout" VARCHAR(48) -- 강사 정보
);
-- 강사 데이터 생성
INSERT INTO teachers(
        "teacherId",
        "teacherName",
        "teacherAbout"
    )
VALUES (1, '조현영', '웹 개발 강사'),
    (2, '개복치개발자', '안드로이드 코틀린 강사'),
    (3, '이고잉', '생활코딩 운영진 겸 강사'),
    (4, '김태원', '파이썬 알고리즘 강사'),
    (5, '윤재성', 'Kotiln 기반 안드로이드 강사'),
    (6, '조훈', '쿠버네티스 강사'),
    (7, 'Rookiss', '얼리언 엔진 전문 강사'),
    (8, '유용한IT학습', 'SQLD 자격증 취득 강사'),
    (9, '김태민', '쿠버네티스 강사'),
    (10, '큰돌', '알고리즘 강사');
SELECT SETVAL(
        '"teachers_teacherId_seq"',
        (
            SELECT max("teacherId")
            FROM teachers
        )
    );
-- ===================
--   강의 카테고리 테이블
-- ===================
-- 강의 카테고리 테이블 생성
CREATE TABLE classes_category(
    "categoryId" SERIAL PRIMARY KEY,
    -- 카테고리 ID
    "categoryName" VARCHAR(32) UNIQUE NOT NULL -- 카테고리 명
);
-- 강의 카테고리 데이터 생성
INSERT INTO classes_category("categoryId", "categoryName")
VALUES (1, '웹'),
    (2, '앱'),
    (3, '게임'),
    (4, '알고리즘'),
    (5, '인프라'),
    (6, '데이터베이스');
SELECT SETVAL(
        '"classes_category_categoryId_seq"',
        (
            SELECT max("categoryId")
            FROM classes_category
        )
    );
-- ============
--   강의 테이블
-- ============
-- 강의 테이블 생성
CREATE TABLE classes(
    "classId" SERIAL PRIMARY KEY,
    -- 강의 ID
    "className" VARCHAR(32) UNIQUE NOT NULL,
    -- 강의명
    "classPrice" INTEGER NOT NULL DEFAULT 0,
    -- 가격
    "introduce" TEXT,
    -- 강의 소개
    "active" BOOLEAN NOT NULL DEFAULT false,
    -- 강의 활성화 (true: 공개, false, 비공개)
    "createdAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT(NOW() AT TIME ZONE 'utc'),
    -- 강의 생성 일자
    "updatedAt" TIMESTAMP WITHOUT TIME ZONE,
    -- 강의 수정 일자
    "teacherId" INTEGER REFERENCES teachers("teacherId") ON DELETE CASCADE,
    -- 강사 ID
    "categoryId" INTEGER REFERENCES classes_category("categoryId") ON DELETE CASCADE -- 강사 ID
);
-- ==============
--   수강생 테이블
-- ==============
-- 수강생 테이블 생성
CREATE TABLE students(
    "studentId" SERIAL PRIMARY KEY,
    -- 수강생 ID
    "email" VARCHAR(48) UNIQUE NOT NULL,
    -- 수강생 이메일
    "nickname" VARCHAR(32) NOT NULL -- 수강생 닉네임
);
-- ===============
--   수강신청 테이블
-- ===============
-- 수강신청 테이블 생성
CREATE TABLE enrolment(
    "classId" INTEGER REFERENCES classes("classId") ON DELETE CASCADE,
    -- 강의 ID
    "studentId" INTEGER REFERENCES students("studentId") ON DELETE CASCADE,
    -- 수강생 ID
    "applicationAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT(NOW() AT TIME ZONE 'utc') -- 신청 일자
);