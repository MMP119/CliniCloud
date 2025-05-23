CREATE DATABASE IF NOT EXISTS CLINICLOUD;

USE CLINICLOUD;


CREATE TABLE PATIENT(
    Patient_Id INT PRIMARY KEY AUTO_INCREMENT,
    Patient_Name VARCHAR(100) NOT NULL,
    Patient_email VARCHAR(100) NOT NULL,
    Description VARCHAR(250) NOT NULL,
    Patient_Appointment DATETIME NOT NULL,
    Appointment_status ENUM('Pendiente', 'Realizada') DEFAULT 'Pendiente',
    Unique_Code VARCHAR(250) NOT NULL
);


CREATE TABLE LOGIN(
    Login_Id INT PRIMARY KEY AUTO_INCREMENT,
    Email VARCHAR(100) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Rol_Type ENUM('Doctor', 'Laboratorio') NOT NULL
);

CREATE TABLE MEDICINE(
    Medicine_Id INT PRIMARY KEY AUTO_INCREMENT,
    Medicine_Name VARCHAR(100) NOT NULL,
    Description VARCHAR(150) NOT NULL,
    Amount INT NOT NULL
);

CREATE TABLE TESTS_PERFORMED(
    Test_Id INT PRIMARY KEY AUTO_INCREMENT,
    Diagnostic VARCHAR(250) NOT NULL,
    Motive VARCHAR(250) NOT NULL,
    Status ENUM('pendiente', 'terminado', 'enviado') DEFAULT 'pendiente',
    Patient_Id INT,
    CONSTRAINT Pacient_Test FOREIGN KEY(Patient_Id) REFERENCES PATIENT(Patient_Id)
);


CREATE TABLE RESULT_OF_DIAGNOSTIC(
    Result_Id INT PRIMARY KEY AUTO_INCREMENT,
    Patient_Id INT,
    Diagnostic INT,
    Recipe VARCHAR(250) NOT NULL,
    Status  ENUM('pendiente', 'terminada') DEFAULT 'pendiente',
    CONSTRAINT Pacient_Result FOREIGN KEY(Patient_Id) REFERENCES PATIENT(Patient_Id),
    CONSTRAINT Pacient_Diagnostic FOREIGN KEY(Diagnostic) REFERENCES TESTS_PERFORMED(Test_Id)
);